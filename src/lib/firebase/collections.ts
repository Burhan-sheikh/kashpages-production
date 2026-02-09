// KashPages Firestore Collections

export const COLLECTIONS = {
  // Core
  USERS: 'users',
  PAGES: 'pages',
  
  // Discovery
  CATEGORIES: 'categories',
  LOCATIONS: 'locations',
  
  // Moderation
  REPORTS: 'reports',
  PENDING_APPROVALS: 'pending_approvals',
  
  // Analytics
  ANALYTICS: 'analytics',
  PAGE_ANALYTICS: 'page_analytics',
  
  // Reviews (Future)
  REVIEWS: 'reviews',
  
  // Admin
  HOMEPAGE_BLOCKS: 'homepage_blocks',
  AUDIT_LOGS: 'audit_logs',
  
  // Marketing
  PLANS: 'plans',
  SUBSCRIPTIONS: 'subscriptions',
  
  // Notifications
  NOTIFICATIONS: 'notifications',
} as const;

// Re-export enums from platform types
export { UserRole, PageStatus, PlanType, ReportStatus } from '@/types/platform';

// Re-export main types
export type {
  UserProfile,
  PageDocument,
  Category,
  Location,
  Report,
  PageAnalytics,
  HomepageBlock,
} from '@/types/platform';
