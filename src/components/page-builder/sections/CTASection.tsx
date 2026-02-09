'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function CTASection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: CTASectionProps) {
  const content = section.content;
  const heading = content.heading || 'Ready to Get Started?';
  const description = content.description || 'Join thousands of satisfied customers today';
  const primaryButtonText = content.primaryButtonText || 'Get Started Now';
  const primaryButtonLink = content.primaryButtonLink || '#';
  const secondaryButtonText = content.secondaryButtonText || 'Learn More';
  const secondaryButtonLink = content.secondaryButtonLink || '#';
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
        layout === 'split' && 'flex items-center justify-between'
      )}
    >
      <div
        className={cn(
          'max-w-4xl',
          layout === 'center' && 'mx-auto',
          layout === 'split' && 'flex items-center justify-between w-full gap-8'
        )}
      >
        <div className={layout === 'split' ? 'flex-1' : 'mb-8'}>
          <InlineEditor
            content={heading}
            onChange={(value) => handleContentChange('heading', value)}
            tagName="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: globalStyles.typography.fontFamily,
              color: section.styles.textColor || globalStyles.primaryColor,
            }}
            disabled={isPreviewMode}
          />

          <InlineEditor
            content={description}
            onChange={(value) => handleContentChange('description', value)}
            tagName="p"
            className="text-lg md:text-xl opacity-90"
            disabled={isPreviewMode}
          />
        </div>

        <div
          className={cn(
            'flex gap-4',
            layout === 'center' && 'justify-center',
            layout === 'split' && 'flex-shrink-0'
          )}
        >
          {isPreviewMode ? (
            <>
              <a
                href={primaryButtonLink}
                className="px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: globalStyles.primaryColor,
                  borderRadius: globalStyles.buttons.borderRadius,
                }}
              >
                {primaryButtonText}
              </a>
              <a
                href={secondaryButtonLink}
                className="px-8 py-4 rounded-lg font-semibold border-2 transition-all hover:scale-105"
                style={{
                  borderColor: globalStyles.primaryColor,
                  color: globalStyles.primaryColor,
                  borderRadius: globalStyles.buttons.borderRadius,
                }}
              >
                {secondaryButtonText}
              </a>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <InlineEditor
                  content={primaryButtonText}
                  onChange={(value) => handleContentChange('primaryButtonText', value)}
                  tagName="span"
                  className="px-8 py-4 rounded-lg font-semibold text-white"
                  style={{
                    backgroundColor: globalStyles.primaryColor,
                    borderRadius: globalStyles.buttons.borderRadius,
                  }}
                />
                <input
                  type="text"
                  value={primaryButtonLink}
                  onChange={(e) => handleContentChange('primaryButtonLink', e.target.value)}
                  placeholder="URL"
                  className="px-3 py-2 border rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <InlineEditor
                  content={secondaryButtonText}
                  onChange={(value) => handleContentChange('secondaryButtonText', value)}
                  tagName="span"
                  className="px-8 py-4 rounded-lg font-semibold border-2"
                  style={{
                    borderColor: globalStyles.primaryColor,
                    color: globalStyles.primaryColor,
                    borderRadius: globalStyles.buttons.borderRadius,
                  }}
                />
                <input
                  type="text"
                  value={secondaryButtonLink}
                  onChange={(e) => handleContentChange('secondaryButtonLink', e.target.value)}
                  placeholder="URL"
                  className="px-3 py-2 border rounded text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
