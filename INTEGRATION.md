# Frontend Integration Guide

Panduan integrasi backend API ke frontend SkySweep miniapp.

## Setup

### 1. Install Dependencies

```bash
npm install @farcaster/miniapp-sdk axios
```

### 2. Environment Variables

Tambahkan ke `.env.local` di root project:

```env
VITE_BACKEND_URL=http://localhost:8787
VITE_BACKEND_API_URL=http://localhost:8787/api
```

Untuk production:

```env
VITE_BACKEND_URL=https://your-backend-url.railway.app
VITE_BACKEND_API_URL=https://your-backend-url.railway.app/api
```

## Integration

### 1. Create API Client

Buat file `src/lib/api.ts`:

```typescript
import { sdk } from '@farcaster/miniapp-sdk';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8787/api';

export const api = {
  async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    return sdk.quickAuth.fetch(`${API_BASE_URL}${endpoint}`, options);
  },
  
  async get(endpoint: string) {
    const response = await this.authenticatedFetch(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await this.authenticatedFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },
};

export const weatherApi = axios.create({
  baseURL: API_BASE_URL + '/weather',
});
```

### 2. Authentication Hook

Buat file `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { api } from '../lib/api';

export interface User {
  id: string;
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  points: number;
  streak: number;
  rank: number;
  accuracy: number;
  primaryAddress?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

### 3. Update App.tsx

```typescript
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Sweep } from './components/Sweep';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { StormWatch } from './components/StormWatch';
import { HowItWorks } from './components/HowItWorks';

const App: React.FC = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Sweep user={user} />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="storm-watch" element={<StormWatch />} />
          <Route path="faq" element={<HowItWorks />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
```

### 4. API Usage Examples

#### Fetch User Profile

```typescript
import { api } from '../lib/api';

async function loadProfile() {
  const profile = await api.get('/users/profile');
  console.log(profile);
}
```

#### Create Prediction

```typescript
import { api } from '../lib/api';

async function createPrediction() {
  const prediction = await api.post('/predictions', {
    locationName: 'New York',
    locationLat: 40.7128,
    locationLng: -74.0060,
    locationCountry: 'US',
    predictedTemp: 25,
    predictedCondition: 'Sunny',
    targetDate: '2025-12-15',
  });
  
  console.log('Prediction created:', prediction);
}
```

#### Fetch Leaderboard

```typescript
import { api } from '../lib/api';

async function loadLeaderboard() {
  const leaderboard = await api.get('/leaderboard?limit=100');
  console.log(leaderboard);
}
```

#### Search Locations

```typescript
import { weatherApi } from '../lib/api';

async function searchLocations(query: string) {
  const response = await weatherApi.get('/search', {
    params: { q: query }
  });
  
  return response.data;
}
```

#### Get Weather Forecast

```typescript
import { weatherApi } from '../lib/api';

async function getForecast(location: string) {
  const response = await weatherApi.get('/forecast', {
    params: { 
      location,
      days: 7
    }
  });
  
  return response.data;
}
```

### 5. Add to index.html

Add preconnect untuk Quick Auth optimization:

```html
<head>
  <!-- Existing meta tags -->
  <link rel="preconnect" href="https://auth.farcaster.xyz" />
</head>
```

## API Endpoints Reference

### Authentication
- `GET /api/auth/me` - Get authenticated user

### User
- `GET /api/users/profile` - Get full profile with badges
- `GET /api/users/badges` - Get user badges

### Predictions
- `POST /api/predictions` - Create prediction
- `GET /api/predictions` - Get user predictions
- `GET /api/predictions/:id` - Get specific prediction
- `GET /api/predictions/stats` - Get prediction stats

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard (with pagination)
- `GET /api/leaderboard/top` - Get top users

### Weather
- `GET /api/weather/current?location=<location>` - Current weather
- `GET /api/weather/forecast?location=<location>&days=<days>` - Forecast
- `GET /api/weather/search?q=<query>` - Search locations

### Storm Events
- `GET /api/storms` - Coming soon

## Error Handling

```typescript
import { api } from '../lib/api';

async function safeApiCall() {
  try {
    const data = await api.get('/users/profile');
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

## Testing

Test API connection:

```typescript
import { api } from '../lib/api';

async function testConnection() {
  try {
    const response = await fetch('http://localhost:8787/health');
    const data = await response.json();
    console.log('Backend health:', data);
    
    const user = await api.get('/auth/me');
    console.log('Authenticated user:', user);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

## Production Checklist

- [ ] Update `VITE_BACKEND_URL` to production URL
- [ ] Test authentication flow
- [ ] Verify CORS settings on backend
- [ ] Test all API endpoints
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add retry logic for failed requests
- [ ] Monitor API performance
- [ ] Set up error tracking (Sentry)
