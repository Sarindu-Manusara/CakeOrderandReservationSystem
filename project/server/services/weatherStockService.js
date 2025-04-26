import axios from 'axios';
import schedule from 'node-schedule';
import Product from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

// Constants
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'e22b916173bb8dfbac2133cf97ac5de2';
const COLOMBO_COORDS = { lat: 6.9271, lon: 79.8612 };
const LOG_FILE_PATH = path.join('logs', 'price_stock_changes.log');

// Utility Functions
const isHoliday = (date) => {
  const holidays = [
    '2025-01-01', '2025-01-15', '2025-02-04', '2025-05-01', '2025-12-25'
  ];
  const dateString = date.toISOString().split('T')[0];
  return holidays.includes(dateString);
};

const getWeatherData = async () => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${COLOMBO_COORDS.lat}&lon=${COLOMBO_COORDS.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching weather data:', error.message);
    return null;
  }
};

const adjustStockBasedOnWeather = async (weather) => {
  if (!weather) return;

  const temp = weather.main.temp;
  const isRaining = weather.weather[0].main.toLowerCase().includes('rain');
  const isHot = temp > 28;
  const isCold = temp < 22;

  const now = new Date();
  const weekend = now.getDay() === 0 || now.getDay() === 6;
  const holiday = isHoliday(now);
  const summer = now.getMonth() >= 3 && now.getMonth() <= 8;

  const changeLogs = [];

  try {
    const products = await Product.find({});

    for (const product of products) {
      if (product.weatherSensitive === false) continue;

      let stockAdjustment = 0;
      let priceAdjustment = 0;

      // Weather-based adjustments
      if (isHot) {
        if (product.category.toLowerCase().includes('ice cream')) {
          stockAdjustment += 5;
          priceAdjustment -= 500;
        } else if (product.category.toLowerCase().includes('chocolate')) {
          stockAdjustment -= 2;
          priceAdjustment -= 500;
        }
      }

      if (isRaining) {
        if (['chocolate', 'carrot'].some(keyword => product.category.toLowerCase().includes(keyword))) {
          stockAdjustment += 3;
        }
      }

      if (isCold) {
        if (product.category.toLowerCase().includes('ice cream')) {
          stockAdjustment -= 3;
        } else {
          stockAdjustment += 2;
        }
      }

      // Time-based adjustments
      if (weekend) stockAdjustment += 3;
      if (holiday) {
        stockAdjustment += 5;
        priceAdjustment -= 300;
      }
      if (summer && product.category.toLowerCase().includes('fruit')) {
        stockAdjustment += 2;
      }

      // Apply adjustments with bounds
      const minStock = 5;
      const maxStock = 50;
      const newStock = Math.max(minStock, Math.min(maxStock, product.stock + stockAdjustment));
      const newPrice = Math.max(0, product.price + priceAdjustment);

      await Product.findByIdAndUpdate(product._id, {
        stock: newStock,
        price: newPrice,
      });

      const logEntry = `${new Date().toISOString()} | ${product.name} | Stock: ${product.stock} → ${newStock} | Price: ${product.price} → ${newPrice}`;
      changeLogs.push(logEntry);
      console.log(logEntry);
    }

    // Write logs
    if (changeLogs.length > 0) {
      if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
      }
      fs.appendFileSync(LOG_FILE_PATH, changeLogs.join('\n') + '\n');

      // Send promotional emails
      const offerMessage = `🔥 Some Products Haven Promo Alert!\n\nWe're dropping prices on select products due to the amazing weather and holiday cheer!\n\nDon't miss your chance to grab them while stocks last!\n\nCheck them out now at our store! 🎂`;
      await sendPromotionalEmailToUsers(offerMessage);
    }

    console.log('✅ Stock and price adjusted based on weather and time.');
  } catch (error) {
    console.error('❌ Error adjusting stock/price:', error.message);
  }
};

const runStockAdjustment = async () => {
  try {
    console.log('⏰ Running stock adjustment...');
    const weather = await getWeatherData();
    if (weather) {
      console.log('🌡️ Current Temp:', weather.main.temp);
    }
    await adjustStockBasedOnWeather(weather);
  } catch (error) {
    console.error('❌ Error during scheduled stock adjustment:', error.message);
  }
};

const scheduleStockAdjustment = () => {
  // Run immediately
  runStockAdjustment();

  // Then schedule to run every 3 hours
  schedule.scheduleJob('0 */3 * * *', async () => {
    await runStockAdjustment();
  });
};

const sendPromotionalEmailToUsers = async (message) => {
  try {
    const users = await User.find({});

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = users.map(user =>
      transporter.sendMail({
        from: `"Product Haven" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🎉 Special Offer Just for You!',
        text: message,
        html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
      })
    );

    await Promise.all(emailPromises);
    console.log(`📧 Promotional emails sent to ${users.length} users.`);
  } catch (error) {
    console.error('❌ Failed to send promotional emails:', error.message);
  }
};

export { scheduleStockAdjustment, adjustStockBasedOnWeather, getWeatherData, sendPromotionalEmailToUsers };
