// =====================================================
// DATABASE HELPER FUNCTIONS
// Connects to Supabase PostgreSQL database
// =====================================================

import { createClient } from "npm:@supabase/supabase-js@2";

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================
// TRANSPORT REQUESTS DATABASE OPERATIONS
// =====================================================

export const requests = {
  // Get all requests with optional filtering
  async getAll(filters?: {
    status?: string;
    assigned_worker_id?: string;
    from_date?: string;
    to_date?: string;
  }) {
    let query = supabase
      .from("transport_requests")
      .select(`
        *,
        assigned_worker:workers!assigned_worker_id(id, name, email)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.assigned_worker_id) {
      query = query.eq("assigned_worker_id", filters.assigned_worker_id);
    }
    if (filters?.from_date) {
      query = query.gte("pickup_date", filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte("pickup_date", filters.to_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error fetching requests:", error);
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }

    return data;
  },

  // Get single request by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("transport_requests")
      .select(`
        *,
        assigned_worker:workers!assigned_worker_id(id, name, email, phone)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Database error fetching request:", error);
      throw new Error(`Failed to fetch request: ${error.message}`);
    }

    return data;
  },

  // Create new request
  async create(requestData: {
    customer_name: string;
    company_name?: string;
    phone_number: string;
    email?: string;
    container_type: string;
    pickup_location: string;
    delivery_location: string;
    pickup_date: string;
    delivery_date?: string;
    special_instructions?: string;
    status?: string;
    assigned_worker_id?: string;
  }) {
    const { data, error } = await supabase
      .from("transport_requests")
      .insert(requestData)
      .select(`
        *,
        assigned_worker:workers!assigned_worker_id(id, name, email)
      `)
      .single();

    if (error) {
      console.error("Database error creating request:", error);
      throw new Error(`Failed to create request: ${error.message}`);
    }

    return data;
  },

  // Update existing request
  async update(id: string, updates: Partial<{
    customer_name: string;
    company_name: string;
    phone_number: string;
    email: string;
    container_type: string;
    pickup_location: string;
    delivery_location: string;
    pickup_date: string;
    delivery_date: string;
    special_instructions: string;
    status: string;
    assigned_worker_id: string;
  }>) {
    const { data, error } = await supabase
      .from("transport_requests")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        assigned_worker:workers!assigned_worker_id(id, name, email)
      `)
      .single();

    if (error) {
      console.error("Database error updating request:", error);
      throw new Error(`Failed to update request: ${error.message}`);
    }

    return data;
  },

  // Delete request
  async delete(id: string) {
    const { error } = await supabase
      .from("transport_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error deleting request:", error);
      throw new Error(`Failed to delete request: ${error.message}`);
    }

    return true;
  },

  // Get analytics/statistics
  async getStats() {
    // Total requests
    const { count: totalCount } = await supabase
      .from("transport_requests")
      .select("*", { count: "exact", head: true });

    // Requests by status
    const { data: statusData } = await supabase
      .from("transport_requests")
      .select("status")
      .order("status");

    // Count by status
    const statusCounts = (statusData || []).reduce((acc: Record<string, number>, item: { status: string }) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    // Recent requests (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentCount } = await supabase
      .from("transport_requests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    return {
      total: totalCount || 0,
      by_status: statusCounts,
      recent_30_days: recentCount || 0,
    };
  },
};

// =====================================================
// WORKERS DATABASE OPERATIONS
// =====================================================

export const workers = {
  // Get all workers with optional filtering
  async getAll(filters?: { role?: string; status?: string }) {
    let query = supabase
      .from("workers")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.role) {
      query = query.eq("role", filters.role);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error fetching workers:", error);
      throw new Error(`Failed to fetch workers: ${error.message}`);
    }

    return data;
  },

  // Get single worker by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Database error fetching worker:", error);
      throw new Error(`Failed to fetch worker: ${error.message}`);
    }

    return data;
  },

  // Get worker by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Database error fetching worker by email:", error);
      throw new Error(`Failed to fetch worker: ${error.message}`);
    }

    return data;
  },

  // Create new worker
  async create(workerData: {
    email: string;
    name: string;
    phone?: string;
    role?: string;
    status?: string;
  }) {
    const { data, error } = await supabase
      .from("workers")
      .insert(workerData)
      .select()
      .single();

    if (error) {
      console.error("Database error creating worker:", error);
      throw new Error(`Failed to create worker: ${error.message}`);
    }

    return data;
  },

  // Update existing worker
  async update(id: string, updates: Partial<{
    email: string;
    name: string;
    phone: string;
    role: string;
    status: string;
  }>) {
    const { data, error } = await supabase
      .from("workers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error updating worker:", error);
      throw new Error(`Failed to update worker: ${error.message}`);
    }

    return data;
  },

  // Delete worker
  async delete(id: string) {
    const { error } = await supabase
      .from("workers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error deleting worker:", error);
      throw new Error(`Failed to delete worker: ${error.message}`);
    }

    return true;
  },

  // Get worker statistics
  async getStats() {
    const { count: totalCount } = await supabase
      .from("workers")
      .select("*", { count: "exact", head: true });

    const { count: activeCount } = await supabase
      .from("workers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    return {
      total: totalCount || 0,
      active: activeCount || 0,
      inactive: (totalCount || 0) - (activeCount || 0),
    };
  },
};
