# SkySweep Project Structure

Complete structure dari SkySweep miniapp dengan backend.

## 📁 Project Tree

```
skysweep/
│
├── backend/                          # Backend API (NEW)
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts               # Environment configuration
│   │   │   └── supabase.ts          # Supabase client setup
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.ts              # Quick Auth middleware with Neynar
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.ts       # GET /api/auth/me
│   │   │   ├── user.routes.ts       # GET /api/users/profile, /badges
│   │   │   ├── prediction.routes.ts # POST/GET /api/predictions
│   │   │   ├── leaderboard.routes.ts# GET /api/leaderboard
│   │   │   ├── weather.routes.ts    # GET /api/weather/*
│   │   │   └── storm.routes.ts      # GET /api/storms (coming soon)
│   │   │
│   │   ├── services/
│   │   │   ├── weather.service.ts   # WeatherAPI integration & scoring
│   │   │   ├── user.service.ts      # User management & badges
│   │   │   ├── prediction.service.ts# Prediction logic & scoring
│   │   │   └── leaderboard.service.ts# Leaderboard management
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types & interfaces
│   │   │
│   │   ├── utils/
│   │   │   ├── scoring.ts           # Scoring utilities & constants
│   │   │   └── validators.ts        # Input validation helpers
│   │   │
│   │   └── index.ts                 # Main Express server + cron jobs
│   │
│   ├── supabase/
│   │   └── schema.sql               # Database schema (users, predictions, badges)
│   │
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Example env file
│   ├── .gitignore                   # Git ignore rules
│   │
│   ├── README.md                    # Backend main documentation
│   ├── DEPLOYMENT.md                # Deployment guide (Railway, Render, etc)
│   ├── SUPABASE_SETUP.md           # Database setup guide
│   └── API_EXAMPLES.md              # API testing examples
│
├── components/                       # Frontend React components
│   ├── Layout.tsx                   # Main layout wrapper
│   ├── Sweep.tsx                    # Prediction creation page
│   ├── Leaderboard.tsx              # Leaderboard page
│   ├── Profile.tsx                  # User profile page
│   ├── StormWatch.tsx               # Storm events page
│   └── HowItWorks.tsx               # FAQ page
│
├── App.tsx                          # Main React app with routing
├── index.tsx                        # React entry point
├── index.html                       # HTML template
├── types.ts                         # Frontend TypeScript types
├── constants.ts                     # Frontend constants
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # Frontend TypeScript config
├── package.json                     # Frontend dependencies
│
├── .env.local                       # Frontend environment variables
├── .gitignore                       # Git ignore rules
├── metadata.json                    # Farcaster miniapp metadata
├── README.md                        # Original project README
│
├── BACKEND_SUMMARY.md               # Complete backend overview (NEW)
├── INTEGRATION.md                   # Frontend integration guide (NEW)
├── QUICK_START.md                   # 10-minute setup guide (NEW)
└── PROJECT_STRUCTURE.md             # This file (NEW)
```

## 📦 Key Files Explained

### Backend Core

| File | Purpose |
|------|---------|
| `src/index.ts` | Main Express server, routes setup, cron jobs |
| `src/config/env.ts` | Environment validation & configuration |
| `src/middleware/auth.ts` | Farcaster Quick Auth + Neynar integration |

### Services

| File | Purpose |
|------|---------|
| `weather.service.ts` | WeatherAPI calls, condition mapping, scoring |
| `user.service.ts` | User CRUD, stats calculation, badge awards |
| `prediction.service.ts` | Predictions CRUD, auto-scoring logic |
| `leaderboard.service.ts` | Ranking queries, leaderboard refresh |

### Routes (API Endpoints)

| File | Endpoints |
|------|-----------|
| `auth.routes.ts` | `/api/auth/me` |
| `user.routes.ts` | `/api/users/profile`, `/api/users/badges` |
| `prediction.routes.ts` | `/api/predictions` (POST, GET, GET/:id) |
| `leaderboard.routes.ts` | `/api/leaderboard`, `/api/leaderboard/top` |
| `weather.routes.ts` | `/api/weather/current`, `/forecast`, `/search` |
| `storm.routes.ts` | `/api/storms` (placeholder) |

### Database

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Complete database schema with tables, indexes, functions |

Tables:
- `users` - User profiles (FID, username, points, streak, rank, etc)
- `predictions` - Weather predictions (location, predicted vs actual, score)
- `badges` - Available badges (14 total)
- `user_badges` - User badge achievements
- `leaderboard` - Materialized view for performance

### Documentation

| File | Content |
|------|---------|
| `BACKEND_SUMMARY.md` | Complete overview of everything |
| `QUICK_START.md` | 10-minute setup guide |
| `INTEGRATION.md` | Frontend integration tutorial |
| `README.md` | Backend main documentation |
| `DEPLOYMENT.md` | Production deployment guide |
| `SUPABASE_SETUP.md` | Database setup instructions |
| `API_EXAMPLES.md` | curl examples for testing |

## 🔄 Data Flow

### 1. User Authentication
```
Frontend → Quick Auth SDK → Backend /api/auth/me
Backend → Neynar API (get user data)
Backend → Supabase (create/get user)
Backend → Frontend (user profile)
```

### 2. Create Prediction
```
Frontend → POST /api/predictions
Backend → Validate input
Backend → Insert to Supabase
Backend → Frontend (prediction created)
```

### 3. Score Predictions (Cron Job)
```
Cron (every hour) → prediction.service.scorePendingPredictions()
Service → Get pending predictions (target_date <= today)
Service → WeatherAPI (get actual weather)
Service → Calculate score (temp + condition)
Service → Update prediction in Supabase
Service → Update user points, streak, accuracy
Service → Check & award badges
Service → Update rankings
Service → Refresh leaderboard
```

### 4. View Leaderboard
```
Frontend → GET /api/leaderboard
Backend → Query Supabase (sorted by points)
Backend → Frontend (leaderboard data)
```

## 🎯 Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: @farcaster/quick-auth
- **APIs**: Neynar, WeatherAPI
- **HTTP Client**: Axios
- **CORS**: cors middleware

### Frontend
- **Framework**: React 19
- **Router**: React Router v7
- **Build**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **SDK**: @farcaster/miniapp-sdk

### Database
- **PostgreSQL** via Supabase
- **Materialized Views** for performance
- **Indexes** on key columns
- **Triggers** for auto-updates

## 📊 Database Schema

### users
```sql
- id (uuid, primary key)
- fid (bigint, unique) -- Farcaster ID
- username, display_name, avatar_url
- primary_address (ETH address)
- points, streak, rank, accuracy
- best_location
- created_at, updated_at
```

### predictions
```sql
- id (uuid, primary key)
- user_id (foreign key → users)
- location_name, location_lat, location_lng, location_country
- predicted_temp, predicted_condition
- prediction_date, target_date
- actual_temp, actual_condition
- score (0-100)
- status (pending|scored)
- created_at, scored_at
```

### badges
```sql
- id (uuid, primary key)
- name, icon, description
- tier (bronze|silver|gold|platinum)
- requirement_type, requirement_value
```

### user_badges
```sql
- id (uuid, primary key)
- user_id (foreign key → users)
- badge_id (foreign key → badges)
- unlocked_at
```

## 🚀 Getting Started

1. **Quick Start**: Read `QUICK_START.md`
2. **Backend Setup**: Read `BACKEND_SUMMARY.md`
3. **Database**: Follow `SUPABASE_SETUP.md`
4. **Integration**: Follow `INTEGRATION.md`
5. **Deploy**: Read `DEPLOYMENT.md`

## 📝 Environment Variables

### Backend (.env)
```env
PORT=8787
HOSTNAME=localhost:8787
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
NEYNAR_API_KEY=...
WEATHER_API_KEY=...
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env.local)
```env
VITE_BACKEND_URL=http://localhost:8787
VITE_BACKEND_API_URL=http://localhost:8787/api
```

## 🎯 Features Implemented

✅ Farcaster Quick Auth  
✅ Neynar API Integration  
✅ WeatherAPI Integration  
✅ User Management  
✅ Prediction System  
✅ Automatic Scoring (cron job)  
✅ Badge System (14 badges)  
✅ Leaderboard  
✅ Points & Streak Tracking  
✅ Accuracy Calculation  
✅ Ranking System  
⏳ Storm Events (coming soon)  

## 📚 API Reference

Full API documentation in `API_EXAMPLES.md`

**Base URL**: `http://localhost:8787/api`

### Endpoints Summary
- Auth: 1 endpoint
- User: 2 endpoints
- Predictions: 4 endpoints
- Leaderboard: 2 endpoints
- Weather: 3 endpoints
- Storms: 1 endpoint (placeholder)

**Total**: 13 API endpoints

## 🔒 Security

- JWT validation via Quick Auth
- Service key for backend operations
- CORS configured
- Environment variables for secrets
- Input validation on all endpoints
- SQL injection protection (Supabase)

## 📈 Performance

- Materialized views for leaderboard
- Database indexes on key columns
- Connection pooling (Supabase)
- Cron jobs for batch processing
- Efficient scoring algorithm

## 🎉 Success Metrics

When fully deployed:
- ✅ Users can authenticate via Farcaster
- ✅ Users can create weather predictions
- ✅ Predictions auto-scored daily
- ✅ Leaderboard updates automatically
- ✅ Badges awarded on achievements
- ✅ Full stats tracking
- ✅ Real-time weather data

## 📞 Support

Check documentation files for help:
- Getting started: `QUICK_START.md`
- Complete guide: `BACKEND_SUMMARY.md`
- API testing: `API_EXAMPLES.md`
- Database: `SUPABASE_SETUP.md`
- Deployment: `DEPLOYMENT.md`
- Integration: `INTEGRATION.md`
