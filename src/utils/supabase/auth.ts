import { supabase } from './client';
import { fetchProfileByUserId } from './profiles';

export type AuthRole = 'worker' | 'admin';

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
  role: AuthRole;
}

/**
 * Sign in, then load role from `profiles` (not user_metadata).
 * `portal` is which login form was used — must match profile.role.
 */
export async function signInWithPortal(email: string, password: string, portal: AuthRole) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { success: false as const, error: 'Invalid credentials' };
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const authUser = userData.user ?? data.user;
  if (userErr || !authUser) {
    await supabase.auth.signOut();
    return { success: false as const, error: 'Invalid credentials' };
  }

  const profile = await fetchProfileByUserId(authUser.id);
  if (!profile) {
    await supabase.auth.signOut();
    return {
      success: false as const,
      error: 'Account setup incomplete. Ask an administrator to add your profile row.',
    };
  }

  if (portal === 'admin' && profile.role !== 'admin') {
    await supabase.auth.signOut();
    return { success: false as const, error: 'Unauthorized access' };
  }
  if (portal === 'worker' && profile.role !== 'worker') {
    await supabase.auth.signOut();
    return { success: false as const, error: 'Unauthorized access' };
  }

  return { success: true as const, role: profile.role };
}

/** Backwards-compatible name used by AppContext */
export async function login(email: string, password: string, portal: AuthRole) {
  return signInWithPortal(email, password, portal);
}

export async function signup(payload: SignupPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
        company_name: payload.companyName ?? '',
        phone: payload.phone ?? '',
      },
    },
  });
  if (error) return { success: false, error: error.message };

  const u = data.user;
  if (u?.id && u.email) {
    const { error: pErr } = await supabase.from('profiles').insert({
      id: u.id,
      email: u.email,
      role: 'worker',
    });
    if (pErr && !/duplicate|unique/i.test(pErr.message)) {
      await supabase.auth.signOut();
      return { success: false, error: pErr.message };
    }

    const { error: wErr } = await supabase.from('workers').upsert(
      {
        email: u.email,
        name: payload.name,
        phone: payload.phone || null,
        role: 'worker',
        status: 'active',
      },
      { onConflict: 'email' },
    );
    if (wErr) {
      console.warn('[signup] workers:', wErr.message);
    }
  }

  return { success: true, user: data.user };
}

export async function logout() {
  await supabase.auth.signOut();
}
