# Kashpages Development Workflow

## Repository Structure

```
kashpages-production/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── features/           # Feature modules
│   ├── lib/                # Utilities & configs
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
├── public/                 # Static assets
├── tests/                  # Test files
├── firestore.rules         # Firestore security
├── firestore.indexes.json  # Firestore indexes
├── storage.rules           # Storage security
├── .env.example            # Environment template
└── package.json
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Firebase CLI
- VS Code (recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/Burhan-sheikh/kashpages-production.git
cd kashpages-production

# Install dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..

# Copy environment template
cp .env.example .env.local

# Configure Firebase
firebase login
firebase use kashpages-prod
```

### Environment Configuration

Edit `.env.local` with your Firebase credentials:

```env
# Get these from Firebase Console > Project Settings
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (from service account JSON)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"

# Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Development Commands

### Core Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Firebase Functions

```bash
# Build functions
cd functions && npm run build

# Watch functions
cd functions && npm run watch

# Test functions locally
cd functions && npm run serve

# Deploy functions
cd functions && npm run deploy

# View function logs
cd functions && npm run logs
```

### Firebase Emulators

```bash
# Start all emulators
firebase emulators:start

# Start specific emulators
firebase emulators:start --only firestore,auth

# Export emulator data
firebase emulators:export ./emulator-data

# Import emulator data
firebase emulators:start --import=./emulator-data
```

### Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## Git Workflow

### Branch Strategy

```
main          → Production (protected)
develop       → Staging (protected)
feature/*     → New features
bugfix/*      → Bug fixes
hotfix/*      → Production hotfixes
```

### Creating a Feature

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/user-authentication

# Create Pull Request to develop
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Add or update tests
chore: Maintenance tasks
perf: Performance improvements
```

Examples:

```bash
git commit -m "feat: add page builder drag and drop"
git commit -m "fix: resolve payment verification issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify authentication flow"
```

### Pull Request Process

1. **Create PR** against `develop` branch
2. **Fill PR template** with description and checklist
3. **Ensure CI passes** (lint, test, build)
4. **Request review** from team member
5. **Address feedback** and push changes
6. **Squash and merge** when approved

---

## Code Standards

### TypeScript

**Always use strict typing:**

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ Bad
const getUser = async (id: any) => {
  // implementation
};
```

### Component Structure

**Organize components consistently:**

```typescript
// ComponentName.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { ComponentProps } from './types';

interface Props {
  title: string;
  onSave: () => void;
}

export const ComponentName = ({ title, onSave }: Props) => {
  const [state, setState] = useState('');
  
  const handleAction = () => {
    // logic
  };
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};
```

### File Naming

```
PascalCase:  Components, Types, Interfaces
camelCase:   Functions, Variables, Hooks
kebab-case:  Files (except components), URLs, CSS
SNAKE_CASE:  Constants, Environment Variables
```

Examples:

```
PageBuilder.tsx        → Component
useAutosave.ts         → Hook
page-service.ts        → Service
types.ts               → Types
MAX_FILE_SIZE          → Constant
```

### Import Order

```typescript
// 1. External dependencies
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Internal modules
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Types
import type { User } from '@/types/user';

// 4. Styles
import './styles.css';
```

---

## Testing Guidelines

### Unit Tests

**Test individual functions and components:**

```typescript
// sanitize.test.ts
import { sanitizeContent } from '@/lib/security/sanitize';

describe('sanitizeContent', () => {
  it('removes script tags', () => {
    const input = '<p>Hello <script>alert("xss")</script></p>';
    const output = sanitizeContent(input);
    expect(output).not.toContain('<script>');
  });
  
  it('preserves safe HTML', () => {
    const input = '<p><strong>Bold</strong> text</p>';
    const output = sanitizeContent(input);
    expect(output).toContain('<strong>');
  });
});
```

### Integration Tests

**Test feature workflows:**

```typescript
// page-creation.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePage from '@/app/dashboard/pages/create/page';

describe('Page Creation', () => {
  it('creates page from template', async () => {
    render(<CreatePage />);
    
    await userEvent.click(screen.getByText('Creative Agency'));
    await userEvent.type(screen.getByLabelText('Title'), 'My Agency');
    await userEvent.click(screen.getByText('Create Page'));
    
    await waitFor(() => {
      expect(window.location.pathname).toMatch(/\/builder\//);
    });
  });
});
```

### E2E Tests

**Test complete user journeys:**

```typescript
// signup-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete signup and create first page', async ({ page }) => {
  // Sign up
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  // Create page
  await expect(page).toHaveURL(/\/dashboard/);
  await page.click('text=Create Page');
  await page.click('text=Creative Agency');
  await page.fill('input[name="title"]', 'My Business');
  await page.click('text=Create');
  
  // Verify builder opened
  await expect(page).toHaveURL(/\/builder\//);
  await expect(page.locator('.builder-canvas')).toBeVisible();
});
```

---

## Firebase Development

### Firestore Rules Testing

```bash
# Test rules locally
firebase emulators:start --only firestore

# Run rules tests
npm run test:rules
```

```javascript
// firestore-rules.test.js
const { assertSucceeds, assertFails } = require('@firebase/rules-unit-testing');

test('user can read own page', async () => {
  const db = getFirestore(myAuth);
  await assertSucceeds(db.collection('pages').doc('page123').get());
});

test('user cannot read other user page', async () => {
  const db = getFirestore(theirAuth);
  await assertFails(db.collection('pages').doc('page123').get());
});
```

### Cloud Functions Development

```bash
# Local testing
cd functions
npm run serve

# Call function locally
curl http://localhost:5001/kashpages-prod/us-central1/functionName

# View logs
npm run logs
```

---

## Deployment

### Staging Deployment

```bash
# Push to develop branch
git checkout develop
git merge feature/my-feature
git push origin develop

# CI/CD automatically deploys to staging
# URL: https://staging.kashpages.com
```

### Production Deployment

```bash
# Create release PR: develop → main
# After approval and merge, CI/CD deploys to production
# URL: https://kashpages.com
```

### Manual Deployment

**Next.js (Vercel):**

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

**Firebase Functions:**

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:functionName

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy
```

---

## Monitoring & Debugging

### Local Debugging

**VS Code Launch Configuration:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Production Monitoring

**View logs:**

```bash
# Vercel logs
vercel logs

# Firebase Function logs
firebase functions:log

# Firestore logs
firebase firestore:logs
```

**Error tracking:**

- Sentry for error monitoring
- Firebase Crashlytics for mobile
- Google Analytics for user tracking

---

## Common Issues

### Build Errors

**Issue:** "Module not found"

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue:** Type errors

```bash
# Regenerate types
npm run type-check
```

### Firebase Errors

**Issue:** "Permission denied"

```bash
# Check Firestore rules
firebase deploy --only firestore:rules

# Verify authentication
firebase login
```

**Issue:** "Function timeout"

```javascript
// Increase timeout in function config
export const myFunction = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onCall(async (data) => {
    // implementation
  });
```

---

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle
npm run analyze

# Check bundle size
npm run build -- --profile
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const BuilderCanvas = dynamic(
  () => import('@/features/builder/BuilderCanvas'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

---

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Internal Guides

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

---

## Getting Help

### Issues

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Search existing GitHub issues
3. Create new issue with template

### Communication

- GitHub Issues: Bug reports, feature requests
- GitHub Discussions: Questions, ideas
- Code Reviews: Pull requests

---

**Happy coding! Build something amazing for Kashmir! 🚀**
