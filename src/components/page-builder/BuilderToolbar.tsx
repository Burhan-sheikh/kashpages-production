'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Layers,
  Settings,
  Plus,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface BuilderToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onTogglePreview: () => void;
  onToggleLayers: () => void;
  onToggleStyles: () => void;
  onAddSection: () => void;
  isPreviewMode: boolean;
  showLayersPanel: boolean;
  showStylesPanel: boolean;
}

export function BuilderToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onTogglePreview,
  onToggleLayers,
  onToggleStyles,
  onAddSection,
  isPreviewMode,
  showLayersPanel,
  showStylesPanel,
}: BuilderToolbarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold text-gray-900 mr-4">Page Builder</h1>
        
        {!isPreviewMode && (
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Undo2 className="h-4 w-4" />}
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Redo2 className="h-4 w-4" />}
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </Button>
            
            <div className="h-6 w-px bg-gray-300 mx-2" />
            
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onAddSection}
            >
              Add Section
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!isPreviewMode && (
          <>
            <Button
              variant={showLayersPanel ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Layers className="h-4 w-4" />}
              onClick={onToggleLayers}
              title="Toggle Layers Panel"
            >
              Layers
            </Button>
            <Button
              variant={showStylesPanel ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={onToggleStyles}
              title="Toggle Styles Panel"
            >
              Styles
            </Button>
            
            <div className="h-6 w-px bg-gray-300 mx-2" />
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          leftIcon={isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          onClick={onTogglePreview}
          title="Preview Mode (Ctrl+P)"
        >
          {isPreviewMode ? 'Exit Preview' : 'Preview'}
        </Button>
      </div>
    </div>
  );
}
