import { BaseDocument, SEOMetadata, Timestamp } from './common';
import { ContentSchema } from './builder';
import { AIConfig } from './ai';

export type PageStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived';

export interface Page extends BaseDocument {
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  title: string;
  slug: string;
  status: PageStatus;
  templateId: string;
  templateName: string;
  seo: SEOMetadata;
  contentSchema: ContentSchema;
  aiConfig?: AIConfig;
  customDomain?: string;
  analytics: {
    views: number;
    uniqueVisitors: number;
    lastViewedAt?: Timestamp;
  };
  publishedAt?: Timestamp;
  rejectionReason?: string;
  version: number;
  isPublic: boolean;
  removeBranding: boolean; // Premium feature
}

export interface PageRevision {
  id: string;
  pageId: string;
  contentSchema: ContentSchema;
  seo: SEOMetadata;
  timestamp: Timestamp;
  createdBy: string;
  version: number;
  changeDescription?: string;
}

export interface PageAnalytics {
  pageId: string;
  date: string; // YYYY-MM-DD
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  referrers: Record<string, number>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries: Record<string, number>;
}

export interface PageCreateInput {
  title: string;
  templateId: string;
  slug?: string;
}

export interface PageUpdateInput {
  title?: string;
  slug?: string;
  contentSchema?: ContentSchema;
  seo?: Partial<SEOMetadata>;
  aiConfig?: AIConfig;
  status?: PageStatus;
}

export interface PagePublishInput {
  slug: string;
  seo: SEOMetadata;
}
