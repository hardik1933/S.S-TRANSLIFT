import { supabase } from './client';

export type AuthRole = 'worker' | 'admin';

function mapNetworkError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('network request failed') ||
    m.includes('load failed')
  ) {
    return (
      'Cannot reach Supabase. Confirm VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env match ' +
      'Project Settings → API, then restart the dev server. Also check VPN/firewall and that you open the app over http://localhost (not file://).'
    );
  }
  return message;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
  role: AuthRole;
}

export async function login(email: string, password: string, requiredRole: AuthRole) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { success: false, error: error?.message ?? 'Login failed' };
  }

  const userRole = (data.user.user_metadata?.role as AuthRole | undefined) ?? 'worker';
  if (userRole !== requiredRole) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: `This account does not have ${requiredRole} access.`,
    };
  }

  return { success: true, role: userRole };
}

export async function signup(payload: SignupPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        role: payload.role,
        name: payload.name,
        company_name: payload.companyName ?? '',
        phone: payload.phone ?? '',
      },
    },
  });

  if (error) {
    return { success: false, error: mapNetworkError(error.message) };
  }

  const u = data.user;
  if (u?.email) {
    const row: Record<string, unknown> = {
      email: u.email,
      name: payload.name,
      phone: payload.phone || null,
      role: payload.role,
      status: 'active',
    };
    const { error: wErr } = await supabase.from('workers').upsert(row, { onConflict: 'email' });
    if (wErr) {
      console.warn('[signup] workers profile sync:', wErr.message);
    }
  }

  return { success: true, user: data.user };
}

export async function logout() {
  await supabase.auth.signOut();
}