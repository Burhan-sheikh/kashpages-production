// Custom hook for page operations
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Page, PaginationParams, PaginationResponse } from '@/types';

export function usePages(params?: PaginationParams) {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<PaginationResponse<Page>, 'data'> | null>(null);

  const fetchPages = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken?.();
      const queryParams = new URLSearchParams({
        page: params?.page?.toString() || '1',
        limit: params?.limit?.toString() || '10',
      });

      const response = await fetch(`/api/pages?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }

      const result: PaginationResponse<Page> = await response.json();
      setPages(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        hasMore: result.hasMore,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [user, params?.page, params?.limit]);

  return {
    pages,
    loading,
    error,
    pagination,
    refetch: fetchPages,
  };
}

export function usePage(pageId: string | null) {
  const { user } = useAuth();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async () => {
    if (!user || !pageId) return;

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken?.();
      const response = await fetch(`/api/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch page');
      }

      const data: Page = await response.json();
      setPage(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [user, pageId]);

  return {
    page,
    loading,
    error,
    refetch: fetchPage,
  };
}
