// Firestore collection names and types
export const COLLECTIONS = {
  USERS: 'users',
  PAGES: 'pages',
  TEMPLATES: 'templates',
  ANALYTICS: 'analytics',
  SUBSCRIPTIONS: 'subscriptions',
  AUDIT_LOGS: 'auditLogs',
  PENDING_APPROVALS: 'pendingApprovals',
  NOTIFICATIONS: 'notifications',
} as const;

// User roles
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

// Page status
export enum PageStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// User document structure
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  phone: string | null;
  businessName: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
  };
  stats: {
    totalPages: number;
    publishedPages: number;
    totalViews: number;
  };
}

// Page document structure
export interface PageDocument {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  sections: any[];
  design: any;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string | null;
  };
  status: PageStatus;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  category: string;
  tags: string[];
  customDomain: string | null;
  isPremium: boolean;
}

// Pending approval document
export interface PendingApprovalDocument {
  id: string;
  pageId: string;
  userId: string;
  type: 'create' | 'update';
  changes: any;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  reviewNotes: string | null;
}

// Audit log document
export interface AuditLogDocument {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: Date;
}
