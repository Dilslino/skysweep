# Troubleshooting Guide

Common issues dan solutions untuk SkySweep backend.

## Installation Issues

### Issue: `@farcaster/quick-auth` version not found

**Error:**
```
npm ERR! notarget No matching version found for @farcaster/quick-auth@^0.1.0
```

**Solution:**
Package sudah diupdate ke versi yang benar. Pastikan `package.json` menggunakan:
```json
"@farcaster/quick-auth": "^0.0.8"
```

Current latest version: `0.0.8`

### Issue: Node version warning

**Warning:**
```
npm WARN EBADENGINE Unsupported engine
npm WARN EBADENGINE required: { node: '>=20.0.0' }
npm WARN EBADENGINE current: { node: 'v18.18.0' }
```

**Solution:**
Ini hanya warning dari Supabase packages. Backend akan tetap berjalan dengan Node 18+.

**Recommended:** Upgrade ke Node 20+ untuk best compatibility:
- Download from: https://nodejs.org
- Or use nvm: `nvm install 20` (if using nvm)

**Workaround (if stuck on Node 18):**
Backend tetap functional dengan Node 18.18.0+. Warning bisa diabaikan.

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install again
npm install
```

### Issue: TypeScript errors during build

**Error:**
```
error TS2307: Cannot find module '@farcaster/quick-auth'
```

**Solution:**
```bash
# Reinstall dependencies
npm install

# Check if node_modules/@farcaster/quick-auth exists
ls node_modules/@farcaster/quick-auth

# Try building again
npm run build
```

## Runtime Issues

### Issue: Server won't start

**Error:**
```
Error: Missing required environment variable: SUPABASE_URL
```

**Solution:**
1. Check `.env` file exists in `backend/` directory
2. Copy from `.env.example`: `cp .env.example .env`
3. Fill in all required variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY
   - NEYNAR_API_KEY
   - WEATHER_API_KEY

### Issue: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::8787
```

**Solution:**

**Option 1:** Kill process using port 8787
```bash
# Windows
netstat -ano | findstr :8787
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8787
kill -9 <PID>
```

**Option 2:** Change port in `.env`
```env
PORT=3001
```

### Issue: Database connection fails

**Error:**
```
Error: Failed to connect to Supabase
```

**Solution:**
1. Verify Supabase credentials in `.env`
2. Check Supabase project is active (not paused)
3. Test connection in Supabase dashboard
4. Verify network/firewall not blocking connection
5. Check if schema.sql has been run

### Issue: Authentication fails

**Error:**
```
401 Unauthorized: Invalid token
```

**Solution:**
1. Check `HOSTNAME` in `.env` matches your actual domain
   - Dev: `localhost:8787`
   - Prod: `your-app.railway.app`
2. Verify Neynar API key is valid
3. Test token from frontend: `sdk.quickAuth.getToken()`
4. Check CORS settings allow your frontend origin

### Issue: Weather API errors

**Error:**
```
Failed to fetch weather data
```

**Solution:**
1. Verify WeatherAPI key in `.env`
2. Check API key is active at https://www.weatherapi.com
3. Verify rate limits not exceeded
4. Test API directly:
   ```bash
   curl "http://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=London"
   ```

## Database Issues

### Issue: Tables not found

**Error:**
```
relation "users" does not exist
```

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run entire `backend/supabase/schema.sql`
3. Verify tables in Table Editor:
   - users
   - predictions
   - badges
   - user_badges
4. Check for error messages in SQL execution

### Issue: Badge data missing

**Error:**
No badges showing up in app

**Solution:**
Run badge insert query in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM badges;
-- Should return 14

-- If returns 0, re-run the INSERT statements from schema.sql
```

### Issue: Leaderboard not updating

**Error:**
Leaderboard shows stale data

**Solution:**
Manually refresh materialized view:
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
```

Or call the function:
```sql
SELECT refresh_leaderboard();
```

### Issue: User ranks not updating

**Error:**
User rank stays the same after earning points

**Solution:**
```sql
SELECT update_user_ranks();
```

Or restart backend (cron job will trigger update).

## API Issues

### Issue: CORS errors

**Error:**
```
Access-Control-Allow-Origin header missing
```

**Solution:**
1. Add frontend URL to `ALLOWED_ORIGINS` in `.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
   ```
2. Restart backend
3. Clear browser cache

### Issue: 500 Internal Server Error

**Error:**
Generic 500 error

**Solution:**
1. Check backend console logs
2. Check Supabase logs in dashboard
3. Verify all services (Supabase, Neynar, WeatherAPI) are up
4. Check for rate limiting
5. Review error stack trace

### Issue: Predictions not scoring

**Error:**
Predictions stay "pending" forever

**Solution:**
1. Check backend logs for cron job execution
2. Manually trigger scoring:
   ```bash
   curl -X POST http://localhost:8787/api/admin/score-predictions
   ```
   (You may need to add this endpoint for manual triggering)
3. Check target_date is in the past
4. Verify WeatherAPI has historical data for that date

## Development Issues

### Issue: TypeScript compilation errors

**Error:**
```
error TS2304: Cannot find name 'Express'
```

**Solution:**
```bash
# Reinstall type definitions
npm install --save-dev @types/express @types/node @types/cors

# Clean and rebuild
rm -rf dist
npm run build
```

### Issue: Hot reload not working

**Error:**
Changes not reflected when using `npm run dev`

**Solution:**
1. Check `tsx` is installed: `npm list tsx`
2. Restart dev server
3. Verify file is saved
4. Check for syntax errors

### Issue: Module import errors

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**Solution:**
1. Check file extensions use `.js` for imports (even for `.ts` files):
   ```typescript
   import { x } from './file.js';  // ✅ Correct
   import { x } from './file';     // ❌ Wrong
   ```
2. Verify `"type": "module"` in package.json
3. Check tsconfig.json `"module": "ESNext"`

## Production Issues

### Issue: Deployment fails

**Error:**
Build or deployment errors on Railway/Render

**Solution:**
1. Check Node version matches requirements
2. Verify all environment variables are set
3. Check build logs for specific errors
4. Ensure `package.json` has correct build command
5. Verify database is accessible from hosting platform

### Issue: Environment variables not loading

**Error:**
```
undefined is not a valid URL
```

**Solution:**
1. Verify env vars are set in hosting dashboard
2. Check for typos in variable names
3. Don't use quotes around values in hosting platform
4. Restart application after setting env vars

### Issue: Cron jobs not running in production

**Error:**
Predictions not auto-scoring

**Solution:**
1. Check hosting platform logs for cron execution
2. Verify app stays alive (not sleeping)
3. Consider using external cron service:
   - EasyCron: https://www.easycron.com
   - Cron-job.org: https://cron-job.org
4. Add endpoint for manual trigger

## Performance Issues

### Issue: Slow API responses

**Problem:**
Endpoints taking >2 seconds

**Solution:**
1. Add database indexes (already in schema.sql)
2. Use materialized view for leaderboard (already implemented)
3. Add caching layer (Redis)
4. Optimize N+1 queries
5. Check database query performance in Supabase

### Issue: High memory usage

**Problem:**
Backend using too much memory

**Solution:**
1. Check for memory leaks in code
2. Limit query result sizes
3. Use pagination for large datasets
4. Monitor with `console.log(process.memoryUsage())`
5. Restart backend periodically

## Testing Issues

### Issue: Can't test with curl

**Error:**
401 Unauthorized when testing with curl

**Solution:**
Endpoints with authentication need token:

1. Get token from frontend:
   ```javascript
   const { token } = await sdk.quickAuth.getToken();
   console.log(token);
   ```

2. Use in curl:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8787/api/auth/me
   ```

### Issue: Postman tests fail

**Error:**
Various authentication or CORS errors

**Solution:**
1. Set Authorization: Bearer Token in Postman
2. Add header: `Content-Type: application/json`
3. Disable "SSL certificate verification" for local testing
4. Check request body format

## Getting Help

If issue not covered here:

1. **Check Logs:**
   - Backend console logs
   - Supabase logs
   - Browser console

2. **Review Documentation:**
   - BACKEND_SUMMARY.md
   - API_EXAMPLES.md
   - SUPABASE_SETUP.md

3. **Test Services:**
   - Supabase: https://supabase.com/dashboard
   - Neynar: https://neynar.com
   - WeatherAPI: https://www.weatherapi.com

4. **Common Commands:**
   ```bash
   # Check service status
   curl http://localhost:8787/health
   
   # View logs
   npm run dev
   
   # Rebuild
   npm run build
   
   # Fresh install
   rm -rf node_modules package-lock.json
   npm install
   ```

## Contact

For persistent issues:
- Check GitHub issues
- Review Farcaster docs: https://miniapps.farcaster.xyz
- Supabase support: https://supabase.com/support
