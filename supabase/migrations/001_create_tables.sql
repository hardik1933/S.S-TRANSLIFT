-- =====================================================
-- S.S. TRANSLIFT TMS - DATABASE SCHEMA
-- Version: 1.0.1
-- Description: Creates all necessary tables for the TMS with ALL fields
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- WORKERS/USERS TABLE
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
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Workers table indexes
CREATE INDEX IF NOT EXISTS idx_workers_email ON public.workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_role ON public.workers(role);
CREATE INDEX IF NOT EXISTS idx_workers_status ON public.workers(status);

-- Transport requests table indexes
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.transport_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.transport_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_customer_name ON public.transport_requests(customer_name);
CREATE INDEX IF NOT EXISTS idx_requests_container_type ON public.transport_requests(container_type);
CREATE INDEX IF NOT EXISTS idx_requests_pickup_date ON public.transport_requests(pickup_date);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_worker ON public.transport_requests(assigned_worker_id);

-- =====================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
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
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.workers;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.workers;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.transport_requests;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.transport_requests;

-- Workers table policies (Allow all for now - adjust for production)
CREATE POLICY "Enable read access for all users" ON public.workers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.workers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.workers
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.workers
    FOR DELETE USING (true);

-- Transport requests table policies (Allow all for now - adjust for production)
CREATE POLICY "Enable read access for all users" ON public.transport_requests
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.transport_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.transport_requests
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.transport_requests
    FOR DELETE USING (true);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.workers IS 'Stores worker/employee information for the TMS';
COMMENT ON TABLE public.transport_requests IS 'Stores all container transport requests';

COMMENT ON COLUMN public.workers.role IS 'User role: admin or worker';
COMMENT ON COLUMN public.workers.status IS 'Worker status: active or inactive';

COMMENT ON COLUMN public.transport_requests.status IS 'Request status: Pending, Approved, In Progress, Completed, or Cancelled';
COMMENT ON COLUMN public.transport_requests.container_type IS 'Type of container being transported';
COMMENT ON COLUMN public.transport_requests.assigned_worker_id IS 'Worker assigned to handle this request';
