import { Router } from 'express';
import { quickAuthMiddleware } from '../middleware/auth.js';
import { predictionService } from '../services/prediction.service.js';
import { WeatherCondition } from '../types/index.js';

const router = Router();

router.post('/', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      locationName,
      locationLat,
      locationLng,
      locationCountry,
      predictedTemp,
      predictedCondition,
      targetDate,
    } = req.body;

    if (
      !locationName ||
      locationLat === undefined ||
      locationLng === undefined ||
      !locationCountry ||
      predictedTemp === undefined ||
      !predictedCondition ||
      !targetDate
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Object.values(WeatherCondition).includes(predictedCondition)) {
      return res.status(400).json({ error: 'Invalid weather condition' });
    }

    const targetDateObj = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDateObj <= today) {
      return res.status(400).json({ error: 'Target date must be in the future' });
    }

    const prediction = await predictionService.createPrediction(
      req.user.id,
      locationName,
      locationLat,
      locationLng,
      locationCountry,
      predictedTemp,
      predictedCondition,
      targetDate
    );

    res.status(201).json(prediction);
  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const predictions = await predictionService.getUserPredictions(req.user.id, limit);

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const prediction = await predictionService.getPredictionById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    if (prediction.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await predictionService.getPredictionStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching prediction stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
