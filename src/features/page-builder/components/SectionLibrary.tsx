'use client';

import React, { useState } from 'react';
import { SectionType } from '../types';
import { sectionDefinitions } from '../constants/sections';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface SectionLibraryProps {
  onSelectSection: (type: SectionType) => void;
}

const categories = [
  { id: 'all', label: 'All Sections' },
  { id: 'hero', label: 'Hero & Headers' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'social', label: 'Social' },
];

export function SectionLibrary({ onSelectSection }: SectionLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSections = sectionDefinitions.filter((section) => {
    const matchesSearch =
      search === '' ||
      section.name.toLowerCase().includes(search.toLowerCase()) ||
      section.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || section.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <Input
        placeholder="Search sections..."
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.type}
              onClick={() => onSelectSection(section.type)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {section.name}
                  </h3>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sections found matching your search.</p>
        </div>
      )}
    </div>
  );
}