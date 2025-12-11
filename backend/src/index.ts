import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import predictionRoutes from './routes/prediction.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import stormRoutes from './routes/storm.routes.js';
import { predictionService } from './services/prediction.service.js';
import { leaderboardService } from './services/leaderboard.service.js';

const app = express();

app.use(cors({
  origin: env.cors.allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/storms', stormRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const startCronJobs = () => {
  setInterval(async () => {
    try {
      console.log('Running prediction scoring job...');
      const scored = await predictionService.scorePendingPredictions();
      console.log(`Scored ${scored} predictions`);
      
      if (scored > 0) {
        await leaderboardService.refreshLeaderboard();
        console.log('Leaderboard refreshed');
      }
    } catch (error) {
      console.error('Error in prediction scoring job:', error);
    }
  }, 60 * 60 * 1000);
};

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`CORS enabled for: ${env.cors.allowedOrigins.join(', ')}`);
  
  startCronJobs();
  console.log('Cron jobs started');
});

export default app;
