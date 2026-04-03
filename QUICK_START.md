# ⚡ Quick Start Guide

Get S.S. Translift TMS up and running in 5 minutes!

## 🚀 Super Quick Setup (Local Development)

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

### 3. Open Browser

```
http://localhost:5173
```

### 4. Login



---

## ✅ You're Done!

The app is running with mock data. No backend setup required for local testing!

---

## 📦 For Production Deployment

### Quick Supabase Setup (5 steps)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Get Your Credentials**
   - Settings → API
   - Copy **Project ID** and **anon key**

3. **Update Your Code**
   - Edit `/utils/supabase/info.tsx`
   - Paste your credentials

4. **Deploy Edge Function**
   ```bash
   # Install CLI
   npm install -g supabase
   
   # Login
   supabase login
   
   # Deploy
   supabase functions deploy make-server-b414255c --project-ref YOUR_PROJECT_ID
   ```

5. **Deploy Frontend**
   ```bash
   # Build
   pnpm build
   
   # Deploy to Vercel
   npm install -g vercel
   vercel
   ```

### 📚 Detailed Guides

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete Supabase configuration
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - Push to GitHub

---

## 🎯 What Can You Do?

### As Admin

✅ View analytics dashboard  
✅ Manage transport requests  
✅ Track active jobs  
✅ View revenue charts  
✅ Manage workers  
✅ Export data to Excel  
✅ Generate reports  

### As Worker

✅ View personal dashboard  
✅ See assigned jobs  
✅ Submit transport entries  
✅ Update job status  
✅ Track performance  

---

## 🛠️ Common Tasks

### Add a Transport Request

1. Login as any user
2. Click "New Request" or go to Transport Request Form
3. Fill in details:
   - Customer info
   - Container type (20ft, 40ft, Reefer, etc.)
   - Pickup/Delivery locations
   - Date
4. Submit

### Export Customer Data

1. Login as Admin
2. Go to Dashboard
3. Scroll to "Total Customers" card
4. Click "Download Customers"
5. Excel file downloads automatically

### View Reports

1. Login as Admin
2. Click "Reports" in sidebar
3. Select date range
4. View analytics
5. Export to Excel

### Manage Workers

1. Login as Admin
2. Click "Workers" in sidebar
3. View all workers
4. Add/Edit/Deactivate workers

---

## 🎨 Customize the App

### Change Colors

Edit `/src/styles/theme.css`:

```css
:root {
  --primary: #0F172A;  /* Change this */
  --accent: #1E40AF;   /* And this */
}
```

### Change Company Name

Edit these files:
- `/src/app/pages/LandingPage.tsx`
- `/src/app/components/AdminLayout.tsx`
- `/README.md`

### Add New Container Types

Edit `/src/app/pages/TransportRequestForm.tsx`:

```typescript
const containerTypes = [
  '20-Foot Standard',
  '40-Foot Standard',
  'Your New Type', // Add here
];
```

---

## 📱 Mobile Access

The app is fully responsive! Just open on your phone:

```
http://localhost:5173
```

Or after deployment:
```
https://your-app.vercel.app
```

---

## 🔧 Development Scripts

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Clean build cache
pnpm clean
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill
# Then restart
pnpm dev
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
pnpm install
pnpm build
```

### Supabase Connection Issues

1. Check project ID and anon key
2. Verify edge function is deployed
3. Check browser console for errors

### Can't Login

The app uses local mock data by default. Any credentials work for testing!

For production:
- Implement real authentication
- See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for auth setup

---

## 📚 Next Steps

1. ✅ Get familiar with the UI
2. ✅ Test all features
3. ✅ Customize branding
4. ✅ Set up Supabase for production
5. ✅ Deploy to web
6. ✅ Add your team members
7. ✅ Start managing transport!

---

## 🆘 Need Help?

- **README.md** - Full project overview
- **DEPLOYMENT.md** - Deployment instructions
- **SUPABASE_SETUP.md** - Backend setup
- **CONTRIBUTING.md** - How to contribute
- **GitHub Issues** - Report bugs or request features

---

## 🎉 Have Fun!

You're ready to manage container transport like a pro! 🚢📦

**Developed for S.S. Translift, Kalamboli, Navi Mumbai**

---

**Quick Links:**
- [Documentation](README.md)
- [Supabase Setup](SUPABASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [GitHub Setup](GITHUB_SETUP.md)
