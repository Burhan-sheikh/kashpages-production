# 🚀 KashPages - Quick Start Guide

## 📍 You Are Here

Your platform is **60% integrated** with modern UI and database connected!

---

## ⚡ Get Running in 5 Minutes

### Step 1: Pull & Install (2 min)

```bash
# Pull latest changes
git pull origin main

# Clean install
rm -rf node_modules package-lock.json .next
npm install

# Start dev server
npm run dev
```

### Step 2: Test User Flow (3 min)

1. **Sign Up**
   - Go to: `http://localhost:3000/auth/signup`
   - Create account with email/password
   - Or use Google sign-in

2. **Dashboard**
   - Automatically redirected to `/dashboard`
   - See your stats (all zeros initially)
   - Click "Create New Page"

3. **Create Page**
   - Fill in business details:
     - Business name (e.g., "Kashmiri Wazwan Restaurant")
     - Category (e.g., "Restaurant")
     - City (e.g., "Srinagar")
     - District (e.g., "Srinagar")
     - Phone & email (optional)
   - Click "Create Page"

4. **Check Firebase**
   - Open Firebase Console
   - Go to Firestore Database
   - See collections:
     - `users/` - Your user profile
     - `pages/` - Your new page

---

## ✅ What's Working Right Now

### ✓ Authentication
- Sign up with email/password
- Sign in with Google
- User profiles created automatically
- Protected dashboard routes

### ✓ Dashboard
- View all your pages
- See stats (pages, views, status)
- Create new pages
- Status badges (Draft, Published, etc.)

### ✓ Page Creation
- Form with validation
- Saves to Firebase
- Returns to dashboard
- Appears in your pages list

### ✓ Visual Builder
- Access at `/builder`
- Drag & drop sections
- Inline text editing
- Properties panel
- Export/import JSON

---

## 🚧 What Needs Connection

### Page Builder → Firebase
**Status:** Standalone (works, but not connected)

**To Connect:**
1. Create edit route: `/dashboard/pages/[id]/edit`
2. Load page data into builder
3. Save changes to Firebase

**Impact:** Users can edit their created pages

### Public Pages
**Status:** Not built yet

**Needed:**
- Route: `/[username]/[slug]`
- Fetch published pages
- Display sections
- Track views

**Impact:** Pages become publicly visible

### Explore/Search
**Status:** Not built yet

**Needed:**
- Route: `/explore`
- List all published pages
- Category filter
- Location filter
- Search functionality

**Impact:** Discovery system active

---

## 📐 Quick Reference

### Routes Available

| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ | Homepage |
| `/auth/signin` | ✅ | Sign in page |
| `/auth/signup` | ✅ | Sign up page |
| `/dashboard` | ✅ | User dashboard |
| `/dashboard/pages/new` | ✅ | Create page |
| `/builder` | ✅ | Visual builder (standalone) |
| `/dashboard/pages/[id]/edit` | ⚠️ | Edit page (needs creation) |
| `/[username]/[slug]` | ⚠️ | Public page view (needs creation) |
| `/explore` | ⚠️ | Explore pages (needs creation) |

### Services Available

```typescript
// Pages
import { PagesService } from '@/services/pages.service';

PagesService.createPage(userId, data)
PagesService.getPage(pageId)
PagesService.getUserPages(userId)
PagesService.updatePage(pageId, data)
PagesService.publishPage(pageId)
PagesService.deletePage(pageId)

// Categories
import { CategoriesService } from '@/services/categories.service';

CategoriesService.getCategories()
CategoriesService.getCategoryBySlug(slug)
```

### Types Available

```typescript
import {
  UserProfile,
  PageDocument,
  PageStatus,
  UserRole,
  Category,
  Location,
  // ... and many more
} from '@/types/platform';
```

---

## 📊 Check Integration Status

### Firebase Console
1. Go to: https://console.firebase.google.com
2. Select your project
3. Check Firestore:
   - `users/` collection exists?
   - `pages/` collection exists?
   - Data populated after creating page?

### Browser DevTools
1. Open DevTools (F12)
2. Console tab:
   - No errors?
   - Auth state logs?
3. Network tab:
   - Firestore requests successful?

---

## 🐛 Common Issues

### "Can't find module @/types/platform"
**Fix:**
```bash
git pull origin main
rm -rf node_modules .next
npm install
```

### "Firebase auth not working"
**Fix:**
Check `.env.local` has all Firebase keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

### "Page created but not in dashboard"
**Fix:**
- Check Firebase Console for data
- Reload dashboard page
- Check console for errors

### "Builder doesn't save"
**Expected:** Builder is standalone, not connected yet

---

## 🎯 Your Next Task

### Connect Builder to Firebase (20% work)

**Create:** `src/app/dashboard/pages/[id]/edit/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PagesService } from '@/services/pages.service';
import { PageDocument } from '@/types/platform';
import PageBuilderPlatform from '@/components/page-builder/PageBuilderPlatform';

export default function EditPagePage() {
  const params = useParams();
  const [page, setPage] = useState<PageDocument | null>(null);

  useEffect(() => {
    if (params.id) {
      PagesService.getPage(params.id as string)
        .then(setPage);
    }
  }, [params.id]);

  const handleSave = async (sections: any[], design: any) => {
    if (!page) return;
    await PagesService.updatePage(page.id, { sections, design });
    alert('Saved!');
  };

  if (!page) return <div>Loading...</div>;

  return (
    <PageBuilderPlatform
      initialSections={page.sections}
      initialDesign={page.design}
      onSave={handleSave}
    />
  );
}
```

**Then update dashboard page link:**
```typescript
// In dashboard page.tsx, change:
<Link href={`/dashboard/pages/${page.id}`}>
// To:
<Link href={`/dashboard/pages/${page.id}/edit`}>
```

**Result:** Users can edit their pages! 🎉

---

## 📚 Full Documentation

- **DEPLOYMENT_SUMMARY.md** - Complete overview
- **PLATFORM_INTEGRATION.md** - Technical details
- **TROUBLESHOOTING.md** - Error solutions
- **README-PAGE-BUILDER.md** - Builder features

---

## ✅ Success Checklist

- [ ] Pulled latest code
- [ ] Installed dependencies
- [ ] Server running
- [ ] Signed up new user
- [ ] Created a page
- [ ] Page appears in dashboard
- [ ] Checked Firebase data
- [ ] Builder loads (standalone)

---

**Ready to build Kashmir's digital presence platform!** 🏏️🚀

Have questions? Check the docs or test each route step by step!
