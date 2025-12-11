# 🚀 Quick Start Guide - SkySweep Backend

Panduan cepat untuk setup dan run backend dalam 10 menit!

## Prerequisites

- **Node.js 18+** installed (20+ recommended)
  - Check: `node --version`
  - Download: https://nodejs.org
- Supabase account
- Neynar API key
- WeatherAPI key

**Note:** Backend works with Node 18+ but you may see warnings. Node 20+ recommended for best compatibility.

## Step 1: Get API Keys (5 minutes)

### Supabase
1. Go to https://supabase.com
2. Create new project
3. Copy: URL, anon key, service key

### Neynar
1. Go to https://neynar.com
2. Sign up / Login
3. Create API key

### WeatherAPI
1. Go to https://www.weatherapi.com
2. Sign up (Free tier: 1M calls/month)
3. Copy API key

## Step 2: Setup Database (3 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Open `backend/supabase/schema.sql`
3. Copy all content
4. Paste in SQL Editor
5. Click "Run"
6. ✅ Done! Tables created

## Step 3: Configure Backend (2 minutes)

```bash
cd backend
npm install
```

Edit `backend/.env`:

```env
PORT=8787
NODE_ENV=development
HOSTNAME=localhost:8787

# Paste your Supabase credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Paste your Neynar API key
NEYNAR_API_KEY=NEYNAR_...

# Paste your WeatherAPI key
WEATHER_API_KEY=your-key-here

ALLOWED_ORIGINS=http://localhost:5173
```

## Step 4: Run Backend

```bash
npm run dev
```

Output:
```
Server running on port 8787
Environment: development
CORS enabled for: http://localhost:5173
Cron jobs started
```

## Step 5: Test Backend

Open new terminal:

```bash
curl http://localhost:8787/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T..."
}
```

✅ **Backend is running!**

## Step 6: Configure Frontend

Edit `.env.local` in root:

```env
VITE_BACKEND_URL=http://localhost:8787
VITE_BACKEND_API_URL=http://localhost:8787/api
```

## Step 7: Install Frontend Dependencies

```bash
npm install @farcaster/miniapp-sdk axios
```

## Step 8: Create API Client

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

## Step 9: Create Auth Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { api } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await api.get('/auth/me');
        setUser(userData);
        sdk.actions.ready();
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return { user, loading };
}
```

## Step 10: Test Integration

In your component:

```typescript
import { useAuth } from './hooks/useAuth';
import { api } from './lib/api';

function MyComponent() {
  const { user, loading } = useAuth();

  const createPrediction = async () => {
    const prediction = await api.post('/predictions', {
      locationName: 'New York',
      locationLat: 40.7128,
      locationLng: -74.0060,
      locationCountry: 'US',
      predictedTemp: 25,
      predictedCondition: 'Sunny',
      targetDate: '2025-12-15',
    });
    console.log('Created:', prediction);
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Hello {user?.username}!</h1>
      <p>Points: {user?.points}</p>
      <button onClick={createPrediction}>
        Make Prediction
      </button>
    </div>
  );
}
```

## ✅ Checklist

- [ ] Got all API keys
- [ ] Created Supabase project
- [ ] Ran database schema
- [ ] Configured backend .env
- [ ] Installed backend dependencies
- [ ] Started backend (npm run dev)
- [ ] Tested /health endpoint
- [ ] Configured frontend .env
- [ ] Installed frontend dependencies
- [ ] Created API client
- [ ] Created auth hook
- [ ] Tested authentication

## 🎉 Done!

Your backend is now running with:
- ✅ Farcaster authentication
- ✅ Database ready
- ✅ API endpoints working
- ✅ Frontend integrated

## Next Steps

1. **Read Full Docs**: Check `BACKEND_SUMMARY.md`
2. **Test API**: Use `API_EXAMPLES.md`
3. **Deploy**: Follow `DEPLOYMENT.md`
4. **Integrate**: Complete `INTEGRATION.md`

## Common Issues

### Node version warnings during npm install

```
npm WARN EBADENGINE Unsupported engine
```

**Fix**: This is just a warning. Backend will work with Node 18+. Consider upgrading to Node 20+ for best compatibility.

### Backend won't start
```
Error: Missing required environment variable
```
**Fix**: Check all env vars are set in `.env`

### Database connection fails
```
Error: Failed to connect to Supabase
```
**Fix**: 
1. Verify SUPABASE_URL and keys
2. Check Supabase project is active
3. Run schema.sql if tables missing

### Authentication fails
```
Error: Invalid token
```
**Fix**:
1. Check HOSTNAME matches (use `localhost:8787` for dev)
2. Verify Neynar API key
3. Make sure frontend uses correct backend URL

### CORS error
```
Access-Control-Allow-Origin error
```
**Fix**: Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env`

## Support

For detailed documentation, see:
- `BACKEND_SUMMARY.md` - Complete overview
- `README.md` - Backend documentation
- `INTEGRATION.md` - Frontend integration
- `API_EXAMPLES.md` - API testing
- `DEPLOYMENT.md` - Production deployment
- `SUPABASE_SETUP.md` - Database setup

## Tips

💡 Use `npm run dev` for development (auto-reload)
💡 Check console logs for debugging
💡 Test endpoints with curl or Postman
💡 Monitor Supabase dashboard for queries
💡 Cron jobs run every hour for scoring

Happy coding! 🚀
