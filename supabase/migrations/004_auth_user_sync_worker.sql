-- Optional: if RLS blocks browser inserts into `workers`, this trigger still creates/updates
-- a workers row when a new Auth user signs up (runs as SECURITY DEFINER).

CREATE OR REPLACE FUNCTION public.handle_new_user_worker()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.workers (email, name, phone, role, status)
  VALUES (
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'phone', '')), ''),
    COALESCE(NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'role', '')), ''), 'worker'),
    'active'
  )
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, workers.phone),
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_worker ON auth.users;
CREATE TRIGGER on_auth_user_created_worker
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_worker();
