a;# 🚀 Deployment Guide - S.S. Translift TMS

This guide will help you deploy the S.S. Translift Transport Management System to production.

## 📋 Prerequisites

- Supabase account (free tier available)
- GitHub account (for code hosting)
- Vercel account (free tier available) or any hosting platform
- Node.js 18+ installed locally
- Supabase CLI installed

## 🔧 Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: `ss-translift-tms`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to Mumbai (Singapore or Mumbai if available)
4. Click "Create new project" and wait for setup to complete (~2 minutes)

### 1.2 Get Your Credentials

1. Navigate to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project ID**: The subdomain part (xxxxx)
   - **anon/public key**: Your public API key

### 1.3 Update Your Code

Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id-here';
export const publicAnonKey = 'your-anon-key-here';
```

⚠️ **Important**: Add `/utils/supabase/info.tsx` to `.gitignore` before committing if you plan to make the repo public, or use environment variables instead.

## 🔌 Step 2: Deploy Edge Functions

### 2.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 2.2 Login to Supabase

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

### 2.3 Link Your Project

```bash
supabase link --project-ref your-project-id
```

Replace `your-project-id` with your actual project ID.

### 2.4 Deploy the Edge Function

```bash
supabase functions deploy make-server-b414255c --project-ref your-project-id
```

### 2.5 Verify Deployment

Test the health endpoint:

```bash
curl https://your-project-id.supabase.co/functions/v1/make-server-b414255c/health
```

Expected response:
```json
{"status":"ok"}
```

## 🌐 Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

#### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 3.2 Login to Vercel

```bash
vercel login
```

#### 3.3 Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Y
- **Which scope?** Your account
- **Link to existing project?** N
- **Project name?** ss-translift-tms
- **Directory?** ./
- **Override settings?** N

#### 3.4 Deploy to Production

```bash
vercel --prod
```

#### 3.5 Set Environment Variables (Optional)

If using environment variables instead of hardcoded values:

```bash
vercel env add VITE_SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_ANON_KEY
```

### Option B: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy
   ```

4. Deploy to production:
   ```bash
   netlify deploy --prod
   ```

### Option C: Deploy to Your Own Server

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains your production build

3. Serve with any static file server:
   ```bash
   # Using serve
   npm install -g serve
   serve -s dist -p 3000
   
   # Using nginx, apache, etc.
   # Copy dist/ contents to your web server directory
   ```

## 📊 Step 4: Set Up Database (Optional - for production)

The app uses Supabase's built-in KV store by default. For production, you may want to set up proper database tables.

### 4.1 Create Tables (Optional)

Go to Supabase Dashboard > SQL Editor and run:

```sql
-- Transport Requests Table
CREATE TABLE transport_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  company_name TEXT,
  phone_number TEXT,
  email TEXT,
  container_type TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  pickup_date DATE,
  special_instructions TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workers Table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'worker',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Enable read access for all users" ON transport_requests
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON transport_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON workers
  FOR SELECT USING (true);
```

## 🔐 Step 5: Set Up Authentication (Optional)

### 5.1 Enable Email Authentication

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable **Email** provider
3. Configure email templates if needed

### 5.2 Configure Email Server (Optional)

For production, configure SMTP:
1. Go to Authentication > Settings
2. Scroll to SMTP Settings
3. Add your email provider credentials

Popular options:
- SendGrid
- AWS SES
- Mailgun
- Postmark

## 📱 Step 6: Configure Domain (Optional)

### For Vercel:

1. Go to your project on Vercel dashboard
2. Click **Settings** > **Domains**
3. Add your custom domain
4. Update DNS records as shown

### For Netlify:

1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records

## ✅ Step 7: Verify Deployment

### 7.1 Test the Application

1. Visit your deployed URL
2. Test login with default credentials:

  - Worker: `worker@example.com` / `change-me-immediately!`
### 7.2 Test API Endpoints

```bash
# Replace with your actual URL
curl https://your-project-id.supabase.co/functions/v1/make-server-b414255c/requests
```

### 7.3 Check for Errors

- Open browser DevTools > Console
- Check for any errors
- Verify all API calls are successful

## 🔒 Security Checklist

- [ ] Change default admin/worker passwords
- [ ] Enable RLS (Row Level Security) on Supabase tables
- [ ] Set up proper authentication
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Regular backups of database

## 📈 Monitoring & Maintenance

### Supabase Monitoring

1. Go to Supabase Dashboard > Database
2. Monitor query performance
3. Check function logs in Functions > Logs

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor page views, performance, etc.

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user analytics

## 🆘 Troubleshooting

### Function not working

```bash
# Check function logs
supabase functions logs make-server-b414255c --project-ref your-project-id
```

### CORS errors

Verify CORS settings in `/supabase/functions/server/index.tsx`

### Build errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs
2. Check browser console for errors
3. Review function logs
4. Contact support@sstranslift.com

---

**Deployment complete! 🎉**

Your S.S. Translift TMS is now live and ready for production use!
