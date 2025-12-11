# 🚀 Vercel Deployment Guide (Proper Way)

Deploy SkySweep ke Vercel dengan GitHub integration untuk auto-deploy setiap push.

## ✅ Step-by-Step Deployment

### 1. Login ke Vercel Dashboard

Buka: https://vercel.com/login

Login menggunakan akun GitHub Anda.

### 2. Import Repository dari GitHub

1. Click **"Add New..."** → **"Project"**
2. Atau langsung ke: https://vercel.com/new

3. Pada halaman "Import Git Repository":
   - Pilih **GitHub** tab
   - Cari repository: **"skysweep"**
   - Click **"Import"**

### 3. Configure Project

Vercel akan otomatis detect settings, tapi verify:

**Project Settings:**
- **Framework Preset**: Vite ✅ (auto-detected)
- **Root Directory**: `./` (default) ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

**Biarkan semua default settings!**

### 4. Add Environment Variables (PENTING!)

⚠️ **SEBELUM DEPLOY**, tambahkan environment variables:

Click **"Environment Variables"** section:

Tambahkan 2 variables berikut:

#### Variable 1: VITE_BACKEND_URL
- **Name**: `VITE_BACKEND_URL`
- **Value**: `http://localhost:8787` (untuk development, update nanti setelah backend deploy)
- **Environment**: All (Production, Preview, Development)

#### Variable 2: VITE_BACKEND_API_URL
- **Name**: `VITE_BACKEND_API_URL`
- **Value**: `http://localhost:8787/api` (untuk development, update nanti)
- **Environment**: All (Production, Preview, Development)

**Note**: Nilai ini temporary. Anda akan update setelah backend deployed.

### 5. Deploy!

1. Click **"Deploy"** button
2. Wait ~2-3 minutes untuk build & deployment
3. ✅ Done!

### 6. Get Your URLs

Setelah deployment selesai, Anda akan dapat:

- **Production URL**: `https://skysweep-xxxx.vercel.app`
- **Dashboard URL**: `https://vercel.com/your-username/skysweep`

## 🔄 Auto-Deploy Setup

✅ **Sudah automatic!** Setiap push ke GitHub akan trigger auto-deploy.

### Git Branches & Deployments

- **Push to `master`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Request** → Preview deployment dengan comment

### Disable Auto-Deploy (Optional)

Jika ingin manual deploy only:
1. Go to Project Settings
2. Git → **Ignored Build Step**
3. Add condition: `exit 1` untuk disable

## 🌐 Custom Domain (Optional)

Untuk custom domain:

1. Go to Project Settings → **Domains**
2. Click **"Add Domain"**
3. Enter domain (misal: `skysweep.app`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~24 hours)

## 📝 Update Environment Variables Nanti

Setelah backend deployed:

### Option A: Via Dashboard

1. Go to Project Settings → **Environment Variables**
2. Click **Edit** pada `VITE_BACKEND_URL`
3. Update value ke: `https://your-backend.railway.app`
4. Click **Save**
5. Repeat untuk `VITE_BACKEND_API_URL`: `https://your-backend.railway.app/api`

### Option B: Via CLI

```bash
# Update production environment
vercel env rm VITE_BACKEND_URL production
vercel env add VITE_BACKEND_URL production
# Enter: https://your-backend.railway.app

vercel env rm VITE_BACKEND_API_URL production
vercel env add VITE_BACKEND_API_URL production
# Enter: https://your-backend.railway.app/api

# Redeploy
vercel --prod
```

### Trigger Redeploy

Setelah update environment variables:

**Option 1**: Push dummy commit
```bash
git commit --allow-empty -m "Redeploy with updated env vars"
git push
```

**Option 2**: Manual redeploy di dashboard
1. Go to Deployments tab
2. Click **"..."** pada latest deployment
3. Click **"Redeploy"**

## 🎯 Verify Deployment

### 1. Check Build Logs

Di Vercel dashboard:
1. Go to **Deployments** tab
2. Click latest deployment
3. View **Building** logs
4. Verify no errors

### 2. Check Production URL

Visit production URL dan verify:
- ✅ Page loads
- ✅ No console errors
- ✅ UI renders correctly
- ✅ Routing works (try different pages)

### 3. Check Functions (setelah backend ready)

- ✅ Can login with Farcaster
- ✅ Weather data loads
- ✅ Can create predictions
- ✅ Leaderboard shows data

## 📊 Monitoring

### Analytics

Vercel provides free analytics:
1. Go to **Analytics** tab
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Logs

View runtime logs:
1. Go to **Deployments** tab
2. Click deployment
3. View **Functions** logs (if any)

### Performance

Check performance:
1. Go to **Speed Insights** (if enabled)
2. View Core Web Vitals
3. Optimize as needed

## 🔧 Advanced Configuration

### Build Settings

File: `vercel.json` (optional, create if needed)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "regions": ["sin1"]
}
```

### Redirects

Tambahkan di `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### Headers

Security headers di `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 🐛 Troubleshooting

### Build Fails

**Error**: `Command "npm run build" exited with 1`

**Solutions**:
1. Check build logs untuk error details
2. Verify `package.json` build command
3. Test build locally: `npm run build`
4. Check Node version compatibility

### Environment Variables Not Working

**Issue**: Variables undefined di app

**Solutions**:
1. Verify variable names start with `VITE_`
2. Redeploy after adding variables
3. Check variables di Project Settings
4. Clear cache: `vercel --prod --force`

### CORS Errors

**Issue**: Backend requests blocked

**Solutions**:
1. Add Vercel URL to backend `ALLOWED_ORIGINS`
2. Update backend CORS configuration
3. Verify backend URL in env variables

### 404 on Routes

**Issue**: Refresh on `/profile` shows 404

**Solution**: Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🎯 Best Practices

### 1. Use Preview Deployments

- Test changes on preview before production
- Share preview URL for testing
- Review deployment comments on PRs

### 2. Environment Variables

- Never commit `.env` files
- Use different values for production/preview
- Rotate secrets regularly

### 3. Performance

- Optimize bundle size
- Enable compression
- Use CDN for static assets

### 4. Monitoring

- Check analytics regularly
- Monitor error logs
- Set up alerts for downtime

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

## ✅ Deployment Checklist

- [ ] Logged in to Vercel
- [ ] Imported GitHub repository
- [ ] Verified build settings
- [ ] Added environment variables
- [ ] Clicked Deploy
- [ ] Verified production URL works
- [ ] Checked build logs (no errors)
- [ ] Tested routing (all pages work)
- [ ] Noted production URL for backend CORS
- [ ] Updated documentation with URL

## 🎊 Done!

Your SkySweep app is now:
- ✅ Deployed to Vercel
- ✅ Connected to GitHub (auto-deploy)
- ✅ Production ready
- ✅ Monitored by Vercel

Next: Deploy backend dan update environment variables!
