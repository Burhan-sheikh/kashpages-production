// Discovery & Search Types

export interface SearchFilters {
  category?: string;
  location?: string;
  verified?: boolean;
  planType?: string;
  openNow?: boolean;
  rating?: number;
}

export type SortOption = 
  | 'trending' 
  | 'newest' 
  | 'most_viewed' 
  | 'alphabetic' 
  | 'rating';

export interface SearchParams {
  query: string;
  filters: SearchFilters;
  sort: SortOption;
  page: number;
  limit: number;
}

export interface SearchResult {
  pages: Page[];
  total: number;
  hasMore: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  parentId?: string;
  isHighlighted: boolean;
  pageCount: number;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  district: string;
  type: 'city' | 'district' | 'area';
  pageCount: number;
  isFeatured: boolean;
}

export interface HomepageBlock {
  id: string;
  title: string;
  type: 'trending' | 'featured' | 'new' | 'verified' | 'category' | 'location';
  pageIds: string[];
  order: number;
  isVisible: boolean;
}
