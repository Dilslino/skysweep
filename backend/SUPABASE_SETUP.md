# Supabase Setup Guide

Panduan lengkap setup Supabase untuk SkySweep backend.

## 1. Create Supabase Project

1. Buka https://supabase.com
2. Sign in atau create account
3. Click "New Project"
4. Isi:
   - **Project Name**: skysweep
   - **Database Password**: Generate strong password
   - **Region**: Pilih yang terdekat dengan users
   - **Pricing Plan**: Free tier sudah cukup untuk start
5. Wait for project to be created (~2 minutes)

## 2. Get Credentials

### Project URL & Keys

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (keep this secret!)

### Add to .env

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

## 3. Run Database Schema

### Option A: SQL Editor (Recommended)

1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy entire content dari `backend/supabase/schema.sql`
4. Paste ke SQL Editor
5. Click "Run"
6. Wait for success message

### Option B: Via CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## 4. Verify Tables

Go to Table Editor dan verify tables dibuat:

- ✅ `users`
- ✅ `predictions`
- ✅ `badges`
- ✅ `user_badges`
- ✅ `leaderboard` (materialized view)

## 5. Check Initial Data

### Verify Badges

Run query di SQL Editor:

```sql
SELECT * FROM badges ORDER BY requirement_value;
```

Should show 14 badges yang sudah di-insert.

### Test User Creation

Backend akan automatically create users saat first login, tapi Anda bisa test manual:

```sql
INSERT INTO users (fid, username, display_name, avatar_url)
VALUES (12345, 'testuser', 'Test User', 'https://example.com/avatar.jpg')
RETURNING *;
```

## 6. Configure Row Level Security (Optional)

Untuk production, enable RLS:

### Users Table

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Users can update own profile only
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id);
```

### Predictions Table

```sql
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Users can view all predictions
CREATE POLICY "Predictions are viewable by everyone" 
ON predictions FOR SELECT 
USING (true);

-- Users can insert own predictions
CREATE POLICY "Users can insert own predictions" 
ON predictions FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Only backend (service role) can update predictions
-- No policy needed, service role bypasses RLS
```

### Badges Tables

```sql
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone" 
ON badges FOR SELECT 
USING (true);

CREATE POLICY "User badges are viewable by everyone" 
ON user_badges FOR SELECT 
USING (true);
```

**Note**: Untuk sekarang, Anda bisa skip RLS karena backend menggunakan `service_role` key yang bypass RLS.

## 7. Setup Database Functions

Pastikan functions sudah dibuat dari schema.sql:

1. `refresh_leaderboard()` - Refresh materialized view
2. `update_user_ranks()` - Update user rankings
3. `update_updated_at_column()` - Auto-update timestamps

### Test Functions

```sql
-- Test refresh leaderboard
SELECT refresh_leaderboard();

-- Test update ranks
SELECT update_user_ranks();
```

## 8. Setup Indexes

Schema sudah include indexes, verify dengan:

```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Should show indexes untuk:
- `users.fid`
- `users.points`
- `users.rank`
- `predictions.user_id`
- `predictions.status`
- `predictions.target_date`
- `user_badges.user_id`

## 9. Database Backups

### Automatic Backups

Supabase automatically backup database daily (Free tier: 7 days retention).

### Manual Backup

1. Go to Database → Backups
2. Click "Create backup"
3. Choose PITR or Full backup

### Download Backup

```bash
# Via CLI
supabase db dump -f backup.sql
```

## 10. Monitoring

### Activity

Go to Database → Logs untuk monitor:
- Query performance
- Error logs
- Slow queries

### Usage

Go to Settings → Usage untuk track:
- Database size
- API requests
- Bandwidth

## 11. Performance Optimization

### Enable Connection Pooling

1. Go to Database → Connection Pooling
2. Enable for better performance under load

### Query Optimization

Run explain analyze untuk slow queries:

```sql
EXPLAIN ANALYZE
SELECT * FROM users 
ORDER BY points DESC 
LIMIT 100;
```

### Materialized View Refresh

Leaderboard menggunakan materialized view. Refresh strategy:

- Manual: Via cron job di backend (setiap jam)
- On-demand: When leaderboard changes significantly

## 12. Troubleshooting

### Connection Error

**Error**: `Failed to connect to database`

**Solutions**:
1. Check SUPABASE_URL is correct
2. Check network/firewall
3. Verify project is not paused (free tier pauses after 7 days inactivity)

### Permission Error

**Error**: `permission denied for table`

**Solutions**:
1. Use service_role key for backend
2. Check RLS policies
3. Verify user has correct permissions

### Query Timeout

**Error**: `Query timeout`

**Solutions**:
1. Add indexes on frequently queried columns
2. Optimize query with EXPLAIN
3. Consider pagination for large datasets

### Schema Migration Error

**Error**: `relation already exists`

**Solutions**:
1. Drop existing tables if development:
   ```sql
   DROP TABLE IF EXISTS user_badges CASCADE;
   DROP TABLE IF EXISTS predictions CASCADE;
   DROP TABLE IF EXISTS badges CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   DROP MATERIALIZED VIEW IF EXISTS leaderboard;
   ```
2. Then run schema.sql again

## 13. Production Checklist

- [ ] Verified all tables exist
- [ ] Verified indexes are created
- [ ] Tested all functions
- [ ] Checked initial badge data
- [ ] Configured backups
- [ ] Set up monitoring alerts
- [ ] Documented credentials securely
- [ ] Considered RLS for additional security
- [ ] Tested connection from backend
- [ ] Verified leaderboard view works

## 14. Cost Management

Free tier limits:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

Monitor usage dan upgrade saat mendekati limits.

## Support

Untuk Supabase issues:
- Documentation: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase
