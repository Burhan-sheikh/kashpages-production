// Analytics Types

export interface PageAnalytics {
  pageId: string;
  views: number;
  uniqueVisitors: number;
  clicks: {
    contact: number;
    whatsapp: number;
    website: number;
    instagram: number;
    facebook: number;
    youtube: number;
  };
  viewsOverTime: TimeSeriesData[];
  topReferrers: Referrer[];
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface Referrer {
  source: string;
  count: number;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalPages: number;
  totalViews: number;
  userGrowth: TimeSeriesData[];
  pageGrowth: TimeSeriesData[];
  popularCategories: CategoryStats[];
  topLocations: LocationStats[];
}

export interface CategoryStats {
  category: string;
  pageCount: number;
  viewCount: number;
}

export interface LocationStats {
  location: string;
  pageCount: number;
  viewCount: number;
}

export interface AnalyticsEvent {
  type: 'page_view' | 'click' | 'share' | 'search';
  pageId?: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}
