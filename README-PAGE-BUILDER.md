# KashPages Page Builder Platform

## 🎨 Professional, Modern, Dynamic Landing Page Builder

A complete drag-and-drop page builder with inline editing, real-time preview, and comprehensive section components.

---

## ✨ Key Features

### 🎯 Core Capabilities
- **Drag & Drop Interface** - Reorder sections with smooth animations
- **Inline Editing** - Click to edit text directly on the canvas
- **Real-time Preview** - See changes instantly as you build
- **Mobile & Desktop Preview** - Switch between device views
- **Undo/Redo** - Full history management with keyboard shortcuts
- **Section Library** - 10+ pre-built section types
- **Global Theming** - Unified color and typography controls
- **Export/Import** - Save and load your designs as JSON

### 🎨 Section Components
1. **Hero Section** - Large headers with CTA buttons
2. **About Section** - Company/product introduction with features
3. **Services Section** - Service offerings with icons
4. **Gallery Section** - Image grid with hover effects
5. **Testimonials Section** - Customer reviews with ratings
6. **Team Section** - Team member profiles with social links
7. **Pricing Section** - Pricing tables with highlights
8. **FAQ Section** - Accordion-style Q&A
9. **CTA Section** - Call-to-action banners
10. **Contact Section** - Contact form with info cards

### 🛠️ Technical Features
- **Type-Safe** - Full TypeScript implementation
- **Responsive Design** - Mobile-first with safe area support
- **Dark Mode** - Complete dark theme support
- **Accessibility** - ARIA labels, keyboard navigation
- **Performance** - Optimized rendering with React 18
- **Modern Stack** - Next.js 14, Tailwind CSS, Radix UI

---

## 📁 Project Structure

```
src/
├── components/
│   ├── page-builder/
│   │   ├── PageBuilderPlatform.tsx    # Main container
│   │   ├── TopToolbar.tsx             # Top action bar
│   │   ├── LeftSidebar.tsx            # Sections list
│   │   ├── RightSidebar.tsx           # Properties panel
│   │   ├── LivePreview.tsx            # Canvas renderer
│   │   ├── SectionsLibrary.tsx        # Section picker modal
│   │   ├── InlineEditor.tsx           # Contenteditable wrapper
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── AboutSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── GallerySection.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── TeamSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── FAQSection.tsx
│   │       ├── CTASection.tsx
│   │       └── ContactSection.tsx
│   └── ui/
│       ├── input.tsx
│       ├── select.tsx
│       └── tabs.tsx
├── hooks/
│   └── usePageBuilderHistory.ts       # State management
├── types/
│   └── pageBuilder.ts                  # Type definitions
└── app/
    └── globals.css                     # Global styles
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Required packages
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install react-contenteditable
npm install lucide-react
```

### Usage

```tsx
import { PageBuilderPlatform } from '@/components/page-builder/PageBuilderPlatform';

export default function BuilderPage() {
  return <PageBuilderPlatform />;
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#3B82F6` (Blue)
- **Secondary**: `#8B5CF6` (Purple)
- **Background**: `#F9FAFB` (Light) / `#111827` (Dark)
- **Text**: `#111827` (Light) / `#F3F4F6` (Dark)

### Typography
- **Font Family**: Inter, sans-serif
- **Headings**: 3rem - 1rem (responsive)
- **Body**: 1rem with 1.5 line height

### Spacing Scale
- **XS**: 0.5rem (8px)
- **SM**: 1rem (16px)
- **MD**: 1.5rem (24px)
- **LG**: 2rem (32px)
- **XL**: 3rem (48px)

### Border Radius
- **SM**: 6px
- **MD**: 8px
- **LG**: 12px
- **XL**: 16px

---

## 🔧 Component Architecture

### State Management

```typescript
const {
  sections,              // Array of section objects
  selectedSectionId,     // Currently selected section ID
  globalStyles,          // Theme settings
  addSection,            // Add new section
  removeSection,         // Delete section
  updateSection,         // Modify section
  duplicateSection,      // Clone section
  reorderSections,       // Change order
  selectSection,         // Select for editing
  updateGlobalStyles,    // Change theme
  undo,                  // Undo last change
  redo,                  // Redo change
  canUndo,               // Can undo?
  canRedo,               // Can redo?
} = usePageBuilderHistory();
```

### Section Type Definition

```typescript
interface Section {
  id: string;                    // Unique identifier
  type: SectionType;             // Section category
  name: string;                  // Display name
  isLocked: boolean;             // Prevent editing
  hideOnMobile: boolean;         // Mobile visibility
  hideOnDesktop: boolean;        // Desktop visibility
  order: number;                 // Position in page
  content: Record<string, any>;  // Section-specific data
  styles: {
    backgroundColor: string;
    textColor?: string;
    padding: {
      mobile: string;
      desktop: string;
    };
    margin: {
      top: string;
      bottom: string;
    };
    backgroundGradient?: {
      enabled: boolean;
      from: string;
      to: string;
      direction: string;
    };
  };
}
```

---

## 🎯 Usage Examples

### Adding a New Section Type

1. Create component in `sections/`:
```tsx
export function NewSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: SectionProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Your section content */}
    </div>
  );
}
```

2. Register in `LivePreview.tsx`:
```tsx
case 'new-section':
  return <NewSection {...props} />;
```

3. Add to `SectionsLibrary.tsx`:
```tsx
{ type: 'new-section', name: 'New Section', icon: 'Icon', description: 'Description' }
```

### Customizing Global Styles

```tsx
const customStyles: PageStyles = {
  primaryColor: '#FF6B6B',
  secondaryColor: '#4ECDC4',
  typography: {
    fontFamily: 'Poppins, sans-serif',
    // ...
  },
  buttons: {
    variant: 'solid',
    borderRadius: '12px',
  },
  darkMode: false,
};

updateGlobalStyles(customStyles);
```

---

## 🔑 Keyboard Shortcuts

- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Y** - Redo
- **Ctrl/Cmd + S** - Save (custom implementation)
- **Delete** - Remove selected section (custom implementation)

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Safe Area Support
- iOS notch/safe area insets
- Android navigation bars
- Landscape orientation

---

## ♿ Accessibility Features

- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Tab through UI
- **Focus Indicators** - Visible focus states
- **Color Contrast** - WCAG AA compliant
- **Reduced Motion** - Respects user preferences
- **High Contrast Mode** - Support for system setting

---

## 🎨 Theming

### Light Mode
```css
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--text-primary: #111827
--text-secondary: #6B7280
```

### Dark Mode
```css
--bg-primary: #111827
--bg-secondary: #1F2937
--text-primary: #F3F4F6
--text-secondary: #9CA3AF
```

---

## 🚀 Performance Optimization

- **React 18** - Automatic batching and transitions
- **Code Splitting** - Lazy load section components
- **Memoization** - Prevent unnecessary re-renders
- **Debounced Updates** - Optimize inline editing
- **Virtual Scrolling** - Handle large section lists

---

## 📦 Export Format

```json
{
  "sections": [
    {
      "id": "section-123",
      "type": "hero",
      "name": "Hero Section",
      "content": { /* ... */ },
      "styles": { /* ... */ }
    }
  ],
  "globalStyles": {
    "primaryColor": "#3B82F6",
    "typography": { /* ... */ }
  },
  "exportedAt": "2024-02-09T15:30:00.000Z"
}
```

---

## 🔮 Future Enhancements

- [ ] Custom section templates
- [ ] Image upload integration
- [ ] Animation builder
- [ ] Form builder with validation
- [ ] SEO meta editor
- [ ] Collaboration features
- [ ] Version history
- [ ] A/B testing
- [ ] Analytics integration
- [ ] Multi-language support

---

## 🐛 Known Issues

- Drag & drop may have slight delay on low-end devices
- Some animations disabled in reduced motion mode
- Print preview needs custom implementation

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for Kashmir's businesses**
