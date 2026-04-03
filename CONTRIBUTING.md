# Contributing to S.S. Translift TMS

Thank you for your interest in contributing to the S.S. Translift Transport Management System! 🚢

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ss-translift-tms.git
cd ss-translift-tms
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ss-translift-tms.git
```

### 4. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 5. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

## 💻 Development Process

### Running the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Project Structure

```
src/
├── app/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context
│   └── routes.ts      # Routing configuration
├── styles/            # Global styles
└── utils/             # Utility functions

supabase/
└── functions/
    └── server/        # Backend API
```

### Making Changes

1. **Write clean, readable code**
2. **Follow existing patterns**
3. **Add comments for complex logic**
4. **Test your changes thoroughly**

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type

```typescript
// ✅ Good
interface TransportRequest {
  id: string;
  customerName: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed';
}

// ❌ Bad
const request: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks

```typescript
// ✅ Good
export function RequestCard({ request }: { request: TransportRequest }) {
  return <Card>...</Card>;
}

// ❌ Bad
export function RequestCard(props: any) {
  return <div>...</div>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure responsive design (mobile-first)

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `TransportRequestForm.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Hooks: `use` prefix (e.g., `useTransportRequests.ts`)

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(admin): add customer export functionality

Add Excel export button to admin dashboard that exports all customer data with comprehensive details including names, companies, and request counts.

Closes #123
```

```bash
fix(api): resolve CORS error on request creation

Updated CORS configuration in edge function to allow Content-Type header.
```

```bash
docs(readme): update installation instructions

Added detailed steps for Supabase setup and deployment.
```

## 🔄 Pull Request Process

### 1. Update Your Fork

Before creating a PR, sync with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 2. Rebase Your Branch

```bash
git checkout feature/your-feature-name
git rebase main
```

### 3. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 4. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings or errors
```

### 5. Code Review

- Address review feedback promptly
- Make requested changes
- Push updates to the same branch

### 6. Merge

Once approved, maintainers will merge your PR.

## 🧪 Testing

### Manual Testing

Before submitting a PR:

1. **Test all affected features**
2. **Test on different screen sizes** (mobile, tablet, desktop)
3. **Test in dark mode**
4. **Test with different data scenarios**

### Testing Checklist

- [ ] Login/Logout works
- [ ] Forms validate correctly
- [ ] API calls succeed
- [ ] Error handling works
- [ ] UI is responsive
- [ ] Dark mode works
- [ ] No console errors

## 🐛 Bug Reports

### Before Submitting

- Check existing issues
- Verify it's reproducible
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution**
What you want to happen.

**Describe alternatives**
Alternative solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## ❓ Questions?

- Open a GitHub Discussion
- Email: support@sstranslift.com

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
