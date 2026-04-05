import { supabase } from './client';

export async function createWorkerAccount(params: {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  jobTitle?: string;
}): Promise<void> {
  const { data, error } = await supabase.functions.invoke('create-worker', {
    body: params,
  });

  if (error) {
    throw new Error(error.message || 'Failed to create worker account');
  }
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }
}
