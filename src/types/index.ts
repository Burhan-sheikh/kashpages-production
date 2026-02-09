// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    lastLogin: Date;
    loginCount: number;
  };
}

// ============================================
// PAGE & BUILDER TYPES
// ============================================

export type PageStatus = 'draft' | 'published' | 'pending' | 'rejected';

export interface Page {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description?: string;
  status: PageStatus;
  sections: Section[];
  settings: PageSettings;
  seo: SEOSettings;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views: number;
  likes: number;
}

export interface PageSettings {
  template: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  layout: {
    maxWidth: string;
    spacing: string;
  };
  header: {
    enabled: boolean;
    logo?: string;
    navigation: NavigationItem[];
  };
  footer: {
    enabled: boolean;
    copyright: string;
    links: NavigationItem[];
  };
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  target?: '_blank' | '_self';
  icon?: string;
}

// ============================================
// SECTION & ELEMENT TYPES
// ============================================

export type SectionType =
  | 'hero'
  | 'features'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'contact'
  | 'cta'
  | 'faq'
  | 'blog'
  | 'custom';

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  order: number;
  visible: boolean;
  elements: Element[];
  styles: SectionStyles;
  settings: SectionSettings;
}

export interface SectionStyles {
  backgroundColor: string;
  backgroundImage?: string;
  padding: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  margin: {
    top: string;
    bottom: string;
  };
  customCSS?: string;
}

export interface SectionSettings {
  fullWidth: boolean;
  containerWidth: string;
  animation?: AnimationSettings;
}

export type ElementType =
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'video'
  | 'form'
  | 'divider'
  | 'spacer'
  | 'icon'
  | 'card'
  | 'column'
  | 'row'
  | 'widget';

export interface Element {
  id: string;
  type: ElementType;
  order: number;
  content: any; // Type varies by element
  styles: ElementStyles;
  settings: ElementSettings;
}

export interface ElementStyles {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  customCSS?: string;
}

export interface ElementSettings {
  visible: boolean;
  responsive: {
    mobile: Partial<ElementStyles>;
    tablet: Partial<ElementStyles>;
    desktop: Partial<ElementStyles>;
  };
  animation?: AnimationSettings;
  link?: {
    url: string;
    target: '_blank' | '_self';
  };
}

export interface AnimationSettings {
  type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
  duration: number;
  delay: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// ============================================
// WIDGET TYPES
// ============================================

export type WidgetType =
  | 'contact-form'
  | 'newsletter'
  | 'social-icons'
  | 'pricing-table'
  | 'testimonial-slider'
  | 'gallery'
  | 'countdown'
  | 'map'
  | 'custom';

export interface Widget {
  id: string;
  type: WidgetType;
  name: string;
  icon: string;
  category: string;
  settings: any; // Type varies by widget
  defaultContent: any;
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  sections: Section[];
  settings: PageSettings;
  premium: boolean;
  downloads: number;
  rating: number;
}

// ============================================
// MEDIA TYPES (Cloudinary)
// ============================================

export interface MediaAsset {
  id: string;
  userId: string;
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
  folder: string;
  tags: string[];
  createdAt: Date;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminStats {
  totalUsers: number;
  totalPages: number;
  publishedPages: number;
  pendingPages: number;
  totalViews: number;
  newUsersThisMonth: number;
  newPagesThisMonth: number;
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: 'approve' | 'reject' | 'delete' | 'ban' | 'unban';
  targetType: 'user' | 'page';
  targetId: string;
  reason?: string;
  timestamp: Date;
}

// ============================================
// REAL-TIME COLLABORATION TYPES
// ============================================

export interface RealtimeSession {
  pageId: string;
  userId: string;
  userName: string;
  cursor: {
    x: number;
    y: number;
  };
  selectedElement?: string;
  lastActive: number;
}

export interface RealtimeUpdate {
  sessionId: string;
  type: 'element-update' | 'section-update' | 'cursor-move';
  data: any;
  timestamp: number;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

export interface FormSettings {
  id: string;
  name: string;
  fields: FormField[];
  submitButton: {
    text: string;
    styles: ElementStyles;
  };
  notifications: {
    email: string;
    subject: string;
    message: string;
  };
  redirectUrl?: string;
  successMessage: string;
}

// ============================================
// EXPORT ALL
// ============================================

export type * from './index';
