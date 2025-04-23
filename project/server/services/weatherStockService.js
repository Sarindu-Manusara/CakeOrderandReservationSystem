import axios from 'axios';
import schedule from 'node-schedule';
import Cake from '../models/cakeModel.js';


const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'e22b916173bb8dfbac2133cf97ac5de2';
const COLOMBO_COORDS = { lat: 6.9271, lon: 79.8612 };

// ✅ Moved above so it's available before usage
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

  try {
    const cakes = await Cake.find({});

    for (const cake of cakes) {
      if (cake.weatherSensitive == false) {
        continue;
      }
      let stockAdjustment = 0;

      // ☀️ Weather-based rules
      if (isHot) {
        if (cake.category.toLowerCase().includes('ice cream')) {
          stockAdjustment += 5;
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

      // 🗓️ Time-based rules
      const now = new Date();
      const weekend = now.getDay() === 0 || now.getDay() === 6;
      const holiday = isHoliday(now);
      const summer = now.getMonth() >= 3 && now.getMonth() <= 8;

      if (weekend) stockAdjustment += 3;
      if (holiday) stockAdjustment += 5;
      if (summer && cake.category.toLowerCase().includes('fruit')) {
        stockAdjustment += 2;
      }

      // 🧮 Calculate new stock within limits
      const minStock = 5;
      const maxStock = 50;
      const newStock = Math.max(minStock, Math.min(maxStock, cake.stock + stockAdjustment));

      await Cake.findByIdAndUpdate(cake._id, { stock: newStock });
    }

    console.log('✅ Stock levels adjusted based on weather and time.');
  } catch (error) {
    console.error('❌ Error adjusting stock levels:', error);
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

export { scheduleStockAdjustment, adjustStockBasedOnWeather, getWeatherData };
