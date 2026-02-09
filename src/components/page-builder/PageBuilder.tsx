'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PageBuilderState, Section, PageStyles } from '@/types/pageBuilder';
import { BuilderToolbar } from './BuilderToolbar';
import { SectionsList } from './SectionsList';
import { LivePreview } from './LivePreview';
import { StylesPanel } from './StylesPanel';
import { LayersPanel } from './LayersPanel';
import { SectionsLibrary } from './SectionsLibrary';
import { usePageBuilderHistory } from '@/hooks/usePageBuilderHistory';
import { Save, Eye, Undo2, Redo2, Layers, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PageBuilderProps {
  initialSections?: Section[];
  onSave: (sections: Section[], styles: PageStyles) => Promise<void>;
}

export function PageBuilder({ initialSections = [], onSave }: PageBuilderProps) {
  const {
    sections,
    selectedSectionId,
    globalStyles,
    history,
    historyIndex,
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
  } = usePageBuilderHistory(initialSections);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showStylesPanel, setShowStylesPanel] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [saving, setSaving] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z') || e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Delete: Del key
      if (e.key === 'Delete' && selectedSectionId) {
        e.preventDefault();
        const section = sections.find(s => s.id === selectedSectionId);
        if (section && !section.isLocked) {
          removeSection(selectedSectionId);
        }
      }
      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedSectionId) {
        e.preventDefault();
        duplicateSection(selectedSectionId);
      }
      // Preview: Ctrl+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsPreviewMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSectionId, sections, canUndo, canRedo, undo, redo, removeSection, duplicateSection]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(sections, globalStyles);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <BuilderToolbar
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onToggleLayers={() => setShowLayersPanel(!showLayersPanel)}
        onToggleStyles={() => setShowStylesPanel(!showStylesPanel)}
        onAddSection={() => setShowLibrary(true)}
        isPreviewMode={isPreviewMode}
        showLayersPanel={showLayersPanel}
        showStylesPanel={showStylesPanel}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Layers Panel */}
        {showLayersPanel && !isPreviewMode && (
          <LayersPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={selectSection}
            onRemoveSection={removeSection}
            onDuplicateSection={duplicateSection}
            onToggleLock={(id) => {
              const section = sections.find(s => s.id === id);
              if (section) {
                updateSection(id, { isLocked: !section.isLocked });
              }
            }}
          />
        )}

        {/* Center - Live Preview */}
        <div className="flex-1 overflow-auto bg-white">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
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

        {/* Right Sidebar - Styles Panel */}
        {showStylesPanel && !isPreviewMode && selectedSectionId && (
          <StylesPanel
            section={sections.find(s => s.id === selectedSectionId)!}
            globalStyles={globalStyles}
            onUpdateSection={(updates) => updateSection(selectedSectionId, updates)}
            onUpdateGlobalStyles={updateGlobalStyles}
          />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{sections.length} sections</span>
          <span>•</span>
          <span>Last saved: Never</span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            loading={saving}
          >
            Save Page
          </Button>
        </div>
      </div>

      {/* Sections Library Modal */}
      {showLibrary && (
        <SectionsLibrary
          onClose={() => setShowLibrary(false)}
          onAddSection={(type) => {
            addSection(type);
            setShowLibrary(false);
          }}
        />
      )}
    </div>
  );
}
