'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePageBuilderHistory } from '@/hooks/usePageBuilderHistory';
import { LivePreview } from './LivePreview';
import { SectionsLibrary } from './SectionsLibrary';
import { TopToolbar } from './TopToolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { SectionType } from '@/types/pageBuilder';

export function PageBuilderPlatform() {
  const [showSectionsLibrary, setShowSectionsLibrary] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const {
    sections,
    selectedSectionId,
    globalStyles,
    addSection,
    removeSection,
    updateSection,
    duplicateSection,
    reorderSections,
    selectSection,
    updateGlobalStyles,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePageBuilderHistory();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleAddSection = (type: SectionType) => {
    addSection(type);
    setShowSectionsLibrary(false);
  };

  const handleExport = () => {
    const exportData = {
      sections,
      globalStyles,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar
        isPreviewMode={isPreviewMode}
        isMobilePreview={isMobilePreview}
        canUndo={canUndo}
        canRedo={canRedo}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
        onAddSection={() => setShowSectionsLibrary(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sections List */}
        {!isPreviewMode && (
          <LeftSidebar
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={selectSection}
            onAddSection={() => setShowSectionsLibrary(true)}
            onRemoveSection={removeSection}
            onDuplicateSection={duplicateSection}
          />
        )}

        {/* Center - Live Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
            <div
              className="mx-auto transition-all duration-300"
              style={{
                maxWidth: isMobilePreview ? '375px' : '100%',
                boxShadow: isMobilePreview
                  ? '0 0 0 4px #e5e7eb, 0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  : 'none',
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <LivePreview
                    sections={sections}
                    globalStyles={globalStyles}
                    selectedSectionId={selectedSectionId}
                    isPreviewMode={isPreviewMode}
                    onSelectSection={selectSection}
                    onUpdateSection={updateSection}
                  />
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        {!isPreviewMode && (
          <RightSidebar
            section={selectedSection}
            globalStyles={globalStyles}
            onUpdateSection={(updates) =>
              selectedSectionId && updateSection(selectedSectionId, updates)
            }
            onUpdateGlobalStyles={updateGlobalStyles}
          />
        )}
      </div>

      {/* Sections Library Modal */}
      {showSectionsLibrary && (
        <SectionsLibrary
          onClose={() => setShowSectionsLibrary(false)}
          onAddSection={handleAddSection}
        />
      )}
    </div>
  );
}
