-- =====================================================
-- S.S. TRANSLIFT TMS - SEED DATA
-- Version: 1.0.0
-- Description: Inserts initial sample data for testing
-- =====================================================

-- =====================================================
-- SEED WORKERS
-- =====================================================

-- Insert admin and worker accounts
INSERT INTO public.workers (email, name, phone, role, status) VALUES
    ('admin@sstranslift.com', 'Admin User', '+91-9876543210', 'admin', 'active'),
    ('worker1@sstranslift.com', 'Rajesh Kumar', '+91-9876543211', 'worker', 'active'),
    ('worker2@sstranslift.com', 'Priya Sharma', '+91-9876543212', 'worker', 'active'),
    ('worker3@sstranslift.com', 'Amit Patel', '+91-9876543213', 'worker', 'active'),
    ('worker4@sstranslift.com', 'Sunita Rao', '+91-9876543214', 'worker', 'active'),
    ('worker5@sstranslift.com', 'Vikram Singh', '+91-9876543215', 'worker', 'inactive')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED TRANSPORT REQUESTS
-- =====================================================

-- Get worker IDs for assignment
DO $$
DECLARE
    admin_id UUID;
    worker1_id UUID;
    worker2_id UUID;
    worker3_id UUID;
BEGIN
    -- Get worker IDs
    SELECT id INTO admin_id FROM public.workers WHERE email = 'admin@sstranslift.com';
    SELECT id INTO worker1_id FROM public.workers WHERE email = 'worker1@sstranslift.com';
    SELECT id INTO worker2_id FROM public.workers WHERE email = 'worker2@sstranslift.com';
    SELECT id INTO worker3_id FROM public.workers WHERE email = 'worker3@sstranslift.com';

    -- Insert sample transport requests
    INSERT INTO public.transport_requests (
        customer_name,
        company_name,
        phone_number,
        email,
        container_type,
        pickup_location,
        delivery_location,
        pickup_date,
        delivery_date,
        special_instructions,
        status,
        assigned_worker_id
    ) VALUES
        -- Pending requests
        (
            'Rajesh Kumar',
            'Mumbai Exports Ltd',
            '+91-9876543220',
            'rajesh@mumbaiexports.com',
            '20-Foot Standard',
            'JNPT Port, Navi Mumbai',
            'Pune Industrial Area',
            CURRENT_DATE + INTERVAL '5 days',
            CURRENT_DATE + INTERVAL '6 days',
            'Handle with care - fragile items',
            'Pending',
            NULL
        ),
        (
            'Neha Desai',
            'Gujarat Traders',
            '+91-9876543221',
            'neha@gujarattraders.com',
            '40-Foot Standard',
            'Mundra Port, Gujarat',
            'Ahmedabad Warehouse',
            CURRENT_DATE + INTERVAL '7 days',
            NULL,
            'Temperature sensitive goods',
            'Pending',
            NULL
        ),
        
        -- Approved requests
        (
            'Priya Sharma',
            'Delhi Imports',
            '+91-9876543222',
            'priya@delhiimports.com',
            '40-Foot High Cube',
            'JNPT Port, Navi Mumbai',
            'Delhi NCR',
            CURRENT_DATE + INTERVAL '3 days',
            CURRENT_DATE + INTERVAL '5 days',
            'Requires customs clearance',
            'Approved',
            worker1_id
        ),
        (
            'Amit Verma',
            'Bangalore Tech Solutions',
            '+91-9876543223',
            'amit@bangaloretech.com',
            'Reefer Container',
            'Chennai Port',
            'Bangalore Electronic City',
            CURRENT_DATE + INTERVAL '4 days',
            CURRENT_DATE + INTERVAL '6 days',
            'Maintain temperature at 5°C',
            'Approved',
            worker2_id
        ),
        
        -- In Progress requests
        (
            'Suresh Reddy',
            'Hyderabad Logistics',
            '+91-9876543224',
            'suresh@hyderabadlog.com',
            'Flat Rack Container',
            'Visakhapatnam Port',
            'Hyderabad Industrial Park',
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '2 days',
            'Heavy machinery - requires special handling',
            'In Progress',
            worker1_id
        ),
        (
            'Kavita Nair',
            'Kerala Exports',
            '+91-9876543225',
            'kavita@keralaexports.com',
            '20-Foot Standard',
            'Kochi Port',
            'Trivandrum',
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '1 day',
            'Perishable goods - urgent delivery',
            'In Progress',
            worker3_id
        ),
        
        -- Completed requests
        (
            'Ramesh Iyer',
            'Tamil Nadu Industries',
            '+91-9876543226',
            'ramesh@tnind.com',
            '40-Foot Standard',
            'Chennai Port',
            'Coimbatore',
            CURRENT_DATE - INTERVAL '10 days',
            CURRENT_DATE - INTERVAL '8 days',
            'Standard delivery',
            'Completed',
            worker2_id
        ),
        (
            'Anjali Mehta',
            'Maharashtra Textiles',
            '+91-9876543227',
            'anjali@mahtextiles.com',
            'ODC (Over Dimensional Cargo)',
            'JNPT Port, Navi Mumbai',
            'Nagpur',
            CURRENT_DATE - INTERVAL '15 days',
            CURRENT_DATE - INTERVAL '12 days',
            'Oversized textile machinery',
            'Completed',
            worker1_id
        ),
        (
            'Vikram Malhotra',
            'Punjab Agro',
            '+91-9876543228',
            'vikram@punjabagro.com',
            '20-Foot Standard',
            'Mundra Port, Gujarat',
            'Ludhiana',
            CURRENT_DATE - INTERVAL '20 days',
            CURRENT_DATE - INTERVAL '18 days',
            'Agricultural equipment',
            'Completed',
            worker3_id
        ),
        (
            'Deepa Krishnan',
            'Kolkata Commodities',
            '+91-9876543229',
            'deepa@kolkatacom.com',
            'Reefer Container',
            'Kolkata Port',
            'Kolkata Market',
            CURRENT_DATE - INTERVAL '5 days',
            CURRENT_DATE - INTERVAL '3 days',
            'Fresh produce - maintain 2°C',
            'Completed',
            worker2_id
        ),
        
        -- Additional requests for analytics
        (
            'Arjun Reddy',
            'Visakhapatnam Steel',
            '+91-9876543230',
            'arjun@vizagsteel.com',
            '40-Foot High Cube',
            'Visakhapatnam Port',
            'Raipur',
            CURRENT_DATE + INTERVAL '2 days',
            NULL,
            'Steel products - heavy load',
            'Approved',
            worker1_id
        ),
        (
            'Meera Nambiar',
            'Kochi Spices',
            '+91-9876543231',
            'meera@kochispices.com',
            'Flat Rack Container',
            'Kochi Port',
            'Mumbai',
            CURRENT_DATE - INTERVAL '30 days',
            CURRENT_DATE - INTERVAL '28 days',
            'Spice containers - waterproof required',
            'Completed',
            worker3_id
        );
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count workers
SELECT 'Workers created:' as info, COUNT(*) as count FROM public.workers;

-- Count requests by status
SELECT 'Requests by status:' as info, status, COUNT(*) as count 
FROM public.transport_requests 
GROUP BY status 
ORDER BY status;

-- Show sample data
SELECT 'Sample requests:' as info;
SELECT 
    customer_name,
    company_name,
    container_type,
    pickup_location,
    status,
    created_at
FROM public.transport_requests 
ORDER BY created_at DESC 
LIMIT 5;
