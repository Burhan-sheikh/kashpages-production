# Kashpages API Documentation

## Overview

This document describes the API architecture, endpoints, and integration patterns for Kashpages platform.

---

## Architecture

### Client-Server Pattern

```
Client (Next.js App)
    ↓
    ↓ Firebase SDK (Auth, Firestore queries)
    ↓
    ↓ API Routes (Privileged operations)
    ↓
Firebase Backend
    │
    ├─ Authentication
    ├─ Firestore
    ├─ Realtime Database
    ├─ Storage
    ├─ Functions
    └─ Data Connect (PostgreSQL)
```

### Security Model

1. **Public operations** → Direct Firebase SDK
2. **Authenticated operations** → Firestore security rules
3. **Privileged operations** → Server API routes + Firebase Admin SDK

---

## Authentication

### Sign Up

**Endpoint:** Firebase Auth SDK

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { user } = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

// Create user document
await setDoc(doc(db, 'users', user.uid), {
  name,
  email: user.email,
  role: 'user',
  status: 'active',
  createdAt: serverTimestamp()
});
```

### Sign In

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const { user } = await signInWithEmailAndPassword(
  auth,
  email,
  password
);
```

### Google Sign In

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const { user } = await signInWithPopup(auth, provider);
```

### Phone Sign In

```typescript
import { signInWithPhoneNumber } from 'firebase/auth';

// Request OTP
const confirmationResult = await signInWithPhoneNumber(
  auth,
  phoneNumber,
  recaptchaVerifier
);

// Verify OTP
const { user } = await confirmationResult.confirm(code);
```

### Get Current User

```typescript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User signed in
  } else {
    // User signed out
  }
});
```

### Sign Out

```typescript
import { signOut } from 'firebase/auth';

await signOut(auth);
```

---

## User Management

### Get User Profile

**Method:** Direct Firestore

```typescript
import { doc, getDoc } from 'firebase/firestore';

const userDoc = await getDoc(doc(db, 'users', userId));
const userData = userDoc.data();
```

### Update User Profile

**Method:** Direct Firestore (user can update own)

```typescript
import { doc, updateDoc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', userId), {
  name: 'New Name',
  bio: 'Updated bio',
  updatedAt: serverTimestamp()
});
```

### Upload Profile Picture

**Method:** Firebase Storage

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storageRef = ref(storage, `avatars/${userId}`);
await uploadBytes(storageRef, file);
const photoURL = await getDownloadURL(storageRef);

// Update user document
await updateDoc(doc(db, 'users', userId), {
  photoURL,
  updatedAt: serverTimestamp()
});
```

---

## Page Management

### Create Page

**Method:** Direct Firestore

```typescript
import { collection, addDoc } from 'firebase/firestore';

const pageData = {
  ownerId: user.uid,
  title: 'My Business',
  slug: 'my-business',
  templateId: selectedTemplateId,
  status: 'draft',
  contentSchema: templateSchema,
  seo: {
    title: '',
    description: '',
    keywords: [],
    ogImage: ''
  },
  aiConfig: {
    enabled: false,
    name: '',
    avatar: '',
    knowledgeBase: []
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

const docRef = await addDoc(collection(db, 'pages'), pageData);
```

### Get User Pages

**Method:** Direct Firestore query

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

const q = query(
  collection(db, 'pages'),
  where('ownerId', '==', user.uid)
);

const snapshot = await getDocs(q);
const pages = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Get Single Page

**Method:** Direct Firestore

```typescript
const pageDoc = await getDoc(doc(db, 'pages', pageId));
const page = pageDoc.data();
```

### Update Page Content

**Method:** Direct Firestore (with autosave)

```typescript
import { doc, updateDoc } from 'firebase/firestore';

// Debounced autosave
const autosave = debounce(async (pageId, contentSchema) => {
  await updateDoc(doc(db, 'pages', pageId), {
    contentSchema,
    updatedAt: serverTimestamp()
  });
}, 1000);
```

### Update Page SEO

```typescript
await updateDoc(doc(db, 'pages', pageId), {
  'seo.title': 'New Title',
  'seo.description': 'New description',
  'seo.keywords': ['keyword1', 'keyword2'],
  'seo.ogImage': 'https://...',
  updatedAt: serverTimestamp()
});
```

### Publish Page

**Method:** API Route (requires validation)

**Endpoint:** `POST /api/pages/publish`

```typescript
const response = await fetch('/api/pages/publish', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({
    pageId,
    seo: {
      title: 'My Business',
      description: 'Best business in Kashmir',
      keywords: ['kashmir', 'business'],
      ogImage: 'https://...'
    }
  })
});

const result = await response.json();
```

**Response:**
```json
{
  "success": true,
  "pageId": "abc123",
  "slug": "my-business",
  "url": "https://kashpages.com/username/my-business",
  "status": "pending" // or "published" based on auto-approval
}
```

### Unpublish Page

**Endpoint:** `POST /api/pages/unpublish`

```typescript
const response = await fetch('/api/pages/unpublish', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({ pageId })
});
```

### Delete Page

**Method:** Direct Firestore

```typescript
import { doc, deleteDoc } from 'firebase/firestore';

await deleteDoc(doc(db, 'pages', pageId));
```

---

## Templates

### Get All Templates

**Method:** Direct Firestore

```typescript
const snapshot = await getDocs(collection(db, 'templates'));
const templates = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Filter Templates by Category

```typescript
const q = query(
  collection(db, 'templates'),
  where('category', '==', 'ecommerce')
);

const snapshot = await getDocs(q);
```

### Filter Templates by Plan

```typescript
// Get templates available for user's plan
const q = query(
  collection(db, 'templates'),
  where('plan', 'in', ['free', 'starter']) // based on user plan
);
```

---

## Revisions

### Create Revision

**Method:** API Route (automated on save)

```typescript
// Automatic revision on significant changes
const createRevision = async (pageId: string, snapshot: any) => {
  await addDoc(collection(db, 'revisions'), {
    pageId,
    snapshot,
    timestamp: serverTimestamp()
  });
};
```

### Get Page Revisions

```typescript
const q = query(
  collection(db, 'revisions'),
  where('pageId', '==', pageId),
  orderBy('timestamp', 'desc'),
  limit(20)
);

const snapshot = await getDocs(q);
const revisions = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Restore Revision

**Endpoint:** `POST /api/pages/restore`

```typescript
const response = await fetch('/api/pages/restore', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({
    pageId,
    revisionId
  })
});
```

---

## AI Configuration

### Enable AI Assistant

```typescript
await updateDoc(doc(db, 'pages', pageId), {
  'aiConfig.enabled': true,
  'aiConfig.name': 'Business Assistant',
  'aiConfig.avatar': 'https://...',
  updatedAt: serverTimestamp()
});
```

### Update AI Knowledge Base

```typescript
await updateDoc(doc(db, 'pages', pageId), {
  'aiConfig.knowledgeBase': [
    {
      type: 'custom',
      title: 'Business Overview',
      content: '...'
    },
    {
      type: 'premade',
      cardId: 'services-card'
    }
  ],
  updatedAt: serverTimestamp()
});
```

### AI Chat (Public API)

**Endpoint:** `POST /api/ai/chat`

```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pageId: 'abc123',
    message: 'What are your business hours?',
    conversationId: 'conv-123' // optional, for context
  })
});

const { reply, conversationId } = await response.json();
```

---

## Subscriptions

### Get User Subscription

```typescript
const subDoc = await getDoc(doc(db, 'subscriptions', userId));
const subscription = subDoc.data();
```

### Create Checkout Session

**Endpoint:** `POST /api/payments/create-checkout`

```typescript
const response = await fetch('/api/payments/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({
    plan: 'starter', // or 'business'
    provider: 'cashfree' // or 'razorpay'
  })
});

const { checkoutUrl } = await response.json();

// Redirect user
window.location.href = checkoutUrl;
```

### Verify Payment

**Endpoint:** `POST /api/payments/verify`

```typescript
// Called by payment gateway webhook
// Handled automatically by server
```

### Cancel Subscription

**Endpoint:** `POST /api/subscriptions/cancel`

```typescript
const response = await fetch('/api/subscriptions/cancel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`
  }
});
```

---

## Custom Domains

### Add Custom Domain

**Endpoint:** `POST /api/domains/add`

```typescript
const response = await fetch('/api/domains/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({
    pageId: 'abc123',
    hostname: 'www.mybusiness.com'
  })
});

const { verificationToken, dnsInstructions } = await response.json();
```

### Verify Domain

**Endpoint:** `POST /api/domains/verify`

```typescript
const response = await fetch('/api/domains/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await user.getIdToken()}`
  },
  body: JSON.stringify({
    domainId: 'domain-123'
  })
});

const { verified, sslStatus } = await response.json();
```

### Remove Domain

**Endpoint:** `DELETE /api/domains/:domainId`

```typescript
const response = await fetch(`/api/domains/${domainId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`
  }
});
```

---

## Admin APIs

### Get All Users

**Endpoint:** `GET /api/admin/users`

```typescript
const response = await fetch('/api/admin/users?page=1&limit=50', {
  headers: {
    'Authorization': `Bearer ${await adminUser.getIdToken()}`
  }
});

const { users, total, page } = await response.json();
```

### Suspend User

**Endpoint:** `POST /api/admin/users/suspend`

```typescript
const response = await fetch('/api/admin/users/suspend', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await adminUser.getIdToken()}`
  },
  body: JSON.stringify({
    userId: 'user123',
    reason: 'Violation of terms'
  })
});
```

### Approve Page

**Endpoint:** `POST /api/admin/pages/approve`

```typescript
const response = await fetch('/api/admin/pages/approve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await adminUser.getIdToken()}`
  },
  body: JSON.stringify({
    pageId: 'page123'
  })
});
```

### Reject Page

**Endpoint:** `POST /api/admin/pages/reject`

```typescript
const response = await fetch('/api/admin/pages/reject', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await adminUser.getIdToken()}`
  },
  body: JSON.stringify({
    pageId: 'page123',
    reason: 'Content policy violation'
  })
});
```

### Update System Settings

**Endpoint:** `PUT /api/admin/settings`

```typescript
const response = await fetch('/api/admin/settings', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await adminUser.getIdToken()}`
  },
  body: JSON.stringify({
    aiEnabled: true,
    aiApiKey: 'encrypted-key',
    paymentConfigs: {
      cashfree: {
        appId: '...',
        secretKey: '...'
      },
      razorpay: {
        keyId: '...',
        keySecret: '...'
      }
    }
  })
});
```

### Get Analytics

**Endpoint:** `GET /api/admin/analytics`

```typescript
const response = await fetch(
  '/api/admin/analytics?period=30d',
  {
    headers: {
      'Authorization': `Bearer ${await adminUser.getIdToken()}`
    }
  }
);

const analytics = await response.json();
// {
//   totalUsers: 1234,
//   totalPages: 567,
//   publishedPages: 432,
//   revenue: 45000,
//   subscriptions: { free: 800, starter: 300, business: 134 }
// }
```

---

## Storage Operations

### Upload Image

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

// Usage
const imageUrl = await uploadImage(
  file,
  `pages/${pageId}/images/${Date.now()}-${file.name}`
);
```

### Delete Image

```typescript
import { ref, deleteObject } from 'firebase/storage';

const deleteImage = async (url: string) => {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};
```

---

## Rate Limiting

All API routes are rate-limited:

- **Public endpoints:** 100 requests per 15 minutes per IP
- **Authenticated endpoints:** 200 requests per 15 minutes per user
- **Admin endpoints:** 500 requests per 15 minutes per admin

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1234567890
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You don't have permission to perform this action",
    "details": {
      "resource": "page",
      "action": "publish"
    }
  }
}
```

### Error Codes

- `UNAUTHENTICATED` - User not signed in
- `PERMISSION_DENIED` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Duplicate resource
- `INVALID_ARGUMENT` - Invalid input
- `FAILED_PRECONDITION` - Operation not allowed in current state
- `RESOURCE_EXHAUSTED` - Quota exceeded
- `INTERNAL` - Server error

---

## Webhooks

### Payment Webhook

**Endpoint:** `POST /api/webhooks/payment`

Handled by payment providers (Cashfree/Razorpay).

**Verification:**
- Signature validation
- Replay attack prevention
- Idempotency

### Domain Verification Webhook

**Endpoint:** `POST /api/webhooks/domain`

Triggered by DNS verification checks.

---

## Best Practices

1. **Always use server timestamps** for consistency
2. **Implement optimistic updates** for better UX
3. **Cache frequently accessed data** (templates, settings)
4. **Use pagination** for large lists
5. **Validate on both client and server**
6. **Handle offline mode** gracefully
7. **Implement retry logic** for failed requests
8. **Use environment-specific endpoints**
9. **Never expose secrets** in client code
10. **Monitor API usage** and set quotas

---

## SDK Usage Examples

See `/src/lib/` directory for SDK wrappers:

- `firebase.ts` - Firebase client initialization
- `firebase-admin.ts` - Firebase Admin SDK
- `api.ts` - API client with auth
- `storage.ts` - Storage operations
- `analytics.ts` - Analytics tracking

---

## Support

For API-related issues:

1. Check Firebase Console logs
2. Review server logs in Vercel
3. Test with Firebase Emulators
4. Create GitHub issue with API call details
