import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from './info';
import {
  mapWorkerFromDb,
  mapWorkerFormToDb,
  mapTransportRequestFormToDb,
  mapTransportRequestFromDb,
  type WorkerRow,
} from './mappers';

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export const api = {
  async getRequests() {
    const { data, error } = await supabase
      .from('transport_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch requests');
    return (data || []).map((row) => mapTransportRequestFromDb(row as Record<string, unknown>));
  },

  async createRequest(form: Record<string, unknown>, addedBy: string) {
    const payload = mapTransportRequestFormToDb(form, addedBy);
    const { data, error } = await supabase.from('transport_requests').insert(payload).select().single();
    if (error) throw new Error(error.message || 'Failed to create request');
    return mapTransportRequestFromDb(data as Record<string, unknown>);
  },

  async updateRequest(id: string, data: Record<string, unknown>) {
    const { data: result, error } = await supabase
      .from('transport_requests')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message || 'Failed to update request');
    return result ? mapTransportRequestFromDb(result as Record<string, unknown>) : null;
  },

  async getWorkers() {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to fetch workers');
    return (data || []).map((row) => mapWorkerFromDb(row as WorkerRow));
  },

  async createWorker(data: Record<string, unknown>) {
    const payload = mapWorkerFormToDb(data as Parameters<typeof mapWorkerFormToDb>[0]);
    let { data: result, error } = await supabase.from('workers').insert(payload).select().single();
    if (error && 'job_title' in payload && /job_title|schema cache/i.test(error.message || '')) {
      const { job_title: _skip, ...rest } = payload;
      const retry = await supabase.from('workers').insert(rest).select().single();
      result = retry.data;
      error = retry.error;
    }
    if (error) throw new Error(error.message || 'Failed to create worker');
    return mapWorkerFromDb(result as WorkerRow);
  },
};
