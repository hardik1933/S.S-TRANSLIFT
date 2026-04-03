# 📌 Quick Reference Card

**Keep this handy while working with S.S. Translift TMS**

---

## 🔑 Your Credentials

| Item | Value |
|------|-------|
| **Project ID** | `tdybvncpujnnlibfpmth` |
| **Project URL** | `https://tdybvncpujnnlibfpmth.supabase.co` |
| **Anon Key** | Already in `/utils/supabase/info.tsx` |
| **Dashboard** | [Open Dashboard](https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth) |

---

## ⚡ Most Common Commands

### Development
```bash
pnpm dev                 # Start dev server
pnpm build              # Build for production
pnpm preview            # Preview production build
```

### Supabase
```bash
supabase login                                               # Login
supabase link --project-ref tdybvncpujnnlibfpmth            # Link project
supabase functions deploy make-server-b414255c              # Deploy function
supabase functions logs make-server-b414255c                # View logs
```

### Testing
```bash
./test-api.sh           # Run API tests (Linux/Mac)
test-api.bat            # Run API tests (Windows)
```

---

## 🗄️ Database Quick Access

### Tables
- `workers` - 6 sample workers
- `transport_requests` - 12 sample requests

### Quick Queries

**View all workers:**
```sql
SELECT * FROM workers;
```

**View pending requests:**
```sql
SELECT * FROM transport_requests WHERE status = 'Pending';
```

**Count by status:**
```sql
SELECT status, COUNT(*) FROM transport_requests GROUP BY status;
```

---

## 🔌 API Endpoints

**Base URL:** `https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c`

### Requests
```bash
GET  /requests              # Get all
GET  /requests/:id          # Get one
POST /requests              # Create
PUT  /requests/:id          # Update
DELETE /requests/:id        # Delete
GET  /requests/stats/summary # Statistics
```

### Workers
```bash
GET  /workers               # Get all
GET  /workers/:id           # Get one
POST /workers               # Create
PUT  /workers/:id           # Update
DELETE /workers/:id         # Delete
GET  /workers/stats/summary  # Statistics
```

### Health
```bash
GET  /health                # Server status
```

---

## 🧪 Quick Tests

### Health Check
```bash
curl https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c/health
```

### Get All Requests
```bash
curl -X GET \
  "https://tdybvncpujnnlibfpmth.supabase.co/functions/v1/make-server-b414255c/requests" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 📊 Sample Data

### Workers
| Email | Name | Role | Status |
|-------|------|------|--------|
| admin@sstranslift.com | Admin User | admin | active |
| worker1@sstranslift.com | Rajesh Kumar | worker | active |
| worker2@sstranslift.com | Priya Sharma | worker | active |
| worker3@sstranslift.com | Amit Patel | worker | active |
| worker4@sstranslift.com | Sunita Rao | worker | active |
| worker5@sstranslift.com | Vikram Singh | worker | inactive |

### Request Statuses
- **Pending:** 2 requests
- **Approved:** 3 requests
- **In Progress:** 2 requests
- **Completed:** 5 requests

---

## 🎯 Container Types

1. 20-Foot Standard
2. 40-Foot Standard
3. 40-Foot High Cube
4. Reefer Container
5. Flat Rack Container
6. ODC (Over Dimensional Cargo)

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `/src/app/App.tsx` | Main app component |
| `/src/app/routes.ts` | Route configuration |
| `/utils/supabase/info.tsx` | Supabase credentials |
| `/utils/supabase/client.ts` | API helpers |
| `/supabase/functions/server/index.tsx` | Edge function |
| `/supabase/functions/server/db.tsx` | Database helpers |

---

## 🛠️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| No data showing | Run SQL setup script |
| API 500 error | Deploy edge function |
| Can't login to CLI | `supabase login` |
| Function not found | Deploy with correct project ID |
| Port already in use | `pnpm dev --port 3000` |

---

## 📖 Documentation Files

| File | When to Read |
|------|--------------|
| **START_HERE.md** | First time setup |
| **SETUP_NOW.md** | Detailed setup steps |
| **VISUAL_SETUP_GUIDE.md** | Visual walkthrough |
| **DATABASE_SCHEMA.md** | Database structure |
| **DEPLOYMENT_COMMANDS.md** | Command reference |
| **README.md** | Project overview |

---

## 🔗 Quick Links

| Link | URL |
|------|-----|
| Dashboard | https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth |
| SQL Editor | https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth/sql |
| Table Editor | https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth/editor |
| Functions | https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth/functions |
| API Settings | https://supabase.com/dashboard/project/tdybvncpujnnlibfpmth/settings/api |

---

## 💡 Pro Tips

1. **Use TypeScript** - Already configured, use it!
2. **Check logs** - `supabase functions logs make-server-b414255c`
3. **Test locally** - Use `pnpm dev` before deploying
4. **Verify data** - Always check Supabase Table Editor
5. **Keep credentials safe** - Never commit `.env` files

---

## 🎨 Color Palette (Slate/Blue/Emerald/Amber)

```css
/* Primary Colors */
--slate-900: #0f172a    /* Dark backgrounds */
--blue-600:  #2563eb    /* Primary actions */
--emerald-500: #10b981  /* Success states */
--amber-500: #f59e0b    /* Warnings/highlights */

/* Usage */
Background: Slate
Primary Buttons: Blue
Success States: Emerald
Highlights: Amber
```

---

## 📱 Port Numbers

| Service | Port | URL |
|---------|------|-----|
| Dev Server | 5173 | http://localhost:5173 |
| Preview | 4173 | http://localhost:4173 |

---

## 🎯 Common Tasks

### Add New Worker
```sql
INSERT INTO workers (email, name, role, status)
VALUES ('new@sstranslift.com', 'New Worker', 'worker', 'active');
```

### Create Request
```bash
curl -X POST "BASE_URL/requests" \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"...","phone_number":"...","container_type":"...","pickup_location":"...","delivery_location":"...","pickup_date":"..."}'
```

### View Logs
```bash
supabase functions logs make-server-b414255c --project-ref tdybvncpujnnlibfpmth
```

---

## 🚀 Deployment Checklist

- [ ] Database tables created
- [ ] Sample data inserted
- [ ] Edge function deployed
- [ ] Health check passes
- [ ] Frontend builds (`pnpm build`)
- [ ] Preview works (`pnpm preview`)
- [ ] Environment variables set
- [ ] Deploy to hosting

---

## 📞 Support Resources

| Resource | Link |
|----------|------|
| Supabase Docs | https://supabase.com/docs |
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com/docs |
| TypeScript | https://www.typescriptlang.org/docs |

---

## ⚠️ Important Notes

1. **Never commit** the anon key to public repos
2. **Always test** API changes locally first
3. **Backup data** before major changes
4. **Use migrations** for schema changes
5. **Monitor logs** after deployment

---

## ✅ Daily Workflow

```bash
# 1. Start development
pnpm dev

# 2. Make changes to code

# 3. Test changes locally

# 4. If backend changed, deploy:
supabase functions deploy make-server-b414255c

# 5. If frontend changed, build:
pnpm build

# 6. Deploy to hosting (Vercel, Netlify, etc.)
vercel --prod
```

---

**Print this page and keep it on your desk! 📌**

---

*Last updated: March 7, 2026*  
*Project: S.S. Translift TMS*  
*Version: 1.0.0*
