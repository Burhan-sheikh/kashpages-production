'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Smartphone, Monitor, Sun, Moon } from 'lucide-react';

interface StylesPanelProps {
  section: Section;
  globalStyles: PageStyles;
  onUpdateSection: (updates: Partial<Section>) => void;
  onUpdateGlobalStyles: (updates: Partial<PageStyles>) => void;
}

export function StylesPanel({
  section,
  globalStyles,
  onUpdateSection,
  onUpdateGlobalStyles,
}: StylesPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'section' | 'global'>('section');

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('section')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'section'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Section Styles
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'global'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Global Styles
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {activeTab === 'section' ? (
          <>
            {/* Visibility Controls */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Visibility</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={section.hideOnMobile}
                  onChange={(e) =>
                    onUpdateSection({ hideOnMobile: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Smartphone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Hide on Mobile</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={section.hideOnDesktop}
                  onChange={(e) =>
                    onUpdateSection({ hideOnDesktop: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Monitor className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">Hide on Desktop</span>
              </label>
            </div>

            {/* Background */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Background</h3>
              <Input
                type="color"
                label="Background Color"
                value={section.styles.backgroundColor}
                onChange={(e) =>
                  onUpdateSection({
                    styles: {
                      ...section.styles,
                      backgroundColor: e.target.value,
                    },
                  })
                }
              />
              
              {/* Gradient Builder */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={section.styles.backgroundGradient?.enabled || false}
                  onChange={(e) =>
                    onUpdateSection({
                      styles: {
                        ...section.styles,
                        backgroundGradient: {
                          enabled: e.target.checked,
                          from: section.styles.backgroundGradient?.from || '#3B82F6',
                          to: section.styles.backgroundGradient?.to || '#8B5CF6',
                          direction: section.styles.backgroundGradient?.direction || 'to right',
                        },
                      },
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Enable Gradient</span>
              </label>

              {section.styles.backgroundGradient?.enabled && (
                <div className="space-y-2 pl-6">
                  <Input
                    type="color"
                    label="From"
                    value={section.styles.backgroundGradient.from}
                    onChange={(e) =>
                      onUpdateSection({
                        styles: {
                          ...section.styles,
                          backgroundGradient: {
                            ...section.styles.backgroundGradient!,
                            from: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    type="color"
                    label="To"
                    value={section.styles.backgroundGradient.to}
                    onChange={(e) =>
                      onUpdateSection({
                        styles: {
                          ...section.styles,
                          backgroundGradient: {
                            ...section.styles.backgroundGradient!,
                            to: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <Select
                    label="Direction"
                    value={section.styles.backgroundGradient.direction}
                    onChange={(e) =>
                      onUpdateSection({
                        styles: {
                          ...section.styles,
                          backgroundGradient: {
                            ...section.styles.backgroundGradient!,
                            direction: e.target.value,
                          },
                        },
                      })
                    }
                    options={[
                      { value: 'to right', label: 'Left to Right' },
                      { value: 'to left', label: 'Right to Left' },
                      { value: 'to bottom', label: 'Top to Bottom' },
                      { value: 'to top', label: 'Bottom to Top' },
                      { value: 'to bottom right', label: 'Diagonal ↘' },
                      { value: 'to bottom left', label: 'Diagonal ↙' },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Spacing</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Padding Mobile"
                  value={section.styles.padding.mobile}
                  onChange={(e) =>
                    onUpdateSection({
                      styles: {
                        ...section.styles,
                        padding: {
                          ...section.styles.padding,
                          mobile: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="4rem"
                />
                <Input
                  label="Padding Desktop"
                  value={section.styles.padding.desktop}
                  onChange={(e) =>
                    onUpdateSection({
                      styles: {
                        ...section.styles,
                        padding: {
                          ...section.styles.padding,
                          desktop: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="6rem"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Global Colors */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Brand Colors</h3>
              <Input
                type="color"
                label="Primary Color"
                value={globalStyles.primaryColor}
                onChange={(e) =>
                  onUpdateGlobalStyles({ primaryColor: e.target.value })
                }
              />
              <Input
                type="color"
                label="Secondary Color"
                value={globalStyles.secondaryColor}
                onChange={(e) =>
                  onUpdateGlobalStyles({ secondaryColor: e.target.value })
                }
              />
            </div>

            {/* Typography Scale */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Typography Scale</h3>
              <Input
                label="H1 Size"
                value={globalStyles.typography.h1Size}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    typography: { ...globalStyles.typography, h1Size: e.target.value },
                  })
                }
                placeholder="3rem"
              />
              <Input
                label="H2 Size"
                value={globalStyles.typography.h2Size}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    typography: { ...globalStyles.typography, h2Size: e.target.value },
                  })
                }
                placeholder="2.5rem"
              />
              <Input
                label="H3 Size"
                value={globalStyles.typography.h3Size}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    typography: { ...globalStyles.typography, h3Size: e.target.value },
                  })
                }
                placeholder="2rem"
              />
            </div>

            {/* Button Styles */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Button Styles</h3>
              <Select
                label="Variant"
                value={globalStyles.buttons.variant}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    buttons: {
                      ...globalStyles.buttons,
                      variant: e.target.value as any,
                    },
                  })
                }
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'ghost', label: 'Ghost' },
                ]}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius: {globalStyles.buttons.borderRadius}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={parseInt(globalStyles.buttons.borderRadius)}
                  onChange={(e) =>
                    onUpdateGlobalStyles({
                      buttons: {
                        ...globalStyles.buttons,
                        borderRadius: `${e.target.value}px`,
                      },
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Shadow Intensity */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Shadows</h3>
              <Select
                label="Intensity"
                value={globalStyles.shadows.intensity}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    shadows: { intensity: e.target.value as any },
                  })
                }
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'sm', label: 'Small' },
                  { value: 'md', label: 'Medium' },
                  { value: 'lg', label: 'Large' },
                  { value: 'xl', label: 'Extra Large' },
                ]}
              />
            </div>

            {/* Container Width */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Container Width</h3>
              <Select
                label="Mobile"
                value={globalStyles.container.mobile}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    container: { ...globalStyles.container, mobile: e.target.value as any },
                  })
                }
                options={[
                  { value: 'full', label: 'Full Width' },
                  { value: 'boxed', label: 'Boxed (1200px)' },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
              <Select
                label="Desktop"
                value={globalStyles.container.desktop}
                onChange={(e) =>
                  onUpdateGlobalStyles({
                    container: { ...globalStyles.container, desktop: e.target.value as any },
                  })
                }
                options={[
                  { value: 'full', label: 'Full Width' },
                  { value: 'boxed', label: 'Boxed (1200px)' },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </div>

            {/* Dark Mode Toggle */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Theme</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={globalStyles.darkMode}
                  onChange={(e) =>
                    onUpdateGlobalStyles({ darkMode: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {globalStyles.darkMode ? (
                  <Moon className="h-4 w-4 text-gray-700" />
                ) : (
                  <Sun className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">Dark Mode</span>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
