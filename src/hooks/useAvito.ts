import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  AvitoAccount,
  AvitoListing,
  AvitoOAuthUrlResponse,
  AvitoOAuthCallbackResponse,
  AvitoListingsResponse,
  AvitoSyncResponse,
  AvitoToggleResponse,
  AvitoActiveListingsResponse,
  AvitoConnectionStatus,
  AvitoStats,
  AvitoToggleRequest,
  AvitoSyncRequest,
} from '@/lib/avito-types';

interface UseAvitoReturn {
  // Состояние
  listings: AvitoListing[];
  activeListings: AvitoListing[];
  connectionStatus: AvitoConnectionStatus | null;
  stats: AvitoStats | null;
  isLoading: boolean;
  isConnecting: boolean;
  isSyncing: boolean;
  
  // Методы
  getOAuthUrl: () => Promise<AvitoOAuthUrlResponse>;
  connectAccount: (code: string, state?: string) => Promise<boolean>;
  syncListings: (force?: boolean) => Promise<boolean>;
  toggleAiAssistant: (listingId: string, enabled: boolean) => Promise<boolean>;
  getActiveListings: () => Promise<boolean>;
  refreshConnectionStatus: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Обработчики ошибок
  error: string | null;
  clearError: () => void;
}

export function useAvito(): UseAvitoReturn {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [activeListings, setActiveListings] = useState<AvitoListing[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<AvitoConnectionStatus | null>(null);
  const [stats, setStats] = useState<AvitoStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error?.message || error?.error || defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito API Error:', error);
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Необходима авторизация');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  const getOAuthUrl = useCallback(async (): Promise<AvitoOAuthUrlResponse> => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/oauth/url`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка получения OAuth URL');
      }

      const data: AvitoOAuthUrlResponse = await response.json();
      return data;
    } catch (error) {
      handleError(error, 'Ошибка получения ссылки для авторизации');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [getAuthHeaders, handleError]);

  const connectAccount = useCallback(async (code: string, state?: string): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);

      const params = new URLSearchParams({ code });
      if (state) params.append('state', state);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/oauth/callback?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка подключения аккаунта');
      }

      const data: AvitoOAuthCallbackResponse = await response.json();
      
      if (data.success) {
        toast.success('Аккаунт Avito успешно подключен!');
        await refreshConnectionStatus();
        await syncListings();
        return true;
      } else {
        throw new Error('Не удалось подключить аккаунт');
      }
    } catch (error) {
      handleError(error, 'Ошибка подключения аккаунта Avito');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [getAuthHeaders, handleError]);

  const syncListings = useCallback(async (force = false): Promise<boolean> => {
    // Предотвращаем множественные одновременные вызовы
    if (isSyncing) {
      return false;
    }
    
    try {
      setIsSyncing(true);
      setError(null);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/listings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ force } as AvitoSyncRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка синхронизации объявлений');
      }

      const data: AvitoSyncResponse = await response.json();
      
      if (data.success) {
        setListings(data.listings);
        toast.success(`Синхронизировано ${data.syncedCount} объявлений`);
        await refreshStats();
        return true;
      } else {
        throw new Error('Не удалось синхронизировать объявления');
      }
    } catch (error) {
      handleError(error, 'Ошибка синхронизации объявлений');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [getAuthHeaders, handleError]);

  const toggleAiAssistant = useCallback(async (listingId: string, enabled: boolean): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/listings/${listingId}/ai-toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled } as AvitoToggleRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка переключения ИИ ассистента');
      }

      const data: AvitoToggleResponse = await response.json();
      
      if (data.success) {
        // Обновляем локальное состояние
        setListings(prev => prev.map(listing => 
          listing.id === listingId ? data.listing : listing
        ));
        
        toast.success(
          `ИИ ассистент ${enabled ? 'включен' : 'выключен'} для объявления "${data.listing.title}"`
        );
        
        await refreshStats();
        return true;
      } else {
        throw new Error('Не удалось переключить ИИ ассистент');
      }
    } catch (error) {
      handleError(error, 'Ошибка переключения ИИ ассистента');
      return false;
    }
  }, [getAuthHeaders, handleError]);

  const getActiveListings = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/listings/ai-active`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка получения активных объявлений');
      }

      const data: AvitoActiveListingsResponse = await response.json();
      setActiveListings(data.listings);
      return true;
    } catch (error) {
      handleError(error, 'Ошибка получения активных объявлений');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, handleError]);

  const refreshConnectionStatus = useCallback(async (): Promise<void> => {
    try {
      // Здесь можно добавить API для проверки статуса подключения
      // Пока используем простую логику
      const hasToken = !!localStorage.getItem('auth_token');
      setConnectionStatus({
        hasToken,
        isExpired: false,
        expiresAt: null,
        willExpireSoon: false,
      });
    } catch (error) {
      console.error('Ошибка обновления статуса подключения:', error);
    }
  }, []);

  const refreshStats = useCallback(async (): Promise<void> => {
    try {
      const totalListings = listings.length;
      const activeAiListings = listings.filter(l => l.aiAssistantIsOn).length;
      
      setStats({
        totalListings,
        activeAiListings,
        totalConversations: 0, // TODO: реализовать когда будет API
        unreadMessages: 0, // TODO: реализовать когда будет API
      });
    } catch (error) {
      console.error('Ошибка обновления статистики:', error);
    }
  }, [listings]);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (hasInitialized) {
      return; // Предотвращаем повторную инициализацию
    }
    
    const loadInitialData = async () => {
      setHasInitialized(true);
      await refreshConnectionStatus();
      await syncListings(); // Загружаем объявления при инициализации
      // refreshStats() будет вызван автоматически через useEffect при изменении listings
    };

    loadInitialData();
  }, [hasInitialized]); // Добавляем hasInitialized в зависимости

  // Обновляем статистику при изменении объявлений
  useEffect(() => {
    const totalListings = listings.length;
    const activeAiListings = listings.filter(l => l.aiAssistantIsOn).length;
    
    setStats({
      totalListings,
      activeAiListings,
      totalConversations: 0, // TODO: реализовать когда будет API
      unreadMessages: 0, // TODO: реализовать когда будет API
    });
  }, [listings]); // Обновляем статистику напрямую без вызова функции

  return {
    // Состояние
    listings,
    activeListings,
    connectionStatus,
    stats,
    isLoading,
    isConnecting,
    isSyncing,
    error,
    
    // Методы
    getOAuthUrl,
    connectAccount,
    syncListings,
    toggleAiAssistant,
    getActiveListings,
    refreshConnectionStatus,
    refreshStats,
    clearError,
  };
}
