# 🚀 Quick Deployment Commands Reference

Copy-paste commands for deploying S.S. Translift TMS.

---

## 🗄️ Database Setup (Run First)

### 1. Create Tables in Supabase

1. Go to [supabase.com](https://supabase.com) → Your Project → SQL Editor
2. Copy entire content from `/supabase/migrations/001_create_tables.sql`
3. Paste and click **Run**
4. ✅ Tables created!

### 2. Insert Sample Data

1. In SQL Editor, create new query
2. Copy entire content from `/supabase/migrations/002_seed_data.sql`
3. Paste and click **Run**
4. ✅ Sample data inserted!

### 3. Verify Setup

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workers', 'transport_requests');

-- Check data
SELECT COUNT(*) as workers_count FROM workers;
SELECT COUNT(*) as requests_count FROM transport_requests;
```

Expected: 6 workers, 12 requests

---

## ⚙️ Supabase Edge Function Deployment

### Install Supabase CLI

**macOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**npm (all platforms):**
```bash
npm install -g supabase
```

### Login and Deploy

```bash
# Login to Supabase
supabase login

# Link your project (replace YOUR_PROJECT_ID)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the edge function
supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID
```

### Test Deployment

```bash
# Test health endpoint (replace YOUR_PROJECT_ID)
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/health

# Expected: {"status":"ok","timestamp":"..."}
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
pnpm build

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Build for Custom Server

```bash
# Build
pnpm build

# Output is in dist/ folder
# Upload dist/ to your web server
```

---

## 🔧 Local Development

### Start Development Server

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open browser to:
# http://localhost:5173
```

### Build for Production

```bash
# Clean build
pnpm clean

# Build
pnpm build

# Preview build
pnpm preview
```

---

## 📦 GitHub Deployment

### Initial Setup

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: S.S. Translift TMS v1.0.0"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ss-translift-tms.git

# Push to GitHub
git push -u origin main
```

### Future Updates

```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to GitHub
git push
```

---

## 🧪 Testing Commands

### Test Database Connection

```sql
-- In Supabase SQL Editor
SELECT * FROM workers LIMIT 5;
SELECT * FROM transport_requests WHERE status = 'Pending';
```

### Test API Endpoints

Replace `YOUR_PROJECT_ID` and `YOUR_ANON_KEY`:

```bash
# Health check
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/health

# Get all requests
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/requests" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Get all workers
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/workers" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Create a request
curl -X POST \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/requests" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "phone_number": "+91-9876543210",
    "container_type": "20-Foot Standard",
    "pickup_location": "JNPT Port",
    "delivery_location": "Mumbai",
    "pickup_date": "2026-03-15"
  }'
```

---

## 🔄 Update Existing Deployment

### Update Database Schema

```bash
# Create new migration file
# /supabase/migrations/003_your_changes.sql

# Run in Supabase SQL Editor
```

### Update Edge Function

```bash
# Make changes to /supabase/functions/server/index.tsx
# Then deploy:
supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID
```

### Update Frontend

```bash
# Make changes to frontend code
# Build and deploy:
pnpm build
vercel --prod
```

---

## 🛠️ Troubleshooting Commands

### Clear Cache and Reinstall

```bash
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

### Check Supabase Function Logs

```bash
supabase functions logs make-server-b414255c --project-ref YOUR_PROJECT_ID
```

### Check Database Tables

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check table structure
\d workers
\d transport_requests
```

### Reset Database (Caution!)

```sql
-- Drop all data
TRUNCATE workers CASCADE;
TRUNCATE transport_requests CASCADE;

-- Then re-run seed data
```

---

## 📊 Monitoring Commands

### Check Function Status

```bash
supabase functions list --project-ref YOUR_PROJECT_ID
```

### Check Database Size

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Row Counts

```sql
SELECT 
  'workers' as table_name,
  COUNT(*) as row_count 
FROM workers
UNION ALL
SELECT 
  'transport_requests' as table_name,
  COUNT(*) as row_count 
FROM transport_requests;
```

---

## 🔐 Security Commands

### Rotate API Keys (Supabase Dashboard)

1. Go to Settings → API
2. Click "Generate new anon key"
3. Update `/utils/supabase/info.tsx`
4. Redeploy

### Update RLS Policies

```sql
-- Example: Restrict access
DROP POLICY "Enable read access for all users" ON transport_requests;

CREATE POLICY "Restricted access" ON transport_requests
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

---

## 📱 Environment Variables

### Set Vercel Environment Variables

```bash
vercel env add VITE_SUPABASE_PROJECT_ID
# Enter: your-project-id

vercel env add VITE_SUPABASE_ANON_KEY
# Enter: your-anon-key
```

### Set Netlify Environment Variables

```bash
netlify env:set VITE_SUPABASE_PROJECT_ID "your-project-id"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
```

---

## 🎯 Complete Deployment Sequence

### First-Time Deployment (Full Stack)

```bash
# 1. Database Setup (in Supabase SQL Editor)
# Run: 001_create_tables.sql
# Run: 002_seed_data.sql

# 2. Install Supabase CLI
npm install -g supabase

# 3. Login and Deploy Function
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID

# 4. Test API
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/health

# 5. Build Frontend
pnpm install
pnpm build

# 6. Deploy Frontend
vercel --prod

# 7. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ss-translift-tms.git
git push -u origin main

# ✅ DONE!
```

---

## 📞 Quick Links

- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub:** https://github.com

---

## ✅ Deployment Checklist

After running commands above:

- [ ] Database tables created
- [ ] Sample data inserted
- [ ] Edge function deployed
- [ ] Health endpoint returns OK
- [ ] API endpoints work
- [ ] Frontend builds successfully
- [ ] Frontend deployed
- [ ] Can access deployed site
- [ ] Login works
- [ ] Data loads correctly
- [ ] Code pushed to GitHub

---

**All set! Your S.S. Translift TMS is now deployed! 🎉**

For detailed explanations, see:
- [DATABASE_SETUP.md](DATABASE_SETUP.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [GITHUB_SETUP.md](GITHUB_SETUP.md)
