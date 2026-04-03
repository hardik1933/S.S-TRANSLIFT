-- =====================================================
-- S.S. TRANSLIFT TMS - QUICK SETUP SQL
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- WORKERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'worker' CHECK (role IN ('admin', 'worker')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    total_entries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRANSPORT REQUESTS TABLE - COMPLETE schema
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    date DATE,
    bill_number TEXT,
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    company_name TEXT,
    phone_number TEXT NOT NULL,
    email TEXT,
    
    -- Transport Details
    party_name TEXT,
    broker_name TEXT,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    port_name TEXT,
    
    -- Container Information
    container_type TEXT NOT NULL CHECK (container_type IN (
        '20-Foot Standard',
        '40-Foot Standard',
        '40-Foot High Cube',
        'Reefer Container',
        'Flat Rack Container',
        'ODC Container',
        'ODC (Over Dimensional Cargo)'
    )),
    
    -- Vehicle Information
    vehicle_number TEXT,
    container_number TEXT,
    load_weight TEXT,
    cargo_description TEXT,
    
    -- Scheduling
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    
    -- Financial Information
    parking_charges NUMERIC DEFAULT 0,
    freight_amount NUMERIC DEFAULT 0,
    truck_freight NUMERIC DEFAULT 0,
    company_margin NUMERIC DEFAULT 0,
    advance_payment NUMERIC DEFAULT 0,
    balance_payment NUMERIC DEFAULT 0,
    payment_mode TEXT DEFAULT 'Cash',
    
    -- Additional Details
    special_instructions TEXT,
    
    -- Status Tracking
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN (
        'Pending',
        'Approved',
        'In Progress',
        'Completed',
        'Cancelled'
    )),
    
    -- Worker Assignment
    assigned_worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    added_by TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_workers_email ON public.workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_role ON public.workers(role);
CREATE INDEX IF NOT EXISTS idx_workers_status ON public.workers(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.transport_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.transport_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_customer_name ON public.transport_requests(customer_name);
CREATE INDEX IF NOT EXISTS idx_requests_container_type ON public.transport_requests(container_type);
CREATE INDEX IF NOT EXISTS idx_requests_pickup_date ON public.transport_requests(pickup_date);

-- =====================================================
-- TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================
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
-- ROW LEVEL SECURITY (RLS) - Allow all for development
-- =====================================================
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Workers policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.workers;

CREATE POLICY "Enable read access for all users" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.workers FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.workers FOR DELETE USING (true);

-- Transport requests policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.transport_requests;

CREATE POLICY "Enable read access for all users" ON public.transport_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.transport_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.transport_requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.transport_requests FOR DELETE USING (true);

-- =====================================================
-- ADD SAMPLE DATA (Optional - for testing)
-- =====================================================
INSERT INTO workers (email, name, phone, role, status) VALUES
  ('admin@sstranslift.com', 'Admin User', '+91 9876543210', 'admin', 'active'),
  ('worker@sstranslift.com', 'Worker One', '+91 9876543211', 'worker', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO transport_requests (
  customer_name, 
  company_name, 
  phone_number, 
  container_type, 
  pickup_location, 
  delivery_location, 
  pickup_date,
  status
) VALUES
  ('Rajesh Kumar', 'Mumbai Logistics', '+91 9876543212', '20-Foot Standard', 'JNPT Port', 'Pune', '2026-03-15', 'Pending'),
  ('Priya Sharma', 'Delhi Imports', '+91 9876543213', '40-Foot Standard', 'JNPT Port', 'Delhi', '2026-03-20', 'Approved'),
  ('Amit Patel', 'Gujarat Logistics', '+91 9876543214', 'Reefer Container', 'Mundra Port', 'Ahmedabad', '2026-03-18', 'In Progress')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Workers table created!' as status, COUNT(*) as count FROM workers;
SELECT 'Transport requests table created!' as status, COUNT(*) as count FROM transport_requests;

