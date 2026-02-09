'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Page, Section, SectionType } from '../types';
import { SectionLibrary } from './SectionLibrary';
import { SectionEditor } from './SectionEditor';
import { SectionRenderer } from './SectionRenderer';
import { DesignPanel } from './DesignPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Plus,
  Eye,
  Save,
  Settings,
  Smartphone,
  Monitor,
  GripVertical,
} from 'lucide-react';
import { getSectionByType } from '../constants/sections';
import { v4 as uuidv4 } from 'uuid';

interface PageBuilderProps {
  page: Page;
  onSave: (page: Page) => Promise<void>;
}

export function PageBuilder({ page, onSave }: PageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(page.sections || []);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSection = (type: SectionType) => {
    const definition = getSectionByType(type);
    if (!definition) return;

    const newSection: Section = {
      id: uuidv4(),
      type,
      data: definition.defaultData,
      visibility: { mobile: true, desktop: true },
      locked: false,
      order: sections.length,
    };

    setSections([...sections, newSection]);
    setShowSectionLibrary(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSections(updatedItems);
  };

  const handleUpdateSection = (sectionId: string, data: Partial<Section>) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...data } : section
      )
    );
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    if (selectedSection?.id === sectionId) {
      setSelectedSection(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ ...page, sections });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">{page.title}</h1>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowSectionLibrary(true)}
            >
              Add Section
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preview Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${
                  previewMode === 'desktop'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${
                  previewMode === 'mobile'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={() => setShowDesignPanel(true)}
            >
              Design
            </Button>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              size="sm"
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div
            className={`mx-auto bg-white shadow-xl ${
              previewMode === 'mobile' ? 'max-w-md' : 'max-w-6xl'
            }`}
          >
            {isPreview ? (
              // Preview Mode
              <div>
                {sections.map((section) => (
                  <SectionRenderer key={section.id} section={section} isPreview />
                ))}
              </div>
            ) : (
              // Edit Mode with Drag & Drop
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.length === 0 ? (
                        <div className="text-center py-20">
                          <p className="text-gray-500 mb-4">
                            No sections yet. Add your first section to get started.
                          </p>
                          <Button
                            onClick={() => setShowSectionLibrary(true)}
                            leftIcon={<Plus className="h-4 w-4" />}
                          >
                            Add Section
                          </Button>
                        </div>
                      ) : (
                        sections.map((section, index) => (
                          <Draggable
                            key={section.id}
                            draggableId={section.id}
                            index={index}
                            isDragDisabled={section.locked}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`relative group ${
                                  snapshot.isDragging ? 'opacity-50' : ''
                                }`}
                              >
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <GripVertical className="h-6 w-6 text-gray-400" />
                                </div>

                                {/* Section Content */}
                                <div
                                  onClick={() => setSelectedSection(section)}
                                  className={`cursor-pointer border-2 transition-colors ${
                                    selectedSection?.id === section.id
                                      ? 'border-primary-500'
                                      : 'border-transparent hover:border-gray-300'
                                  }`}
                                >
                                  <SectionRenderer section={section} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>

        {/* Right Sidebar - Section Editor */}
        {!isPreview && selectedSection && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-6">
              <SectionEditor
                section={selectedSection}
                onUpdate={handleUpdateSection}
                onDelete={handleDeleteSection}
              />
            </div>
          </div>
        )}
      </div>

      {/* Section Library Modal */}
      <Modal
        isOpen={showSectionLibrary}
        onClose={() => setShowSectionLibrary(false)}
        title="Add Section"
        size="xl"
      >
        <SectionLibrary onSelectSection={handleAddSection} />
      </Modal>

      {/* Design Panel Modal */}
      <Modal
        isOpen={showDesignPanel}
        onClose={() => setShowDesignPanel(false)}
        title="Design Settings"
        size="lg"
      >
        <DesignPanel
          design={page.design}
          onUpdate={(design) => onSave({ ...page, design })}
        />
      </Modal>
    </div>
  );
}
