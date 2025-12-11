# 🚀 Complete Deployment Instructions

## Current Status

✅ **Code**: Complete dan tested  
✅ **Git**: Pushed to GitHub (https://github.com/Dilslino/skysweep)  
⏳ **Deployment**: Ready to deploy  

## 📋 Step-by-Step Deployment

### Phase 1: Deploy Frontend ke Vercel (5 menit)

#### Via Vercel Dashboard (Recommended):

1. **Login ke Vercel**
   - Buka: https://vercel.com/login
   - Login dengan GitHub account

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Atau: https://vercel.com/new
   - Pilih repository: **"skysweep"**
   - Click **"Import"**

3. **Configure Settings** (Auto-detected, verify aja):
   - Framework: **Vite** ✅
   - Root Directory: `./` ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅

4. **Add Environment Variables**:
   
   **VITE_BACKEND_URL**
   - Name: `VITE_BACKEND_URL`
   - Value: `http://localhost:8787` (temporary)
   - Environment: All
   
   **VITE_BACKEND_API_URL**
   - Name: `VITE_BACKEND_API_URL`
   - Value: `http://localhost:8787/api` (temporary)
   - Environment: All

5. **Deploy!**
   - Click **"Deploy"**
   - Wait ~2-3 minutes
   - Get production URL: `https://skysweep-xxxx.vercel.app`

✅ **Frontend deployed!**

---

### Phase 2: Setup Supabase Database (10 menit)

1. **Create Supabase Project**
   - Go to: https://supabase.com/dashboard
   - Click **"New Project"**
   - Project name: `skysweep`
   - Strong database password
   - Region: Choose closest to users
   - Wait ~2 minutes untuk provisioning

2. **Run Database Schema**
   - Go to **SQL Editor**
   - Click **"New Query"**
   - Open file: `backend/supabase/schema.sql`
   - Copy all content
   - Paste di SQL Editor
   - Click **"Run"**
   - Verify: "Success. No rows returned"

3. **Get Credentials**
   - Go to **Project Settings** → **API**
   - Copy:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public**: `eyJhbGc...`
     - **service_role**: `eyJhbGc...` (keep secret!)

4. **Verify Tables**
   - Go to **Table Editor**
   - Should see:
     - ✅ users
     - ✅ predictions
     - ✅ badges (14 rows)
     - ✅ user_badges
     - ✅ leaderboard (view)

✅ **Database ready!**

---

### Phase 3: Get API Keys (5 menit)

#### Neynar API Key

1. Go to: https://neynar.com
2. Sign up / Login
3. Go to Dashboard
4. Create API key
5. Copy key: `NEYNAR_...`

#### WeatherAPI Key

1. Go to: https://www.weatherapi.com
2. Sign up (Free tier: 1M calls/month)
3. Go to Dashboard
4. Copy API key

✅ **API keys ready!**

---

### Phase 4: Deploy Backend ke Railway (15 menit)

#### Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Login & Deploy

```bash
cd backend
railway login
railway init
railway up
```

#### Set Environment Variables

Di Railway dashboard atau via CLI:

```bash
railway variables set PORT=8787
railway variables set NODE_ENV=production
railway variables set HOSTNAME=your-app.railway.app
railway variables set SUPABASE_URL=https://xxxxx.supabase.co
railway variables set SUPABASE_ANON_KEY=eyJhbGc...
railway variables set SUPABASE_SERVICE_KEY=eyJhbGc...
railway variables set NEYNAR_API_KEY=NEYNAR_...
railway variables set WEATHER_API_KEY=your-weather-key
railway variables set ALLOWED_ORIGINS=https://skysweep-xxxx.vercel.app
```

#### Get Backend URL

```bash
railway domain
```

Copy URL: `https://your-app.railway.app`

✅ **Backend deployed!**

---

### Phase 5: Connect Frontend to Backend (3 menit)

#### Update Vercel Environment Variables

**Option A: Via Dashboard**
1. Go to: https://vercel.com/your-username/skysweep
2. Settings → **Environment Variables**
3. Edit `VITE_BACKEND_URL`:
   - Value: `https://your-app.railway.app`
4. Edit `VITE_BACKEND_API_URL`:
   - Value: `https://your-app.railway.app/api`
5. Save

**Option B: Via CLI**
```bash
vercel env rm VITE_BACKEND_URL production
vercel env add VITE_BACKEND_URL production
# Enter: https://your-app.railway.app

vercel env rm VITE_BACKEND_API_URL production
vercel env add VITE_BACKEND_API_URL production  
# Enter: https://your-app.railway.app/api
```

#### Redeploy Frontend

**Option 1: Via Dashboard**
- Deployments → Latest → **"..."** → **"Redeploy"**

**Option 2: Via Git Push**
```bash
git commit --allow-empty -m "Update env vars"
git push
```

✅ **Frontend connected to backend!**

---

### Phase 6: Update Backend CORS (2 menit)

Update Railway environment variable:

```bash
railway variables set ALLOWED_ORIGINS=https://skysweep-xxxx.vercel.app
```

Or via Railway dashboard:
- Variables → Edit `ALLOWED_ORIGINS`
- Add your Vercel URL

Railway will auto-redeploy.

✅ **CORS configured!**

---

### Phase 7: Test Everything! (5 menit)

#### 1. Test Frontend

Visit: `https://skysweep-xxxx.vercel.app`

Check:
- ✅ Page loads
- ✅ No console errors
- ✅ All pages route correctly
- ✅ Loading spinner shows initially

#### 2. Test Backend

Visit: `https://your-app.railway.app/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

#### 3. Test Integration

Di frontend:
1. ✅ Login with Farcaster (if in Farcaster client)
2. ✅ Weather data loads on Sweep page
3. ✅ Can create prediction
4. ✅ Leaderboard shows data
5. ✅ Profile shows stats

#### 4. Check Logs

**Vercel**: 
- Deployments → Latest → View logs

**Railway**: 
```bash
railway logs
```

✅ **Everything working!**

---

## 🎯 Final Checklist

### Frontend
- [ ] Deployed to Vercel via GitHub
- [ ] Auto-deploy enabled (push to master)
- [ ] Environment variables configured
- [ ] Production URL working
- [ ] All routes accessible

### Backend
- [ ] Deployed to Railway
- [ ] All environment variables set
- [ ] Health check passing
- [ ] CORS configured with Vercel URL
- [ ] Cron jobs running

### Database
- [ ] Supabase project created
- [ ] Schema executed
- [ ] All tables created
- [ ] Initial data loaded (badges)
- [ ] Credentials added to backend

### API Keys
- [ ] Neynar API key obtained
- [ ] WeatherAPI key obtained
- [ ] All keys added to backend env vars

### Testing
- [ ] Frontend loads without errors
- [ ] Backend health check works
- [ ] Can authenticate (in Farcaster)
- [ ] Weather data loads
- [ ] Can create predictions
- [ ] Leaderboard shows data

### Documentation
- [ ] README updated with URLs
- [ ] Deployment info documented
- [ ] Environment variables documented

## 🎊 Success!

Your SkySweep app is now **FULLY DEPLOYED** and **FUNCTIONAL**!

**URLs:**
- Frontend: `https://skysweep-xxxx.vercel.app`
- Backend: `https://your-app.railway.app`
- GitHub: https://github.com/Dilslino/skysweep

## 📞 Support

Check documentation:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed Vercel guide
- `backend/DEPLOYMENT.md` - Backend deployment details
- `backend/TROUBLESHOOTING.md` - Common issues
- `QUICK_START.md` - Quick setup guide

## 🔄 Updates

After deployment, any push to GitHub will:
1. ✅ Auto-deploy to Vercel (frontend)
2. ✅ Can redeploy Railway manually or via webhook

Enjoy your weather prediction app! 🌤️⚡️
