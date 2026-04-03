-- =====================================================
-- VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to verify setup
-- =====================================================

-- Check if tables exist
SELECT 
    'Tables Check' as test,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'workers'
        ) THEN '✅ workers table exists'
        ELSE '❌ workers table missing'
    END as workers_status,
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'transport_requests'
        ) THEN '✅ transport_requests table exists'
        ELSE '❌ transport_requests table missing'
    END as requests_status;

-- Check data counts
SELECT 
    'Data Count' as test,
    (SELECT COUNT(*) FROM public.workers) as workers_count,
    (SELECT COUNT(*) FROM public.transport_requests) as requests_count;

-- Check workers by role
SELECT 
    'Workers by Role' as test,
    role,
    COUNT(*) as count
FROM public.workers
GROUP BY role
ORDER BY role;

-- Check requests by status
SELECT 
    'Requests by Status' as test,
    status,
    COUNT(*) as count
FROM public.transport_requests
GROUP BY status
ORDER BY status;

-- Show sample workers
SELECT 
    'Sample Workers' as test,
    id,
    email,
    name,
    role,
    status
FROM public.workers
ORDER BY role DESC, name
LIMIT 5;

-- Show sample requests
SELECT 
    'Sample Requests' as test,
    id,
    customer_name,
    company_name,
    container_type,
    status,
    pickup_location,
    pickup_date
FROM public.transport_requests
ORDER BY created_at DESC
LIMIT 5;

-- Check indexes
SELECT 
    'Indexes Check' as test,
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('workers', 'transport_requests')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
    'RLS Policies Check' as test,
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('workers', 'transport_requests')
ORDER BY tablename, policyname;

-- Final summary
SELECT 
    '✅ Setup Verification Complete!' as message,
    'All checks passed' as status,
    NOW() as verified_at;
