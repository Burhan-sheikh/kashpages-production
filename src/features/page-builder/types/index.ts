// Page Builder Types

export type PageStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'published' 
  | 'rejected' 
  | 'unpublished';

export type PlanType = 
  | 'free' 
  | 'basic' 
  | 'featured' 
  | 'verified' 
  | 'premium';

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
  geo?: {
    lat: number;
    lng: number;
  };
}

export interface ContactInfo {
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

export interface Design {
  primaryColor: string;
  secondaryColor: string;
  fontPair: string;
  borderRadius: string;
  shadows: boolean;
  containerWidth: string;
  theme: 'light' | 'dark';
  gradient?: object;
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'contact' 
  | 'map' 
  | 'gallery' 
  | 'services' 
  | 'working_hours'
  | 'testimonials' 
  | 'reviews' 
  | 'certifications' 
  | 'clients'
  | 'cta_banner' 
  | 'offers' 
  | 'pricing' 
  | 'faq'
  | 'team' 
  | 'video' 
  | 'menu' 
  | 'products';

export interface Section {
  id: string;
  type: SectionType;
  data: Record<string, any>;
  visibility: {
    mobile: boolean;
    desktop: boolean;
  };
  locked: boolean;
  order: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  ownerId: string;
  category: string;
  subCategory?: string;
  tags: string[];
  status: PageStatus;
  planType: PlanType;
  createdAt: Date;
  publishedAt?: Date;
  views: number;
  address: Address;
  contact: ContactInfo;
  design: Design;
  sections: Section[];
}

export interface PageFormData {
  title: string;
  category: string;
  subCategory?: string;
  tags: string[];
  address: Address;
  contact: ContactInfo;
}

export interface SectionTemplate {
  id: string;
  name: string;
  type: SectionType;
  thumbnail: string;
  data: Record<string, any>;
}
