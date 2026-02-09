'use client';

import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useClickOutside(() => setShowPicker(false));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center space-x-3 w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <div
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono text-gray-700">{color}</span>
        </button>

        {showPicker && (
          <div className="absolute z-10 mt-2">
            <ChromePicker
              color={color}
              onChange={(newColor) => onChange(newColor.hex)}
              disableAlpha
            />
          </div>
        )}
      </div>
    </div>
  );
}
