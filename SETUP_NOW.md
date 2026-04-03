# 🚀 Quick Database Setup for Your Supabase Project

**Project ID:** `tdybvncpujnnlibfpmth`  
**Project URL:** `https://tdybvncpujnnlibfpmth.supabase.co`  
**Status:** ✅ Credentials already configured in the project

---

## 📋 Setup Steps (5 Minutes Total)

### Step 1: Open Supabase SQL Editor (1 minute)

1. Go to: https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth
2. Click **SQL Editor** in the left sidebar
3. Click **New query** button

---

### Step 2: Create Tables (2 minutes)

**Copy this ENTIRE SQL script and paste it into the SQL Editor:**

```sql
-- =====================================================
-- S.S. TRANSLIFT TMS - DATABASE SETUP
-- This creates all tables with sample data
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE WORKERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'worker' CHECK (role IN ('admin', 'worker')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE TRANSPORT REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    company_name TEXT,
    phone_number TEXT NOT NULL,
    email TEXT,
    container_type TEXT NOT NULL CHECK (container_type IN (
        '20-Foot Standard',
        '40-Foot Standard',
        '40-Foot High Cube',
        'Reefer Container',
        'Flat Rack Container',
        'ODC (Over Dimensional Cargo)'
    )),
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    special_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN (
        'Pending',
        'Approved',
        'In Progress',
        'Completed',
        'Cancelled'
    )),
    assigned_worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_workers_email ON public.workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_role ON public.workers(role);
CREATE INDEX IF NOT EXISTS idx_workers_status ON public.workers(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.transport_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.transport_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_customer_name ON public.transport_requests(customer_name);
CREATE INDEX IF NOT EXISTS idx_requests_container_type ON public.transport_requests(container_type);
CREATE INDEX IF NOT EXISTS idx_requests_pickup_date ON public.transport_requests(pickup_date);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_worker ON public.transport_requests(assigned_worker_id);

-- =====================================================
-- CREATE TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_workers_updated_at ON public.workers;
CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON public.workers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transport_requests_updated_at ON public.transport_requests;
CREATE TRIGGER update_transport_requests_updated_at
    BEFORE UPDATE ON public.transport_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.transport_requests;

-- Create permissive policies for development
CREATE POLICY "Enable read access for all users" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.workers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.workers FOR DELETE USING (true);
CREATE POLICY "Enable read access for all users" ON public.transport_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.transport_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.transport_requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.transport_requests FOR DELETE USING (true);

-- =====================================================
-- INSERT SAMPLE DATA - WORKERS
-- =====================================================
INSERT INTO public.workers (email, name, phone, role, status) VALUES
    ('admin@sstranslift.com', 'Admin User', '+91-9876543210', 'admin', 'active'),
    ('worker1@sstranslift.com', 'Rajesh Kumar', '+91-9876543211', 'worker', 'active'),
    ('worker2@sstranslift.com', 'Priya Sharma', '+91-9876543212', 'worker', 'active'),
    ('worker3@sstranslift.com', 'Amit Patel', '+91-9876543213', 'worker', 'active'),
    ('worker4@sstranslift.com', 'Sunita Rao', '+91-9876543214', 'worker', 'active'),
    ('worker5@sstranslift.com', 'Vikram Singh', '+91-9876543215', 'worker', 'inactive')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- INSERT SAMPLE DATA - TRANSPORT REQUESTS
-- =====================================================
DO $$
DECLARE
    worker1_id UUID;
    worker2_id UUID;
    worker3_id UUID;
BEGIN
    SELECT id INTO worker1_id FROM public.workers WHERE email = 'worker1@sstranslift.com';
    SELECT id INTO worker2_id FROM public.workers WHERE email = 'worker2@sstranslift.com';
    SELECT id INTO worker3_id FROM public.workers WHERE email = 'worker3@sstranslift.com';

    INSERT INTO public.transport_requests (
        customer_name, company_name, phone_number, email, container_type,
        pickup_location, delivery_location, pickup_date, delivery_date,
        special_instructions, status, assigned_worker_id
    ) VALUES
        ('Rajesh Kumar', 'Mumbai Exports Ltd', '+91-9876543220', 'rajesh@mumbaiexports.com',
         '20-Foot Standard', 'JNPT Port, Navi Mumbai', 'Pune Industrial Area',
         CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '6 days',
         'Handle with care - fragile items', 'Pending', NULL),
        
        ('Neha Desai', 'Gujarat Traders', '+91-9876543221', 'neha@gujarattraders.com',
         '40-Foot Standard', 'Mundra Port, Gujarat', 'Ahmedabad Warehouse',
         CURRENT_DATE + INTERVAL '7 days', NULL,
         'Temperature sensitive goods', 'Pending', NULL),
        
        ('Priya Sharma', 'Delhi Imports', '+91-9876543222', 'priya@delhiimports.com',
         '40-Foot High Cube', 'JNPT Port, Navi Mumbai', 'Delhi NCR',
         CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 days',
         'Requires customs clearance', 'Approved', worker1_id),
        
        ('Amit Verma', 'Bangalore Tech Solutions', '+91-9876543223', 'amit@bangaloretech.com',
         'Reefer Container', 'Chennai Port', 'Bangalore Electronic City',
         CURRENT_DATE + INTERVAL '4 days', CURRENT_DATE + INTERVAL '6 days',
         'Maintain temperature at 5°C', 'Approved', worker2_id),
        
        ('Suresh Reddy', 'Hyderabad Logistics', '+91-9876543224', 'suresh@hyderabadlog.com',
         'Flat Rack Container', 'Visakhapatnam Port', 'Hyderabad Industrial Park',
         CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days',
         'Heavy machinery - requires special handling', 'In Progress', worker1_id),
        
        ('Kavita Nair', 'Kerala Exports', '+91-9876543225', 'kavita@keralaexports.com',
         '20-Foot Standard', 'Kochi Port', 'Trivandrum',
         CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day',
         'Perishable goods - urgent delivery', 'In Progress', worker3_id),
        
        ('Ramesh Iyer', 'Tamil Nadu Industries', '+91-9876543226', 'ramesh@tnind.com',
         '40-Foot Standard', 'Chennai Port', 'Coimbatore',
         CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days',
         'Standard delivery', 'Completed', worker2_id),
        
        ('Anjali Mehta', 'Maharashtra Textiles', '+91-9876543227', 'anjali@mahtextiles.com',
         'ODC (Over Dimensional Cargo)', 'JNPT Port, Navi Mumbai', 'Nagpur',
         CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '12 days',
         'Oversized textile machinery', 'Completed', worker1_id),
        
        ('Vikram Malhotra', 'Punjab Agro', '+91-9876543228', 'vikram@punjabagro.com',
         '20-Foot Standard', 'Mundra Port, Gujarat', 'Ludhiana',
         CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '18 days',
         'Agricultural equipment', 'Completed', worker3_id),
        
        ('Deepa Krishnan', 'Kolkata Commodities', '+91-9876543229', 'deepa@kolkatacom.com',
         'Reefer Container', 'Kolkata Port', 'Kolkata Market',
         CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days',
         'Fresh produce - maintain 2°C', 'Completed', worker2_id),
        
        ('Arjun Reddy', 'Visakhapatnam Steel', '+91-9876543230', 'arjun@vizagsteel.com',
         '40-Foot High Cube', 'Visakhapatnam Port', 'Raipur',
         CURRENT_DATE + INTERVAL '2 days', NULL,
         'Steel products - heavy load', 'Approved', worker1_id),
        
        ('Meera Nambiar', 'Kochi Spices', '+91-9876543231', 'meera@kochispices.com',
         'Flat Rack Container', 'Kochi Port', 'Mumbai',
         CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '28 days',
         'Spice containers - waterproof required', 'Completed', worker3_id);
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Setup Complete! ✅' as message;
SELECT 'Workers created:' as info, COUNT(*) as count FROM public.workers;
SELECT 'Requests created:' as info, COUNT(*) as count FROM public.transport_requests;
SELECT 'Requests by status:' as info, status, COUNT(*) as count 
FROM public.transport_requests 
GROUP BY status 
ORDER BY status;
```

**Then click the "RUN" button (or press Ctrl+Enter)**

✅ **Expected Output:**
```
Setup Complete! ✅
Workers created: 6
Requests created: 12
Requests by status:
  - Approved: 3
  - Completed: 5
  - In Progress: 2
  - Pending: 2
```

---

### Step 3: Deploy Edge Function (2 minutes)

Open your terminal and run these commands:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref tdybvncpujnnlibfpmth

# Deploy the edge function
supabase functions deploy make-server-b414255c --project-ref tdybvncpujnnlibfpmth
```

---

### Step 4: Test Everything (1 minute)

**Test 1: Health Check**
```bash
curl https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c/health
```

Expected: `{"status":"ok","timestamp":"..."}`

**Test 2: Get Requests**
```bash
curl -X GET \
  "https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c/requests" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeWJ2bmNwdWpubmxpYmZwbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzkyODgsImV4cCI6MjA4ODQ1NTI4OH0.MV9GdcNWwiaBepn-v9RzZMk_ycRbdA8_LMCMIqrX5R8"
```

Expected: `{"success":true,"data":[...]}`

**Test 3: Run Your App**
```bash
pnpm dev
```

Open browser to `http://localhost:5173` and verify data loads!

---

## ✅ What You'll Have After Setup

### Database Tables:
- ✅ `workers` table (6 sample workers)
- ✅ `transport_requests` table (12 sample requests)
- ✅ 10 performance indexes
- ✅ Auto-updating timestamps
- ✅ Row Level Security enabled

### Sample Data:
- ✅ 1 Admin: admin@sstranslift.com
- ✅ 5 Workers: worker1-5@sstranslift.com
- ✅ 12 Transport requests with various statuses
- ✅ Realistic Indian company names and locations

### API Endpoints (All working):
- ✅ GET /requests (with filtering)
- ✅ POST /requests
- ✅ PUT /requests/:id
- ✅ DELETE /requests/:id
- ✅ GET /workers
- ✅ POST /workers
- ✅ And more...

---

## 🎯 Quick Verification Checklist

After running the SQL script above:

- [ ] SQL script ran successfully
- [ ] Saw "Setup Complete! ✅" message
- [ ] Saw "Workers created: 6"
- [ ] Saw "Requests created: 12"
- [ ] Edge function deployed successfully
- [ ] Health endpoint returns OK
- [ ] App runs with `pnpm dev`
- [ ] Can see data in the dashboard

---

## 🆘 Troubleshooting

### "Permission denied" error
→ Make sure you're logged into the correct Supabase project

### "Table already exists" 
→ That's fine! The script uses `IF NOT EXISTS` so it's safe to run multiple times

### "Function not found"
→ Make sure you deployed the edge function with the correct project ID

### Edge function deployment fails
→ Run `supabase login` first, then try again

---

## 📞 Your Project Info

- **Project ID:** tdybvncpujnnlibfpmth
- **Project URL:** https://tdybvncpujnnlibfpmth.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth
- **SQL Editor:** https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth/sql
- **Anon Key:** Already configured in `/utils/supabase/info.tsx`

---

## 🚀 You're All Set!

Once you complete the 4 steps above, your S.S. Translift TMS will be:
- ✅ Connected to Supabase
- ✅ Using PostgreSQL database
- ✅ With sample data ready to test
- ✅ All API endpoints working
- ✅ Ready for development and deployment

**Time to complete: ~5 minutes**

---

**Ready? Start with Step 1 above! 🎉**
