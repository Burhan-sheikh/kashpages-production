# Kashpages Implementation Plan

## Executive Summary

Kashpages is a production-grade SaaS platform enabling Kashmir businesses to create professional web presence through schema-driven page building with AI assistance and secure governance.

**Repository:** [kashpages-production](https://github.com/Burhan-sheikh/kashpages-production)

---

## Phase 1: Foundation (Weeks 1-2)

### 1.1 Firebase Project Setup

**Priority: CRITICAL**

```bash
# Create Firebase project
firebase projects:create kashpages-prod
firebase use kashpages-prod

# Enable services
- Authentication (Email/Password, Google, Phone)
- Firestore Database
- Realtime Database
- Cloud Storage
- Cloud Functions
- Firebase Data Connect (PostgreSQL)
```

**Configuration Files:**
- ✅ `firestore.rules` - Security rules
- ✅ `firestore.indexes.json` - Database indexes
- ✅ `database.rules.json` - Realtime DB rules
- ✅ `storage.rules` - Storage security
- 🔄 `functions/` - Cloud Functions

### 1.2 Environment Configuration

**Create `.env.local`:**

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kashpages-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side only)
FIREBASE_ADMIN_PROJECT_ID=kashpages-prod
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"

# Platform Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Kashpages
NEXT_PUBLIC_PLATFORM_DOMAIN=kashpages.com

# Rate Limiting
REDIS_URL=redis://localhost:6379
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Payment Gateways (Admin configures via dashboard)
# These are stored in Firestore systemSettings, not in env
```

### 1.3 Core Dependencies

**Already Configured:**
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Firebase SDK

**Additional Required:**

```bash
npm install framer-motion
npm install react-beautiful-dnd
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-hook-form zod
npm install date-fns
npm install sharp
npm install sanitize-html
npm install validator

# Development
npm install -D @types/sanitize-html
npm install -D @types/validator
```

---

## Phase 2: Authentication & User Management (Weeks 3-4)

### 2.1 Authentication System

**Files to Create:**

```
src/lib/
  ├── firebase/
  │   ├── auth.ts          ✅ Created
  │   ├── firestore.ts     ✅ Created
  │   └── admin.ts         🔄 Needs enhancement
  ├── auth/
  │   ├── session.ts       🆕 Create
  │   ├── middleware.ts    🆕 Create
  │   └── verification.ts  🆕 Create
```

**Implementation:**

1. **Email/Password Auth**
   - Registration with email verification
   - Password reset flow
   - Secure password requirements

2. **Google OAuth**
   - One-click sign-in
   - Profile data sync

3. **Phone Authentication**
   - OTP verification
   - Multi-factor authentication option

4. **Session Management**
   - JWT token validation
   - Refresh token rotation
   - Auto logout on inactivity

### 2.2 User Roles & Permissions

**Data Model:**

```typescript
interface User {
  uid: string;
  email: string;
  name: string;
  role: 'guest' | 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  subscription: {
    plan: 'free' | 'starter' | 'business';
    status: 'active' | 'expired' | 'cancelled';
    currentPeriodEnd: Date;
  };
  profile: {
    avatar?: string;
    phone?: string;
    businessName?: string;
    businessType?: string;
  };
  usage: {
    pagesCreated: number;
    pagesLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Firestore Rules Enhancement:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isActive() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'active';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId) && 
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'status']);
      allow delete: if isAdmin();
    }
    
    // Pages collection
    match /pages/{pageId} {
      allow read: if resource.data.status == 'published' || 
        (isAuthenticated() && isOwner(resource.data.ownerId)) || 
        isAdmin();
      allow create: if isAuthenticated() && isActive() && 
        request.resource.data.ownerId == request.auth.uid;
      allow update: if isAuthenticated() && isOwner(resource.data.ownerId);
      allow delete: if isAuthenticated() && (isOwner(resource.data.ownerId) || isAdmin());
    }
    
    // Templates collection
    match /templates/{templateId} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
    
    // System settings
    match /systemSettings/{settingId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

---

## Phase 3: Page Builder Core (Weeks 5-8)

### 3.1 Schema-Based Architecture

**Content Schema:**

```typescript
interface PageSchema {
  version: string; // '1.0.0'
  metadata: {
    title: string;
    slug: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  sections: Section[];
  theme: {
    colors: ColorPalette;
    fonts: FontConfig;
    spacing: SpacingConfig;
  };
  settings: {
    seo: SEOConfig;
    ai: AIConfig;
    analytics: AnalyticsConfig;
  };
}

interface Section {
  id: string;
  type: SectionType;
  config: SectionConfig;
  elements: Element[];
  visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  order: number;
}

type SectionType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'gallery'
  | 'contact'
  | 'footer'
  | 'stats'
  | 'team'
  | 'process'
  | 'cta';

interface Element {
  id: string;
  type: ElementType;
  content: any;
  style: StyleConfig;
  order: number;
}

type ElementType =
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'video'
  | 'form'
  | 'divider'
  | 'spacer'
  | 'socialLinks'
  | 'map'
  | 'badge'
  | 'list';
```

### 3.2 Component Whitelist System

**Strict Component Registry:**

```typescript
// src/features/builder/registry/componentRegistry.ts

import { ComponentType } from 'react';

interface ComponentDefinition {
  type: string;
  component: ComponentType<any>;
  schema: any; // Zod schema for validation
  permissions: {
    free: boolean;
    starter: boolean;
    business: boolean;
  };
  category: string;
}

const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  'section.hero': {
    type: 'section.hero',
    component: HeroSection,
    schema: HeroSectionSchema,
    permissions: { free: true, starter: true, business: true },
    category: 'sections',
  },
  'element.heading': {
    type: 'element.heading',
    component: HeadingElement,
    schema: HeadingElementSchema,
    permissions: { free: true, starter: true, business: true },
    category: 'elements',
  },
  // ... 50 total components
};

export const getComponent = (type: string): ComponentDefinition | null => {
  return COMPONENT_REGISTRY[type] || null;
};

export const validateComponent = (type: string, data: any): boolean => {
  const component = getComponent(type);
  if (!component) return false;
  
  try {
    component.schema.parse(data);
    return true;
  } catch {
    return false;
  }
};

export const hasAccess = (
  componentType: string,
  userPlan: 'free' | 'starter' | 'business'
): boolean => {
  const component = getComponent(componentType);
  return component?.permissions[userPlan] ?? false;
};
```

### 3.3 Drag & Drop System

**Implementation with @dnd-kit:**

```typescript
// src/features/builder/components/BuilderCanvas.tsx

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const BuilderCanvas = () => {
  const [sections, setSections] = useState<Section[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Autosave
      debouncedSave(sections);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SortableSection key={section.id} section={section} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
```

### 3.4 Sanitization & Security

**Content Sanitization:**

```typescript
// src/lib/security/sanitize.ts

import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'br', 'p', 'span'];
const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'style'],
};

export const sanitizeContent = (content: string): string => {
  return sanitizeHtml(content, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['https'],
  });
};

export const validateUrl = (url: string): boolean => {
  return validator.isURL(url, {
    protocols: ['https'],
    require_protocol: true,
  });
};

export const sanitizePageSchema = (schema: PageSchema): PageSchema => {
  // Deep sanitization of all text content
  // Validate all URLs
  // Remove any script-like content
  // Validate against schema definition
  
  return {
    ...schema,
    sections: schema.sections.map((section) => ({
      ...section,
      elements: section.elements.map((element) => ({
        ...element,
        content: sanitizeElementContent(element.type, element.content),
      })),
    })),
  };
};
```

### 3.5 Autosave & Revision History

**Autosave Implementation:**

```typescript
// src/features/builder/hooks/useAutosave.ts

import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { savePageDraft, createRevision } from '@/services/pages';

export const useAutosave = (pageId: string, content: PageSchema) => {
  const lastSavedRef = useRef<string>('');
  
  const saveRevision = useCallback(async () => {
    const currentContent = JSON.stringify(content);
    
    if (currentContent === lastSavedRef.current) {
      return; // No changes
    }
    
    try {
      await savePageDraft(pageId, content);
      
      // Create revision every 5 autosaves
      const saveCount = parseInt(localStorage.getItem(`saves_${pageId}`) || '0');
      if (saveCount % 5 === 0) {
        await createRevision(pageId, content);
      }
      localStorage.setItem(`saves_${pageId}`, (saveCount + 1).toString());
      
      lastSavedRef.current = currentContent;
    } catch (error) {
      console.error('Autosave failed:', error);
    }
  }, [pageId, content]);
  
  const debouncedSave = useCallback(
    debounce(saveRevision, 2000),
    [saveRevision]
  );
  
  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [content, debouncedSave]);
};
```

**Revision History:**

```typescript
interface Revision {
  id: string;
  pageId: string;
  snapshot: PageSchema;
  timestamp: Date;
  message?: string;
  userId: string;
}

// Store last 20 revisions per page
export const createRevision = async (
  pageId: string,
  snapshot: PageSchema,
  message?: string
): Promise<void> => {
  const revision: Revision = {
    id: generateId(),
    pageId,
    snapshot,
    timestamp: new Date(),
    message,
    userId: auth.currentUser!.uid,
  };
  
  await db.collection('revisions').add(revision);
  
  // Keep only last 20 revisions
  const revisions = await db
    .collection('revisions')
    .where('pageId', '==', pageId)
    .orderBy('timestamp', 'desc')
    .get();
  
  if (revisions.size > 20) {
    const toDelete = revisions.docs.slice(20);
    await Promise.all(toDelete.map((doc) => doc.ref.delete()));
  }
};
```

---

## Phase 4: Template System (Weeks 9-11)

### 4.1 Template Categories

**50 Production-Ready Templates:**

1. **Agency (7 templates)**
   - Creative Agency
   - Digital Marketing
   - Consulting Services
   - Design Studio
   - PR Firm
   - Branding Agency
   - Full-Service Agency

2. **eCommerce (8 templates)**
   - Fashion Store
   - Electronics Shop
   - Handicrafts
   - Organic Products
   - Jewelry Store
   - Home Decor
   - Saffron & Spices
   - Kashmiri Pashmina

3. **Landing Pages (7 templates)**
   - SaaS Product
   - Mobile App
   - Event Registration
   - Course Launch
   - Lead Generation
   - Webinar Sign-up
   - Product Launch

4. **Non-Profit (6 templates)**
   - Charity Organization
   - Environmental NGO
   - Education Foundation
   - Healthcare Initiative
   - Animal Welfare
   - Community Development

5. **Portfolio (7 templates)**
   - Photographer
   - Graphic Designer
   - Web Developer
   - Artist
   - Architect
   - Writer
   - Video Producer

6. **SaaS (7 templates)**
   - Project Management
   - CRM Platform
   - Analytics Tool
   - Communication App
   - Productivity Suite
   - E-learning Platform
   - Marketing Automation

7. **Services (8 templates)**
   - Restaurant
   - Hotel & Tourism
   - Real Estate
   - Healthcare Clinic
   - Law Firm
   - Accounting Services
   - Fitness Center
   - Beauty Salon

### 4.2 Template Data Structure

```typescript
interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: {
    thumbnail: string;
    screenshots: string[];
    demoUrl?: string;
  };
  schema: PageSchema;
  metadata: {
    description: string;
    tags: string[];
    author: string;
    version: string;
  };
  permissions: {
    free: boolean;
    starter: boolean;
    business: boolean;
  };
  stats: {
    usageCount: number;
    rating: number;
    reviews: number;
  };
  customizable: {
    colors: boolean;
    fonts: boolean;
    layout: boolean;
    content: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.3 Template Selection Flow

```typescript
// User flow: Dashboard → Create Page → Select Template

// 1. User browses templates with filters
const [filters, setFilters] = useState({
  category: 'all',
  plan: user.subscription.plan,
  search: '',
});

// 2. User previews template
const previewTemplate = async (templateId: string) => {
  const template = await getTemplate(templateId);
  // Open preview modal with demo data
};

// 3. User selects template
const selectTemplate = async (templateId: string) => {
  // Check plan access
  if (!hasTemplateAccess(templateId, user.subscription.plan)) {
    showUpgradeModal();
    return;
  }
  
  // Create new page from template
  const page = await createPageFromTemplate(templateId, user.uid);
  router.push(`/builder/${page.id}`);
};
```

---

## Phase 5: AI Assistant Feature (Weeks 12-14)

### 5.1 AI Configuration

**Per-Page AI Settings:**

```typescript
interface AIConfig {
  enabled: boolean;
  name: string; // Custom AI name
  avatar?: string; // Custom AI avatar
  training: {
    mode: 'premade' | 'custom' | 'hybrid';
    knowledgeCards: string[]; // IDs of premade cards
    customData: CustomTrainingData;
  };
  behavior: {
    tone: 'professional' | 'friendly' | 'casual';
    responseLength: 'concise' | 'detailed';
    language: 'en' | 'ur' | 'hi';
  };
  appearance: {
    position: 'bottom-right' | 'bottom-left';
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
  };
}

interface CustomTrainingData {
  businessOverview: string;
  services: string[];
  pricingApproach: string;
  policies: string[];
  contactPreference: string;
  extraInstructions: string;
  faqs: FAQ[];
}
```

### 5.2 Training System

**Premade Knowledge Cards (Generated per niche):**

```typescript
const KNOWLEDGE_CARDS = {
  restaurant: [
    {
      id: 'restaurant_hours',
      title: 'Business Hours',
      content: 'Operating hours and days',
    },
    {
      id: 'restaurant_menu',
      title: 'Menu Information',
      content: 'Cuisine types and popular dishes',
    },
    {
      id: 'restaurant_reservations',
      title: 'Reservations',
      content: 'Booking process and policies',
    },
    // ... more cards
  ],
  hotel: [
    // Hotel-specific cards
  ],
  // ... other categories
};
```

**Custom Training Interface:**

```typescript
// src/features/builder/components/AITraining.tsx

export const AITrainingPanel = ({ pageId }: { pageId: string }) => {
  const [config, setConfig] = useState<AIConfig>(defaultConfig);
  
  const handleSaveTraining = async () => {
    // Validate training data
    // Sanitize all inputs
    // Save to Firestore
    await updatePageAI(pageId, config);
  };
  
  return (
    <div className="ai-training-panel">
      <section>
        <h3>Basic Information</h3>
        <TextField
          label="Business Overview"
          value={config.training.customData.businessOverview}
          onChange={(e) => updateField('businessOverview', e.target.value)}
          maxLength={500}
        />
      </section>
      
      <section>
        <h3>Services Offered</h3>
        <TagInput
          values={config.training.customData.services}
          onChange={(services) => updateField('services', services)}
        />
      </section>
      
      {/* More training fields */}
      
      <Button onClick={handleSaveTraining}>Save Training</Button>
    </div>
  );
};
```

### 5.3 AI Widget Implementation

**Floating Chat Widget:**

```typescript
// Embedded in published page if AI enabled

export const AIWidget = ({ config }: { config: AIConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const sendMessage = async (content: string) => {
    // Call secure API endpoint
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        pageId,
        message: content,
        history: messages,
      }),
    });
    
    const data = await response.json();
    setMessages([...messages, data.reply]);
  };
  
  return (
    <>
      <FloatingButton
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: config.appearance.primaryColor }}
      >
        {config.avatar ? (
          <img src={config.avatar} alt={config.name} />
        ) : (
          <ChatIcon />
        )}
      </FloatingButton>
      
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSend={sendMessage}
          config={config}
        />
      )}
    </>
  );
};
```

### 5.4 Secure API Proxy

**Server-Side AI Integration:**

```typescript
// src/app/api/ai/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting
  const limiter = await rateLimit(req);
  if (!limiter.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  const { pageId, message, history } = await req.json();
  
  // Get AI config from Firestore
  const pageDoc = await adminDb.collection('pages').doc(pageId).get();
  const aiConfig = pageDoc.data()?.aiConfig;
  
  if (!aiConfig?.enabled) {
    return NextResponse.json({ error: 'AI not enabled' }, { status: 403 });
  }
  
  // Get API key from system settings (admin configured)
  const settingsDoc = await adminDb.collection('systemSettings').doc('ai').get();
  const apiKey = settingsDoc.data()?.apiKey;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }
  
  // Call AI provider (OpenAI, Anthropic, etc.)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(aiConfig),
        },
        ...history,
        {
          role: 'user',
          content: message,
        },
      ],
    }),
  });
  
  const data = await response.json();
  
  return NextResponse.json({
    reply: {
      role: 'assistant',
      content: data.choices[0].message.content,
    },
  });
}

function buildSystemPrompt(config: AIConfig): string {
  return `
    You are ${config.name}, a helpful assistant for this business.
    
    Business Overview:
    ${config.training.customData.businessOverview}
    
    Services:
    ${config.training.customData.services.join(', ')}
    
    Pricing Approach:
    ${config.training.customData.pricingApproach}
    
    Contact Preference:
    ${config.training.customData.contactPreference}
    
    Additional Instructions:
    ${config.training.customData.extraInstructions}
    
    Tone: ${config.behavior.tone}
    Response Length: ${config.behavior.responseLength}
    
    Always provide accurate information based on the training data above.
    If you don't know something, say so and suggest contacting the business directly.
  `;
}
```

---

## Phase 6: Subscription & Payment System (Weeks 15-16)

### 6.1 Plan Definitions

```typescript
interface SubscriptionPlan {
  id: 'free' | 'starter' | 'business';
  name: string;
  price: number; // in paise/cents
  currency: 'INR';
  interval: 'month';
  features: {
    pagesLimit: number;
    templatesAccess: 'basic' | 'starter' | 'all';
    widgetsAccess: 'basic' | 'starter' | 'all';
    seo: boolean;
    analytics: boolean;
    customDomain: boolean;
    aiAssistant: boolean;
    versionHistory: boolean;
    prioritySupport: boolean;
    branding: 'kashpages' | 'removable' | 'none';
  };
  limitations: {
    storageGB: number;
    monthlyVisitors: number;
  };
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    interval: 'month',
    features: {
      pagesLimit: 1,
      templatesAccess: 'basic',
      widgetsAccess: 'basic',
      seo: false,
      analytics: false,
      customDomain: false,
      aiAssistant: false,
      versionHistory: false,
      prioritySupport: false,
      branding: 'kashpages',
    },
    limitations: {
      storageGB: 1,
      monthlyVisitors: 1000,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49900, // ₹499
    currency: 'INR',
    interval: 'month',
    features: {
      pagesLimit: 10,
      templatesAccess: 'starter',
      widgetsAccess: 'starter',
      seo: true,
      analytics: true,
      customDomain: false,
      aiAssistant: true,
      versionHistory: true,
      prioritySupport: true,
      branding: 'removable',
    },
    limitations: {
      storageGB: 10,
      monthlyVisitors: 10000,
    },
  },
  {
    id: 'business',
    name: 'Business',
    price: 249900, // ₹2,499
    currency: 'INR',
    interval: 'month',
    features: {
      pagesLimit: -1, // unlimited
      templatesAccess: 'all',
      widgetsAccess: 'all',
      seo: true,
      analytics: true,
      customDomain: true,
      aiAssistant: true,
      versionHistory: true,
      prioritySupport: true,
      branding: 'none',
    },
    limitations: {
      storageGB: 100,
      monthlyVisitors: -1, // unlimited
    },
  },
];
```

### 6.2 Payment Gateway Integration

**Cashfree Integration:**

```typescript
// src/lib/payments/cashfree.ts

import { Cashfree } from 'cashfree-pg-sdk-javascript';

export const initiateCashfreePayment = async (
  orderId: string,
  amount: number,
  userId: string
) => {
  // Get credentials from system settings
  const settings = await getSystemSettings('payments');
  const { cashfreeAppId, cashfreeSecretKey } = settings;
  
  if (!cashfreeAppId || !cashfreeSecretKey) {
    throw new Error('Cashfree not configured');
  }
  
  // Create order on server
  const order = await fetch('/api/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ orderId, amount, userId }),
  }).then(res => res.json());
  
  // Initialize Cashfree
  const cashfree = await Cashfree({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  });
  
  // Open payment modal
  const result = await cashfree.checkout({
    paymentSessionId: order.sessionId,
    redirectTarget: '_modal',
  });
  
  return result;
};
```

**Razorpay Integration:**

```typescript
// src/lib/payments/razorpay.ts

export const initiateRazorpayPayment = async (
  orderId: string,
  amount: number,
  userId: string
) => {
  const settings = await getSystemSettings('payments');
  const { razorpayKeyId } = settings;
  
  if (!razorpayKeyId) {
    throw new Error('Razorpay not configured');
  }
  
  const options = {
    key: razorpayKeyId,
    amount: amount,
    currency: 'INR',
    name: 'Kashpages',
    description: 'Subscription Payment',
    order_id: orderId,
    handler: async (response: any) => {
      // Verify payment on server
      await fetch('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify(response),
      });
    },
  };
  
  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
```

### 6.3 Subscription Management

**Server-Side Subscription Handler:**

```typescript
// src/app/api/subscriptions/upgrade/route.ts

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { planId } = await req.json();
  const userId = session.user.id;
  
  // Get plan details
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }
  
  // Create order
  const orderId = generateOrderId();
  await adminDb.collection('orders').doc(orderId).set({
    userId,
    planId,
    amount: plan.price,
    status: 'pending',
    createdAt: new Date(),
  });
  
  // Return order for payment
  return NextResponse.json({ orderId, amount: plan.price });
}
```

**Payment Verification:**

```typescript
// src/app/api/payments/verify/route.ts

export async function POST(req: NextRequest) {
  const { orderId, paymentId, signature } = await req.json();
  
  // Get order
  const orderDoc = await adminDb.collection('orders').doc(orderId).get();
  if (!orderDoc.exists) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  
  const order = orderDoc.data();
  
  // Verify signature (provider-specific)
  const isValid = await verifyPaymentSignature(orderId, paymentId, signature);
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Update order status
  await orderDoc.ref.update({
    status: 'completed',
    paymentId,
    completedAt: new Date(),
  });
  
  // Update user subscription
  await adminDb.collection('users').doc(order.userId).update({
    'subscription.plan': order.planId,
    'subscription.status': 'active',
    'subscription.currentPeriodEnd': addMonths(new Date(), 1),
  });
  
  // Update usage limits
  const plan = PLANS.find(p => p.id === order.planId);
  await adminDb.collection('users').doc(order.userId).update({
    'usage.pagesLimit': plan.features.pagesLimit,
    'usage.storageLimit': plan.limitations.storageGB * 1024 * 1024 * 1024,
  });
  
  return NextResponse.json({ success: true });
}
```

---

## Phase 7: Custom Domain System (Weeks 17-18)

### 7.1 Domain Management UI

```typescript
// src/features/domains/components/DomainSettings.tsx

export const DomainSettings = ({ pageId }: { pageId: string }) => {
  const { user } = useAuth();
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<DomainStatus>('pending');
  
  if (user.subscription.plan !== 'business') {
    return <UpgradePrompt feature="Custom Domain" />;
  }
  
  const connectDomain = async () => {
    // Validate domain
    if (!isValidDomain(domain)) {
      showError('Invalid domain');
      return;
    }
    
    // Check availability
    const response = await fetch('/api/domains/check', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
    
    const { available, token } = await response.json();
    
    if (!available) {
      showError('Domain already connected');
      return;
    }
    
    // Show DNS instructions
    showDNSInstructions(domain, token);
  };
  
  return (
    <div className="domain-settings">
      <h2>Custom Domain</h2>
      <p>Connect your own domain to this page</p>
      
      <Input
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="www.yourdomain.com"
      />
      
      <Button onClick={connectDomain}>Connect Domain</Button>
      
      {status === 'pending' && (
        <DNSInstructions domain={domain} />
      )}
      
      {status === 'verified' && (
        <StatusBadge>Domain Connected</StatusBadge>
      )}
    </div>
  );
};
```

### 7.2 DNS Verification

```typescript
// src/app/api/domains/verify/route.ts

import { Resolver } from 'dns/promises';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { domainId } = await req.json();
  
  // Get domain record
  const domainDoc = await adminDb.collection('domains').doc(domainId).get();
  const domain = domainDoc.data();
  
  if (!domain || domain.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Verify DNS records
  const resolver = new Resolver();
  
  try {
    // Check CNAME
    const cname = await resolver.resolveCname(domain.hostname);
    if (!cname.includes('cname.kashpages.com')) {
      return NextResponse.json({
        verified: false,
        error: 'CNAME not found or incorrect',
      });
    }
    
    // Check TXT for verification
    const txt = await resolver.resolveTxt(`_kashpages.${domain.hostname}`);
    const found = txt.flat().find(record => record === domain.verificationToken);
    
    if (!found) {
      return NextResponse.json({
        verified: false,
        error: 'Verification TXT record not found',
      });
    }
    
    // Mark as verified
    await domainDoc.ref.update({
      verified: true,
      verifiedAt: new Date(),
      sslStatus: 'pending',
    });
    
    // Trigger SSL provisioning
    await provisionSSL(domain.hostname);
    
    return NextResponse.json({ verified: true });
    
  } catch (error) {
    return NextResponse.json({
      verified: false,
      error: 'DNS verification failed',
    });
  }
}
```

### 7.3 SSL Certificate Management

```typescript
// Depends on hosting provider
// For Vercel:

export const provisionSSL = async (hostname: string) => {
  const response = await fetch(
    `https://api.vercel.com/v1/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: hostname,
      }),
    }
  );
  
  return response.json();
};
```

### 7.4 Request Routing

```typescript
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  
  // Check if custom domain
  if (hostname && !hostname.includes('kashpages.com')) {
    // Look up domain in database
    const domain = await lookupDomain(hostname);
    
    if (domain && domain.verified && domain.sslStatus === 'active') {
      // Rewrite to page
      return NextResponse.rewrite(
        new URL(`/p/${domain.pageId}`, request.url)
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
```

---

## Phase 8: Admin Panel (Weeks 19-20)

### 8.1 Admin Dashboard

**Key Metrics:**

```typescript
interface AdminMetrics {
  users: {
    total: number;
    active: number;
    suspended: number;
    new24h: number;
  };
  pages: {
    total: number;
    published: number;
    pending: number;
    drafts: number;
  };
  revenue: {
    mrr: number; // Monthly Recurring Revenue
    newSubscriptions: number;
    churnRate: number;
  };
  system: {
    storageUsed: number;
    bandwidthUsed: number;
    apiCalls: number;
  };
}
```

### 8.2 User Management

```typescript
// src/app/admin/users/page.tsx

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    plan: 'all',
  });
  
  const suspendUser = async (userId: string, reason: string) => {
    await fetch('/api/admin/users/suspend', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
    
    // Refresh list
    fetchUsers();
  };
  
  return (
    <AdminLayout>
      <UserTable
        users={users}
        onSuspend={suspendUser}
        onView={(user) => router.push(`/admin/users/${user.id}`)}
      />
    </AdminLayout>
  );
}
```

### 8.3 Content Moderation

```typescript
// src/app/admin/pages/page.tsx

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  
  const approvePage = async (pageId: string) => {
    await fetch('/api/admin/pages/approve', {
      method: 'POST',
      body: JSON.stringify({ pageId }),
    });
    
    fetchPages();
  };
  
  const rejectPage = async (pageId: string, reason: string) => {
    await fetch('/api/admin/pages/reject', {
      method: 'POST',
      body: JSON.stringify({ pageId, reason }),
    });
    
    fetchPages();
  };
  
  return (
    <AdminLayout>
      <h1>Page Moderation</h1>
      
      <FilterBar value={filter} onChange={setFilter} />
      
      <PageGrid
        pages={pages}
        onApprove={approvePage}
        onReject={rejectPage}
        onPreview={(page) => window.open(`/preview/${page.id}`)}
      />
    </AdminLayout>
  );
}
```

### 8.4 System Configuration

```typescript
// src/app/admin/settings/page.tsx

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({});
  
  const saveSettings = async () => {
    await fetch('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  };
  
  return (
    <AdminLayout>
      <h1>System Settings</h1>
      
      <SettingsSection title="AI Configuration">
        <Select
          label="AI Provider"
          value={settings.aiProvider}
          onChange={(value) => setSettings({ ...settings, aiProvider: value })}
          options={['openai', 'anthropic', 'google']}
        />
        
        <PasswordInput
          label="API Key"
          value={settings.aiApiKey}
          onChange={(value) => setSettings({ ...settings, aiApiKey: value })}
        />
      </SettingsSection>
      
      <SettingsSection title="Payment Gateways">
        <Checkbox
          label="Enable Cashfree"
          checked={settings.cashfreeEnabled}
          onChange={(checked) => setSettings({ ...settings, cashfreeEnabled: checked })}
        />
        
        {settings.cashfreeEnabled && (
          <>
            <TextField
              label="Cashfree App ID"
              value={settings.cashfreeAppId}
              onChange={(e) => setSettings({ ...settings, cashfreeAppId: e.target.value })}
            />
            
            <PasswordInput
              label="Cashfree Secret Key"
              value={settings.cashfreeSecretKey}
              onChange={(value) => setSettings({ ...settings, cashfreeSecretKey: value })}
            />
          </>
        )}
        
        <Checkbox
          label="Enable Razorpay"
          checked={settings.razorpayEnabled}
          onChange={(checked) => setSettings({ ...settings, razorpayEnabled: checked })}
        />
        
        {settings.razorpayEnabled && (
          <>
            <TextField
              label="Razorpay Key ID"
              value={settings.razorpayKeyId}
              onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
            />
            
            <PasswordInput
              label="Razorpay Secret Key"
              value={settings.razorpaySecretKey}
              onChange={(value) => setSettings({ ...settings, razorpaySecretKey: value })}
            />
          </>
        )}
      </SettingsSection>
      
      <Button onClick={saveSettings}>Save Settings</Button>
    </AdminLayout>
  );
}
```

---

## Phase 9: Testing & Quality Assurance (Weeks 21-22)

### 9.1 Testing Strategy

**Unit Tests:**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

```typescript
// __tests__/lib/sanitize.test.ts

import { sanitizeContent, validateUrl } from '@/lib/security/sanitize';

describe('Sanitization', () => {
  it('removes script tags', () => {
    const input = '<p>Hello <script>alert("xss")</script></p>';
    const output = sanitizeContent(input);
    expect(output).not.toContain('<script>');
  });
  
  it('validates HTTPS URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://example.com')).toBe(false);
    expect(validateUrl('javascript:alert(1)')).toBe(false);
  });
});
```

**Integration Tests:**

```typescript
// __tests__/features/page-creation.test.ts

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePageFlow from '@/app/dashboard/pages/create/page';

describe('Page Creation Flow', () => {
  it('creates page from template', async () => {
    render(<CreatePageFlow />);
    
    // Select template
    const template = screen.getByText('Creative Agency');
    await userEvent.click(template);
    
    // Enter title
    const titleInput = screen.getByLabelText('Page Title');
    await userEvent.type(titleInput, 'My Agency');
    
    // Create
    const createButton = screen.getByText('Create Page');
    await userEvent.click(createButton);
    
    // Should redirect to builder
    await waitFor(() => {
      expect(window.location.pathname).toMatch(/\/builder\//);  });
  });
});
```

**E2E Tests (Playwright):**

```bash
npm install -D @playwright/test
```

```typescript
// tests/e2e/signup.spec.ts

import { test, expect } from '@playwright/test';

test('complete signup flow', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### 9.2 Security Audit

**Checklist:**

- [ ] No secrets in client code
- [ ] All API endpoints authenticated
- [ ] Rate limiting on public endpoints
- [ ] Input sanitization everywhere
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection prevention (PostgreSQL)
- [ ] Firestore rules tested
- [ ] File upload validation
- [ ] Custom domain verification secure

### 9.3 Performance Optimization

**Metrics to Achieve:**

- Lighthouse Score: 90+
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s

**Optimizations:**

```typescript
// Image optimization
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

// Code splitting
const BuilderCanvas = dynamic(() => import('@/features/builder/components/BuilderCanvas'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// API caching
export const revalidate = 3600; // 1 hour
```

---

## Phase 10: Deployment (Week 23)

### 10.1 Production Checklist

**Environment:**

- [ ] Firebase project created
- [ ] All environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] CDN enabled

**Security:**

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Rate limiting active
- [ ] CORS configured
- [ ] Security headers set

**Monitoring:**

- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### 10.2 Deployment Steps

```bash
# 1. Deploy Firebase services
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage:rules
firebase deploy --only functions

# 2. Build Next.js
npm run build

# 3. Deploy to Vercel
vercel --prod

# 4. Configure domain
vercel domains add kashpages.com

# 5. Set environment variables
vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
# ... (all environment variables)

# 6. Verify deployment
curl https://kashpages.com/api/health
```

### 10.3 Post-Deployment

**Monitoring Setup:**

```typescript
// src/lib/monitoring/sentry.ts

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Health Check Endpoint:**

```typescript
// src/app/api/health/route.ts

export async function GET() {
  const checks = {
    firebase: await checkFirebaseConnection(),
    database: await checkDatabaseConnection(),
    storage: await checkStorageConnection(),
  };
  
  const allHealthy = Object.values(checks).every(v => v);
  
  return NextResponse.json(
    { status: allHealthy ? 'healthy' : 'degraded', checks },
    { status: allHealthy ? 200 : 503 }
  );
}
```

---

## Phase 11: Launch & Growth (Week 24+)

### 11.1 Soft Launch

**Beta Testing:**

- Invite 50 Kashmir businesses
- Collect feedback
- Fix critical issues
- Monitor performance

### 11.2 Marketing Launch

**Channels:**

- Kashmir business directories
- Social media campaigns
- Local tech communities
- Business associations
- Tourism board partnerships

### 11.3 Success Metrics

**Track:**

- User signups
- Page creations
- Publishing rate
- Subscription conversions
- User retention
- Customer satisfaction

---

## Critical Implementation Notes

### Security First

**NEVER:**

- Store API keys in client code
- Trust client-side validation alone
- Allow arbitrary HTML rendering
- Skip input sanitization
- Expose admin operations to client

**ALWAYS:**

- Validate on server
- Use Firestore security rules
- Rate limit public endpoints
- Sanitize user content
- Verify payment signatures
- Check user permissions

### Performance Considerations

**Optimize:**

- Use Next.js Image component
- Implement lazy loading
- Enable Firestore caching
- Use CDN for static assets
- Compress images on upload
- Minimize bundle size

### Scalability

**Design for growth:**

- Firestore composite indexes
- Database sharding strategy
- Background job queues
- Edge caching
- Auto-scaling functions

---

## Next Steps

Now that implementation plan is complete:

1. **Setup Firebase project** following `FIREBASE_SETUP.md`
2. **Configure local environment** with `.env.local`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`
5. **Begin with Phase 1** authentication system
6. **Follow phases sequentially** for best results

**Questions or issues?** Check `TROUBLESHOOTING.md` or documentation.

**Ready to build? Let's create the best business presence platform for Kashmir! 🚀**
