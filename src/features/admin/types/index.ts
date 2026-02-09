// Admin Types

export interface DashboardMetrics {
  totalUsers: number;
  totalPages: number;
  publishedPages: number;
  pendingReviews: number;
  totalViews: number;
  growthRate: number;
}

export interface AdminPageFilters {
  status?: string;
  category?: string;
  planType?: string;
  verified?: boolean;
  featured?: boolean;
  search?: string;
}

export interface PageModeration {
  pageId: string;
  action: 'approve' | 'reject' | 'feature' | 'unfeature' | 'verify' | 'suspend' | 'delete';
  reason?: string;
  adminId: string;
  timestamp: Date;
}

export interface Report {
  id: string;
  reportedBy: string;
  pageId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface PlatformSettings {
  privacyPolicy: string;
  termsOfService: string;
  contactEmail: string;
  supportPhone: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface UserManagement {
  userId: string;
  action: 'block' | 'unblock' | 'verify' | 'change_role' | 'delete';
  newRole?: 'user' | 'admin';
  reason?: string;
}
