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
  // Transport Requests - Using REST API
  async getRequests() {
    const { data, error } = await supabase
      .from('transport_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to fetch requests');
    }
    return (data || []).map((row) => mapTransportRequestFromDb(row as Record<string, unknown>));
  },

  async getRequest(id: string) {
    const { data, error } = await supabase
      .from('transport_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to fetch request');
    }
    return data ? mapTransportRequestFromDb(data as Record<string, unknown>) : null;
  },

  async createRequest(form: Record<string, unknown>, addedBy: string) {
    const payload = mapTransportRequestFormToDb(form, addedBy);
    const { data: result, error } = await supabase
      .from('transport_requests')
      .insert(payload)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to create request');
    }
    return mapTransportRequestFromDb(result as Record<string, unknown>);
  },

  async updateRequest(id: string, data: any) {
    const { data: result, error } = await supabase
      .from('transport_requests')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to update request');
    }
    return result ? mapTransportRequestFromDb(result as Record<string, unknown>) : null;
  },

  async deleteRequest(id: string) {
    const { error } = await supabase
      .from('transport_requests')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to delete request');
    }
    return true;
  },

  // Workers - Using REST API
  async getWorkers() {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to fetch workers');
    }
    return (data || []).map((row) => mapWorkerFromDb(row as WorkerRow));
  },

  async createWorker(data: Record<string, unknown>) {
    let payload = mapWorkerFormToDb(data as Parameters<typeof mapWorkerFormToDb>[0]);
    let { data: result, error } = await supabase
      .from('workers')
      .insert(payload)
      .select()
      .single();

    if (error && 'job_title' in payload && /job_title|schema cache/i.test(error.message || '')) {
      const { job_title: _j, ...rest } = payload;
      const retry = await supabase.from('workers').insert(rest).select().single();
      result = retry.data;
      error = retry.error;
      if (!error) {
        console.warn('[workers job_title] Retrying insert without job_title. Run migration 003_workers_job_title.sql.');
      }
    }

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to create worker');
    }
    return mapWorkerFromDb(result as WorkerRow);
  },

  async updateWorker(id: string, data: any) {
    const { data: result, error } = await supabase
      .from('workers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to update worker');
    }
    return result ? mapWorkerFromDb(result as WorkerRow) : null;
  },

  async deleteWorker(id: string) {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to delete worker');
    }
    return true;
  },
};
