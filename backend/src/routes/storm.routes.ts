import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({
    message: 'Storm events coming soon!',
    events: [],
  });
});

router.get('/:id', async (req, res) => {
  res.status(404).json({
    message: 'Storm events coming soon!',
  });
});

export default router;
