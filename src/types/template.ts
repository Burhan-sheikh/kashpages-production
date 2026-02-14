import { BaseDocument, Plan } from './common';
import { ContentSchema } from './builder';

export type TemplateCategory = 
  | 'agency'
  | 'ecommerce'
  | 'landing'
  | 'nonprofit'
  | 'portfolio'
  | 'saas'
  | 'services';

export interface Template extends BaseDocument {
  name: string;
  description: string;
  category: TemplateCategory;
  previewImage: string;
  previewUrl?: string;
  schema: ContentSchema;
  plan: Plan; // Minimum plan required
  featured: boolean;
  usageCount: number;
  rating?: number;
  tags: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  isActive: boolean;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  plan?: Plan;
  featured?: boolean;
  search?: string;
}
