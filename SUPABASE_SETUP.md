# 🔧 Supabase Setup Guide

Complete guide for setting up Supabase backend for S.S. Translift TMS.

## 📋 Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Configure Database](#2-configure-database)
3. [Deploy Edge Functions](#3-deploy-edge-functions)
4. [Set Up Authentication](#4-set-up-authentication-optional)
5. [Configure Storage](#5-configure-storage-optional)
6. [Environment Variables](#6-environment-variables)
7. [Testing](#7-testing)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up / Login

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email

### Step 1.2: Create New Project

1. Click "New Project"
2. Select your organization (or create one)
3. Fill in project details:
   ```
   Name: ss-translift-tms
   Database Password: [Choose a strong password - SAVE IT!]
   Region: ap-south-1 (Mumbai) or ap-southeast-1 (Singapore)
   Pricing Plan: Free (or Pro for production)
   ```
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

### Step 1.3: Get API Credentials

1. Go to **Settings** (⚙️ icon in sidebar)
2. Click **API** section
3. Copy and save these values:

```plaintext
Project URL: https://xxxxxxxxxxxxx.supabase.co
Project ID: xxxxxxxxxxxxx
anon/public key: eyJhbGc....(long string)
service_role key: eyJhbGc....(long string - KEEP SECRET!)
```

---

## 2. Configure Database

### Step 2.1: Access SQL Editor

1. Click **SQL Editor** in the sidebar
2. Click **New Query**

### Step 2.2: Create Database Tables (Optional)

The app uses Supabase's KV store by default. For production, you can optionally create proper tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transport Requests Table
CREATE TABLE IF NOT EXISTS transport_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  company_name TEXT,
  phone_number TEXT NOT NULL,
  email TEXT,
  container_type TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  special_instructions TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled')),
  assigned_worker_id UUID,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workers/Users Table
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'worker' CHECK (role IN ('admin', 'worker')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_requests_status ON transport_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON transport_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_customer ON transport_requests(customer_name);
CREATE INDEX IF NOT EXISTS idx_workers_email ON workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_role ON workers(role);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for auto-updating timestamps
CREATE TRIGGER update_transport_requests_updated_at 
  BEFORE UPDATE ON transport_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at 
  BEFORE UPDATE ON workers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for development (adjust for production)
-- Allow all authenticated users to read requests
CREATE POLICY "Allow authenticated read access" 
  ON transport_requests 
  FOR SELECT 
  USING (true);

-- Allow all authenticated users to create requests
CREATE POLICY "Allow authenticated create access" 
  ON transport_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Allow all authenticated users to update requests
CREATE POLICY "Allow authenticated update access" 
  ON transport_requests 
  FOR UPDATE 
  USING (true);

-- Allow admin to delete requests
CREATE POLICY "Allow admin delete access" 
  ON transport_requests 
  FOR DELETE 
  USING (true);

-- Workers table policies
CREATE POLICY "Allow authenticated read workers" 
  ON workers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin manage workers" 
  ON workers 
  FOR ALL 
  USING (true);
```

### Step 2.3: Insert Sample Data (Optional)

```sql
-- Insert sample workers
INSERT INTO workers (email, name, phone, role) VALUES
  ('admin@sstranslift.com', 'Admin User', '+91-9876543210', 'admin'),
  ('worker@sstranslift.com', 'Worker One', '+91-9876543211', 'worker')
ON CONFLICT (email) DO NOTHING;

-- Insert sample transport requests
INSERT INTO transport_requests (
  customer_name, 
  company_name, 
  phone_number, 
  email, 
  container_type, 
  pickup_location, 
  delivery_location, 
  pickup_date, 
  status
) VALUES
  ('Rajesh Kumar', 'Mumbai Exports Ltd', '+91-9876543212', 'rajesh@mumbaiexports.com', '20-Foot Standard', 'JNPT Port', 'Pune', '2026-03-15', 'Pending'),
  ('Priya Sharma', 'Delhi Imports', '+91-9876543213', 'priya@delhiimports.com', '40-Foot Standard', 'JNPT Port', 'Delhi', '2026-03-20', 'Approved'),
  ('Amit Patel', 'Gujarat Logistics', '+91-9876543214', 'amit@gujaratlog.com', 'Reefer Container', 'Mundra Port', 'Ahmedabad', '2026-03-18', 'In Progress')
ON CONFLICT DO NOTHING;
```

---

## 3. Deploy Edge Functions

### Step 3.1: Install Supabase CLI

**macOS / Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**npm (All platforms):**
```bash
npm install -g supabase
```

### Step 3.2: Login to Supabase CLI

```bash
supabase login
```

This opens your browser - authorize the CLI.

### Step 3.3: Link Your Project

```bash
cd /path/to/ss-translift-tms
supabase link --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual project ID from step 1.3.

### Step 3.4: Deploy Edge Function

```bash
supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID
```

You should see:
```
Deploying Function make-server-b414255c...
Function URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c
```

### Step 3.5: Set Function Environment Variables (if needed)

```bash
supabase secrets set CUSTOM_ENV_VAR=value --project-ref YOUR_PROJECT_ID
```

### Step 3.6: View Function Logs

```bash
supabase functions logs make-server-b414255c --project-ref YOUR_PROJECT_ID
```

---

## 4. Set Up Authentication (Optional)

### Step 4.1: Enable Email Provider

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable email confirmation for development:
   - Go to **Authentication** > **Settings**
   - Under "Email Auth", disable "Confirm email"

### Step 4.2: Configure SMTP (Production Only)

1. Go to **Authentication** > **Settings**
2. Scroll to **SMTP Settings**
3. Add your email provider credentials:

```plaintext
Host: smtp.sendgrid.net (or your provider)
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
Sender email: noreply@sstranslift.com
Sender name: S.S. Translift
```

### Step 4.3: Create User Accounts

**Via SQL Editor:**
```sql
-- Create admin user
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  'admin@sstranslift.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"name": "Admin User", "role": "admin"}'::jsonb
);
```

**Or via Supabase Dashboard:**
1. Go to **Authentication** > **Users**
2. Click "Add User"
3. Fill in email and password
4. Add metadata: `{"name": "Admin", "role": "admin"}`

---

## 5. Configure Storage (Optional)

If you need to store files (documents, images):

### Step 5.1: Create Storage Bucket

1. Go to **Storage** in sidebar
2. Click "Create bucket"
3. Name: `transport-documents`
4. Public: No (keep private)
5. Allowed MIME types: `application/pdf,image/*`

### Step 5.2: Set Up Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transport-documents');

-- Allow authenticated users to read their uploads
CREATE POLICY "Allow authenticated read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'transport-documents');
```

---

## 6. Environment Variables

### Step 6.1: Update Local Project

Edit `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'YOUR_PROJECT_ID';
export const publicAnonKey = 'YOUR_ANON_KEY';
```

### Step 6.2: Create .env File (Alternative Approach)

Create `.env.local`:

```env
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Then update `/utils/supabase/info.tsx`:

```typescript
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

---

## 7. Testing

### Step 7.1: Test Health Endpoint

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/health
```

Expected: `{"status":"ok"}`

### Step 7.2: Test API Endpoints

**Get all requests:**
```bash
curl -X GET \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/requests \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Create a request:**
```bash
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/requests \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "phoneNumber": "+91-9876543210",
    "containerType": "20-Foot Standard",
    "pickupLocation": "JNPT Port",
    "deliveryLocation": "Mumbai",
    "pickupDate": "2026-03-15"
  }'
```

### Step 7.3: Test in Application

1. Start your dev server: `pnpm dev`
2. Open browser to `http://localhost:5173`
3. Login with test credentials
4. Try creating a transport request
5. Check browser DevTools console for errors

---

## 🔒 Security Checklist

Before going to production:

- [ ] Changed default admin password
- [ ] Enabled RLS on all tables
- [ ] Configured proper RLS policies
- [ ] Set up SMTP for email
- [ ] Enabled email confirmation
- [ ] Added rate limiting (Supabase Edge Functions)
- [ ] Configured CORS properly
- [ ] Secured API keys (use environment variables)
- [ ] Set up monitoring and alerts
- [ ] Enabled database backups
- [ ] Reviewed function logs

---

## 📊 Database Schema Diagram

```
┌─────────────────────────────┐
│   transport_requests        │
├─────────────────────────────┤
│ id (PK)                     │
│ customer_name               │
│ company_name                │
│ phone_number                │
│ email                       │
│ container_type              │
│ pickup_location             │
│ delivery_location           │
│ pickup_date                 │
│ status                      │
│ assigned_worker_id (FK)     │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
         │
         │ (FK)
         ▼
┌─────────────────────────────┐
│        workers              │
├─────────────────────────────┤
│ id (PK)                     │
│ email (UNIQUE)              │
│ name                        │
│ phone                       │
│ role                        │
│ status                      │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Function not deploying

```bash
# Check function syntax
supabase functions serve make-server-b414255c

# View detailed logs
supabase functions logs make-server-b414255c --follow
```

### Database connection issues

1. Check project status in Supabase dashboard
2. Verify API keys are correct
3. Check network/firewall settings

### CORS errors

Update `/supabase/functions/server/index.tsx`:
```typescript
app.use(
  "/*",
  cors({
    origin: "*", // For dev. Use specific domain in production
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
```

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Community Discord**: https://discord.supabase.com
- **GitHub Issues**: Open an issue in this repository

---

**Setup Complete! 🎉**

Your Supabase backend is now configured and ready for the S.S. Translift TMS!
