# 📸 Visual Setup Guide - Step by Step

Follow these screenshots and instructions to set up your database.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SETUP FLOW                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Open Supabase    →   2. Run SQL Script             │
│     SQL Editor            (Create Tables)               │
│         ↓                      ↓                        │
│                                                         │
│  3. Verify Data      →   4. Deploy Edge Function       │
│     (6+12 rows)           (via CLI)                     │
│         ↓                      ↓                        │
│                                                         │
│  5. Test API         →   6. Run Your App               │
│     (curl test)           (pnpm dev)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Open Supabase SQL Editor

### What to do:
1. Go to: https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth
2. Look for **"SQL Editor"** in the left sidebar
3. Click **"SQL Editor"**

### Visual Guide:

```
┌────────────────────────────────────────────────────────┐
│ Supabase Dashboard                                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────┐                                       │
│  │ 🏠 Home      │                                       │
│  │ 📊 Table Ed. │  ← Sidebar                           │
│  │ 📝 SQL Ed.   │  ← CLICK HERE                        │
│  │ 🔧 Settings  │                                       │
│  └─────────────┘                                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### You should see:
- A code editor window
- "New query" button at the top
- Sample queries on the left (optional)

---

## Step 2: Create New Query

### What to do:
1. Click the **"New query"** button
2. A blank editor will appear

### Visual Guide:

```
┌────────────────────────────────────────────────────────┐
│ SQL Editor                                             │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [+ New query]  [Templates ▼]  [Run ▶]               │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │  -- Write your SQL here                         │ │
│  │                                                  │ │
│  │                                                  │ │
│  │     ← PASTE THE SCRIPT HERE                     │ │
│  │                                                  │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 3: Copy and Paste SQL Script

### What to do:
1. Open file: `SETUP_NOW.md`
2. Scroll to **Step 2**
3. Copy the **ENTIRE SQL script** (it's long!)
4. Paste into the SQL Editor

### The script starts with:
```sql
-- =====================================================
-- S.S. TRANSLIFT TMS - DATABASE SETUP
-- This creates all tables with sample data
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
...
```

### The script ends with:
```sql
...
SELECT 'Requests by status:' as info, status, COUNT(*) as count 
FROM public.transport_requests 
GROUP BY status 
ORDER BY status;
```

### Visual Guide:

```
┌────────────────────────────────────────────────────────┐
│ SQL Editor - Script Pasted                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [+ New query]  [Templates ▼]  [▶ RUN] ← CLICK HERE  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ -- ========================================       │ │
│  │ -- S.S. TRANSLIFT TMS - DATABASE SETUP           │ │
│  │ -- ========================================       │ │
│  │                                                  │ │
│  │ CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     │ │
│  │                                                  │ │
│  │ CREATE TABLE IF NOT EXISTS public.workers (     │ │
│  │   id UUID PRIMARY KEY ...                       │ │
│  │   ...                                           │ │
│  │   (LOTS OF SQL CODE HERE)                       │ │
│  │   ...                                           │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 4: Run the Script

### What to do:
1. Click the **"RUN"** button (or press Ctrl+Enter)
2. Wait 5-10 seconds for execution
3. Check the results panel below

### Visual Guide - SUCCESS:

```
┌────────────────────────────────────────────────────────┐
│ Results                                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ✅ Success                                            │
│                                                        │
│  message                                               │
│  ──────────────────────────────────────────────       │
│  Setup Complete! ✅                                    │
│                                                        │
│  info                           count                  │
│  ──────────────────────────────────────               │
│  Workers created:               6                      │
│                                                        │
│  info                           count                  │
│  ──────────────────────────────────────               │
│  Requests created:              12                     │
│                                                        │
│  status          count                                 │
│  ─────────────────────                                │
│  Approved        3                                     │
│  Completed       5                                     │
│  In Progress     2                                     │
│  Pending         2                                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### If you see this ✅ YOU'RE DONE WITH DATABASE SETUP!

---

## Step 5: Verify Tables Created

### What to do:
1. Click **"Table Editor"** in sidebar
2. You should see 2 tables:
   - `workers`
   - `transport_requests`

### Visual Guide:

```
┌────────────────────────────────────────────────────────┐
│ Table Editor                                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Tables:                                               │
│  ┌──────────────────────────┐                         │
│  │ ✅ workers             6 │ ← Click to view         │
│  │ ✅ transport_requests 12 │ ← Click to view         │
│  └──────────────────────────┘                         │
│                                                        │
│  Schema:                                               │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Column          Type            Nullable          │ │
│  │ ──────────────────────────────────────────────   │ │
│  │ id              uuid            false             │ │
│  │ email           text            false             │ │
│  │ name            text            false             │ │
│  │ phone           text            true              │ │
│  │ role            text            false             │ │
│  │ status          text            false             │ │
│  │ created_at      timestamp       false             │ │
│  │ updated_at      timestamp       false             │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 6: Deploy Edge Function (Terminal)

### Open your terminal/command prompt and run:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref tdybvncpujnnlibfpmth

# Deploy function
supabase functions deploy make-server-b414255c --project-ref tdybvncpujnnlibfpmth
```

### Visual Guide - Terminal Output:

```
┌────────────────────────────────────────────────────────┐
│ Terminal                                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  $ supabase login                                      │
│  ✓ You are now logged in.                             │
│                                                        │
│  $ supabase link --project-ref tdybvncpujnnlibfpmth   │
│  ✓ Linked to project tdybvncpujnnlibfpmth             │
│                                                        │
│  $ supabase functions deploy make-server-b414255c...  │
│  Deploying function...                                 │
│  ✓ Deployed function make-server-b414255c             │
│    Version: v1.0.0                                     │
│    URL: https://tdybvncpujnnlibfpmth.supabase.co...   │
│                                                        │
│  ✅ ALL DONE!                                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 7: Test the API

### Run this command:

```bash
curl https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c/health
```

### Visual Guide - Expected Output:

```
┌────────────────────────────────────────────────────────┐
│ Terminal - API Test                                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  $ curl https://tdybvncpujnnlibfpmth.supabase.co/...  │
│                                                        │
│  {                                                     │
│    "status": "ok",                                     │
│    "timestamp": "2026-03-07T10:30:00.000Z"            │
│  }                                                     │
│                                                        │
│  ✅ API IS WORKING!                                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 8: Run Your App

### In terminal, run:

```bash
pnpm install
pnpm dev
```

### Visual Guide - Terminal:

```
┌────────────────────────────────────────────────────────┐
│ Terminal - Dev Server                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  $ pnpm dev                                            │
│                                                        │
│  VITE v5.x.x  ready in 1234 ms                        │
│                                                        │
│  ➜  Local:   http://localhost:5173/                   │
│  ➜  Network: use --host to expose                     │
│                                                        │
│  ✅ OPEN THIS URL IN YOUR BROWSER                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Step 9: Open in Browser

### What you'll see:

```
┌────────────────────────────────────────────────────────┐
│ Browser - http://localhost:5173                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │   🚢 S.S. TRANSLIFT                              │ │
│  │   Container Transport Management System          │ │
│  │                                                  │ │
│  │   [Login Button]  [Sign Up Button]              │ │
│  │                                                  │ │
│  │   ✅ Professional Landing Page                   │ │
│  │   ✅ Dark Mode Theme                             │ │
│  │   ✅ Responsive Design                           │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## ✅ Success Indicators

You'll know everything is working when:

### Database:
- ✅ See "Setup Complete! ✅" in SQL results
- ✅ See "Workers created: 6"
- ✅ See "Requests created: 12"
- ✅ Can view tables in Table Editor

### Edge Function:
- ✅ See "Deployed function make-server-b414255c"
- ✅ Health endpoint returns `{"status":"ok"}`

### Frontend:
- ✅ App opens at http://localhost:5173
- ✅ Landing page displays correctly
- ✅ Can navigate to login page
- ✅ Dashboard shows data (after creating tables)

---

## 🎨 What the Dashboard Looks Like

```
┌────────────────────────────────────────────────────────┐
│ Admin Dashboard                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Total Requests    Active Jobs    Completed Jobs      │
│  ┌───────────┐    ┌───────────┐  ┌───────────┐       │
│  │    12     │    │     5     │  │     5     │       │
│  │   +2.5%   │    │   +1.2%   │  │   +0.5%   │       │
│  └───────────┘    └───────────┘  └───────────┘       │
│                                                        │
│  Recent Requests                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Customer    | Container  | Status    | Date     │ │
│  │─────────────────────────────────────────────────│ │
│  │ Rajesh Kumar| 20-Foot    | Pending   | Mar 12   │ │
│  │ Neha Desai  | 40-Foot    | Pending   | Mar 14   │ │
│  │ Priya Sharma| 40-HC      | Approved  | Mar 10   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Revenue Chart (Last 6 Months)                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │        📊 Bar Chart Showing Revenue              │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Verification Queries

Run these in SQL Editor to verify data:

### Check Workers:
```sql
SELECT * FROM workers ORDER BY role DESC, name;
```

**Expected:** 6 rows (1 admin, 5 workers)

### Check Requests:
```sql
SELECT * FROM transport_requests ORDER BY created_at DESC;
```

**Expected:** 12 rows with various statuses

### Check Statistics:
```sql
SELECT status, COUNT(*) 
FROM transport_requests 
GROUP BY status;
```

**Expected:**
```
Approved     | 3
Completed    | 5
In Progress  | 2
Pending      | 2
```

---

## 📱 Mobile View Preview

```
┌─────────────────┐
│  S.S. TRANSLIFT │
│  ═══════════════ │
│                 │
│  ☰ Menu         │
│                 │
│  📊 Dashboard   │
│  ┌─────────────┐│
│  │ Total: 12   ││
│  │ Active: 5   ││
│  │ Done: 5     ││
│  └─────────────┘│
│                 │
│  Recent Requests│
│  ┌─────────────┐│
│  │ Customer 1  ││
│  │ 20-Foot     ││
│  │ Pending     ││
│  └─────────────┘│
│                 │
└─────────────────┘
```

---

## 🎯 Common Screens You'll See

### 1. Landing Page
- Company logo and name
- Professional hero section
- Features overview
- Call-to-action buttons

### 2. Login Page
- Email and password fields
- "Remember me" checkbox
- "Forgot password" link

### 3. Admin Dashboard
- Statistics cards
- Charts and graphs
- Recent requests table
- Quick actions

### 4. Request Management
- Data table with all requests
- Filter and search
- Status badges
- Action buttons

### 5. Worker Dashboard
- Assigned tasks
- Personal statistics
- Quick entry form

---

## ✅ Complete Setup Checklist

Print this out and check off as you go:

```
DATABASE SETUP:
□ Opened Supabase SQL Editor
□ Created new query
□ Copied SQL script from SETUP_NOW.md
□ Pasted into editor
□ Clicked RUN button
□ Saw "Setup Complete! ✅"
□ Verified 6 workers created
□ Verified 12 requests created
□ Checked tables in Table Editor

EDGE FUNCTION DEPLOYMENT:
□ Installed Supabase CLI
□ Ran supabase login
□ Ran supabase link command
□ Deployed function successfully
□ Tested health endpoint
□ Received {"status":"ok"}

FRONTEND SETUP:
□ Ran pnpm install
□ Ran pnpm dev
□ Opened http://localhost:5173
□ Saw landing page
□ Navigated to dashboard
□ Verified data loads correctly

FINAL VERIFICATION:
□ All tables visible in Supabase
□ API endpoints responding
□ Frontend displays data
□ No console errors
□ Can create new requests
□ Can view workers
```

---

## 🎉 Congratulations!

If you've completed all the steps above, you now have:

✅ A fully functional database  
✅ Working API endpoints  
✅ Beautiful React frontend  
✅ Sample data for testing  
✅ Production-ready infrastructure  

**You're ready to start developing! 🚀**

---

**Need help?** Refer to [START_HERE.md](START_HERE.md) or [SETUP_NOW.md](SETUP_NOW.md)
