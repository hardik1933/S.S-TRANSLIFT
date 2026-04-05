-- Role-based access: one row per auth user
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'worker')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own_worker" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin_all" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Self-signup: only worker role for own row
CREATE POLICY "profiles_insert_own_worker"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND role = 'worker');

-- Admins can read all profiles (for future admin UI / verification)
CREATE POLICY "profiles_select_admin_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

COMMENT ON TABLE public.profiles IS 'App roles; must match auth.users. Bootstrap first admin via SQL (see bottom).';

-- ---------------------------------------------------------------------------
-- Bootstrap first admin (run once in SQL Editor after creating the user in Auth):
--
-- INSERT INTO public.profiles (id, email, role)
-- VALUES (
--   '<paste-auth-user-uuid>',
--   'admin@yourdomain.com',
--   'admin'
-- );
-- ---------------------------------------------------------------------------
