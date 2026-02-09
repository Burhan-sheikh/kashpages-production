'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface GallerySectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function GallerySection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: GallerySectionProps) {
  const content = section.content;
  const heading = content.heading || 'Gallery';
  const description = content.description || 'Explore our visual portfolio';
  const images = content.images || [
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', caption: 'Image 1' },
    { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600', caption: 'Image 2' },
    { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600', caption: 'Image 3' },
    { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600', caption: 'Image 4' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600', caption: 'Image 5' },
    { url: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600', caption: 'Image 6' },
  ];
  const columns = content.columns || 3;

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
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
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400"
            disabled={isPreviewMode}
          />
        </div>

        <div
          className={cn(
            'grid gap-4',
            columns === 2 && 'grid-cols-1 md:grid-cols-2',
            columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            columns === 4 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {images.map((image: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100 dark:bg-gray-800"
            >
              <Image
                src={image.url}
                alt={image.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
