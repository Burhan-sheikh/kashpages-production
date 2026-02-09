'use client';

import React from 'react';
import { Section } from '@/types/pageBuilder';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Info,
  Briefcase,
  Images,
  MessageSquare,
  Users,
  DollarSign,
  HelpCircle,
  Target,
  Mail,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';

interface LeftSidebarProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  onRemoveSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
}

const sectionIcons = {
  hero: Sparkles,
  about: Info,
  services: Briefcase,
  gallery: Images,
  testimonials: MessageSquare,
  team: Users,
  pricing: DollarSign,
  faq: HelpCircle,
  cta: Target,
  contact: Mail,
};

export function LeftSidebar({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onDuplicateSection,
}: LeftSidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sections
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sections.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              No sections yet
            </p>
            <button
              onClick={onAddSection}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Add First Section
            </button>
          </div>
        ) : (
          sections.map((section, index) => {
            const Icon =
              sectionIcons[section.type as keyof typeof sectionIcons] || Sparkles;
            const isSelected = selectedSectionId === section.id;

            return (
              <div
                key={section.id}
                className={cn(
                  'group relative rounded-lg transition-all cursor-pointer',
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                )}
                onClick={() => onSelectSection(section.id)}
              >
                <div className="flex items-center p-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900/40'
                        : 'bg-gray-100 dark:bg-gray-700'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        isSelected
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          isSelected
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-900 dark:text-gray-100'
                        )}
                      >
                        {section.name}
                      </p>
                      {section.isLocked && (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {section.type}
                      </span>
                      {(section.hideOnMobile || section.hideOnDesktop) && (
                        <div className="flex items-center space-x-1">
                          {section.hideOnMobile && (
                            <EyeOff className="h-3 w-3 text-gray-400" title="Hidden on mobile" />
                          )}
                          {section.hideOnDesktop && (
                            <EyeOff className="h-3 w-3 text-gray-400" title="Hidden on desktop" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSection(section.id);
                    }}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this section?')) {
                        onRemoveSection(section.id);
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Section Button */}
      {sections.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAddSection}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <span>Add Section</span>
          </button>
        </div>
      )}
    </div>
  );
}
