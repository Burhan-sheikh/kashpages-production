# Firebase Setup Guide for KashPages

Complete guide to set up Firebase for KashPages production environment.

## 🔥 Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name: `kashpages-production`
4. Enable Google Analytics (recommended)
5. Create project

### 2. Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional)
4. Add authorized domain: `kashpages.com` (or your domain)

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Production mode** (we'll set custom rules)
4. Select location: `asia-south1` (Mumbai) or closest to Kashmir
5. Click **Enable**

### 4. Create Realtime Database

1. Go to **Realtime Database**
2. Click **Create Database**
3. Choose **Production mode**
4. Select same location as Firestore
5. Click **Enable**

### 5. Enable Storage (for images)

1. Go to **Storage**
2. Click **Get Started**
3. Use production rules
4. Same location

---

## 🔐 Deploy Firestore Security Rules

### Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project (if not done)
firebase init
# Select:
# - Firestore
# - Realtime Database
# - Storage

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only database
```

### Manual Setup (Console)

1. Go to **Firestore Database** > **Rules**
2. Copy content from `firestore.rules`
3. Paste and **Publish**

4. Go to **Realtime Database** > **Rules**
5. Copy content from `database.rules.json`
6. Paste and **Publish**

---

## 🗂️ Create Firestore Indexes

### Automatic (CLI)

```bash
firebase deploy --only firestore:indexes
```

### Manual (Console)

1. Go to **Firestore Database** > **Indexes**
2. Click **Add Index**
3. Create each index from `firestore.indexes.json`:

**Index 1: Pages by Status and Date**
- Collection: `pages`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 2: User's Pages by Date**
- Collection: `pages`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)

**Index 3: Category Pages**
- Collection: `pages`
- Fields:
  - `category` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 4: Location Pages**
- Collection: `pages`
- Fields:
  - `location` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 5: Popular Pages**
- Collection: `pages`
- Fields:
  - `status` (Ascending)
  - `views` (Descending)

**Index 6: Featured Pages**
- Collection: `pages`
- Fields:
  - `featured` (Ascending)
  - `createdAt` (Descending)

**Index 7: Page Analytics**
- Collection: `analytics`
- Fields:
  - `pageId` (Ascending)
  - `timestamp` (Descending)

---

## 🌱 Seed Initial Data

### Option 1: Firebase Console

1. Go to **Realtime Database**
2. Click on root "/" 
3. Click "⋮" > **Import JSON**
4. Upload `database-seed.json`
5. Click **Import**

### Option 2: Using Script

Create `scripts/seed-database.js`:

```javascript
const admin = require('firebase-admin');
const seedData = require('../database-seed.json');

admin.initializeApp();

const db = admin.database();

async function seedDatabase() {
  try {
    // Seed categories
    await db.ref('categories').set(seedData.categories);
    console.log('✅ Categories seeded');

    // Seed locations
    await db.ref('locations').set(seedData.locations);
    console.log('✅ Locations seeded');

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
```

Run:
```bash
node scripts/seed-database.js
```

### ⚠️ Important: Set Your Admin UID

After creating your first user account:

1. Go to **Authentication** > **Users**
2. Copy your User UID
3. Go to **Realtime Database**
4. Navigate to `admins/`
5. Replace `REPLACE_WITH_YOUR_UID` with your actual UID

---

## 🔑 Environment Variables

### Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web app** (</>) icon
4. Register app: `kashpages-web`
5. Copy Firebase config object

### Update `.env.local`

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Optional: Firebase Admin SDK (for server-side)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
```

---

## 🛡️ Storage Rules

### Deploy Storage Rules

Create `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && 
                      request.resource.size < 5 * 1024 * 1024 && // 5MB
                      request.resource.contentType.matches('image/.*');
    }
    
    // Page images
    match /pages/{pageId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() && 
                      request.resource.size < 10 * 1024 * 1024 && // 10MB
                      request.resource.contentType.matches('image/.*');
    }
    
    // Page gallery images
    match /pages/{pageId}/gallery/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() && 
                      request.resource.size < 10 * 1024 * 1024 && // 10MB
                      request.resource.contentType.matches('image/.*');
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Deploy:
```bash
firebase deploy --only storage
```

---

## 📊 Firestore Data Structure

### Collections

**users/{userId}**
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "User Name",
  "photoURL": "https://...",
  "plan": "free",
  "createdAt": 1707504000000,
  "updatedAt": 1707504000000
}
```

**pages/{pageId}**
```json
{
  "id": "page-id",
  "userId": "owner-user-id",
  "title": "Business Name",
  "slug": "business-name",
  "description": "Brief description",
  "category": "restaurant",
  "location": "srinagar",
  "status": "published",
  "featured": false,
  "views": 0,
  "template": "modern",
  "theme": {
    "primaryColor": "#3B82F6",
    "font": "Inter"
  },
  "content": {
    "hero": {},
    "about": {},
    "services": [],
    "gallery": [],
    "contact": {}
  },
  "seo": {
    "title": "SEO Title",
    "description": "SEO Description",
    "keywords": ["keyword1", "keyword2"]
  },
  "createdAt": 1707504000000,
  "updatedAt": 1707504000000,
  "publishedAt": 1707504000000
}
```

**analytics/{pageId}**
```json
{
  "pageId": "page-id",
  "totalViews": 1234,
  "uniqueVisitors": 567,
  "lastUpdated": 1707504000000,
  "dailyStats": {
    "2024-02-09": {
      "views": 45,
      "visitors": 23
    }
  }
}
```

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firestore rules deployed
- [ ] Firestore indexes created
- [ ] Realtime Database created
- [ ] Realtime Database rules deployed
- [ ] Realtime Database seeded with categories and locations
- [ ] Admin UID added to `admins/` node
- [ ] Storage enabled
- [ ] Storage rules deployed
- [ ] Environment variables added to `.env.local`
- [ ] Firebase config added to project
- [ ] Test authentication working
- [ ] Test create/read/update/delete page operations
- [ ] Test slug availability checker

---

## 🐞 Troubleshooting

### "Missing or insufficient permissions"
- Check Firestore rules are deployed
- Verify user is authenticated
- Check userId matches in page document

### "Index required" error
- Go to error link in console
- Click "Create Index"
- Or deploy indexes: `firebase deploy --only firestore:indexes`

### Slug checker not working
- Verify Firestore rules allow read on `pages` collection
- Check slug index is created
- Verify Firebase config is correct

### Storage upload fails
- Check storage rules deployed
- Verify file size < limit
- Check file type is image

---

## 🚀 Production Deployment

### Before Going Live

1. **Review all rules** - Ensure no test rules remain
2. **Set up billing** - Enable Blaze plan for production
3. **Configure quotas** - Set spending limits
4. **Enable monitoring** - Set up alerts
5. **Backup strategy** - Enable daily backups
6. **Custom domain** - Add to authorized domains
7. **SSL certificate** - Ensure HTTPS enabled

### Monitoring

1. Go to **Firebase Console** > **Analytics**
2. Monitor:
   - Active users
   - Database reads/writes
   - Storage usage
   - Function invocations

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Need help?** Open an issue or contact the development team.
