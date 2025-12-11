# ✅ Setup Checklist - SkySweep Backend

Checklist lengkap untuk setup backend dari awal sampai production.

## Phase 1: Prerequisites ⏰ 5 minutes

### API Keys & Accounts

- [ ] **Supabase Account**
  - Go to: https://supabase.com
  - Sign up / Login
  - Create new project: "skysweep"
  - Wait ~2 minutes for project creation

- [ ] **Neynar API Key**
  - Go to: https://neynar.com
  - Sign up / Login
  - Create API key
  - Copy and save securely

- [ ] **WeatherAPI Key**
  - Go to: https://www.weatherapi.com
  - Sign up (Free tier: 1M calls/month)
  - Copy API key
  - Save securely

- [ ] **Node.js 18+**
  - Check: `node --version`
  - Install if needed from: https://nodejs.org

## Phase 2: Database Setup ⏰ 3 minutes

### Supabase Configuration

- [ ] Open Supabase Dashboard
- [ ] Go to Project Settings → API
- [ ] Copy **Project URL**: `https://xxxxx.supabase.co`
- [ ] Copy **anon public** key
- [ ] Copy **service_role** key (keep secret!)

### Run Database Schema

- [ ] Go to SQL Editor in Supabase Dashboard
- [ ] Click "New Query"
- [ ] Open file: `backend/supabase/schema.sql`
- [ ] Copy entire content
- [ ] Paste in SQL Editor
- [ ] Click "Run"
- [ ] Wait for success message

### Verify Tables Created

- [ ] Go to Table Editor
- [ ] Check tables exist:
  - ✅ users
  - ✅ predictions
  - ✅ badges
  - ✅ user_badges
  - ✅ leaderboard (view)

### Verify Initial Data

- [ ] Go to Table Editor → badges
- [ ] Verify 14 badges are inserted
- [ ] Check badge icons and descriptions

## Phase 3: Backend Setup ⏰ 2 minutes

### Install Dependencies

```bash
cd backend
npm install
```

- [ ] Dependencies installed successfully
- [ ] No errors in console

### Configure Environment

- [ ] Copy `.env.example` to `.env`
- [ ] Open `backend/.env` in editor

Fill in all values:

```env
PORT=8787
NODE_ENV=development
HOSTNAME=localhost:8787

# Paste Supabase credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Paste Neynar API key
NEYNAR_API_KEY=NEYNAR_...

# Paste WeatherAPI key
WEATHER_API_KEY=your-weather-api-key

# Frontend URL
ALLOWED_ORIGINS=http://localhost:5173
```

- [ ] All environment variables filled
- [ ] No placeholder values remaining

## Phase 4: Test Backend ⏰ 2 minutes

### Start Backend

```bash
npm run dev
```

Expected output:
```
Server running on port 8787
Environment: development
CORS enabled for: http://localhost:5173
Cron jobs started
```

- [ ] Backend started without errors
- [ ] Port 8787 is listening
- [ ] No environment variable errors

### Test Health Endpoint

Open new terminal:

```bash
curl http://localhost:8787/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T..."
}
```

- [ ] Health check returns 200 OK
- [ ] Response has correct format

### Test Weather Endpoint

```bash
curl "http://localhost:8787/api/weather/search?q=New%20York"
```

- [ ] Returns location data
- [ ] No API key errors
- [ ] WeatherAPI working

## Phase 5: Frontend Setup ⏰ 3 minutes

### Update Environment Variables

Edit `.env.local` in **root** directory:

```env
VITE_BACKEND_URL=http://localhost:8787
VITE_BACKEND_API_URL=http://localhost:8787/api
```

- [ ] `.env.local` updated
- [ ] URLs point to local backend

### Install Frontend Dependencies

```bash
# In root directory
npm install @farcaster/miniapp-sdk axios
```

- [ ] Dependencies installed
- [ ] No peer dependency warnings

### Create API Client

Create `src/lib/api.ts`:

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const api = {
  async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    return sdk.quickAuth.fetch(`${API_BASE_URL}${endpoint}`, options);
  },
  
  async get(endpoint: string) {
    const response = await this.authenticatedFetch(endpoint);
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await this.authenticatedFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return response.json();
  },
};
```

- [ ] File created: `src/lib/api.ts`
- [ ] No TypeScript errors

### Create Auth Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { api } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await api.get('/auth/me');
        setUser(userData);
        sdk.actions.ready();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return { user, loading, error };
}
```

- [ ] File created: `src/hooks/useAuth.ts`
- [ ] No TypeScript errors

### Update index.html

Add preconnect for Quick Auth:

```html
<head>
  <!-- Other meta tags -->
  <link rel="preconnect" href="https://auth.farcaster.xyz" />
</head>
```

- [ ] Preconnect link added
- [ ] Placed in `<head>` section

## Phase 6: Integration Test ⏰ 5 minutes

### Test Authentication Flow

- [ ] Start frontend: `npm run dev`
- [ ] Open in Farcaster client
- [ ] Login with Farcaster account
- [ ] Check console for user data
- [ ] Verify no CORS errors

### Test Create Prediction

In browser console:

```javascript
const api = await import('./lib/api.js');
const prediction = await api.api.post('/predictions', {
  locationName: 'New York',
  locationLat: 40.7128,
  locationLng: -74.0060,
  locationCountry: 'US',
  predictedTemp: 25,
  predictedCondition: 'Sunny',
  targetDate: '2025-12-15',
});
console.log('Created:', prediction);
```

- [ ] Prediction created successfully
- [ ] No errors in console
- [ ] Backend logs show request

### Verify in Database

- [ ] Go to Supabase → Table Editor → predictions
- [ ] See new prediction record
- [ ] Status is "pending"
- [ ] All fields populated correctly

### Test Profile Endpoint

```javascript
const profile = await api.api.get('/users/profile');
console.log('Profile:', profile);
```

- [ ] Profile data returned
- [ ] Shows user stats
- [ ] Shows badges (if any)

### Test Leaderboard

```javascript
const leaderboard = await api.api.get('/leaderboard?limit=10');
console.log('Leaderboard:', leaderboard);
```

- [ ] Leaderboard data returned
- [ ] Shows users with rankings
- [ ] Sorted by points

## Phase 7: Production Prep ⏰ Varies

### Choose Hosting Platform

Select one:
- [ ] Railway (Recommended - easiest)
- [ ] Render (Free tier available)
- [ ] Fly.io (Good performance)
- [ ] Vercel (Serverless - requires modifications)

### Prepare Production Credentials

- [ ] Note down production domain
- [ ] Update `HOSTNAME` for production
- [ ] Update `ALLOWED_ORIGINS` with production frontend URL

### Review Documentation

- [ ] Read `DEPLOYMENT.md`
- [ ] Understand deployment steps
- [ ] Prepare deployment commands

### Security Review

- [ ] `.env` is in `.gitignore`
- [ ] No API keys in code
- [ ] CORS properly configured
- [ ] Service key kept secret

## Phase 8: Deploy Backend ⏰ 10 minutes

Follow `DEPLOYMENT.md` for detailed steps.

### Railway Deployment (Recommended)

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
```

Set environment variables:
```bash
railway variables set PORT=8787
railway variables set NODE_ENV=production
railway variables set HOSTNAME=your-app.railway.app
railway variables set SUPABASE_URL=...
railway variables set SUPABASE_ANON_KEY=...
railway variables set SUPABASE_SERVICE_KEY=...
railway variables set NEYNAR_API_KEY=...
railway variables set WEATHER_API_KEY=...
railway variables set ALLOWED_ORIGINS=https://your-frontend.com
```

Deploy:
```bash
railway up
```

- [ ] Backend deployed successfully
- [ ] Get production domain from Railway
- [ ] Health check works on production URL

### Update Frontend for Production

Update `.env.local`:
```env
VITE_BACKEND_URL=https://your-backend.railway.app
VITE_BACKEND_API_URL=https://your-backend.railway.app/api
```

- [ ] Frontend URLs updated
- [ ] Frontend redeployed with new URLs

### Test Production

- [ ] Test health endpoint
- [ ] Test authentication
- [ ] Create test prediction
- [ ] View leaderboard
- [ ] Check logs for errors

## Phase 9: Monitoring ⏰ Ongoing

### Setup Monitoring

- [ ] Check Railway/Render logs regularly
- [ ] Monitor Supabase usage dashboard
- [ ] Track API rate limits (Neynar, WeatherAPI)
- [ ] Set up error alerts (optional)

### Verify Cron Jobs

- [ ] Check backend logs for cron execution
- [ ] Verify predictions are being scored
- [ ] Check leaderboard updates

### Database Health

- [ ] Monitor database size
- [ ] Check query performance
- [ ] Review slow query logs

## 🎉 Complete!

Your SkySweep backend is now:
- ✅ Fully configured
- ✅ Database setup
- ✅ APIs integrated
- ✅ Deployed to production
- ✅ Frontend connected
- ✅ Monitoring active

## 📚 Next Steps

1. **Customize**: Modify scoring system, badges, etc.
2. **Enhance**: Add more features (storm events, etc.)
3. **Optimize**: Add caching, improve queries
4. **Monitor**: Track usage and performance
5. **Scale**: Upgrade hosting as needed

## 🆘 Troubleshooting

If you encounter issues, check:

- [ ] `QUICK_START.md` - Quick fixes
- [ ] `BACKEND_SUMMARY.md` - Complete overview
- [ ] `API_EXAMPLES.md` - Test endpoints manually
- [ ] `SUPABASE_SETUP.md` - Database issues
- [ ] `DEPLOYMENT.md` - Deployment problems
- [ ] `INTEGRATION.md` - Frontend issues

## 📞 Support Resources

- **Documentation**: All MD files in project
- **Supabase Docs**: https://supabase.com/docs
- **Neynar Docs**: https://docs.neynar.com
- **WeatherAPI Docs**: https://www.weatherapi.com/docs
- **Farcaster Miniapps**: https://miniapps.farcaster.xyz

Happy building! 🚀
