import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface AvitoListing {
  id: string;
  avitoId: string;
  title: string;
  category: string;
  price: number;
  status: string;
  aiAssistantIsOn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoListingsResponse {
  success: boolean;
  data: {
    listings: AvitoListing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AvitoStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    withAi: number;
    blocked: number;
    statusStats: Array<{ status: string; count: string }>;
    categoryStats: Array<{ category: string; count: string }>;
  };
}

export interface UseAvitoListingsReturn {
  listings: AvitoListing[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchListings: (page?: number, limit?: number, userId?: string) => Promise<void>;
  refreshListings: () => Promise<void>;
  clearError: () => void;
}

export function useAvitoListings(): UseAvitoListingsReturn {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error?.message || error?.error || defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito Listings API Error:', error);
  }, []);

  const fetchListings = useCallback(async (
    page = 1, 
    limit = 20, 
    userId?: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(
        `http://localhost:3005/api/avito/listings/public?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка загрузки объявлений');
      }

      const data: AvitoListingsResponse = await response.json();
      
      if (data.success) {
        setListings(data.data.listings);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Не удалось загрузить объявления');
      }
    } catch (error) {
      handleError(error, 'Ошибка загрузки объявлений');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const refreshListings = useCallback(async (): Promise<void> => {
    await fetchListings(pagination.page, pagination.limit);
  }, [fetchListings, pagination.page, pagination.limit]);

  return {
    listings,
    loading,
    error,
    pagination,
    fetchListings,
    refreshListings,
    clearError,
  };
}
