import { Router } from 'express';
import { quickAuthMiddleware } from '../middleware/auth.js';
import { userService } from '../services/user.service.js';
import { predictionService } from '../services/prediction.service.js';

const router = Router();

router.get('/profile', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const badges = await userService.getUserBadges(req.user.id);
    const stats = await predictionService.getPredictionStats(req.user.id);

    res.json({
      id: user.id,
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      points: user.points,
      streak: user.streak,
      rank: user.rank,
      accuracy: user.accuracy,
      bestLocation: user.best_location,
      badges,
      stats,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/badges', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const badges = await userService.getUserBadges(req.user.id);
    res.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
