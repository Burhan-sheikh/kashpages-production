# 🚀 KashPages Installation Guide

## Prerequisites

Before you begin, ensure you have:
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** installed
- Firebase account
- Typesense Cloud account (or Docker for local)
- Cloudinary account

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Burhan-sheikh/kashpages-production.git
cd kashpages-production
```

### 2. Install Dependencies

```bash
# Clear npm cache (if you had issues before)
npm cache clean --force

# Delete node_modules and package-lock.json if they exist
rm -rf node_modules package-lock.json

# Install dependencies
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Now edit `.env.local` and add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Typesense Configuration (for search)
NEXT_PUBLIC_TYPESENSE_HOST=localhost
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz123

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup Guides

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Click **⚙️ Project Settings**
4. Scroll to **Your apps** → Click **Web** (`</>`)
5. Register your app
6. Copy the configuration values to `.env.local`

**Enable Authentication:**
1. Go to **Authentication** → **Get Started**
2. Enable **Email/Password** sign-in method

**Set Up Firestore:**
1. Go to **Firestore Database** → **Create Database**
2. Choose **Production mode** (you'll add rules later)
3. Select your region

**Set Up Storage:**
1. Go to **Storage** → **Get Started**
2. Start in production mode

### Typesense Setup

**Option A: Typesense Cloud (Recommended for Production)**

1. Sign up at [Typesense Cloud](https://cloud.typesense.org/)
2. Create a new cluster
3. Copy the credentials:
   - Host (e.g., `xxx.a1.typesense.net`)
   - Port (usually `443`)
   - Protocol (`https`)
   - API Key
4. Update `.env.local` with these values

**Option B: Local Development with Docker**

```bash
# Run Typesense locally
docker run -d \
  -p 8108:8108 \
  -v/tmp/typesense-data:/data \
  typesense/typesense:0.25.2 \
  --data-dir /data \
  --api-key=xyz123 \
  --enable-cors
```

Use these values in `.env.local`:
```env
NEXT_PUBLIC_TYPESENSE_HOST=localhost
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz123
```

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Create an **Upload Preset**:
   - Go to **Settings** → **Upload**
   - Scroll to **Upload presets**
   - Click **Add upload preset**
   - Name it `kashpages_preset`
   - Set **Signing Mode** to **Unsigned**
   - Save

---

## Troubleshooting

### ❌ npm install fails

**Problem:** Package installation errors

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**If still failing:**
```bash
# Check Node.js version (must be >= 18)
node --version

# Update npm
npm install -g npm@latest

# Try with legacy peer deps
npm install --legacy-peer-deps
```

### ❌ Module not found errors

**Problem:** `Cannot find module '@/...'` or similar

**Solution:**
```bash
# Ensure tsconfig.json has correct paths
cat tsconfig.json | grep "paths"

# Should show:
# "paths": { "@/*": ["./src/*"] }

# Restart dev server
npm run dev
```

### ❌ Tailwind CSS not working

**Problem:** Styles not applying

**Solution:**
1. Check `tailwind.config.js` content paths
2. Ensure `globals.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server

### ❌ Firebase connection errors

**Problem:** Firebase not connecting

**Solution:**
1. Verify all Firebase env variables are set
2. Check Firebase project settings match `.env.local`
3. Ensure Firebase app is registered for web
4. Check browser console for specific errors

### ❌ Type errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check for type errors
npm run type-check

# If types are missing
npm install --save-dev @types/node @types/react @types/react-dom
```

### ❌ Port 3000 already in use

**Problem:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

---

## Key Changes from Previous Version

### 🔄 Package Updates

1. **Drag & Drop Library Changed:**
   - ❌ Old: `react-beautiful-dnd` (not compatible with React 18)
   - ✅ New: `@hello-pangea/dnd` (React 18 compatible fork)
   - **No API changes** - exact same usage

2. **Added Missing Dependencies:**
   - `clsx` - for conditional class names
   - `tailwind-merge` - for merging Tailwind classes
   - `eslint` and `eslint-config-next` - for code quality

3. **Fixed TypeScript Configuration:**
   - Added proper `tsconfig.json`
   - Set up path aliases (`@/*`)
   - Configured Next.js plugin

4. **Added Missing Config Files:**
   - `next.config.js` - Next.js configuration
   - `tailwind.config.js` - Tailwind CSS setup
   - `postcss.config.js` - PostCSS configuration
   - `.eslintrc.json` - ESLint rules

---

## Verification Steps

After installation, verify everything works:

### 1. Check Installation
```bash
# Should show no errors
npm run type-check
npm run lint
```

### 2. Test Development Server
```bash
npm run dev
# Open http://localhost:3000
# Should see the app without errors
```

### 3. Check Firebase Connection
- Open browser DevTools Console
- Should see Firebase initialized successfully
- No Firebase auth errors

### 4. Test Typesense
- Try searching (if search is implemented)
- Check console for Typesense connection

### 5. Build Test
```bash
# Test production build
npm run build

# Should complete without errors
```

---

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click **Import Project**
4. Select your repository
5. Add environment variables from `.env.local`
6. Deploy!

### Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com/)
3. Click **Add new site** → **Import an existing project**
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy!

---

## Need Help?

- **Issue Tracker:** [GitHub Issues](https://github.com/Burhan-sheikh/kashpages-production/issues)
- **Email:** burhan@kashpages.com
- **Documentation:** Check README.md

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Troubleshooting
npm cache clean --force              # Clear npm cache
rm -rf node_modules package-lock.json # Remove dependencies
npm install                           # Reinstall
npx kill-port 3000                   # Kill port 3000
```

---

✅ **Installation Complete!** You're ready to build amazing landing pages! 🚀
