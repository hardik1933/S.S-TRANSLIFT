/* Supabase config - requires .env.local with VITE_SUPABASE_* vars */

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
if (!projectId) {
  throw new Error('Missing VITE_SUPABASE_PROJECT_ID in .env.local');
}

export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!publicAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY in .env.local');
}
