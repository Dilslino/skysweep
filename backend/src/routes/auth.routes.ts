import { Router } from 'express';
import { quickAuthMiddleware } from '../middleware/auth.js';
import { userService } from '../services/user.service.js';

const router = Router();

router.get('/me', quickAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      primaryAddress: user.primary_address,
      points: user.points,
      streak: user.streak,
      rank: user.rank,
      accuracy: user.accuracy,
      bestLocation: user.best_location,
    });
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
