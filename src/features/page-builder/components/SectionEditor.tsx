'use client';

import React from 'react';
import { Section, SectionType } from '../types';
import { getSectionByType } from '../constants/sections';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onUpdate: (sectionId: string, data: Partial<Section>) => void;
  onDelete: (sectionId: string) => void;
}

export function SectionEditor({ section, onUpdate, onDelete }: SectionEditorProps) {
  const definition = getSectionByType(section.type);

  const handleDataChange = (key: string, value: any) => {
    onUpdate(section.id, {
      data: { ...section.data, [key]: value },
    });
  };

  const handleVisibilityChange = (device: 'mobile' | 'desktop', visible: boolean) => {
    onUpdate(section.id, {
      visibility: { ...section.visibility, [device]: visible },
    });
  };

  const toggleLock = () => {
    onUpdate(section.id, { locked: !section.locked });
  };

  if (!definition) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <definition.icon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">{definition.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLock}
            className="p-2 text-gray-600 hover:text-gray-900"
            title={section.locked ? 'Unlock' : 'Lock'}
          >
            {section.locked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="p-2 text-red-600 hover:text-red-700"
            title="Delete Section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Visibility</h4>
        <div className="space-y-2">
          <Switch
            label="Show on Desktop"
            checked={section.visibility.desktop}
            onChange={(checked) => handleVisibilityChange('desktop', checked)}
          />
          <Switch
            label="Show on Mobile"
            checked={section.visibility.mobile}
            onChange={(checked) => handleVisibilityChange('mobile', checked)}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Section Content</h4>
        
        {/* Dynamic Fields Based on Section Type */}
        {renderSectionFields(section.type, section.data, handleDataChange)}
      </div>
    </div>
  );
}

// Render fields based on section type
function renderSectionFields(
  type: SectionType,
  data: any,
  onChange: (key: string, value: any) => void
) {
  switch (type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <Input
            label="Headline"
            value={data.headline || ''}
            onChange={(e) => onChange('headline', e.target.value)}
          />
          <Textarea
            label="Subheadline"
            value={data.subheadline || ''}
            onChange={(e) => onChange('subheadline', e.target.value)}
            rows={3}
          />
          <Input
            label="Button Text"
            value={data.buttonText || ''}
            onChange={(e) => onChange('buttonText', e.target.value)}
          />
          <Input
            label="Button Link"
            value={data.buttonLink || ''}
            onChange={(e) => onChange('buttonLink', e.target.value)}
          />
          <ImageUpload
            label="Background Image"
            value={data.backgroundImage}
            onChange={(url) => onChange('backgroundImage', url)}
          />
        </div>
      );

    case 'about':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <Textarea
            label="Description"
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={5}
          />
          <ImageUpload
            label="Image"
            value={data.image}
            onChange={(url) => onChange('image', url)}
          />
        </div>
      );

    case 'services':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <Textarea
            label="Description"
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
          {/* Services would be managed with array editor */}
          <p className="text-sm text-gray-500">Service items: {data.items?.length || 0}</p>
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
          />
          <Input
            label="Phone"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
          />
          <Textarea
            label="Address"
            value={data.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            rows={3}
          />
        </div>
      );

    case 'gallery':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <Select
            label="Layout"
            value={data.layout || 'grid'}
            onChange={(e) => onChange('layout', e.target.value)}
            options={[
              { value: 'grid', label: 'Grid' },
              { value: 'masonry', label: 'Masonry' },
              { value: 'carousel', label: 'Carousel' },
            ]}
          />
          <p className="text-sm text-gray-500">Images: {data.images?.length || 0}</p>
        </div>
      );

    case 'testimonials':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Testimonials: {data.testimonials?.length || 0}
          </p>
        </div>
      );

    case 'cta':
      return (
        <div className="space-y-4">
          <Input
            label="Headline"
            value={data.headline || ''}
            onChange={(e) => onChange('headline', e.target.value)}
          />
          <Textarea
            label="Description"
            value={data.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
          <Input
            label="Button Text"
            value={data.buttonText || ''}
            onChange={(e) => onChange('buttonText', e.target.value)}
          />
          <Input
            label="Button Link"
            value={data.buttonLink || ''}
            onChange={(e) => onChange('buttonLink', e.target.value)}
          />
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          Editor for {type} section coming soon...
        </div>
      );
  }
}