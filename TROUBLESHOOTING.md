# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### 1. Undici Module Parse Error (FIXED ✅)

**Error:**
```
Module parse failed: Unexpected token (682:63)
if (typeof this !== "object" || this === null || !(#target in this)) {
```

**Cause:** 
- Private class fields syntax (`#target`) in `undici` package
- Node.js version incompatibility
- Next.js 14.1.0 doesn't transpile these packages by default

**Solution Applied:**
1. ✅ Updated `next.config.js` with webpack fallbacks
2. ✅ Added `transpilePackages` for undici and Firebase
3. ✅ Upgraded Next.js from 14.1.0 to 14.2.20

---

### 2. Invalid next.config.js Options (FIXED ✅)

**Error:**
```
⚠ Invalid next.config.js options detected:
⚠ Unrecognized key(s) in object: 'outputFileTracingRoot'
```

**Solution:**
- ✅ Removed deprecated `outputFileTracingRoot` option
- ✅ Kept only `output: 'standalone'` for Docker builds

---

### 3. Security Vulnerabilities (FIXED ✅)

**Warning:**
```
npm warn deprecated next@14.1.0: This version has a security vulnerability
14 vulnerabilities (10 moderate, 3 high, 1 critical)
```

**Solution:**
- ✅ Upgraded Next.js to 14.2.20 (patched version)
- ✅ Updated eslint-config-next to match

---

## 🚀 Apply the Fixes

### Step 1: Pull Latest Changes
```bash
git pull origin main
```

### Step 2: Clean Install Dependencies
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json
# OR on Windows:
# rmdir /s /q node_modules
# del package-lock.json

# Fresh install
npm install
```

### Step 3: Clear Next.js Cache
```bash
# Remove Next.js cache
rm -rf .next
# OR on Windows:
# rmdir /s /q .next
```

### Step 4: Run Development Server
```bash
npm run dev
```

### Step 5: Verify Page Builder
Visit: http://localhost:3000/builder

---

## 🔍 Additional Debugging

### If Still Getting Undici Error

1. **Check Node.js version:**
```bash
node --version
```
Recommended: Node.js 18.17+ or 20+

2. **Force reinstall:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Try alternative Firebase import:**
In `src/lib/firebase/config.ts`, use dynamic imports:
```typescript
import { initializeApp, getApps } from 'firebase/app';
// Use dynamic imports for storage/auth if needed
```

---

### If Build Fails

1. **Check for TypeScript errors:**
```bash
npm run lint
```

2. **Build locally:**
```bash
npm run build
```

3. **Check environment variables:**
Ensure `.env.local` has all Firebase keys

---

### If Page Builder Doesn't Load

1. **Check browser console** (F12)
2. **Verify route exists:**
   - File: `src/app/builder/page.tsx`
3. **Check imports:**
   - All components in `src/components/page-builder/`
   - All UI components in `src/components/ui/`

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Known Issues
- Drag & drop may be slower on older devices
- Inline editing requires contenteditable support

---

## 🐛 Reporting Issues

If you encounter other errors:

1. **Check this guide first**
2. **Clear cache and reinstall**
3. **Check console for specific errors**
4. **Document:**
   - Error message
   - Steps to reproduce
   - Browser/Node version
   - Screenshot if UI issue

---

## ✅ Success Checklist

- [ ] No undici parse errors
- [ ] No next.config.js warnings
- [ ] No security vulnerabilities (critical/high)
- [ ] Dev server starts successfully
- [ ] `/builder` route loads
- [ ] Can drag and drop sections
- [ ] Inline editing works
- [ ] Properties panel updates styles
- [ ] Export/import JSON works

---

## 🎉 All Fixed!

Your KashPages platform should now be running smoothly!

Visit: **http://localhost:3000/builder** to start building pages.
