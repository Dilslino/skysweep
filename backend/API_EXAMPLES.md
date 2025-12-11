# API Examples & Testing

Contoh lengkap untuk testing API endpoints menggunakan curl atau Postman.

## Setup

Untuk testing dengan authentication, Anda perlu:
1. Token dari Farcaster Quick Auth
2. Backend berjalan di `http://localhost:8787`

## Get Token (dari Frontend)

```javascript
import { sdk } from '@farcaster/miniapp-sdk';

const { token } = await sdk.quickAuth.getToken();
console.log('Bearer token:', token);
```

## Health Check

```bash
curl http://localhost:8787/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T12:00:00.000Z"
}
```

## Authentication Endpoints

### Get Current User

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/auth/me
```

Response:
```json
{
  "id": "uuid",
  "fid": 12345,
  "username": "alice",
  "displayName": "Alice",
  "avatarUrl": "https://...",
  "primaryAddress": "0x...",
  "points": 1500,
  "streak": 7,
  "rank": 15,
  "accuracy": 85.5,
  "bestLocation": "New York"
}
```

## User Endpoints

### Get User Profile

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/users/profile
```

Response:
```json
{
  "id": "uuid",
  "fid": 12345,
  "username": "alice",
  "displayName": "Alice",
  "avatarUrl": "https://...",
  "points": 1500,
  "streak": 7,
  "rank": 15,
  "accuracy": 85.5,
  "bestLocation": "New York",
  "badges": [
    {
      "id": "badge-uuid",
      "name": "First Forecast",
      "icon": "🌤️",
      "description": "Make your first weather prediction",
      "tier": "bronze",
      "unlocked_at": "2025-12-01T10:00:00.000Z"
    }
  ],
  "stats": {
    "total": 50,
    "pending": 5,
    "scored": 45,
    "averageScore": 85.5
  }
}
```

### Get User Badges

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/users/badges
```

Response:
```json
[
  {
    "id": "badge-uuid",
    "name": "First Forecast",
    "icon": "🌤️",
    "description": "Make your first weather prediction",
    "tier": "bronze",
    "unlocked_at": "2025-12-01T10:00:00.000Z"
  }
]
```

## Prediction Endpoints

### Create Prediction

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "locationName": "New York",
    "locationLat": 40.7128,
    "locationLng": -74.0060,
    "locationCountry": "US",
    "predictedTemp": 25,
    "predictedCondition": "Sunny",
    "targetDate": "2025-12-15"
  }' \
  http://localhost:8787/api/predictions
```

Response:
```json
{
  "id": "prediction-uuid",
  "user_id": "user-uuid",
  "location_name": "New York",
  "location_lat": 40.7128,
  "location_lng": -74.0060,
  "location_country": "US",
  "predicted_temp": 25,
  "predicted_condition": "Sunny",
  "prediction_date": "2025-12-11",
  "target_date": "2025-12-15",
  "actual_temp": null,
  "actual_condition": null,
  "score": null,
  "status": "pending",
  "created_at": "2025-12-11T12:00:00.000Z",
  "scored_at": null
}
```

### Get User Predictions

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8787/api/predictions?limit=20"
```

Response:
```json
[
  {
    "id": "prediction-uuid",
    "user_id": "user-uuid",
    "location_name": "New York",
    "predicted_temp": 25,
    "predicted_condition": "Sunny",
    "target_date": "2025-12-15",
    "actual_temp": 24,
    "actual_condition": "Sunny",
    "score": 95,
    "status": "scored",
    "created_at": "2025-12-11T12:00:00.000Z",
    "scored_at": "2025-12-15T02:00:00.000Z"
  }
]
```

### Get Specific Prediction

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/predictions/prediction-uuid
```

### Get Prediction Stats

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/predictions/stats
```

Response:
```json
{
  "total": 50,
  "pending": 5,
  "scored": 45,
  "averageScore": 85.5
}
```

## Leaderboard Endpoints

### Get Leaderboard

```bash
curl "http://localhost:8787/api/leaderboard?limit=100&offset=0"
```

Response:
```json
[
  {
    "fid": 12345,
    "username": "alice",
    "avatar_url": "https://...",
    "points": 5000,
    "accuracy": 92.5,
    "streak": 30,
    "rank": 1,
    "change": 0
  }
]
```

### Get Top Users

```bash
curl "http://localhost:8787/api/leaderboard/top?limit=10"
```

Response:
```json
[
  {
    "fid": 12345,
    "username": "alice",
    "avatar_url": "https://...",
    "points": 5000,
    "accuracy": 92.5,
    "streak": 30,
    "rank": 1,
    "change": 0
  }
]
```

## Weather Endpoints

### Get Current Weather

```bash
curl "http://localhost:8787/api/weather/current?location=New%20York"
```

Response:
```json
{
  "location": {
    "name": "New York",
    "country": "United States of America",
    "lat": 40.71,
    "lon": -74.01
  },
  "current": {
    "temp_c": 15.5,
    "temp_f": 59.9,
    "condition": {
      "text": "Partly cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    },
    "humidity": 65,
    "wind_kph": 15.8,
    "wind_mph": 9.8
  }
}
```

### Get Forecast

```bash
curl "http://localhost:8787/api/weather/forecast?location=New%20York&days=7"
```

Response:
```json
{
  "location": {
    "name": "New York",
    "country": "United States of America",
    "lat": 40.71,
    "lon": -74.01
  },
  "current": { ... },
  "forecast": {
    "forecastday": [
      {
        "date": "2025-12-11",
        "day": {
          "maxtemp_c": 18,
          "mintemp_c": 12,
          "avgtemp_c": 15,
          "condition": {
            "text": "Partly cloudy",
            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
            "code": 1003
          }
        }
      }
    ]
  }
}
```

### Search Locations

```bash
curl "http://localhost:8787/api/weather/search?q=New%20York"
```

Response:
```json
[
  {
    "id": 2624652,
    "name": "New York",
    "region": "New York",
    "country": "United States of America",
    "lat": 40.71,
    "lon": -74.01,
    "url": "new-york-new-york-united-states-of-america"
  }
]
```

## Storm Events Endpoints

### Get Storm Events

```bash
curl http://localhost:8787/api/storms
```

Response:
```json
{
  "message": "Storm events coming soon!",
  "events": []
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Missing token"
}
```

atau

```json
{
  "error": "Invalid token"
}
```

### 400 Bad Request

```json
{
  "error": "Missing required fields"
}
```

atau

```json
{
  "error": "Invalid weather condition"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

atau

```json
{
  "error": "Prediction not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Testing with Postman

### Import Collection

Create a new Postman collection dengan:

1. **Environment Variables**:
   - `baseUrl`: `http://localhost:8787`
   - `token`: Your Bearer token

2. **Authorization**:
   - Type: Bearer Token
   - Token: `{{token}}`

3. **Requests**:
   - Import all examples above

### Collection Runner

Test semua endpoints secara berurutan:

1. Health Check
2. Get Current User
3. Create Prediction
4. Get Predictions
5. Get Profile
6. Get Leaderboard

## Testing Workflow

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test Health**:
   ```bash
   curl http://localhost:8787/health
   ```

3. **Get Token** dari frontend miniapp

4. **Test Authentication**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8787/api/auth/me
   ```

5. **Create Prediction**

6. **Check Profile**

7. **View Leaderboard**

## Common Issues

### Token Expired

Error: `Invalid token`

Solution: Get new token from frontend

### CORS Error

Error: `CORS policy blocked`

Solution: Add your origin to `ALLOWED_ORIGINS` in `.env`

### Database Error

Error: `Failed to fetch user`

Solution: Check Supabase credentials and schema

### Weather API Error

Error: `Failed to fetch weather data`

Solution: Verify WeatherAPI key and rate limits
