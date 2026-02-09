'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function HeroSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: HeroSectionProps) {
  const content = section.content;
  const title = content.title || 'Welcome to Your Website';
  const subtitle = content.subtitle || 'Create something amazing today';
  const buttonText = content.buttonText || 'Get Started';
  const buttonLink = content.buttonLink || '#';
  const layout = content.layout || 'center';

  const handleContentChange = (field: string, value: string) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  return (
    <div
      className={cn(
        'container mx-auto px-4 py-20 md:py-32',
        layout === 'center' && 'text-center',
        layout === 'left' && 'text-left',
        layout === 'right' && 'text-right'
      )}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <InlineEditor
          content={title}
          onChange={(value) => handleContentChange('title', value)}
          tagName="h1"
          className={cn(
            'font-bold tracking-tight',
            'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
          )}
          style={{
            fontFamily: globalStyles.typography.fontFamily,
            color: section.styles.textColor || globalStyles.primaryColor,
          }}
          disabled={isPreviewMode}
        />

        <InlineEditor
          content={subtitle}
          onChange={(value) => handleContentChange('subtitle', value)}
          tagName="p"
          className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto"
          disabled={isPreviewMode}
        />

        <div className="pt-6">
          {isPreviewMode ? (
            <a
              href={buttonLink}
              className={cn(
                'inline-block px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg',
                globalStyles.buttons.variant === 'solid' && 'bg-gradient-to-r from-primary-600 to-primary-700',
                globalStyles.buttons.variant === 'outline' && 'border-2 border-current',
                globalStyles.buttons.variant === 'ghost' && 'bg-white/10 backdrop-blur'
              )}
              style={{
                borderRadius: globalStyles.buttons.borderRadius,
                backgroundColor: globalStyles.buttons.variant === 'solid' ? globalStyles.primaryColor : undefined,
              }}
            >
              {buttonText}
            </a>
          ) : (
            <div className="inline-flex items-center space-x-4">
              <InlineEditor
                content={buttonText}
                onChange={(value) => handleContentChange('buttonText', value)}
                tagName="span"
                className={cn(
                  'inline-block px-8 py-4 rounded-lg font-semibold text-white cursor-pointer',
                  globalStyles.buttons.variant === 'solid' && 'bg-gradient-to-r from-primary-600 to-primary-700'
                )}
                style={{
                  borderRadius: globalStyles.buttons.borderRadius,
                  backgroundColor: globalStyles.primaryColor,
                }}
              />
              <input
                type="text"
                value={buttonLink}
                onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                placeholder="Button URL"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
