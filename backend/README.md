# SkySweep Backend

Backend API untuk SkySweep - Farcaster Mini App untuk prediksi cuaca.

## Features

- 🔐 **Farcaster Authentication**: Quick Auth dengan Neynar API
- 🗄️ **Supabase Database**: PostgreSQL untuk data persistence
- 🌤️ **Weather API Integration**: Real-time dan historical weather data
- 🏆 **Leaderboard System**: Ranking berdasarkan points dan accuracy
- 🎖️ **Badge System**: Achievements untuk berbagai milestones
- 📊 **Prediction Scoring**: Automatic scoring system untuk predictions

## Tech Stack

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: @farcaster/quick-auth
- **APIs**: Neynar API, WeatherAPI.com

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` dan isi dengan credentials Anda:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=8787
NODE_ENV=development
HOSTNAME=your-domain.com

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

NEYNAR_API_KEY=your-neynar-api-key
WEATHER_API_KEY=your-weather-api-key

ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

### 3. Setup Database

Jalankan SQL schema di Supabase:

1. Buka Supabase Dashboard → SQL Editor
2. Copy isi file `supabase/schema.sql`
3. Paste dan execute

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8787`

## API Endpoints

### Authentication

- `GET /api/auth/me` - Get current authenticated user

### User

- `GET /api/users/profile` - Get user profile dengan badges dan stats
- `GET /api/users/badges` - Get user badges

### Predictions

- `POST /api/predictions` - Create new prediction
- `GET /api/predictions` - Get user predictions
- `GET /api/predictions/:id` - Get specific prediction
- `GET /api/predictions/stats` - Get prediction statistics

### Leaderboard

- `GET /api/leaderboard` - Get full leaderboard
- `GET /api/leaderboard/top` - Get top users

### Weather

- `GET /api/weather/current?location=<location>` - Get current weather
- `GET /api/weather/forecast?location=<location>&days=<days>` - Get forecast
- `GET /api/weather/search?q=<query>` - Search locations

### Storm Events

- `GET /api/storms` - Coming soon

## Database Schema

### Tables

- **users**: User profiles dengan FID dari Farcaster
- **predictions**: Weather predictions dari users
- **badges**: Available badges/achievements
- **user_badges**: Junction table untuk user badges
- **leaderboard**: Materialized view untuk ranking

### Automatic Jobs

Backend menjalankan cron jobs untuk:

1. **Score Predictions** (setiap jam): Score predictions yang sudah melewati target date
2. **Update Leaderboard** (setiap jam): Refresh leaderboard setelah scoring

## Scoring System

Predictions di-score berdasarkan:

- **Temperature Accuracy** (0-50 points):
  - Exact match: 50 points
  - ±1°C: 45 points
  - ±2°C: 40 points
  - ±3°C: 35 points
  - Dst.

- **Condition Accuracy** (0-50 points):
  - Exact match: 50 points
  - Similar condition: 25 points
  - Different: 0 points

**Total: 0-100 points per prediction**

## Badge Requirements

- **Predictions**: 1, 10, 50, 100, 500 predictions
- **Points**: 100, 500, 1000 points
- **Streak**: 3, 7, 30 days
- **Accuracy**: 80%, 90%, 95%

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Pastikan set semua environment variables di production environment Anda.

### Recommended Hosting

- **Backend**: Railway, Render, Fly.io
- **Database**: Supabase (sudah included)
- **Domain**: Pastikan HOSTNAME di env sesuai dengan domain production

## Security Notes

- Quick Auth JWT validation memerlukan domain yang benar
- Service key Supabase harus dijaga kerahasiaannya
- API keys harus di environment variables, jangan di commit
- CORS hanya allow origins yang terdaftar

## Support

Untuk issues atau questions, buka issue di repository.
