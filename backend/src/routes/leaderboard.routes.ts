import { Router } from 'express';
import { leaderboardService } from '../services/leaderboard.service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const leaderboard = await leaderboardService.getLeaderboard(limit, offset);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topUsers = await leaderboardService.getTopUsers(limit);
    res.json(topUsers);
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
