'use client';

import React, { useState } from 'react';
import { SectionType } from '@/types/pageBuilder';
import { X, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SectionsLibraryProps {
  onClose: () => void;
  onAddSection: (type: SectionType) => void;
}

const sectionCategories = {
  'Content': [
    { type: 'hero' as SectionType, name: 'Hero Section', icon: 'Sparkles', description: 'Large header with title and CTA' },
    { type: 'about' as SectionType, name: 'About Section', icon: 'Info', description: 'Tell your story' },
    { type: 'features' as SectionType, name: 'Features', icon: 'Grid3x3', description: 'Showcase key features' },
    { type: 'cta' as SectionType, name: 'Call to Action', icon: 'Target', description: 'Drive conversions' },
  ],
  'Media': [
    { type: 'gallery' as SectionType, name: 'Gallery', icon: 'Images', description: 'Image grid or carousel' },
    { type: 'video' as SectionType, name: 'Video', icon: 'Video', description: 'YouTube/Vimeo embed' },
    { type: 'logo-cloud' as SectionType, name: 'Logo Cloud', icon: 'Award', description: 'Partner/client logos' },
  ],
  'Social Proof': [
    { type: 'testimonials' as SectionType, name: 'Testimonials', icon: 'MessageSquare', description: 'Customer reviews' },
    { type: 'team' as SectionType, name: 'Team', icon: 'Users', description: 'Team member grid' },
    { type: 'stats' as SectionType, name: 'Statistics', icon: 'BarChart3', description: 'Key metrics' },
  ],
  'Business': [
    { type: 'pricing' as SectionType, name: 'Pricing', icon: 'DollarSign', description: 'Pricing tables' },
    { type: 'faq' as SectionType, name: 'FAQ', icon: 'HelpCircle', description: 'Q&A accordion' },
    { type: 'services' as SectionType, name: 'Services', icon: 'Briefcase', description: 'Service offerings' },
  ],
  'Engagement': [
    { type: 'contact' as SectionType, name: 'Contact', icon: 'Mail', description: 'Contact form' },
    { type: 'newsletter' as SectionType, name: 'Newsletter', icon: 'Send', description: 'Email signup' },
    { type: 'countdown' as SectionType, name: 'Countdown', icon: 'Clock', description: 'Timer for events' },
  ],
};

export function SectionsLibrary({ onClose, onAddSection }: SectionsLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSections = Object.entries(sectionCategories).reduce((acc, [category, sections]) => {
    const filtered = sections.filter(section =>
      section.name.toLowerCase().includes(search.toLowerCase()) ||
      section.description.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof sectionCategories[keyof typeof sectionCategories]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Add Section
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {Object.entries(filteredSections).map(([category, sections]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sections.map((section) => {
                  const IconComponent = (Icons as any)[section.icon];
                  return (
                    <button
                      key={section.type}
                      onClick={() => onAddSection(section.type)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                          {IconComponent && (
                            <IconComponent className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {section.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
