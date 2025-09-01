// src/hooks/useApi.ts — централизованный хук для API вызовов

import { useState, useCallback } from 'react';

import { toast } from 'sonner';
import { getApiUrl } from '@/lib/config';

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

interface ApiState {
  isLoading: boolean;
  error: string | null;
}

export function useApi(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    error: null,
  });

  const { onSuccess, onError, showToast = true } = options;

  const execute = useCallback(async (
    endpoint: string,
    config: RequestInit = {}
  ) => {
    setState({ isLoading: true, error: null });

    try {
      const url = getApiUrl(endpoint);
      const response = await fetch(url, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}`;
        
        setState({ isLoading: false, error: errorMessage });
        
        if (showToast) {
          toast.error(errorMessage);
        }
        
        onError?.(errorMessage);
        return null;
      }

      const data = await response.json();
      
      setState({ isLoading: false, error: null });
      
      if (showToast) {
        toast.success('Операция выполнена успешно');
      }
      
      onSuccess?.(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      setState({ isLoading: false, error: errorMessage });
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      onError?.(errorMessage);
      return null;
    }
  }, [onSuccess, onError, showToast]);

  const get = useCallback((endpoint: string, config?: RequestInit) => {
    return execute(endpoint, { ...config, method: 'GET' });
  }, [execute]);

  const post = useCallback((endpoint: string, data?: unknown, config?: RequestInit) => {
    return execute(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [execute]);

  const put = useCallback((endpoint: string, data?: unknown, config?: RequestInit) => {
    return execute(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [execute]);

  const patch = useCallback((endpoint: string, data?: unknown, config?: RequestInit) => {
    return execute(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [execute]);

  const del = useCallback((endpoint: string, config?: RequestInit) => {
    return execute(endpoint, { ...config, method: 'DELETE' });
  }, [execute]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
  };
}
