# Railway Environment Variables

**URGENT: Update these in Railway Dashboard**

## URL to Update
https://railway.com/project/8cd12885-c537-44a6-a789-e5d0ea410096

## Steps:
1. Click service "skysweep-backend"
2. Go to "Variables" tab
3. Update/Add these variables:

## Required Variables:

```
PORT=8787
NODE_ENV=production
HOSTNAME=skysweep-backend-production.up.railway.app

SUPABASE_URL=https://synmxqhktwjhbnyoykjh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bm14cWhrdHdqaGJueW95a2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzI2MzMsImV4cCI6MjA4MTA0ODYzM30.br4qB55RH50FwUkSzDD3rma6PmmdkzSEtNLZEpjHBnk
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bm14cWhrdHdqaGJueW95a2poIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3MjYzMywiZXhwIjoyMDgxMDQ4NjMzfQ.DXuzuyMGD3a2SksN8-ZbRbNMkzZdZgVxWtC9eYHLq0M

NEYNAR_API_KEY=62D61E03-7599-4689-A824-10F1EF9CF680
WEATHER_API_KEY=af5c0bc3529e4ed2955165603251112

ALLOWED_ORIGINS=https://skysweep-e4ura0m31-dilslinos-projects.vercel.app
```

## CRITICAL:
**ALLOWED_ORIGINS** must match the latest Vercel deployment URL!

Current Vercel URL: https://skysweep-e4ura0m31-dilslinos-projects.vercel.app

## After Updating:
- Railway will auto-redeploy (~2 minutes)
- Test at: https://skysweep-e4ura0m31-dilslinos-projects.vercel.app
- Backend should respond without CORS errors
