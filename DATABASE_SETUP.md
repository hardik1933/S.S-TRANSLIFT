# 🗄️ Database Setup Guide - Complete Instructions

This guide will help you set up the Supabase PostgreSQL database with all tables and data.

---

## 📋 Overview

The S.S. Translift TMS now uses **PostgreSQL tables** instead of the KV store for better:
- ✅ Data integrity with foreign keys
- ✅ Complex queries and filtering
- ✅ Built-in validation with constraints
- ✅ Better performance with indexes
- ✅ Relationship management

---

## 🏗️ Database Schema

### Tables

**1. workers**
- Stores all workers and admins
- Fields: id, email, name, phone, role, status, timestamps

**2. transport_requests**
- Stores all container transport requests
- Fields: customer info, container details, locations, dates, status, assigned worker
- Foreign key to workers table

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run Migration 001 - Create Tables

Copy and paste the entire content of `/supabase/migrations/001_create_tables.sql`:

1. Open the file `/supabase/migrations/001_create_tables.sql`
2. Copy all content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

**Expected output:**
```
Success. No rows returned
```

This creates:
- ✅ workers table
- ✅ transport_requests table
- ✅ All indexes
- ✅ Auto-update timestamp triggers
- ✅ Row Level Security policies

### Step 3: Run Migration 002 - Seed Data

Copy and paste the entire content of `/supabase/migrations/002_seed_data.sql`:

1. Open the file `/supabase/migrations/002_seed_data.sql`
2. Copy all content
3. Paste into a new query in Supabase SQL Editor
4. Click **Run**

**Expected output:**
```
Workers created: 6
Requests by status:
  Approved: 3
  Completed: 5
  In Progress: 2
  Pending: 2
```

This inserts:
- ✅ 6 workers (1 admin + 5 workers)
- ✅ 12 sample transport requests
- ✅ Various statuses and dates for testing

### Step 4: Verify Tables Created

Run this query to check tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workers', 'transport_requests');
```

**Expected output:**
```
workers
transport_requests
```

### Step 5: Verify Data Inserted

Check workers:

```sql
SELECT id, name, email, role, status 
FROM public.workers 
ORDER BY role DESC, name;
```

Check requests:

```sql
SELECT 
  id, 
  customer_name, 
  container_type, 
  status,
  pickup_location,
  created_at
FROM public.transport_requests 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🔧 Deploy Updated Edge Function

Now that tables are ready, deploy the updated edge function that uses the database:

### Step 1: Ensure Supabase CLI is Installed

```bash
npm install -g supabase
```

### Step 2: Login and Link Project

```bash
# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_ID
```

### Step 3: Deploy the Edge Function

```bash
supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID
```

**Important:** The function now uses the `db.tsx` helper file which connects to PostgreSQL tables instead of the KV store.

### Step 4: Test the API

Test health endpoint:

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-03-07T..."
}
```

Test getting requests:

```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b414255c/requests" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "customer_name": "...",
      "status": "...",
      ...
    }
  ]
}
```

---

## 📊 Database Structure Details

### Workers Table Schema

```sql
CREATE TABLE public.workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('admin', 'worker')),
    status TEXT CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_workers_email` - Fast email lookups
- `idx_workers_role` - Filter by role
- `idx_workers_status` - Filter by status

### Transport Requests Table Schema

```sql
CREATE TABLE public.transport_requests (
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
    status TEXT DEFAULT 'Pending',
    assigned_worker_id UUID REFERENCES workers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_requests_status` - Filter by status
- `idx_requests_created_at` - Sort by date
- `idx_requests_customer_name` - Search customers
- `idx_requests_container_type` - Filter by type
- `idx_requests_pickup_date` - Filter by date
- `idx_requests_assigned_worker` - Filter by worker

---

## 🔐 Security (Row Level Security)

RLS is enabled with permissive policies for development. For production, you should update these policies:

### Example: Restrict Worker Access

Workers should only see their own assigned requests:

```sql
-- Drop the permissive policy
DROP POLICY "Enable read access for all users" ON public.transport_requests;

-- Create restricted policy
CREATE POLICY "Workers see own requests" ON public.transport_requests
  FOR SELECT
  USING (
    assigned_worker_id = auth.uid()::uuid
    OR 
    EXISTS (
      SELECT 1 FROM public.workers 
      WHERE id = auth.uid()::uuid 
      AND role = 'admin'
    )
  );
```

### Example: Only Admins Can Delete

```sql
DROP POLICY "Enable delete access for all users" ON public.transport_requests;

CREATE POLICY "Only admins can delete" ON public.transport_requests
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workers 
      WHERE id = auth.uid()::uuid 
      AND role = 'admin'
    )
  );
```

---

## 📈 Performance Optimization

### Analyze Query Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM public.transport_requests 
WHERE status = 'Pending' 
ORDER BY created_at DESC;
```

### Add Additional Indexes (if needed)

```sql
-- For searching by customer email
CREATE INDEX idx_requests_email ON public.transport_requests(email);

-- For combined status + date queries
CREATE INDEX idx_requests_status_date ON public.transport_requests(status, pickup_date);
```

---

## 🔄 Data Maintenance

### Clean Up Old Completed Requests (Optional)

```sql
-- Archive requests older than 1 year
DELETE FROM public.transport_requests 
WHERE status = 'Completed' 
  AND created_at < NOW() - INTERVAL '1 year';
```

### Update Timestamps Manually (if needed)

```sql
UPDATE public.transport_requests 
SET updated_at = NOW() 
WHERE id = 'some-uuid';
```

---

## 🧪 Testing Queries

### Get All Pending Requests

```sql
SELECT * FROM public.transport_requests 
WHERE status = 'Pending' 
ORDER BY pickup_date ASC;
```

### Get Worker's Assigned Requests

```sql
SELECT 
  tr.*,
  w.name as worker_name,
  w.email as worker_email
FROM public.transport_requests tr
LEFT JOIN public.workers w ON tr.assigned_worker_id = w.id
WHERE w.email = 'worker1@sstranslift.com';
```

### Get Statistics by Status

```sql
SELECT 
  status,
  COUNT(*) as count,
  COUNT(DISTINCT customer_name) as unique_customers
FROM public.transport_requests 
GROUP BY status 
ORDER BY count DESC;
```

### Get Revenue by Month (if you add pricing)

```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed
FROM public.transport_requests 
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY month 
ORDER BY month DESC;
```

---

## 🆘 Troubleshooting

### Error: "relation does not exist"

**Solution:** Run the migration files again to create tables.

### Error: "duplicate key value violates unique constraint"

**Solution:** The seed data is already inserted. This is expected if you run it twice.

### Error: "permission denied for table"

**Solution:** Check RLS policies and ensure you're using the service role key for server operations.

### Edge Function Can't Connect to Database

**Solution:** 
1. Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in edge function environment
2. These are automatically set by Supabase, but verify in Settings > Edge Functions

---

## 📋 Migration Checklist

- [ ] Created Supabase project
- [ ] Accessed SQL Editor
- [ ] Ran migration 001 (create tables)
- [ ] Verified tables created
- [ ] Ran migration 002 (seed data)
- [ ] Verified data inserted
- [ ] Checked workers table has 6 rows
- [ ] Checked requests table has 12 rows
- [ ] Updated edge function (`db.tsx` created)
- [ ] Deployed edge function
- [ ] Tested health endpoint
- [ ] Tested GET /requests endpoint
- [ ] Tested POST /requests endpoint
- [ ] Frontend can connect to API
- [ ] Data displays in application

---

## 🎉 You're Done!

Your database is now set up with:
- ✅ Proper PostgreSQL tables
- ✅ Relationships with foreign keys
- ✅ Indexes for performance
- ✅ Auto-updating timestamps
- ✅ Row Level Security
- ✅ Sample data for testing

The application will now use real database tables instead of the KV store!

---

## 📚 Next Steps

1. Test the application in browser
2. Verify data loads correctly
3. Try creating new requests
4. Test worker assignment
5. Export data to Excel
6. Customize RLS policies for production

---

**For more information:**
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
