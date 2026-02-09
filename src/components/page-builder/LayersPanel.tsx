'use client';

import React from 'react';
import { Section } from '@/types/pageBuilder';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  GripVertical,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LayersPanelProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export function LayersPanel({
  sections,
  selectedSectionId,
  onSelectSection,
  onRemoveSection,
  onDuplicateSection,
  onToggleLock,
}: LayersPanelProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Layers
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {sections.length} sections
        </p>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No sections yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Section" to start</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className={`group p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedSectionId === section.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium text-gray-900">
                      {section.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(section.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title={section.isLocked ? 'Unlock' : 'Lock'}
                    >
                      {section.isLocked ? (
                        <Lock className="h-3 w-3 text-gray-600" />
                      ) : (
                        <Unlock className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateSection(section.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Duplicate (Ctrl+D)"
                    >
                      <Copy className="h-3 w-3 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!section.isLocked) {
                          onRemoveSection(section.id);
                        }
                      }}
                      className={`p-1 hover:bg-red-50 rounded ${
                        section.isLocked ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                      title={section.isLocked ? 'Locked' : 'Delete (Del)'}
                      disabled={section.isLocked}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {section.type}
                  </span>
                  {section.hideOnMobile && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded flex items-center">
                      <Smartphone className="h-3 w-3 mr-1" />
                      Hidden
                    </span>
                  )}
                  {section.hideOnDesktop && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded flex items-center">
                      <Monitor className="h-3 w-3 mr-1" />
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
