'use client';

import React from 'react';
import { Design } from '../types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ColorPicker } from './ColorPicker';
import { Button } from '@/components/ui/Button';

interface DesignPanelProps {
  design: Design;
  onUpdate: (design: Design) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
];

const borderRadiusOptions = [
  { value: '0px', label: 'None (0px)' },
  { value: '4px', label: 'Small (4px)' },
  { value: '8px', label: 'Medium (8px)' },
  { value: '12px', label: 'Large (12px)' },
  { value: '24px', label: 'Extra Large (24px)' },
];

const containerWidthOptions = [
  { value: '1200px', label: 'Standard (1200px)' },
  { value: '1400px', label: 'Wide (1400px)' },
  { value: '100%', label: 'Full Width' },
];

export function DesignPanel({ design, onUpdate }: DesignPanelProps) {
  const handleChange = (key: keyof Design, value: any) => {
    onUpdate({ ...design, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Colors</h3>
        <div className="space-y-4">
          <ColorPicker
            label="Primary Color"
            color={design.primaryColor}
            onChange={(color) => handleChange('primaryColor', color)}
          />
          <ColorPicker
            label="Secondary Color"
            color={design.secondaryColor}
            onChange={(color) => handleChange('secondaryColor', color)}
          />
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <Select
          label="Font Family"
          options={fontOptions}
          value={design.fontPair}
          onChange={(e) => handleChange('fontPair', e.target.value)}
        />
      </div>

      {/* Layout */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Layout</h3>
        <div className="space-y-4">
          <Select
            label="Border Radius"
            options={borderRadiusOptions}
            value={design.borderRadius}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
          />
          <Select
            label="Container Width"
            options={containerWidthOptions}
            value={design.containerWidth}
            onChange={(e) => handleChange('containerWidth', e.target.value)}
          />
        </div>
      </div>

      {/* Theme */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleChange('theme', 'light')}
            className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
              design.theme === 'light'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="bg-white rounded-md p-4 mb-2">
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-100 rounded"></div>
            </div>
            <p className="text-sm font-medium">Light</p>
          </button>
          <button
            onClick={() => handleChange('theme', 'dark')}
            className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
              design.theme === 'dark'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="bg-gray-900 rounded-md p-4 mb-2">
              <div className="h-2 bg-gray-700 rounded mb-2"></div>
              <div className="h-2 bg-gray-800 rounded"></div>
            </div>
            <p className="text-sm font-medium">Dark</p>
          </button>
        </div>
      </div>

      {/* Effects */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Effects</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={design.shadows}
            onChange={(e) => handleChange('shadows', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Enable shadows</span>
        </label>
      </div>
    </div>
  );
}
