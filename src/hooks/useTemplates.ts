// Custom hook for template operations
import { useState, useEffect } from 'react';
import { Template, TemplateFilter } from '@/types';

export function useTemplates(filter?: TemplateFilter) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filter?.category) queryParams.set('category', filter.category);
      if (filter?.plan) queryParams.set('plan', filter.plan);
      if (filter?.featured !== undefined) queryParams.set('featured', filter.featured.toString());
      if (filter?.search) queryParams.set('search', filter.search);

      const response = await fetch(`/api/templates?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data: Template[] = await response.json();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filter?.category, filter?.plan, filter?.featured, filter?.search]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
}

export function useTemplate(templateId: string | null) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    if (!templateId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/templates/${templateId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      const data: Template = await response.json();
      setTemplate(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  return {
    template,
    loading,
    error,
    refetch: fetchTemplate,
  };
}
