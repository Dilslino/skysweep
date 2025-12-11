# Deployment Guide

## Railway Deployment (Recommended)

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login ke Railway

```bash
railway login
```

### 3. Initialize Project

```bash
cd backend
railway init
```

### 4. Set Environment Variables

```bash
railway variables set PORT=8787
railway variables set NODE_ENV=production
railway variables set HOSTNAME=your-app.railway.app
railway variables set SUPABASE_URL=your-supabase-url
railway variables set SUPABASE_ANON_KEY=your-anon-key
railway variables set SUPABASE_SERVICE_KEY=your-service-key
railway variables set NEYNAR_API_KEY=your-neynar-key
railway variables set WEATHER_API_KEY=your-weather-key
railway variables set ALLOWED_ORIGINS=https://your-frontend.com
```

### 5. Deploy

```bash
railway up
```

Railway akan automatically detect Node.js dan deploy aplikasi.

### 6. Get Domain

```bash
railway domain
```

Update `HOSTNAME` environment variable dengan domain yang diberikan Railway.

## Render Deployment

### 1. Create New Web Service

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your Git repository

### 2. Configure Service

- **Name**: skysweep-backend
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3. Add Environment Variables

Tambahkan semua environment variables di Render dashboard.

### 4. Deploy

Render akan automatically deploy on every push ke main branch.

## Fly.io Deployment

### 1. Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login

```bash
fly auth login
```

### 3. Launch App

```bash
cd backend
fly launch
```

Follow prompts dan set environment variables.

### 4. Set Secrets

```bash
fly secrets set SUPABASE_URL=your-url
fly secrets set SUPABASE_ANON_KEY=your-key
fly secrets set SUPABASE_SERVICE_KEY=your-key
fly secrets set NEYNAR_API_KEY=your-key
fly secrets set WEATHER_API_KEY=your-key
```

### 5. Deploy

```bash
fly deploy
```

## Vercel Deployment (Serverless)

Vercel bisa digunakan untuk serverless deployment, tapi memerlukan adjustment karena cron jobs perlu external scheduler.

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### 3. Deploy

```bash
vercel
```

**Note**: Untuk cron jobs, gunakan Vercel Cron atau external scheduler seperti EasyCron.

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Run database migrations/schema in Supabase
- [ ] Test `/health` endpoint
- [ ] Test authentication flow
- [ ] Verify CORS settings
- [ ] Update frontend with backend URL
- [ ] Test predictions creation
- [ ] Verify cron jobs are running
- [ ] Monitor logs for errors
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

## Monitoring

### Health Check

```bash
curl https://your-backend-url/health
```

### Logs

**Railway**:
```bash
railway logs
```

**Render**:
Check dashboard logs

**Fly.io**:
```bash
fly logs
```

## Troubleshooting

### Authentication Issues

- Verify `HOSTNAME` matches your actual domain
- Check Neynar API key is valid
- Verify CORS origins include your frontend

### Database Issues

- Check Supabase credentials
- Verify network access in Supabase dashboard
- Check database schema is applied

### Weather API Issues

- Verify WeatherAPI key is valid
- Check API rate limits
- Monitor error logs

### Cron Job Issues

- Check logs for cron job execution
- Verify predictions are being scored
- Check leaderboard updates

## Scaling

### Horizontal Scaling

Most platforms support auto-scaling based on CPU/memory usage.

### Database

Supabase automatically handles scaling, but consider:
- Index optimization
- Query optimization
- Connection pooling

### Caching

Consider adding Redis for:
- Leaderboard caching
- Weather data caching
- User session caching

## Security

- [ ] Use HTTPS only
- [ ] Enable rate limiting
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Monitor for suspicious activity
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Backup

Supabase provides automatic backups, but consider:
- Export database regularly
- Backup environment variables
- Document deployment process
