import { Router } from 'express';
import { weatherService } from '../services/weather.service.js';

const router = Router();

router.get('/current', async (req, res) => {
  try {
    const location = req.query.location as string;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const weather = await weatherService.getCurrentWeather(location);
    res.json(weather);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

router.get('/forecast', async (req, res) => {
  try {
    const location = req.query.location as string;
    const days = parseInt(req.query.days as string) || 7;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const forecast = await weatherService.getForecast(location, days);
    res.json(forecast);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const locations = await weatherService.searchLocations(query);
    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

export default router;
