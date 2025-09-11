import { useState, useCallback, useEffect } from 'react';
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
  getListings: (page?: number, status?: string) => Promise<void>;
  getAvitoToken: (code: string) => Promise<string>;
  getAvitoItems: (token: string, page?: number, status?: string) => Promise<AvitoListing[]>;
  setAccessToken: (token: string | null) => void;
  setListings: (listings: AvitoListing[]) => void;
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

  const getAvitoToken = useCallback(async (code: string): Promise<string> => {
    try {
      const response = await fetch(`https://v467850.hosted-by-vdsina.com/api/avito/token?code=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Неизвестная ошибка');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.access_token) {
        throw new Error('Неверный формат ответа: отсутствует токен доступа');
      }
      
      return data.data.access_token;
    } catch (error) {
      console.error('Ошибка получения токена:', error);
      throw error;
    }
  }, []);

  const setAccessTokenWithPersistence = useCallback((token: string | null) => {
    setAccessToken(token);
    if (token) {
      localStorage.setItem('avito_token', token);
    } else {
      localStorage.removeItem('avito_token');
    }
  }, []);

  const getToken = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAvitoToken(code);
      setAccessTokenWithPersistence(token);
      toast.success('Токен успешно получен');
      return true;
    } catch (error) {
      handleError(error, 'Ошибка получения токена');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getAvitoToken, handleError, setAccessTokenWithPersistence]);

  const getAvitoItems = useCallback(async (token: string, page: number = 1, status: string = 'active'): Promise<AvitoListing[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/avito/items?page=${page}&status=${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Токен истек. Необходимо повторно авторизоваться');
        }
        
        if (response.status === 403) {
          throw new Error('Доступ запрещен. Проверьте права доступа к API');
        }
        
        if (response.status === 429) {
          throw new Error('Превышен лимит запросов. Попробуйте позже');
        }
        
        const errorText = await response.text().catch(() => 'Неизвестная ошибка');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
      }

      const data: AvitoListingsResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Не удалось получить объявления');
      }
      
      if (!data.data || !Array.isArray(data.data.items)) {
        throw new Error('Неверный формат ответа: отсутствуют данные объявлений');
      }
      
      setPagination(data.data.pagination);
      return data.data.items;
    } catch (error) {
      console.error('Ошибка получения объявлений:', error);
      throw error;
    }
  }, []);

  // Инициализация токена из localStorage при загрузке
  useEffect(() => {
    const savedToken = localStorage.getItem('avito_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const getListings = useCallback(async (page: number = 1, status: string = 'active'): Promise<void> => {
    if (!accessToken) {
      setError('Токен не найден. Необходимо авторизоваться');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const items = await getAvitoItems(accessToken, page, status);
      setListings(items);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      if (errorMessage.includes('Токен истек')) {
        setAccessTokenWithPersistence(null);
        setError('Сессия истекла. Необходимо повторно авторизоваться');
      } else if (errorMessage.includes('Доступ запрещен')) {
        setError('Доступ запрещен. Обратитесь к администратору');
      } else if (errorMessage.includes('Превышен лимит')) {
        setError('Превышен лимит запросов. Попробуйте позже');
      } else {
        setError(errorMessage);
      }
      handleError(error, 'Ошибка получения объявлений');
    } finally {
      setLoading(false);
    }
  }, [accessToken, getAvitoItems, handleError, setAccessTokenWithPersistence]);

  return {
    listings,
    pagination,
    loading,
    error,
    accessToken,
    getToken,
    getListings,
    getAvitoToken,
    getAvitoItems,
    setAccessToken: setAccessTokenWithPersistence,
    setListings,
    clearError,
  };
}