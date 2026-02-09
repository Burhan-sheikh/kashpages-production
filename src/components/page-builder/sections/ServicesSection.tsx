'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { Sparkles, Zap, Heart, Shield } from 'lucide-react';

interface ServicesSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

const iconMap = {
  sparkles: Sparkles,
  zap: Zap,
  heart: Heart,
  shield: Shield,
};

export function ServicesSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: ServicesSectionProps) {
  const content = section.content;
  const heading = content.heading || 'Our Services';
  const description = content.description || 'Discover what we can do for you';
  const services = content.services || [
    {
      icon: 'sparkles',
      title: 'Service 1',
      description: 'Description of your first service offering',
    },
    {
      icon: 'zap',
      title: 'Service 2',
      description: 'Description of your second service offering',
    },
    {
      icon: 'heart',
      title: 'Service 3',
      description: 'Description of your third service offering',
    },
    {
      icon: 'shield',
      title: 'Service 4',
      description: 'Description of your fourth service offering',
    },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    handleContentChange('services', newServices);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Sparkles;
            return (
              <div
                key={index}
                className={cn(
                  'p-6 rounded-2xl transition-all hover:scale-105',
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'shadow-lg hover:shadow-2xl'
                )}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${globalStyles.primaryColor}20`,
                  }}
                >
                  <IconComponent
                    className="h-7 w-7"
                    style={{ color: globalStyles.primaryColor }}
                  />
                </div>

                <InlineEditor
                  content={service.title}
                  onChange={(value) => handleServiceChange(index, 'title', value)}
                  tagName="h3"
                  className="text-xl font-semibold mb-3"
                  disabled={isPreviewMode}
                />

                <InlineEditor
                  content={service.description}
                  onChange={(value) => handleServiceChange(index, 'description', value)}
                  tagName="p"
                  className="text-gray-600 dark:text-gray-400 text-sm"
                  disabled={isPreviewMode}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
