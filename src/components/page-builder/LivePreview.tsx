'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { GallerySection } from './sections/GallerySection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { TeamSection } from './sections/TeamSection';
import { PricingSection } from './sections/PricingSection';
import { FAQSection } from './sections/FAQSection';
import { CTASection } from './sections/CTASection';
import { ContactSection } from './sections/ContactSection';

interface LivePreviewProps {
  sections: Section[];
  globalStyles: PageStyles;
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  onSelectSection: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
}

export function LivePreview({
  sections,
  globalStyles,
  selectedSectionId,
  isPreviewMode,
  onSelectSection,
  onUpdateSection,
}: LivePreviewProps) {
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: globalStyles.darkMode ? '#1f2937' : '#ffffff',
        color: globalStyles.darkMode ? '#f3f4f6' : '#111827',
      }}
    >
      {sections.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-400 mb-2">
              No sections yet
            </p>
            <p className="text-gray-500">Click "Add Section" to get started</p>
          </div>
        </div>
      ) : (
        sections.map((section) => (
          <SortableSection
            key={section.id}
            section={section}
            globalStyles={globalStyles}
            isSelected={selectedSectionId === section.id}
            isPreviewMode={isPreviewMode}
            onSelect={() => onSelectSection(section.id)}
            onUpdate={(updates) => onUpdateSection(section.id, updates)}
          />
        ))
      )}
    </div>
  );
}

interface SortableSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Section>) => void;
}

function SortableSection({
  section,
  globalStyles,
  isSelected,
  isPreviewMode,
  onSelect,
  onUpdate,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: section.isLocked || isPreviewMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Apply section background
  const sectionStyle: React.CSSProperties = {
    backgroundColor: section.styles.backgroundGradient?.enabled
      ? undefined
      : section.styles.backgroundColor,
    backgroundImage: section.styles.backgroundGradient?.enabled
      ? `linear-gradient(${section.styles.backgroundGradient.direction}, ${section.styles.backgroundGradient.from}, ${section.styles.backgroundGradient.to})`
      : undefined,
    padding: section.styles.padding.desktop,
    marginTop: section.styles.margin.top,
    marginBottom: section.styles.margin.bottom,
  };

  // Hide on mobile/desktop
  const visibilityClasses = cn(
    section.hideOnMobile && 'hidden md:block',
    section.hideOnDesktop && 'md:hidden'
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50',
        visibilityClasses
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreviewMode) onSelect();
      }}
    >
      {/* Selection Overlay */}
      {!isPreviewMode && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none transition-all',
            isSelected
              ? 'ring-2 ring-primary-500 ring-inset bg-primary-50/10'
              : 'ring-1 ring-gray-300 ring-inset opacity-0 group-hover:opacity-100'
          )}
        />
      )}

      {/* Drag Handle */}
      {!isPreviewMode && !section.isLocked && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-12 top-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      )}

      {/* Section Content */}
      <div style={sectionStyle}>
        <SectionRenderer
          section={section}
          globalStyles={globalStyles}
          isPreviewMode={isPreviewMode}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

interface SectionRendererProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

function SectionRenderer({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: SectionRendererProps) {
  const props = { section, globalStyles, isPreviewMode, onUpdate };

  switch (section.type) {
    case 'hero':
      return <HeroSection {...props} />;
    case 'about':
      return <AboutSection {...props} />;
    case 'services':
      return <ServicesSection {...props} />;
    case 'gallery':
      return <GallerySection {...props} />;
    case 'testimonials':
      return <TestimonialsSection {...props} />;
    case 'team':
      return <TeamSection {...props} />;
    case 'pricing':
      return <PricingSection {...props} />;
    case 'faq':
      return <FAQSection {...props} />;
    case 'cta':
      return <CTASection {...props} />;
    case 'contact':
      return <ContactSection {...props} />;
    default:
      return (
        <div className="p-12 text-center text-gray-500">
          Section type "{section.type}" not implemented yet
        </div>
      );
  }
}
