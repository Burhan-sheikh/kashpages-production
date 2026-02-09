'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';

interface AboutSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function AboutSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: AboutSectionProps) {
  const content = section.content;
  const heading = content.heading || 'About Us';
  const description = content.description || 'Tell your story here. Share your mission, vision, and values.';
  const features = content.features || [
    { title: 'Feature 1', description: 'Description of feature 1' },
    { title: 'Feature 2', description: 'Description of feature 2' },
    { title: 'Feature 3', description: 'Description of feature 3' },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleContentChange('features', newFeatures);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
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
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            disabled={isPreviewMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature: any, index: number) => (
            <div
              key={index}
              className={cn(
                'p-6 rounded-xl transition-all hover:scale-105',
                'bg-gradient-to-br from-gray-50 to-gray-100',
                'dark:from-gray-800 dark:to-gray-900',
                'border border-gray-200 dark:border-gray-700'
              )}
            >
              <InlineEditor
                content={feature.title}
                onChange={(value) => handleFeatureChange(index, 'title', value)}
                tagName="h3"
                className="text-xl font-semibold mb-3"
                style={{ color: globalStyles.primaryColor }}
                disabled={isPreviewMode}
              />
              <InlineEditor
                content={feature.description}
                onChange={(value) => handleFeatureChange(index, 'description', value)}
                tagName="p"
                className="text-gray-600 dark:text-gray-400"
                disabled={isPreviewMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
