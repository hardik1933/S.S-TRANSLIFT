# 🗂️ Database Schema Documentation

Complete schema reference for S.S. Translift TMS database.

---

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        WORKERS                          │
├─────────────────────────────────────────────────────────┤
│ 🔑 id                 UUID (PK)                         │
│ 📧 email              TEXT (UNIQUE, NOT NULL)           │
│ 👤 name               TEXT (NOT NULL)                   │
│ 📱 phone              TEXT                              │
│ 🎭 role               TEXT (admin/worker)               │
│ ⚡ status             TEXT (active/inactive)            │
│ 📅 created_at         TIMESTAMP                         │
│ 🔄 updated_at         TIMESTAMP                         │
└─────────────────────────────────────────────────────────┘
                              │
                              │ 1:N (assigned_worker_id)
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  TRANSPORT_REQUESTS                     │
├─────────────────────────────────────────────────────────┤
│ 🔑 id                 UUID (PK)                         │
│                                                         │
│ ╔═══════════════════════════════════════════════════╗ │
│ ║         CUSTOMER INFORMATION                      ║ │
│ ╠═══════════════════════════════════════════════════╣ │
│ ║ customer_name       TEXT (NOT NULL)               ║ │
│ ║ company_name        TEXT                          ║ │
│ ║ phone_number        TEXT (NOT NULL)               ║ │
│ ║ email               TEXT                          ║ │
│ ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│ ╔═══════════════════════════════════════════════════╗ │
│ ║         CONTAINER INFORMATION                     ║ │
│ ╠═══════════════════════════════════════════════════╣ │
│ ║ container_type      TEXT (NOT NULL)               ║ │
│ ║   Options:                                        ║ │
│ ║   • 20-Foot Standard                              ║ │
│ ║   • 40-Foot Standard                              ║ │
│ ║   • 40-Foot High Cube                             ║ │
│ ║   • Reefer Container                              ║ │
│ ║   • Flat Rack Container                           ║ │
│ ║   • ODC (Over Dimensional Cargo)                  ║ │
│ ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│ ╔═══════════════════════════════════════════════════╗ │
│ ║         LOCATION & SCHEDULING                     ║ │
│ ╠═══════════════════════════════════════════════════╣ │
│ ║ pickup_location     TEXT (NOT NULL)               ║ │
│ ║ delivery_location   TEXT (NOT NULL)               ║ │
│ ║ pickup_date         DATE (NOT NULL)               ║ │
│ ║ delivery_date       DATE                          ║ │
│ ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│ ╔═══════════════════════════════════════════════════╗ │
│ ║         ADDITIONAL DETAILS                        ║ │
│ ╠═══════════════════════════════════════════════════╣ │
│ ║ special_instructions TEXT                         ║ │
│ ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│ ╔═══════════════════════════════════════════════════╗ │
│ ║         STATUS & ASSIGNMENT                       ║ │
│ ╠═══════════════════════════════════════════════════╣ │
│ ║ status              TEXT (DEFAULT 'Pending')      ║ │
│ ║   Options:                                        ║ │
│ ║   • Pending                                       ║ │
│ ║   • Approved                                      ║ │
│ ║   • In Progress                                   ║ │
│ ║   • Completed                                     ║ │
│ ║   • Cancelled                                     ║ │
│ ║                                                   ║ │
│ ║ 🔗 assigned_worker_id UUID (FK → workers.id)      ║ │
│ ╚═══════════════════════════════════════════════════╝ │
│                                                         │
│ 📅 created_at         TIMESTAMP                         │
│ 🔄 updated_at         TIMESTAMP                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Table Details

### 1️⃣ WORKERS Table

**Purpose:** Stores information about all workers and administrators in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `email` | TEXT | UNIQUE, NOT NULL | Worker's email (login) |
| `name` | TEXT | NOT NULL | Full name |
| `phone` | TEXT | - | Contact number |
| `role` | TEXT | CHECK ('admin', 'worker'), DEFAULT 'worker' | User role |
| `status` | TEXT | CHECK ('active', 'inactive'), DEFAULT 'active' | Account status |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_workers_email` - Unique index on email
- `idx_workers_role` - For role-based queries
- `idx_workers_status` - For status filtering

**Sample Data:**
```sql
email: admin@sstranslift.com, role: admin, status: active
email: worker1@sstranslift.com, role: worker, status: active
```

**Triggers:**
- `update_workers_updated_at` - Auto-updates `updated_at` on every UPDATE

---

### 2️⃣ TRANSPORT_REQUESTS Table

**Purpose:** Stores all container transport requests with customer and shipment details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| **Customer Information** ||||
| `customer_name` | TEXT | NOT NULL | Customer's name |
| `company_name` | TEXT | - | Company name (optional) |
| `phone_number` | TEXT | NOT NULL | Contact number |
| `email` | TEXT | - | Email address (optional) |
| **Container Details** ||||
| `container_type` | TEXT | NOT NULL, CHECK (6 types) | Container type |
| **Locations** ||||
| `pickup_location` | TEXT | NOT NULL | Pickup address/port |
| `delivery_location` | TEXT | NOT NULL | Delivery address |
| **Scheduling** ||||
| `pickup_date` | DATE | NOT NULL | Scheduled pickup date |
| `delivery_date` | DATE | - | Expected delivery date |
| **Additional** ||||
| `special_instructions` | TEXT | - | Special handling notes |
| **Status** ||||
| `status` | TEXT | CHECK (5 statuses), DEFAULT 'Pending' | Current status |
| `assigned_worker_id` | UUID | FK to workers(id), ON DELETE SET NULL | Assigned worker |
| **Metadata** ||||
| `created_at` | TIMESTAMP | DEFAULT NOW() | Request creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Foreign Keys:**
- `assigned_worker_id` → `workers(id)` (ON DELETE SET NULL)

**Indexes:**
- `idx_requests_status` - Filter by status
- `idx_requests_created_at` - Sort by date (DESC)
- `idx_requests_customer_name` - Search customers
- `idx_requests_container_type` - Filter by type
- `idx_requests_pickup_date` - Filter by date
- `idx_requests_assigned_worker` - Filter by worker

**Check Constraints:**

Container Types:
```
'20-Foot Standard'
'40-Foot Standard'
'40-Foot High Cube'
'Reefer Container'
'Flat Rack Container'
'ODC (Over Dimensional Cargo)'
```

Status Values:
```
'Pending'
'Approved'
'In Progress'
'Completed'
'Cancelled'
```

**Triggers:**
- `update_transport_requests_updated_at` - Auto-updates `updated_at` on every UPDATE

---

## 🔗 Relationships

### One-to-Many: Workers → Transport Requests

```
workers (1) ──────────── (N) transport_requests
   id       ←──────────  assigned_worker_id
```

**Description:**
- One worker can be assigned to multiple transport requests
- One transport request can have only one assigned worker
- If a worker is deleted, `assigned_worker_id` is set to NULL (not cascade delete)

**Query Example:**
```sql
SELECT 
  w.name as worker_name,
  COUNT(tr.id) as total_requests,
  COUNT(CASE WHEN tr.status = 'Completed' THEN 1 END) as completed
FROM workers w
LEFT JOIN transport_requests tr ON w.id = tr.assigned_worker_id
WHERE w.status = 'active'
GROUP BY w.id, w.name;
```

---

## 🔐 Row Level Security (RLS)

### Current Policies (Development Mode)

**Workers Table:**
```sql
Policy Name: "Enable read access for all users"
Operation: SELECT
Using: true (allow all)

Policy Name: "Enable insert access for all users"
Operation: INSERT
With Check: true (allow all)

Policy Name: "Enable update access for all users"
Operation: UPDATE
Using: true (allow all)

Policy Name: "Enable delete access for all users"
Operation: DELETE
Using: true (allow all)
```

**Transport Requests Table:**
```sql
Same permissive policies as Workers table
```

### Recommended Production Policies

**Workers (Admin Only Access):**
```sql
-- Only admins can manage workers
CREATE POLICY "Admins manage workers" ON workers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workers 
      WHERE id = auth.uid()::uuid 
      AND role = 'admin'
    )
  );
```

**Transport Requests (Role-Based):**
```sql
-- Workers see only their assigned requests
CREATE POLICY "Workers see assigned requests" ON transport_requests
  FOR SELECT
  USING (
    assigned_worker_id = auth.uid()::uuid
    OR EXISTS (
      SELECT 1 FROM workers 
      WHERE id = auth.uid()::uuid 
      AND role = 'admin'
    )
  );

-- Only admins can delete
CREATE POLICY "Only admins delete" ON transport_requests
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workers 
      WHERE id = auth.uid()::uuid 
      AND role = 'admin'
    )
  );
```

---

## 📊 Common Queries

### Get All Pending Requests

```sql
SELECT * FROM transport_requests 
WHERE status = 'Pending' 
ORDER BY pickup_date ASC;
```

### Get Worker's Assigned Requests

```sql
SELECT 
  tr.*,
  w.name as worker_name
FROM transport_requests tr
JOIN workers w ON tr.assigned_worker_id = w.id
WHERE w.email = 'worker1@sstranslift.com'
ORDER BY tr.pickup_date;
```

### Get Statistics by Status

```sql
SELECT 
  status,
  COUNT(*) as count
FROM transport_requests 
GROUP BY status;
```

### Get Active Workers with Request Count

```sql
SELECT 
  w.id,
  w.name,
  w.email,
  COUNT(tr.id) as total_assigned,
  COUNT(CASE WHEN tr.status = 'In Progress' THEN 1 END) as in_progress
FROM workers w
LEFT JOIN transport_requests tr ON w.id = tr.assigned_worker_id
WHERE w.status = 'active'
GROUP BY w.id, w.name, w.email
ORDER BY total_assigned DESC;
```

### Get Requests by Date Range

```sql
SELECT * FROM transport_requests 
WHERE pickup_date BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY pickup_date;
```

### Search by Customer

```sql
SELECT * FROM transport_requests 
WHERE customer_name ILIKE '%kumar%' 
   OR company_name ILIKE '%kumar%'
ORDER BY created_at DESC;
```

---

## 🎯 Data Validation

### Container Type Validation

Only these 6 types are allowed:
1. 20-Foot Standard
2. 40-Foot Standard
3. 40-Foot High Cube
4. Reefer Container
5. Flat Rack Container
6. ODC (Over Dimensional Cargo)

Attempting to insert other types will raise an error.

### Status Flow Validation

Recommended status progression:
```
Pending → Approved → In Progress → Completed
                ↓
            Cancelled (from any status)
```

### Role Validation

Only 2 roles allowed:
- `admin` - Full access
- `worker` - Limited access

### Status Validation

Only 2 statuses for workers:
- `active` - Can work
- `inactive` - Cannot be assigned

---

## 🔄 Automatic Behaviors

### Auto-Generated UUIDs

Both tables use `uuid_generate_v4()` for primary keys.

### Auto-Timestamps

- `created_at` is set automatically on INSERT
- `updated_at` is updated automatically on UPDATE via trigger

### Foreign Key Behavior

When a worker is deleted:
```sql
ON DELETE SET NULL
```
This means assigned requests won't be deleted, just unassigned.

---

## 📈 Performance Tips

### Use Indexes

All common filter fields have indexes:
- Status
- Dates
- Customer name
- Container type
- Assigned worker

### Optimize Queries

**Good:**
```sql
SELECT * FROM transport_requests WHERE status = 'Pending';
-- Uses idx_requests_status
```

**Bad:**
```sql
SELECT * FROM transport_requests 
WHERE LOWER(status) = 'pending';
-- Cannot use index due to function on column
```

### Limit Results

Always use `LIMIT` for large datasets:
```sql
SELECT * FROM transport_requests 
ORDER BY created_at DESC 
LIMIT 50;
```

---

## 🛠️ Maintenance

### Analyze Tables

```sql
ANALYZE workers;
ANALYZE transport_requests;
```

### Vacuum Tables

```sql
VACUUM ANALYZE workers;
VACUUM ANALYZE transport_requests;
```

### Check Table Sizes

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📚 Additional Resources

- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [UUID Best Practices](https://www.postgresql.org/docs/current/uuid-ossp.html)
- [Indexing Strategies](https://www.postgresql.org/docs/current/indexes.html)

---

**Schema Version:** 1.0.0  
**Last Updated:** March 7, 2026  
**Total Tables:** 2  
**Total Indexes:** 10  
**Total Triggers:** 2
