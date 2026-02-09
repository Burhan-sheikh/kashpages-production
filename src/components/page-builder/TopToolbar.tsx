'use client';

import React from 'react';
import {
  Play,
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  Download,
  Plus,
  Settings,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopToolbarProps {
  isPreviewMode: boolean;
  isMobilePreview: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onTogglePreview: () => void;
  onToggleMobilePreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onAddSection: () => void;
}

export function TopToolbar({
  isPreviewMode,
  isMobilePreview,
  canUndo,
  canRedo,
  onTogglePreview,
  onToggleMobilePreview,
  onUndo,
  onRedo,
  onExport,
  onAddSection,
}: TopToolbarProps) {
  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      {/* Left - Branding */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KP</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              KashPages
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Page Builder</p>
          </div>
        </div>
      </div>

      {/* Center - Main Actions */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1 px-1 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(
              'p-2 rounded-md transition-colors',
              canUndo
                ? 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            )}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(
              'p-2 rounded-md transition-colors',
              canRedo
                ? 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            )}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Add Section */}
        <button
          onClick={onAddSection}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>

        {/* Device Preview */}
        <div className="flex items-center space-x-1 px-1 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={onToggleMobilePreview}
            className={cn(
              'p-2 rounded-md transition-colors',
              !isMobilePreview
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            )}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleMobilePreview}
            className={cn(
              'p-2 rounded-md transition-colors',
              isMobilePreview
                ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                : 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            )}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Preview Mode */}
        <button
          onClick={onTogglePreview}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2',
            isPreviewMode
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          <Play className="h-4 w-4" />
          <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onExport}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          title="Export Page"
        >
          <Download className="h-5 w-5" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
          title="Save Page"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
