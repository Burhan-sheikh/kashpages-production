# Kashpages Architecture

## Product Overview
Kashpages = Digital presence infrastructure for Kashmir. A platform where shops, services, hotels, artisans, and professionals can create a public page, manage information, and be discovered via search & category.

**Think:** Google Business Profile + Linktree + Simple website builder + Local marketplace visibility

## Core Positioning
"Digital identity platform for local businesses" - not just a template builder.

## Tech Stack
- **Frontend:** React/Next.js
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Hosting:** Netlify
- **Version Control:** GitHub
- **Future:** Cloud Functions, Search Indexing, Image Optimization

## Database Schema (Firestore)

### users/
```typescript
{
  id: string
  name: string
  username: string // unique
  email: string
  phone: string
  photoURL: string
  bio: string
  role: 'user' | 'admin'
  createdAt: timestamp
  isVerified: boolean
  isBlocked: boolean
}
```

### pages/
```typescript
{
  id: string
  title: string
  slug: string // username-based URL
  ownerId: string
  category: string
  subCategory: string
  tags: string[]
  status: 'draft' | 'submitted' | 'under_review' | 'published' | 'rejected' | 'unpublished'
  planType: 'free' | 'basic' | 'featured' | 'verified' | 'premium'
  createdAt: timestamp
  publishedAt: timestamp
  views: number
  
  // Address
  address: {
    addressLine1: string
    addressLine2: string
    city: string
    district: string
    postalCode: string
    geo: { lat: number, lng: number } // future
  }
  
  // Contact
  contact: {
    phone: string
    whatsapp: string
    email: string
    website: string
    socialLinks: {
      instagram: string
      facebook: string
      youtube: string
    }
  }
  
  // Design
  design: {
    primaryColor: string
    secondaryColor: string
    fontPair: string
    borderRadius: string
    shadows: boolean
    containerWidth: string
    theme: 'light' | 'dark'
    gradient: object
  }
  
  // Sections
  sections: Section[]
}
```

### Section Structure
```typescript
{
  id: string
  type: 'hero' | 'about' | 'contact' | 'map' | 'gallery' | 'services' | 'working_hours' | 'testimonials' | 'reviews' | 'certifications' | 'clients' | 'cta_banner' | 'offers' | 'pricing' | 'faq' | 'team' | 'video' | 'menu' | 'products'
  data: object // section-specific data
  visibility: {
    mobile: boolean
    desktop: boolean
  }
  locked: boolean
  order: number
}
```

### categories/
```typescript
{
  id: string
  name: string
  slug: string
  icon: string
  description: string
  parentId: string | null
  isHighlighted: boolean
  pageCount: number
  createdAt: timestamp
}
```

### locations/
```typescript
{
  id: string
  name: string
  slug: string
  district: string
  type: 'city' | 'district' | 'area'
  pageCount: number
  isFeatured: boolean
}
```

### reports/
```typescript
{
  id: string
  reportedBy: string
  pageId: string
  reason: string
  description: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: timestamp
  resolvedAt: timestamp
  resolvedBy: string
}
```

### plans/
```typescript
{
  id: string
  name: string
  price: number
  features: string[]
  limits: {
    maxPages: number
    maxImages: number
    maxSections: number
  }
  benefits: string[]
}
```

### reviews/ (future)
```typescript
{
  id: string
  pageId: string
  userId: string
  rating: number
  comment: string
  createdAt: timestamp
  isVerified: boolean
}
```

## Page Lifecycle
```
Draft → Submitted → Under Review → Published
                                  ↓
                              Rejected
                                  ↓
                            Unpublished
```

## Monetization Plans
- **Free:** Draft only, limited features
- **Basic:** Publish pages
- **Featured:** Homepage visibility
- **Verified:** Trust badge
- **Premium:** Top placement in search
