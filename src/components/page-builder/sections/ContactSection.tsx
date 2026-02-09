'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function ContactSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: ContactSectionProps) {
  const content = section.content;
  const heading = content.heading || 'Get In Touch';
  const description = content.description || 'We\'d love to hear from you. Send us a message!';
  const email = content.email || 'hello@example.com';
  const phone = content.phone || '+1 (555) 123-4567';
  const address = content.address || '123 Main Street, City, State 12345';

  const handleContentChange = (field: string, value: string) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${globalStyles.primaryColor}20` }}
              >
                <Mail className="h-6 w-6" style={{ color: globalStyles.primaryColor }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                {isPreviewMode ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    {email}
                  </a>
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleContentChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${globalStyles.primaryColor}20` }}
              >
                <Phone className="h-6 w-6" style={{ color: globalStyles.primaryColor }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                {isPreviewMode ? (
                  <a
                    href={`tel:${phone}`}
                    className="text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    {phone}
                  </a>
                ) : (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleContentChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${globalStyles.primaryColor}20` }}
              >
                <MapPin className="h-6 w-6" style={{ color: globalStyles.primaryColor }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Address</h3>
                {isPreviewMode ? (
                  <p className="text-gray-600 dark:text-gray-400">{address}</p>
                ) : (
                  <textarea
                    value={address}
                    onChange={(e) => handleContentChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: globalStyles.primaryColor,
                  borderRadius: globalStyles.buttons.borderRadius,
                }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
