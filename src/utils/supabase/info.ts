/* Supabase config — set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env (restart dev server after changes). */

function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

function normalizeEnv(value: string | undefined): string | undefined {
  if (value == null || value === '') return undefined;
  return stripQuotes(String(value).replace(/^\uFEFF/, ''));
}

const rawUrl =
  normalizeEnv(import.meta.env.VITE_SUPABASE_URL) ??
  normalizeEnv(import.meta.env.VITE_SUPABASE_PROJECT_ID);

const rawRef = normalizeEnv(import.meta.env.VITE_SUPABASE_PROJECT_REF);

const rawKey =
  normalizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY) ??
  normalizeEnv(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function resolveSupabaseUrl(): string {
  if (rawUrl) {
    const u = rawUrl.replace(/\/+$/, '');
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.endsWith('.supabase.co')) return `https://${u}`;
    if (/^[a-z0-9]{15,}$/i.test(u)) return `https://${u}.supabase.co`;
  }
  if (rawRef) {
    const ref = rawRef.replace(/\.supabase\.co$/i, '').replace(/^https?:\/\//i, '');
    return `https://${ref}.supabase.co`;
  }
  throw new Error(
    'Missing Supabase URL. Set VITE_SUPABASE_URL (recommended) or VITE_SUPABASE_PROJECT_ID / VITE_SUPABASE_PROJECT_REF in .env',
  );
}

export const supabaseUrl = resolveSupabaseUrl();

if (!rawKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in .env');
}

export const publicAnonKey = rawKey;
