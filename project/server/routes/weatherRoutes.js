import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import axios from 'axios';
import { adjustStockBasedOnWeather, getWeatherData } from '../services/weatherStockService.js';

const router = express.Router();

// GET /api/weather/current
router.get('/current', async (req, res) => {
  try {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const COLOMBO_COORDS = { lat: 6.9271, lon: 79.8612 };
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${COLOMBO_COORDS.lat}&lon=${COLOMBO_COORDS.lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const weatherInfo = {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity
    };

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// POST /api/weather/adjust-stock
router.post('/adjust-stock', protect, admin, async (req, res) => {
  try {
    const weather = await getWeatherData();
    await adjustStockBasedOnWeather(weather);
    res.status(200).json({ message: 'Stock adjusted based on current weather.' });
  } catch (error) {
    console.error('Manual stock adjustment failed:', error);
    res.status(500).json({ message: 'Failed to adjust stock.' });
  }
});

export default router;
