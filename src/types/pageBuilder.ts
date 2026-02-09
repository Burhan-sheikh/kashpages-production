export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'team'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'newsletter'
  | 'video'
  | 'features'
  | 'stats'
  | 'logo-cloud'
  | 'blog'
  | 'countdown';

export interface Section {
  id: string;
  type: SectionType;
  name: string;
  isLocked: boolean;
  hideOnMobile: boolean;
  hideOnDesktop: boolean;
  order: number;
  content: any;
  styles: SectionStyles;
}

export interface SectionStyles {
  backgroundColor: string;
  backgroundGradient?: {
    enabled: boolean;
    from: string;
    to: string;
    direction: string;
  };
  padding: {
    mobile: string;
    desktop: string;
  };
  margin: {
    top: string;
    bottom: string;
  };
}

export interface PageStyles {
  primaryColor: string;
  secondaryColor: string;
  typography: {
    fontFamily: string;
    h1Size: string;
    h2Size: string;
    h3Size: string;
    h4Size: string;
    h5Size: string;
    h6Size: string;
    bodySize: string;
  };
  buttons: {
    variant: 'solid' | 'outline' | 'ghost';
    borderRadius: string;
  };
  shadows: {
    intensity: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  container: {
    mobile: 'full' | 'boxed' | 'custom';
    desktop: 'full' | 'boxed' | 'custom';
    customWidth?: string;
  };
  darkMode: boolean;
}

export interface PageBuilderState {
  sections: Section[];
  selectedSectionId: string | null;
  history: Section[][];
  historyIndex: number;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  showLayersPanel: boolean;
  cookieBannerEnabled: boolean;
  stickyCtaEnabled: boolean;
}

export interface HistoryAction {
  type: 'add' | 'remove' | 'update' | 'reorder' | 'duplicate';
  sectionId?: string;
  data?: any;
}
