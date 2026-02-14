# Kashpages Production - Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project
- GitHub account (for CI/CD)

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Burhan-sheikh/kashpages-production.git
cd kashpages-production
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

#### Development Environment

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your Firebase configuration:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Platform Configuration
NEXT_PUBLIC_PLATFORM_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_NAME=Kashpages

# Feature Flags
NEXT_PUBLIC_AI_ENABLED=false
NEXT_PUBLIC_CUSTOM_DOMAIN_ENABLED=false
```

#### Production Environment

Create `.env.production` file:

```bash
cp .env.example .env.production
```

Update with production values:

```env
# Production Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kashpages.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kashpages-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kashpages-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=prod_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=prod_measurement_id

# Production Platform Configuration
NEXT_PUBLIC_PLATFORM_URL=https://kashpages.com
NEXT_PUBLIC_PLATFORM_NAME=Kashpages

# Production Feature Flags
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_CUSTOM_DOMAIN_ENABLED=true
```

---

## 🔥 Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `kashpages-production`
3. Enable Google Analytics (optional)
4. Register web app

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Google
   - Phone (optional, requires billing)

### 3. Create Firestore Database

1. Go to Firestore Database
2. Create database in **production mode**
3. Choose location: `asia-south1` (Mumbai) for better latency
4. Deploy security rules:

```bash
firebase deploy --only firestore:rules
```

### 4. Create Realtime Database

1. Go to Realtime Database
2. Create database
3. Choose location: Same as Firestore
4. Deploy rules:

```bash
firebase deploy --only database
```

### 5. Setup Storage

1. Go to Storage
2. Get started
3. Choose location: Same as Firestore
4. Deploy rules:

```bash
firebase deploy --only storage
```

### 6. Enable Firebase Functions

```bash
firebase init functions
```

Select:
- TypeScript
- ESLint
- Install dependencies

### 7. Setup Firebase Data Connect (PostgreSQL)

1. Go to Firebase Console → Data Connect
2. Enable PostgreSQL instance
3. Choose region: `asia-south1`
4. Configure connection settings
5. Deploy schema:

```bash
firebase deploy --only dataconnect
```

### 8. Firebase Admin SDK

For server-side operations, generate service account key:

1. Go to Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file
4. Store securely (NEVER commit to Git)
5. Set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

---

## 🏗️ Database Initialization

### 1. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

### 2. Seed Templates

Run the template seeding script:

```bash
npm run seed:templates
```

This will:
- Create 50 production-ready templates
- Organize by 7 categories
- Set proper plan access levels
- Add preview images

### 3. Create Admin User

Manually create first admin:

1. Sign up through the app
2. Get user UID from Firebase Console
3. Update Firestore:

```javascript
// In Firebase Console → Firestore
db.collection('users').doc('USER_UID').update({
  role: 'admin',
  status: 'active'
});
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Firebase Emulators (Recommended)

Run local Firebase emulators:

```bash
npm run firebase:emulators
```

Emulators run on:
- Auth: http://localhost:9099
- Firestore: http://localhost:8080
- Realtime Database: http://localhost:9000
- Storage: http://localhost:9199
- Functions: http://localhost:5001

Update `.env.local` to use emulators:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### Code Quality

```bash
# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🌐 Deployment

### Vercel Deployment (Recommended for Next.js)

#### Initial Setup

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login:

```bash
vercel login
```

3. Link project:

```bash
vercel link
```

4. Configure environment variables in Vercel Dashboard:
   - Settings → Environment Variables
   - Add all variables from `.env.production`

#### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Firebase Hosting Deployment

#### Build for Production

```bash
npm run build
```

#### Deploy to Firebase Hosting

```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### GitHub Actions CI/CD

CI/CD is configured in `.github/workflows/`

#### Setup Secrets

Add to GitHub repository secrets:

1. `FIREBASE_SERVICE_ACCOUNT` - Service account JSON
2. `VERCEL_TOKEN` - Vercel deployment token
3. `VERCEL_ORG_ID` - Organization ID
4. `VERCEL_PROJECT_ID` - Project ID

#### Auto Deploy

- **Push to `main`** → Production deployment
- **Push to `develop`** → Staging deployment
- **Pull Request** → Preview deployment + tests

---

## 🔐 Security Configuration

### 1. Firestore Security Rules

Rules are deployed automatically, but verify:

```bash
firebase deploy --only firestore:rules
```

Test rules:

```bash
firebase emulators:start
# Run test suite against emulators
```

### 2. Storage Security Rules

```bash
firebase deploy --only storage
```

### 3. Environment Variables

**NEVER commit:**
- `.env.local`
- `.env.production`
- Service account keys
- API keys
- Payment credentials

**Always use:**
- Vercel/Firebase environment variables
- GitHub Secrets for CI/CD

### 4. Rate Limiting

Configure in `src/middleware.ts`:

```typescript
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

---

## 💳 Payment Gateway Setup

### Cashfree Configuration

1. Go to Admin Panel → Settings → Payment
2. Add Cashfree credentials:
   - App ID
   - Secret Key
   - Webhook Secret

### Razorpay Configuration

1. Same admin panel location
2. Add Razorpay credentials:
   - Key ID
   - Key Secret
   - Webhook Secret

**Important:** These are stored in Firestore `systemSettings` collection and accessed server-side only.

---

## 🌍 Custom Domain Setup

### Platform Domain

1. Configure in Vercel or Firebase Hosting
2. Add custom domain: `kashpages.com`
3. Configure DNS:

```
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com
```

### User Custom Domains

1. Verify DNS programmatically (handled by platform)
2. Provision SSL certificates automatically
3. Route requests to correct page

**CNAME Target:** `cname.kashpages.com`

---

## 📊 Monitoring & Analytics

### Firebase Analytics

Automatically enabled with Measurement ID

### Error Tracking

Integrate Sentry (optional):

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`

### Performance Monitoring

Enable in Firebase Console → Performance

---

## 🔄 Database Migrations

### Adding New Fields

1. Update TypeScript types in `src/types/`
2. Update Firestore rules
3. Deploy rules: `firebase deploy --only firestore:rules`
4. Run migration script if needed

### Example Migration Script

```typescript
// scripts/migrations/add-field.ts
import { db } from '@/lib/firebase-admin';

async function migrate() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      newField: 'defaultValue',
      updatedAt: new Date()
    });
  });
  
  await batch.commit();
  console.log('Migration complete');
}

migrate();
```

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

### Firebase Connection Issues

1. Check environment variables
2. Verify Firebase project ID
3. Check security rules
4. Review Firebase Console logs

### Deployment Failures

1. Check build logs in Vercel/Firebase
2. Verify environment variables
3. Test build locally: `npm run build`
4. Check quota limits

### Performance Issues

1. Enable Next.js Analytics
2. Check Firestore indexes
3. Review component rendering
4. Optimize images (use Next.js Image)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🆘 Support

For issues and questions:

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Review [API.md](./docs/API.md)
3. Search GitHub Issues
4. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Firebase services enabled
- [ ] Security rules deployed and tested
- [ ] Templates seeded
- [ ] Admin user created
- [ ] Payment gateways configured
- [ ] Custom domain DNS configured
- [ ] SSL certificates active
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Support contact configured

---

## 🎉 Launch

You're ready to launch when:

1. ✅ Test user can signup
2. ✅ Test user can select template
3. ✅ Test user can customize page
4. ✅ Test user can publish page
5. ✅ Published page is accessible
6. ✅ Payment flow works
7. ✅ Admin panel functional
8. ✅ Custom domain works

**Welcome to production! 🚀**
