# 🚀 KashPages Deployment Guide

Complete guide to deploy KashPages to production.

---

## 📚 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Firebase Setup](#firebase-setup)
3. [Environment Variables](#environment-variables)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Deploy to Netlify](#deploy-to-netlify)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Firebase project created
- [x] Firestore database set up
- [x] Firebase Authentication enabled
- [x] Firebase Storage configured
- [x] Typesense Cloud cluster OR self-hosted instance
- [x] Cloudinary account
- [x] All environment variables documented
- [x] Security rules configured
- [x] First admin user created

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name: `kashpages-production`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (configure OAuth consent screen)
4. Save settings

### Step 3: Set Up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select location closest to your users (e.g., `asia-south1`)
4. Create database

### Step 4: Configure Security Rules

1. Go to **Firestore Database** → **Rules**
2. Copy rules from `src/lib/firebase/security-rules.txt`
3. Paste and **Publish** rules

### Step 5: Set Up Storage

1. Go to **Storage** → **Get started**
2. Start in **Production mode**
3. Choose same location as Firestore
4. Go to **Rules** tab
5. Copy storage rules from `src/lib/firebase/security-rules.txt`
6. **Publish** rules

### Step 6: Set Up Realtime Database

1. Go to **Realtime Database** → **Create Database**
2. Choose location
3. Start in **Locked mode**
4. Go to **Rules** tab
5. Copy rules from `src/lib/firebase/security-rules.txt`
6. **Publish** rules

### Step 7: Get Firebase Credentials

**Web SDK Config:**
1. Go to **Project Settings** → **General**
2. Scroll to **Your apps**
3. Click **Web** icon (`</>`)
4. Register app name: `kashpages-web`
5. Copy configuration values

**Admin SDK Config:**
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download JSON file
4. Extract values for environment variables

### Step 8: Create First Admin User

1. Sign up through your app
2. Go to **Firestore Database**
3. Find your user document in `users` collection
4. Edit document, change `role` field to `admin`
5. Save

---

## 🔑 Environment Variables

Create `.env.production` file with these variables:

```env
# ========================================
# FIREBASE WEB SDK (CLIENT-SIDE)
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# ========================================
# FIREBASE ADMIN SDK (SERVER-SIDE)
# ========================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# ========================================
# TYPESENSE (SEARCH ENGINE)
# ========================================
NEXT_PUBLIC_TYPESENSE_HOST=xxx.a1.typesense.net
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
TYPESENSE_API_KEY=your_admin_api_key_here
NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY=your_search_only_key_here

# ========================================
# CLOUDINARY (IMAGE STORAGE)
# ========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kashpages_preset

# ========================================
# APPLICATION
# ========================================
NEXT_PUBLIC_APP_URL=https://kashpages.com
NEXT_PUBLIC_APP_NAME=KashPages
```

---

## 💜 Vercel Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Deploy on Vercel:**
   - Go to [Vercel](https://vercel.com/)
   - Click **New Project**
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables:**
   - Go to **Project Settings** → **Environment Variables**
   - Add ALL variables from `.env.production`
   - Make sure to select **Production** environment

4. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete
   - Your site is live! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts and add environment variables when asked
```

### Configure Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your domain: `kashpages.com`
3. Add DNS records as shown
4. Wait for DNS propagation (5-60 minutes)

---

## 🟢 Netlify Deployment

### Method 1: Git Integration

1. **Push to GitHub** (if not already)

2. **Deploy on Netlify:**
   - Go to [Netlify](https://netlify.com/)
   - Click **Add new site** → **Import an existing project**
   - Connect to GitHub
   - Select repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Click **Add a variable**
   - Add each variable from `.env.production`

4. **Deploy:**
   - Click **Deploy site**
   - Wait for build
   - Site is live!

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

---

## ✅ Post-Deployment

### 1. Verify Deployment

- [ ] Visit your production URL
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Create a test page
- [ ] Submit page for approval (as user)
- [ ] Approve page (as admin)
- [ ] View page publicly
- [ ] Test search functionality
- [ ] Check analytics tracking

### 2. Configure Firebase for Production

1. **Add Production Domain to Authorized Domains:**
   - Firebase Console → **Authentication** → **Settings**
   - Scroll to **Authorized domains**
   - Add: `your-domain.com`

2. **Update OAuth Redirect URIs:**
   - Google Cloud Console
   - APIs & Services → Credentials
   - Edit OAuth 2.0 Client
   - Add authorized redirect URIs:
     - `https://your-domain.com/__/auth/handler`

### 3. Set Up Monitoring

**Vercel Analytics:**
- Automatically enabled on Vercel
- View in dashboard

**Sentry (Error Tracking):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Google Analytics:**
- Add GA4 tracking code to layout

---

## 📊 Monitoring & Maintenance

### Daily Tasks
- [ ] Check error logs
- [ ] Review pending approvals
- [ ] Monitor user signups

### Weekly Tasks
- [ ] Review analytics
- [ ] Check Firebase usage
- [ ] Update content/templates
- [ ] Respond to user feedback

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Update dependencies
- [ ] Backup database

### Backup Strategy

**Firestore Backup:**
```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backups/$(date +%Y-%m-%d)

# Schedule daily backups (Firebase Console > Firestore > Import/Export)
```

**Automated Backups:**
1. Go to Firebase Console
2. Firestore Database → **Import/Export**
3. Set up **Scheduled exports**
4. Choose frequency and Cloud Storage bucket

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Rotate API keys** every 90 days
3. **Enable 2FA** on all accounts (Firebase, Vercel, etc.)
4. **Regular security audits** of Firestore rules
5. **Monitor unusual activity** in Firebase Console
6. **Keep dependencies updated**
7. **Use strong passwords** for admin accounts
8. **Enable rate limiting** on API routes

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error:** `Firebase not initialized`
- Check all Firebase env variables are set
- Verify NEXT_PUBLIC_ prefix for client-side vars

### Runtime Errors

**Error:** `Firebase: Error (auth/unauthorized-domain)`
- Add deployment domain to Firebase Authorized Domains

**Error:** `Missing or insufficient permissions`
- Check Firestore security rules
- Verify user role in database

---

## 📞 Support

Need help?

- **Documentation:** README.md, INSTALLATION.md
- **Issues:** [GitHub Issues](https://github.com/Burhan-sheikh/kashpages-production/issues)
- **Email:** support@kashpages.com

---

✅ **Deployment Complete!** Your KashPages platform is now live! 🎉
