import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AvitoOAuthUrlResponse {
  url: string;
  state: string;
}

export interface UseAvitoOAuthReturn {
  oauthUrl: string | null;
  loading: boolean;
  error: string | null;
  initiateOAuth: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
  clearError: () => void;
}

export function useAvitoOAuth(): UseAvitoOAuthReturn {
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error?.message || error?.error || defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito OAuth API Error:', error);
  }, []);

  const initiateOAuth = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/oauth/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка получения OAuth URL');
      }

      const data: AvitoOAuthUrlResponse = await response.json();
      setOauthUrl(data.url);
      
      // Открываем OAuth URL в новой вкладке
      window.open(data.url, '_blank', 'width=600,height=700');
      
      toast.success('Открыта страница авторизации Avito');
    } catch (error) {
      handleError(error, 'Ошибка инициализации OAuth');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем статус подключения через проверку объявлений
      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/listings/public?page=1&limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      handleError(error, 'Ошибка проверки подключения');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    oauthUrl,
    loading,
    error,
    initiateOAuth,
    checkConnection,
    clearError,
  };
}
