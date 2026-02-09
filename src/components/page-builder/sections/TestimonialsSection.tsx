'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function TestimonialsSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: TestimonialsSectionProps) {
  const content = section.content;
  const heading = content.heading || 'What Our Clients Say';
  const testimonials = content.testimonials || [
    {
      name: 'John Doe',
      role: 'CEO, Company',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: 5,
      text: 'Excellent service! Highly recommended for anyone looking for quality work.',
    },
    {
      name: 'Jane Smith',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 5,
      text: 'Professional, reliable, and delivers exceptional results every time.',
    },
    {
      name: 'Mike Johnson',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      rating: 5,
      text: 'Outstanding experience from start to finish. Will definitely work together again.',
    },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    handleContentChange('testimonials', newTestimonials);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <InlineEditor
            content={heading}
            onChange={(value) => handleContentChange('heading', value)}
            tagName="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily: globalStyles.typography.fontFamily,
              color: section.styles.textColor || globalStyles.primaryColor,
            }}
            disabled={isPreviewMode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={index}
              className={cn(
                'p-6 rounded-2xl transition-all',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'hover:shadow-xl'
              )}
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <InlineEditor
                content={testimonial.text}
                onChange={(value) => handleTestimonialChange(index, 'text', value)}
                tagName="p"
                className="text-gray-600 dark:text-gray-400 mb-6 italic"
                disabled={isPreviewMode}
              />

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <InlineEditor
                    content={testimonial.name}
                    onChange={(value) => handleTestimonialChange(index, 'name', value)}
                    tagName="p"
                    className="font-semibold text-gray-900 dark:text-gray-100"
                    disabled={isPreviewMode}
                  />
                  <InlineEditor
                    content={testimonial.role}
                    onChange={(value) => handleTestimonialChange(index, 'role', value)}
                    tagName="p"
                    className="text-sm text-gray-500 dark:text-gray-400"
                    disabled={isPreviewMode}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
