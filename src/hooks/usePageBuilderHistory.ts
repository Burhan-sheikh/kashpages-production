import { useState, useCallback } from 'react';
import { Section, PageStyles, SectionType } from '@/types/pageBuilder';

const defaultGlobalStyles: PageStyles = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1Size: '3rem',
    h2Size: '2.5rem',
    h3Size: '2rem',
    h4Size: '1.5rem',
    h5Size: '1.25rem',
    h6Size: '1rem',
    bodySize: '1rem',
  },
  buttons: {
    variant: 'solid',
    borderRadius: '8px',
  },
  shadows: {
    intensity: 'md',
  },
  container: {
    mobile: 'full',
    desktop: 'boxed',
  },
  darkMode: false,
};

export function usePageBuilderHistory(initialSections: Section[] = []) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [globalStyles, setGlobalStyles] = useState<PageStyles>(defaultGlobalStyles);
  const [history, setHistory] = useState<Section[][]>([initialSections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = useCallback((newSections: Section[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newSections];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const addSection = useCallback((type: SectionType) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      isLocked: false,
      hideOnMobile: false,
      hideOnDesktop: false,
      order: sections.length,
      content: {},
      styles: {
        backgroundColor: '#ffffff',
        padding: { mobile: '3rem 1rem', desktop: '5rem 2rem' },
        margin: { top: '0', bottom: '0' },
      },
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections);
    setSelectedSectionId(newSection.id);
  }, [sections, saveToHistory]);

  const removeSection = useCallback((id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    saveToHistory(newSections);
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
    }
  }, [sections, selectedSectionId, saveToHistory]);

  const updateSection = useCallback((id: string, updates: Partial<Section>) => {
    const newSections = sections.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    setSections(newSections);
    saveToHistory(newSections);
  }, [sections, saveToHistory]);

  const duplicateSection = useCallback((id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      const newSection = {
        ...section,
        id: `section-${Date.now()}`,
        name: `${section.name} (Copy)`,
        order: section.order + 1,
      };
      const index = sections.findIndex(s => s.id === id);
      const newSections = [
        ...sections.slice(0, index + 1),
        newSection,
        ...sections.slice(index + 1),
      ];
      setSections(newSections);
      saveToHistory(newSections);
    }
  }, [sections, saveToHistory]);

  const reorderSections = useCallback((oldIndex: number, newIndex: number) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(oldIndex, 1);
    newSections.splice(newIndex, 0, removed);
    setSections(newSections);
    saveToHistory(newSections);
  }, [sections, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setSections(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setSections(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  return {
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
    selectSection: setSelectedSectionId,
    updateGlobalStyles: setGlobalStyles,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
