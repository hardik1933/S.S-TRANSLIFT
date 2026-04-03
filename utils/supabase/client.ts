import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Use Supabase REST API directly instead of Edge Functions
const REST_API = `${supabaseUrl}/rest/v1`;

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
    return data || [];
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
    return data;
  },

  async createRequest(data: any) {
    const { data: result, error } = await supabase
      .from('transport_requests')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to create request');
    }
    return result;
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
    return result;
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
    return data || [];
  },

  async createWorker(data: any) {
    const { data: result, error } = await supabase
      .from('workers')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase Error:', error);
      throw new Error(error.message || 'Failed to create worker');
    }
    return result;
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
    return result;
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
