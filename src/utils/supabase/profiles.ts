import { supabase } from './client';

export type ProfileRole = 'admin' | 'worker';

export interface ProfileRow {
  id: string;
  email: string;
  role: ProfileRole;
}

export async function fetchProfileByUserId(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[profiles]', error.message);
    return null;
  }
  if (!data) return null;
  return data as ProfileRow;
}
