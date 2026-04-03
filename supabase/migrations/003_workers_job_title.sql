-- Job title for display (RBAC role stays admin | worker)
ALTER TABLE public.workers
  ADD COLUMN IF NOT EXISTS job_title TEXT;

COMMENT ON COLUMN public.workers.job_title IS 'Display role e.g. Transport Coordinator; workers.role remains admin|worker for access control';
