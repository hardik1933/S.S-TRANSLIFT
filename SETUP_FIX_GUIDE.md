# S.S. Translift TMS - Supabase Setup Guide

## Problem
Your transport data is saving to Supabase but workers and other data are not showing. This is because the database tables need to be properly created in Supabase.

## Solution - Step by Step

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **tdybvncpujnnlibfpmth**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Create Database Tables
1. In the SQL Editor, click **New query**
2. Copy the entire content from file: `SUPABASE_DIRECT_SETUP.sql`
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Setup
After running the SQL, you should see:
- "Workers table created!" with count
- "Transport requests table created!" with count

### Step 4: Deploy to Vercel
After SQL setup is complete:

1. Push your code changes to GitHub:
```bash
git add .
git commit -m "Fixed Supabase integration"
git push origin main
```

2. Vercel will automatically deploy the changes

## What Was Fixed

### 1. Database Schema Updated
- Added ALL fields to transport_requests table (vehicle, financial, etc.)
- Added total_entries to workers table
- Added proper indexes and RLS policies

### 2. Code Updates
- Fixed field mapping between app and Supabase
- Added proper error handling
- Enhanced data sync for workers and transport requests

### 3. Files Modified
- `src/app/context/AppContext.tsx` - Better Supabase integration
- `src/app/pages/WorkerManagement.tsx` - Fixed phone field handling
- `supabase/migrations/001_create_tables.sql` - Complete schema
- `SUPABASE_DIRECT_SETUP.sql` - NEW - Ready to run SQL

## Testing After Setup

1. **Add a Worker:**
   - Go to Admin Dashboard > Worker Management
   - Click "Add New Worker"
   - Fill in details and submit
   - Check Supabase > Table Editor > workers

2. **Add Transport Entry:**
   - Login as Worker
   - Go to Transport Entry Form
   - Fill in all details
   - Submit
   - Check Supabase > Table Editor > transport_requests

## Troubleshooting

### If workers still don't save:
- Check browser console for errors
- Verify RLS policies are created (Step 2)

### If transport entries don't save:
- Make sure all required fields are filled
- Check container_type is one of: 20-Foot Standard, 40-Foot Standard, 40-Foot High Cube, Reefer Container, Flat Rack Container, ODC Container

## Your Supabase Credentials (Already Configured)
- Project URL: https://tdybvncpujnnlibfpmth.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

