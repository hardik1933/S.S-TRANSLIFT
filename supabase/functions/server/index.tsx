import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { requests, workers } from "./db.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b414255c/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== TRANSPORT REQUESTS API ====================

// Get all transport requests with optional filtering
app.get("/make-server-b414255c/requests", async (c) => {
  try {
    const status = c.req.query("status");
    const assigned_worker_id = c.req.query("assigned_worker_id");
    const from_date = c.req.query("from_date");
    const to_date = c.req.query("to_date");

    const filters: Record<string, string> = {};
    if (status) filters.status = status;
    if (assigned_worker_id) filters.assigned_worker_id = assigned_worker_id;
    if (from_date) filters.from_date = from_date;
    if (to_date) filters.to_date = to_date;

    const data = await requests.getAll(Object.keys(filters).length > 0 ? filters : undefined);
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch requests" 
    }, 500);
  }
});

// Get single transport request
app.get("/make-server-b414255c/requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await requests.getById(id);
    
    if (!data) {
      return c.json({ success: false, error: "Request not found" }, 404);
    }
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching request:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch request" 
    }, 500);
  }
});

// Create new transport request
app.post("/make-server-b414255c/requests", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    const requiredFields = ['customer_name', 'phone_number', 'container_type', 'pickup_location', 'delivery_location', 'pickup_date'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return c.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, 400);
    }
    
    const data = await requests.create(body);
    
    return c.json({ success: true, data }, 201);
  } catch (error) {
    console.error("Error creating request:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create request" 
    }, 500);
  }
});

// Update transport request
app.put("/make-server-b414255c/requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    // Check if request exists
    const existing = await requests.getById(id);
    if (!existing) {
      return c.json({ success: false, error: "Request not found" }, 404);
    }
    
    const data = await requests.update(id, body);
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error updating request:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update request" 
    }, 500);
  }
});

// Delete transport request
app.delete("/make-server-b414255c/requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Check if request exists
    const existing = await requests.getById(id);
    if (!existing) {
      return c.json({ success: false, error: "Request not found" }, 404);
    }
    
    await requests.delete(id);
    
    return c.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete request" 
    }, 500);
  }
});

// Get request statistics
app.get("/make-server-b414255c/requests/stats/summary", async (c) => {
  try {
    const data = await requests.getStats();
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching request stats:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch statistics" 
    }, 500);
  }
});

// ==================== WORKERS API ====================

// Get all workers with optional filtering
app.get("/make-server-b414255c/workers", async (c) => {
  try {
    const role = c.req.query("role");
    const status = c.req.query("status");

    const filters: Record<string, string> = {};
    if (role) filters.role = role;
    if (status) filters.status = status;

    const data = await workers.getAll(Object.keys(filters).length > 0 ? filters : undefined);
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch workers" 
    }, 500);
  }
});

// Get single worker
app.get("/make-server-b414255c/workers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const data = await workers.getById(id);
    
    if (!data) {
      return c.json({ success: false, error: "Worker not found" }, 404);
    }
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching worker:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch worker" 
    }, 500);
  }
});

// Create new worker
app.post("/make-server-b414255c/workers", async (c) => {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    const requiredFields = ['email', 'name'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return c.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, 400);
    }
    
    // Check if email already exists
    const existing = await workers.getByEmail(body.email);
    if (existing) {
      return c.json({ 
        success: false, 
        error: "A worker with this email already exists" 
      }, 409);
    }
    
    const data = await workers.create(body);
    
    return c.json({ success: true, data }, 201);
  } catch (error) {
    console.error("Error creating worker:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create worker" 
    }, 500);
  }
});

// Update worker
app.put("/make-server-b414255c/workers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    // Check if worker exists
    const existing = await workers.getById(id);
    if (!existing) {
      return c.json({ success: false, error: "Worker not found" }, 404);
    }
    
    // If email is being updated, check for conflicts
    if (body.email && body.email !== existing.email) {
      const emailExists = await workers.getByEmail(body.email);
      if (emailExists) {
        return c.json({ 
          success: false, 
          error: "A worker with this email already exists" 
        }, 409);
      }
    }
    
    const data = await workers.update(id, body);
    
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error updating worker:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update worker" 
    }, 500);
  }
});

// Delete worker
app.delete("/make-server-b414255c/workers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Check if worker exists
    const existing = await workers.getById(id);
    if (!existing) {
      return c.json({ success: false, error: "Worker not found" }, 404);
    }
    
    await workers.delete(id);
    
    return c.json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    console.error("Error deleting worker:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete worker" 
    }, 500);
  }
});

// Get worker statistics
app.get("/make-server-b414255c/workers/stats/summary", async (c) => {
  try {
    const data = await workers.getStats();
    return c.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching worker stats:", error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch statistics" 
    }, 500);
  }
});

Deno.serve(app.fetch);