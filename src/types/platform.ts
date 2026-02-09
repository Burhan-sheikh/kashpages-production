// KashPages Platform Types - Complete Master Blueprint

import { Timestamp } from 'firebase/firestore';

// ==================== CORE ENUMS ====================

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

export enum PageStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  UNPUBLISHED = 'unpublished',
}

export enum PlanType {
  FREE = 'free',
  BASIC = 'basic',
  FEATURED = 'featured',
  VERIFIED = 'verified',
  PREMIUM = 'premium',
}

export enum ReportStatus {
  PENDING = 'pending',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

// ==================== USER SYSTEM ====================

export interface UserProfile {
  uid: string;
  username: string; // unique
  email: string;
  displayName: string;
  phone: string | null;
  photoURL: string | null;
  bio: string | null;
  role: UserRole;
  
  // Status
  isVerified: boolean;
  isBlocked: boolean;
  isEmailVerified: boolean;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp | null;
  
  // Settings
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
  };
  
  // Stats
  stats: {
    totalPages: number;
    publishedPages: number;
    totalViews: number;
  };
}

// ==================== ADDRESS SYSTEM ====================

export interface Address {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  district: string;
  state: string;
  postalCode: string | null;
  country: string;
  
  // Future: Geolocation
  geo?: {
    lat: number;
    lng: number;
  };
}

// ==================== CONTACT INFO ====================

export interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  
  socialLinks: {
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    twitter: string | null;
    linkedin: string | null;
  };
}

// ==================== WORKING HOURS ====================

export interface WorkingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

// ==================== PAGE SECTION SYSTEM ====================

export enum SectionType {
  HERO = 'hero',
  ABOUT = 'about',
  SERVICES = 'services',
  GALLERY = 'gallery',
  TESTIMONIALS = 'testimonials',
  TEAM = 'team',
  PRICING = 'pricing',
  FAQ = 'faq',
  CTA = 'cta',
  CONTACT = 'contact',
  VIDEO = 'video',
  MENU = 'menu',
  PRODUCTS = 'products',
  MAP = 'map',
  WORKING_HOURS = 'working_hours',
  CERTIFICATIONS = 'certifications',
  CLIENTS = 'clients',
  REVIEWS = 'reviews',
}

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  data: Record<string, any>;
  visibility: {
    mobile: boolean;
    desktop: boolean;
  };
  locked: boolean;
  styles?: Record<string, any>;
}

// ==================== PAGE DESIGN SYSTEM ====================

export interface PageDesign {
  theme: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    containerWidth: 'narrow' | 'medium' | 'wide' | 'full';
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'relaxed';
  };
  effects: {
    shadows: boolean;
    animations: boolean;
    gradients: boolean;
  };
}

// ==================== PAGE DOCUMENT ====================

export interface PageDocument {
  id: string;
  
  // Ownership
  ownerId: string;
  ownerName: string;
  
  // Identity
  title: string;
  slug: string; // username-based URL
  description: string;
  thumbnail: string | null;
  
  // Categorization
  category: string;
  subCategory: string | null;
  tags: string[];
  
  // Location
  address: Address;
  
  // Contact
  contact: ContactInfo;
  
  // Hours
  workingHours: WorkingHours | null;
  
  // Content
  sections: PageSection[];
  design: PageDesign;
  
  // Status & Lifecycle
  status: PageStatus;
  planType: PlanType;
  rejectionReason: string | null;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
  submittedAt: Timestamp | null;
  
  // Stats
  views: number;
  clicks: number;
  calls: number;
  
  // Features
  isFeatured: boolean;
  isVerified: boolean;
  isTrending: boolean;
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string | null;
  };
}

// ==================== CATEGORY SYSTEM ====================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  pageCount: number;
  subCategories: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== LOCATION SYSTEM ====================

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: 'district' | 'city' | 'area';
  parent: string | null;
  description: string | null;
  thumbnail: string | null;
  pageCount: number;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
}

// ==================== REPORTS & MODERATION ====================

export interface Report {
  id: string;
  reportedPageId: string;
  reportedUserId: string;
  reporterUserId: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: Timestamp;
  reviewedAt: Timestamp | null;
  reviewedBy: string | null;
  reviewNotes: string | null;
}

// ==================== ANALYTICS ====================

export interface PageAnalytics {
  pageId: string;
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  clicks: number;
  calls: number;
  topReferrers: Record<string, number>;
  deviceTypes: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

// ==================== REVIEWS (FUTURE) ====================

export interface Review {
  id: string;
  pageId: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  rating: number; // 1-5
  comment: string;
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ==================== HOMEPAGE BLOCKS ====================

export interface HomepageBlock {
  id: string;
  type: 'trending' | 'featured' | 'locations' | 'luxury' | 'traditional' | 'new' | 'verified' | 'category';
  title: string;
  description: string | null;
  order: number;
  isActive: boolean;
  
  // Either manual IDs or auto-query
  pageIds: string[] | null;
  query: {
    category?: string;
    location?: string;
    tags?: string[];
    limit: number;
  } | null;
}
