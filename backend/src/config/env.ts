import { config } from 'dotenv';

config();

export const env = {
  port: process.env.PORT || '8787',
  nodeEnv: process.env.NODE_ENV || 'development',
  hostname: process.env.HOSTNAME || 'localhost:8787',
  
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  
  neynar: {
    apiKey: process.env.NEYNAR_API_KEY!,
  },
  
  weather: {
    apiKey: process.env.WEATHER_API_KEY!,
  },
  
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
};

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'NEYNAR_API_KEY',
  'WEATHER_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
