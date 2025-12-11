# SkySweep Testing Checklist

## Current Status
- ✅ Frontend deployed: https://skysweep-e4ura0m31-dilslinos-projects.vercel.app
- ✅ Backend deployed: https://skysweep-backend-production.up.railway.app
- ⚠️ CORS configuration: **NEEDS UPDATE** (see RAILWAY_ENV_VARS.md)
- ✅ Database: Schema deployed to Supabase
- ⚠️ Farcaster SDK: **DISABLED** for testing (will re-enable for production)

## Testing Steps

### 1. Backend Health Check
```bash
curl https://skysweep-backend-production.up.railway.app/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 2. Update Railway CORS
Follow instructions in `RAILWAY_ENV_VARS.md`

### 3. Test Frontend
Open: https://skysweep-e4ura0m31-dilslinos-projects.vercel.app

**Expected Behavior:**
- ✅ App loads without errors
- ✅ Can navigate between pages (Sweep, Leaderboard, Profile, Storm Watch)
- ✅ Weather data loads on Sweep page
- ✅ Leaderboard shows data
- ⚠️ Login disabled (no Farcaster SDK)
- ⚠️ Cannot make predictions (requires auth)

### 4. Test API Endpoints

#### Leaderboard
```bash
curl https://skysweep-backend-production.up.railway.app/api/leaderboard
```
Expected: Array of users with points/rank

#### Weather
```bash
curl "https://skysweep-backend-production.up.railway.app/api/weather/forecast?location=New+York&days=7"
```
Expected: Weather forecast data

### 5. Browser Console
Open DevTools → Console

**Should NOT see:**
- ❌ CORS errors
- ❌ "Cannot read properties of undefined"
- ❌ 401 Unauthorized (unless trying to access protected routes)

**OK to see:**
- ✅ "Running without Farcaster SDK - testing mode"
- ✅ "Token invalid or expired" (normal, no token exists)

## Known Limitations (Testing Mode)

1. **No Login:** Farcaster SDK disabled
2. **No Predictions:** Requires authentication
3. **No User Profile:** Requires authentication
4. **No Badges:** Requires authentication

## When Everything Works

You should be able to:
- Browse all pages
- See leaderboard data
- View weather information
- Navigate smoothly
- No console errors

## Re-enabling Farcaster SDK (Later)

When ready to deploy to Farcaster:

1. Edit `src/lib/api.ts` - uncomment SDK code
2. Edit `src/hooks/useAuth.ts` - uncomment SDK code
3. Build and deploy
4. Test inside Farcaster miniapp

## Troubleshooting

### CORS Error
- Update `ALLOWED_ORIGINS` in Railway to match Vercel URL
- Wait 2 minutes for Railway to redeploy

### 401 Errors
- Normal when not logged in
- App should handle gracefully (no error screen)

### Blank Page
- Check browser console for errors
- Verify backend is responding
- Check CORS configuration

## Contact Info
- Frontend: Vercel (auto-deploy from GitHub)
- Backend: Railway (manual env var updates)
- Database: Supabase (already configured)
