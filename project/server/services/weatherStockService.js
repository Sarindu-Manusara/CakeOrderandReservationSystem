import axios from 'axios';
import schedule from 'node-schedule';
import Cake from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'e22b916173bb8dfbac2133cf97ac5de2';
const COLOMBO_COORDS = { lat: 6.9271, lon: 79.8612 };
const LOG_FILE_PATH = path.join('logs', 'price_stock_changes.log');

const isHoliday = (date) => {
  const holidays = [
    '2025-01-01', // New Year's Day
    '2025-01-15', // Tamil Thai Pongal Day
    '2025-02-04', // National Day
    '2025-05-01', // May Day
    '2025-12-25', // Christmas
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
    console.error('Error fetching weather data:', error);
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

  /** @type {string[]} */
  const changeLogs = [];

  try {
    const cakes = await Cake.find({});

    for (const cake of cakes) {
      if (cake.weatherSensitive === false) continue;

      let stockAdjustment = 0;
      let priceAdjustment = 0;

      // Weather-based stock + price
      if (isHot) {
        if (cake.category.toLowerCase().includes('ice cream')) {
          stockAdjustment += 5;
          priceAdjustment -= 500;
        } else if (cake.category.toLowerCase().includes('chocolate')) {
          stockAdjustment -= 2;
        }
      }

      if (isRaining) {
        if (
          cake.category.toLowerCase().includes('chocolate') ||
          cake.category.toLowerCase().includes('carrot')
        ) {
          stockAdjustment += 3;
        }
      }

      if (isCold) {
        if (cake.category.toLowerCase().includes('ice cream')) {
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
      if (summer && cake.category.toLowerCase().includes('fruit')) {
        stockAdjustment += 2;
      }

      // Final values
      const minStock = 5;
      const maxStock = 50;
      const newStock = Math.max(minStock, Math.min(maxStock, cake.stock + stockAdjustment));
      const newPrice = Math.max(0, cake.price + priceAdjustment);

      // Update DB
      await Cake.findByIdAndUpdate(cake._id, {
        stock: newStock,
        price: newPrice,
      });

      // Save change log
      const logEntry = `${new Date().toISOString()} | ${cake.name} | Stock: ${cake.stock} → ${newStock} | Price: ${cake.price} → ${newPrice}`;
      changeLogs.push(logEntry);
      console.log(logEntry);
    }

    // Write to log file
    if (changeLogs.length > 0) {
      if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
      }
      fs.appendFileSync(LOG_FILE_PATH, changeLogs.join('\n') + '\n');

      
      const offerMessage = `🔥 Cake Haven Promo Alert!\n\nWe're dropping prices on select cakes due to the amazing weather and holiday cheer!\n\nDon't miss your chance to grab them while stocks last!\n\nCheck them out now at our store! 🎂`;
      await sendPromotionalEmailToUsers(offerMessage);
    }

    console.log('✅ Stock and price adjusted based on weather and time.');
  } catch (error) {
    console.error('❌ Error adjusting stock/price:', error);
  }
};


const scheduleStockAdjustment = () => {
  schedule.scheduleJob('0 */3 * * *', async () => {
    console.log('⏰ Running scheduled stock adjustment...');
    const weather = await getWeatherData();
    console.log('🌡️ Current Temp:', weather?.main?.temp);
    await adjustStockBasedOnWeather(weather);
  });
};

const sendPromotionalEmailToUsers = async (message) => {
  try {
    // Optionally only send to verified users
    const users = await User.find({}); // or { isVerified: true }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailPromises = users.map((user) =>
      transporter.sendMail({
        from: `"Cake Haven" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🎉 Special Offer Just for You!',
        text: message,
        html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
      })
    );

    await Promise.all(emailPromises);
    console.log(`📧 Promotional emails sent to ${users.length} users.`);
  } catch (error) {
    console.error('❌ Failed to send promotional emails:', error);
  }
};

export { scheduleStockAdjustment, adjustStockBasedOnWeather, getWeatherData, sendPromotionalEmailToUsers };
