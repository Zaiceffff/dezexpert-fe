import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AvitoListing } from '@/components/AvitoListingCard';

interface AvitoTokenResponse {
  success: boolean;
  access_token: string;
  expires_in?: number;
}

interface AvitoListingsResponse {
  success: boolean;
  data: {
    items: AvitoListing[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

interface UseAvitoListingsReturn {
  listings: AvitoListing[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  getToken: (code: string) => Promise<boolean>;
  getListings: (page?: number) => Promise<void>;
  clearError: () => void;
}

const API_BASE_URL = 'https://v467850.hosted-by-vdsina.com/api';

export function useAvitoListings(): UseAvitoListingsReturn {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error?.message || error?.error || defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito API Error:', error);
  }, []);

  const getToken = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/avito/token?code=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AvitoTokenResponse = await response.json();
      
      if (data.success && data.access_token) {
        setAccessToken(data.access_token);
        toast.success('Токен успешно получен');
        return true;
      } else {
        throw new Error('Не удалось получить токен');
      }
    } catch (error) {
      handleError(error, 'Ошибка получения токена');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getListings = useCallback(async (page: number = 1): Promise<void> => {
    if (!accessToken) {
      setError('Токен не найден');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/avito/items?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setAccessToken(null);
          throw new Error('Токен истек. Необходимо повторно авторизоваться');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AvitoListingsResponse = await response.json();
      
      if (data.success && data.data) {
        setListings(data.data.items);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Не удалось получить объявления');
      }
    } catch (error) {
      handleError(error, 'Ошибка получения объявлений');
    } finally {
      setLoading(false);
    }
  }, [accessToken, handleError]);

  return {
    listings,
    pagination,
    loading,
    error,
    accessToken,
    getToken,
    getListings,
    clearError,
  };
}