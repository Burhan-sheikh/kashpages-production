'use client';

import React, { useState } from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Palette, Type, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RightSidebarProps {
  section: Section | undefined;
  globalStyles: PageStyles;
  onUpdateSection: (updates: Partial<Section>) => void;
  onUpdateGlobalStyles: (styles: PageStyles) => void;
}

export function RightSidebar({
  section,
  globalStyles,
  onUpdateSection,
  onUpdateGlobalStyles,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState('section');

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Properties
        </h2>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 grid grid-cols-2">
          <TabsTrigger value="section" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Section</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Global</span>
          </TabsTrigger>
        </TabsList>

        {/* Section Properties */}
        <TabsContent value="section" className="flex-1 overflow-y-auto p-4 space-y-6 mt-0">
          {section ? (
            <>
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Basic Settings</span>
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Name
                  </label>
                  <Input
                    value={section.name}
                    onChange={(e) => onUpdateSection({ name: e.target.value })}
                    placeholder="Section name"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Lock Section
                  </label>
                  <button
                    onClick={() => onUpdateSection({ isLocked: !section.isLocked })}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      section.isLocked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        section.isLocked ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Hide on Mobile
                  </label>
                  <button
                    onClick={() => onUpdateSection({ hideOnMobile: !section.hideOnMobile })}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      section.hideOnMobile ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        section.hideOnMobile ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Hide on Desktop
                  </label>
                  <button
                    onClick={() => onUpdateSection({ hideOnDesktop: !section.hideOnDesktop })}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      section.hideOnDesktop ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        section.hideOnDesktop ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Styling */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Styling</span>
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={section.styles.backgroundColor}
                      onChange={(e) =>
                        onUpdateSection({
                          styles: { ...section.styles, backgroundColor: e.target.value },
                        })
                      }
                      className="h-10 w-full rounded-lg cursor-pointer"
                    />
                    <Input
                      value={section.styles.backgroundColor}
                      onChange={(e) =>
                        onUpdateSection({
                          styles: { ...section.styles, backgroundColor: e.target.value },
                        })
                      }
                      className="w-28"
                    />
                  </div>
                </div>

                {section.styles.textColor !== undefined && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={section.styles.textColor}
                        onChange={(e) =>
                          onUpdateSection({
                            styles: { ...section.styles, textColor: e.target.value },
                          })
                        }
                        className="h-10 w-full rounded-lg cursor-pointer"
                      />
                      <Input
                        value={section.styles.textColor}
                        onChange={(e) =>
                          onUpdateSection({
                            styles: { ...section.styles, textColor: e.target.value },
                          })
                        }
                        className="w-28"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Padding (Desktop)
                  </label>
                  <Input
                    value={section.styles.padding.desktop}
                    onChange={(e) =>
                      onUpdateSection({
                        styles: {
                          ...section.styles,
                          padding: { ...section.styles.padding, desktop: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g., 5rem 2rem"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Padding (Mobile)
                  </label>
                  <Input
                    value={section.styles.padding.mobile}
                    onChange={(e) =>
                      onUpdateSection({
                        styles: {
                          ...section.styles,
                          padding: { ...section.styles.padding, mobile: e.target.value },
                        },
                      })
                    }
                    placeholder="e.g., 3rem 1rem"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Select a section to edit its properties
              </p>
            </div>
          )}
        </TabsContent>

        {/* Global Styles */}
        <TabsContent value="global" className="flex-1 overflow-y-auto p-4 space-y-6 mt-0">
          {/* Theme Colors */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Theme Colors</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={globalStyles.primaryColor}
                  onChange={(e) =>
                    onUpdateGlobalStyles({ ...globalStyles, primaryColor: e.target.value })
                  }
                  className="h-10 w-full rounded-lg cursor-pointer"
                />
                <Input
                  value={globalStyles.primaryColor}
                  onChange={(e) =>
                    onUpdateGlobalStyles({ ...globalStyles, primaryColor: e.target.value })
                  }
                  className="w-28"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={globalStyles.secondaryColor}
                  onChange={(e) =>
                    onUpdateGlobalStyles({ ...globalStyles, secondaryColor: e.target.value })
                  }
                  className="h-10 w-full rounded-lg cursor-pointer"
                />
                <Input
                  value={globalStyles.secondaryColor}
                  onChange={(e) =>
                    onUpdateGlobalStyles({ ...globalStyles, secondaryColor: e.target.value })
                  }
                  className="w-28"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </label>
              <button
                onClick={() =>
                  onUpdateGlobalStyles({ ...globalStyles, darkMode: !globalStyles.darkMode })
                }
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  globalStyles.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    globalStyles.darkMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Typography</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <Select
                value={globalStyles.typography.fontFamily}
                onValueChange={(value) =>
                  onUpdateGlobalStyles({
                    ...globalStyles,
                    typography: { ...globalStyles.typography, fontFamily: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                  <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                  <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                  <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Layout className="h-4 w-4" />
              <span>Buttons</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Style
              </label>
              <Select
                value={globalStyles.buttons.variant}
                onValueChange={(value: any) =>
                  onUpdateGlobalStyles({
                    ...globalStyles,
                    buttons: { ...globalStyles.buttons, variant: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Border Radius
              </label>
              <Input
                value={globalStyles.buttons.borderRadius}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    ...globalStyles,
                    buttons: { ...globalStyles.buttons, borderRadius: e.target.value },
                  })
                }
                placeholder="e.g., 8px"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
