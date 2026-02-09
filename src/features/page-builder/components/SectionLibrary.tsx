'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SECTION_DEFINITIONS, getSectionsByCategory } from '../constants/sections';
import { SectionType } from '../types';
import { Card } from '@/components/ui/Card';

interface SectionLibraryProps {
  onSelectSection: (type: SectionType) => void;
}

const categories = [
  { id: 'business', name: 'Business Essentials', icon: '💼' },
  { id: 'trust', name: 'Trust Builders', icon: '🛡️' },
  { id: 'marketing', name: 'Marketing', icon: '📈' },
  { id: 'advanced', name: 'Advanced', icon: '🚀' },
];

export function SectionLibrary({ onSelectSection }: SectionLibraryProps) {
  const [activeCategory, setActiveCategory] = useState('business');

  const sections = getSectionsByCategory(activeCategory);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <motion.div
            key={section.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              hover
              onClick={() => onSelectSection(section.type)}
              className="cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{section.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {section.name}
                  </h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
