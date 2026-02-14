// Builder Schema Types - Schema-driven content system
// NO arbitrary HTML - strict component whitelist only

export type SectionType = 
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'gallery'
  | 'contact'
  | 'footer'
  | 'stats'
  | 'team'
  | 'process'
  | 'cta';

export type ElementType = 
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'video'
  | 'form'
  | 'divider'
  | 'spacer'
  | 'socialLinks'
  | 'map'
  | 'badge'
  | 'list';

export type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export interface BaseElement {
  id: string;
  type: ElementType;
  styles: ElementStyles;
  visible: boolean;
  order: number;
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    align: 'left' | 'center' | 'right';
  };
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  content: {
    text: string;
    align: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  content: {
    text: string;
    link: string;
    openInNewTab: boolean;
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
  };
}

export interface ImageElement extends BaseElement {
  type: 'image';
  content: {
    src: string;
    alt: string;
    link?: string;
    fit: 'cover' | 'contain' | 'fill';
    aspectRatio?: string;
  };
}

export interface VideoElement extends BaseElement {
  type: 'video';
  content: {
    provider: 'youtube' | 'vimeo' | 'direct';
    videoId?: string; // For YouTube/Vimeo
    src?: string; // For direct video
    thumbnail?: string;
    autoplay: boolean;
    controls: boolean;
  };
}

export interface FormElement extends BaseElement {
  type: 'form';
  content: {
    fields: FormField[];
    submitText: string;
    submitAction: 'email' | 'webhook';
    submitTarget: string; // Email address or webhook URL
    successMessage: string;
  };
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select
}

export interface SocialLinksElement extends BaseElement {
  type: 'socialLinks';
  content: {
    links: Array<{
      platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'whatsapp';
      url: string;
    }>;
    style: 'icons' | 'buttons';
    size: 'sm' | 'md' | 'lg';
  };
}

export interface ListElement extends BaseElement {
  type: 'list';
  content: {
    items: string[];
    style: 'bullet' | 'numbered' | 'checkmark';
  };
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  content: {
    style: 'solid' | 'dashed' | 'dotted';
    width: string;
  };
}

export interface SpacerElement extends BaseElement {
  type: 'spacer';
  content: {
    height: string;
  };
}

export interface MapElement extends BaseElement {
  type: 'map';
  content: {
    address: string;
    latitude?: number;
    longitude?: number;
    zoom: number;
    marker: boolean;
  };
}

export interface BadgeElement extends BaseElement {
  type: 'badge';
  content: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
}

export type ContentElement = 
  | HeadingElement
  | ParagraphElement
  | ButtonElement
  | ImageElement
  | VideoElement
  | FormElement
  | SocialLinksElement
  | ListElement
  | DividerElement
  | SpacerElement
  | MapElement
  | BadgeElement;

export interface ElementStyles {
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  background?: {
    color?: string;
    image?: string;
  };
  border?: {
    width?: string;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    radius?: string;
  };
  typography?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  animation?: {
    type: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'none';
    duration: number;
    delay: number;
  };
}

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  elements: ContentElement[];
  styles: SectionStyles;
  visible: boolean;
  locked: boolean; // For template sections
  order: number;
}

export interface SectionStyles {
  background?: {
    color?: string;
    image?: string;
    overlay?: string;
  };
  padding?: {
    top: string;
    bottom: string;
  };
  maxWidth?: string;
  fullWidth?: boolean;
}

export interface ContentSchema {
  version: string; // Schema version for backward compatibility
  sections: Section[];
  globalStyles: GlobalStyles;
  metadata: {
    lastEditedAt: number;
    lastEditedBy: string;
  };
}

export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
    baseFontSize: string;
  };
  spacing: {
    base: string;
  };
  borderRadius: string;
}

export interface BuilderState {
  schema: ContentSchema;
  selectedSectionId: string | null;
  selectedElementId: string | null;
  mode: ResponsiveMode;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: number | null;
  history: {
    past: ContentSchema[];
    future: ContentSchema[];
  };
}

export interface BuilderAction {
  type: string;
  payload?: any;
}
