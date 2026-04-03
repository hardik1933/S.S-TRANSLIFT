# 📚 GitHub Setup Guide

Complete guide to push your S.S. Translift TMS project to GitHub.

## 🎯 Prerequisites

- Git installed on your computer
- GitHub account created
- Project completed locally

---

## 📝 Step-by-Step Instructions

### 1. Create a GitHub Repository

#### Option A: Via GitHub Website

1. Go to [github.com](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in the details:
   ```
   Repository name: ss-translift-tms
   Description: Modern SaaS logistics platform for S.S. Translift container transport services
   Visibility: Public (or Private if you prefer)
   ☐ Add a README file (uncheck this - we already have one)
   ☐ Add .gitignore (uncheck - we have one)
   ☐ Choose a license (uncheck - we have MIT license)
   ```
4. Click **Create repository**
5. **Keep this page open** - you'll need the commands shown

#### Option B: Via GitHub CLI

```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create ss-translift-tms --public --description "Modern SaaS logistics platform for S.S. Translift container transport services"
```

---

### 2. Initialize Git in Your Project

Open your terminal and navigate to your project folder:

```bash
cd /path/to/ss-translift-tms
```

Initialize Git repository:

```bash
git init
```

---

### 3. Configure Git (First Time Only)

If you haven't set up Git before:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### 4. Review Files to Commit

Before committing, check what will be tracked:

```bash
git status
```

You should see all project files in red (untracked).

---

### 5. Add Files to Git

Add all files to staging:

```bash
git add .
```

Verify files are staged:

```bash
git status
```

Files should now be green (staged).

---

### 6. Create Your First Commit

```bash
git commit -m "Initial commit: Complete S.S. Translift TMS v1.0.0

- Admin dashboard with analytics
- Worker portal with job management
- Transport request management system
- Excel export functionality
- Professional slate-based design
- Supabase backend integration
- Dark mode support
- Responsive design for all devices"
```

---

### 7. Add Remote Repository

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ss-translift-tms.git
```

Verify remote was added:

```bash
git remote -v
```

---

### 8. Create and Switch to Main Branch

```bash
git branch -M main
```

---

### 9. Push to GitHub

```bash
git push -u origin main
```

You may be prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)

#### Creating a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "SS Translift TMS"
4. Select scopes: ✅ **repo** (full control)
5. Click "Generate token"
6. **Copy the token** - you won't see it again!
7. Use this token as your password when pushing

---

### 10. Verify Upload

1. Go to your GitHub repository page
2. You should see all your files
3. README.md should display automatically

---

## 🔐 Protecting Sensitive Information

### Important: Update Supabase Credentials

Before making your repo public, you should:

#### Option 1: Use Environment Variables (Recommended)

1. Update `/utils/supabase/info.tsx`:

```typescript
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'your-project-id';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

2. Create `.env.local` (already in .gitignore):

```env
VITE_SUPABASE_PROJECT_ID=your-actual-project-id
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

3. Update `.env.example` with placeholder values

4. Commit and push:

```bash
git add .
git commit -m "feat: use environment variables for Supabase credentials"
git push
```

#### Option 2: Keep Private Repository

If you prefer to keep credentials in code, make sure your repository is **Private**.

---

## 📦 Future Updates

### Making Changes and Pushing Updates

1. **Make your changes** to the code

2. **Check what changed**:
   ```bash
   git status
   ```

3. **Stage changes**:
   ```bash
   git add .
   # or stage specific files:
   git add src/app/pages/AdminDashboard.tsx
   ```

4. **Commit changes**:
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in request management"
   ```

5. **Push to GitHub**:
   ```bash
   git push
   ```

### Commit Message Conventions

Use conventional commits format:

```bash
# New features
git commit -m "feat(admin): add export to PDF functionality"

# Bug fixes
git commit -m "fix(api): resolve CORS error on request creation"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style changes
git commit -m "style(ui): improve button spacing"

# Refactoring
git commit -m "refactor(components): extract common card component"

# Performance improvements
git commit -m "perf(dashboard): optimize chart rendering"

# Tests
git commit -m "test(api): add unit tests for request endpoints"

# Chores (dependencies, config, etc.)
git commit -m "chore(deps): update dependencies"
```

---

## 🌿 Working with Branches

### Create a New Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/new-feature-name

# Make your changes...

# Commit changes
git add .
git commit -m "feat: implement new feature"

# Push branch to GitHub
git push -u origin feature/new-feature-name
```

### Merge Feature into Main

```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature
git merge feature/new-feature-name

# Push to GitHub
git push
```

### Delete Branch After Merging

```bash
# Delete local branch
git branch -d feature/new-feature-name

# Delete remote branch
git push origin --delete feature/new-feature-name
```

---

## 🔄 Syncing with Remote Repository

### Pull Latest Changes

```bash
git pull origin main
```

### Clone Repository on Another Computer

```bash
git clone https://github.com/YOUR_USERNAME/ss-translift-tms.git
cd ss-translift-tms
pnpm install
```

---

## 📋 Useful Git Commands

### Check Repository Status

```bash
git status
```

### View Commit History

```bash
git log
# or prettier version:
git log --oneline --graph --decorate
```

### View Changes

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- filename.tsx

# Unstage files
git reset HEAD filename.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### View Remote URLs

```bash
git remote -v
```

### Change Remote URL

```bash
git remote set-url origin https://github.com/NEW_USERNAME/ss-translift-tms.git
```

---

## 🚀 GitHub Features to Enable

### 1. GitHub Pages (Optional)

Host your documentation:

1. Go to repository **Settings** → **Pages**
2. Source: Deploy from a branch → **main** → **/(root)**
3. Click **Save**

### 2. GitHub Actions

We've included a CI/CD workflow in `.github/workflows/ci.yml` that:
- Runs on every push to main/develop
- Tests build process
- Checks for TypeScript errors
- Runs security audit

No setup needed - it will run automatically!

### 3. Issues & Projects

Enable issue tracking:

1. Go to **Settings** → **Features**
2. Enable **Issues**
3. Enable **Projects** (for project management)

### 4. Branch Protection (Recommended for Teams)

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
5. Click **Create**

---

## 📱 GitHub Desktop (Alternative to Command Line)

If you prefer a GUI:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → Add Local Repository → Select your project folder
4. Make changes → Write commit message → Commit → Push

---

## ❓ Troubleshooting

### Authentication Failed

Use a Personal Access Token instead of password (see Step 9).

### Permission Denied

```bash
# Use HTTPS instead of SSH if you haven't set up SSH keys
git remote set-url origin https://github.com/YOUR_USERNAME/ss-translift-tms.git
```

### Large Files Error

If you have large files:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.pdf"
git lfs track "*.zip"

# Commit and push
git add .gitattributes
git commit -m "chore: add Git LFS tracking"
git push
```

### Merge Conflicts

```bash
# Pull latest changes
git pull origin main

# Fix conflicts in your editor (look for <<<<<<, =======, >>>>>> markers)

# After fixing:
git add .
git commit -m "fix: resolve merge conflicts"
git push
```

---

## 🎓 Learning Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Skills](https://skills.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2) (Free)

---

## ✅ Checklist

Before pushing to GitHub:

- [ ] Reviewed `.gitignore` - sensitive files excluded
- [ ] Updated `package.json` with correct repository URL
- [ ] Checked Supabase credentials handling
- [ ] Tested build locally (`pnpm build`)
- [ ] README.md is complete
- [ ] LICENSE file is present
- [ ] All documentation files included

---

## 🎉 You're All Set!

Your S.S. Translift TMS project is now on GitHub!

**Next Steps:**
1. Add collaborators if working with a team
2. Set up Supabase (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
3. Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))
4. Share your repository URL with others

**Repository URL:**
```
https://github.com/YOUR_USERNAME/ss-translift-tms
```

---

**Happy Coding! 🚀**
