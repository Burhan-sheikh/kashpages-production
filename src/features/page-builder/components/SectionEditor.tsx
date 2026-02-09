'use client';

import React from 'react';
import { Section, SectionType } from '../types';
import { getSectionByType } from '../constants/sections';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, data: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
}

export function SectionEditor({
  section,
  onUpdate,
  onDelete,
}: SectionEditorProps) {
  const definition = getSectionByType(section.type);

  const handleDataChange = (key: string, value: any) => {
    onUpdate(section.id, {
      data: {
        ...section.data,
        [key]: value,
      },
    });
  };

  const toggleVisibility = (device: 'mobile' | 'desktop') => {
    onUpdate(section.id, {
      visibility: {
        ...section.visibility,
        [device]: !section.visibility[device],
      },
    });
  };

  const toggleLock = () => {
    onUpdate(section.id, {
      locked: !section.locked,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{definition?.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {definition?.name}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Visibility Toggles */}
          <button
            onClick={() => toggleVisibility('mobile')}
            className={`p-2 rounded ${
              section.visibility.mobile
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-400 bg-gray-50'
            }`}
            title="Mobile visibility"
          >
            📱
          </button>
          <button
            onClick={() => toggleVisibility('desktop')}
            className={`p-2 rounded ${
              section.visibility.desktop
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-400 bg-gray-50'
            }`}
            title="Desktop visibility"
          >
            🖥️
          </button>

          {/* Lock Toggle */}
          <button
            onClick={toggleLock}
            className="p-2 rounded hover:bg-gray-100"
            title={section.locked ? 'Unlock section' : 'Lock section'}
          >
            {section.locked ? (
              <Lock className="h-4 w-4 text-gray-600" />
            ) : (
              <Unlock className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(section.id)}
            className="p-2 rounded hover:bg-red-50 text-red-600"
            title="Delete section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Section-Specific Fields */}
      <div className="space-y-4">
        {section.type === 'hero' && (
          <>
            <Input
              label="Title"
              value={section.data.title || ''}
              onChange={(e) => handleDataChange('title', e.target.value)}
            />
            <Input
              label="Subtitle"
              value={section.data.subtitle || ''}
              onChange={(e) => handleDataChange('subtitle', e.target.value)}
            />
            <Input
              label="Background Image URL"
              value={section.data.backgroundImage || ''}
              onChange={(e) =>
                handleDataChange('backgroundImage', e.target.value)
              }
            />
          </>
        )}

        {section.type === 'about' && (
          <>
            <Input
              label="Heading"
              value={section.data.heading || ''}
              onChange={(e) => handleDataChange('heading', e.target.value)}
            />
            <TextArea
              label="Content"
              value={section.data.content || ''}
              onChange={(e) => handleDataChange('content', e.target.value)}
              rows={5}
            />
            <Input
              label="Image URL"
              value={section.data.image || ''}
              onChange={(e) => handleDataChange('image', e.target.value)}
            />
          </>
        )}

        {section.type === 'contact' && (
          <>
            <Input
              label="Heading"
              value={section.data.heading || ''}
              onChange={(e) => handleDataChange('heading', e.target.value)}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={section.data.showForm || false}
                onChange={(e) => handleDataChange('showForm', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Show contact form</span>
            </label>
          </>
        )}

        {/* Add more section-specific fields as needed */}
      </div>
    </div>
  );
}
