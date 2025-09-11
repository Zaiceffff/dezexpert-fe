import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  AvitoListing,
  AvitoOAuthUrlResponse,
  AvitoConnectionStatus,
  AvitoStats,
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

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito API Error:', error);
  }, []);


  const getOAuthUrl = useCallback(async (): Promise<AvitoOAuthUrlResponse> => {
    try {
      setIsConnecting(true);
      setError(null);

      // Используем прямой URL для OAuth Avito
      const oauthUrl = 'https://avito.ru/oauth?response_type=code&client_id=hF49pA0JvwucazxwgIel&scope=items:info,messenger:read,messenger:write,user:read';
      
      return {
        url: oauthUrl,
        state: Math.random().toString(36).substring(7)
      };
    } catch (error) {
      handleError(error, 'Ошибка получения ссылки для авторизации');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [handleError]);

  const refreshConnectionStatus = useCallback(async (): Promise<void> => {
    try {
      // Проверяем наличие токена Авито
      const avitoToken = localStorage.getItem('avito_token');
      const hasToken = !!avitoToken;
      
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

  const getAvitoItems = useCallback(async (token: string, page: number = 1): Promise<AvitoListing[]> => {
    try {
      const response = await fetch(`https://v467850.hosted-by-vdsina.com/api/avito/items?page=${page}`, {
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

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Не удалось получить объявления');
      }
      
      if (!data.data || !Array.isArray(data.data.items)) {
        throw new Error('Неверный формат ответа: отсутствуют данные объявлений');
      }
      
      return data.data.items;
    } catch (error) {
      console.error('Ошибка получения объявлений:', error);
      throw error;
    }
  }, []);

  const connectAccount = useCallback(async (code: string): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);

      // Получаем токен
      const token = await getAvitoToken(code);
      
      // Получаем объявления с токеном
      const items = await getAvitoItems(token, 1);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('avito_token', token);
      
      // Устанавливаем объявления
      setListings(items);
      
      toast.success('Аккаунт Avito успешно подключен!');
      await refreshConnectionStatus();
      return true;
    } catch (error) {
      handleError(error, 'Ошибка подключения аккаунта Avito');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [getAvitoToken, getAvitoItems, handleError, refreshConnectionStatus]);

  const syncListings = useCallback(async (): Promise<boolean> => {
    // Предотвращаем множественные одновременные вызовы
    if (isSyncing) {
      return false;
    }
    
    try {
      setIsSyncing(true);
      setError(null);

      // Получаем токен из localStorage
      const token = localStorage.getItem('avito_token');
      if (!token) {
        throw new Error('Токен не найден. Необходимо авторизоваться через кнопку "Подключить Avito"');
      }

      // Получаем объявления с токеном
      const items = await getAvitoItems(token, 1);
      
      setListings(items);
      toast.success(`Синхронизировано ${items.length} объявлений`);
      await refreshStats();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      if (errorMessage.includes('Токен истек')) {
        localStorage.removeItem('avito_token');
        setError('Сессия истекла. Необходимо повторно авторизоваться');
      } else if (errorMessage.includes('Доступ запрещен')) {
        setError('Доступ запрещен. Обратитесь к администратору');
      } else if (errorMessage.includes('Превышен лимит')) {
        setError('Превышен лимит запросов. Попробуйте позже');
      } else {
        setError(errorMessage);
      }
      
      handleError(error, 'Ошибка синхронизации объявлений');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [getAvitoItems, handleError, isSyncing, refreshStats]);

  const toggleAiAssistant = useCallback(async (listingId: string, enabled: boolean): Promise<boolean> => {
    try {
      setError(null);

      // Получаем токен из localStorage
      const token = localStorage.getItem('avito_token');
      if (!token) {
        throw new Error('Токен не найден. Необходимо авторизоваться');
      }

      const response = await fetch(`https://v467850.hosted-by-vdsina.com/api/avito/listings/${listingId}/ai-toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Неизвестная ошибка');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Обновляем локальное состояние
        setListings(prev => prev.map(listing => 
          listing.id === listingId ? { ...listing, aiAssistantIsOn: enabled } : listing
        ));
        
        toast.success(
          `ИИ ассистент ${enabled ? 'включен' : 'выключен'} для объявления`
        );
        
        await refreshStats();
        return true;
      } else {
        throw new Error('Не удалось переключить ИИ ассистент');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      if (errorMessage.includes('Токен истек')) {
        localStorage.removeItem('avito_token');
        setError('Сессия истекла. Необходимо повторно авторизоваться');
      } else {
        setError(errorMessage);
      }
      
      handleError(error, 'Ошибка переключения ИИ ассистента');
      return false;
    }
  }, [handleError, refreshStats]);

  const getActiveListings = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем токен из localStorage
      const token = localStorage.getItem('avito_token');
      if (!token) {
        throw new Error('Токен не найден. Необходимо авторизоваться');
      }

      // Получаем объявления с токеном
      const items = await getAvitoItems(token, 1);
      
      // Фильтруем активные объявления с ИИ
      const activeItems = items.filter(item => item.aiAssistantIsOn);
      setActiveListings(activeItems);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      
      if (errorMessage.includes('Токен истек')) {
        localStorage.removeItem('avito_token');
        setError('Сессия истекла. Необходимо повторно авторизоваться');
      } else {
        setError(errorMessage);
      }
      
      handleError(error, 'Ошибка получения активных объявлений');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getAvitoItems, handleError]);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (hasInitialized) {
      return; // Предотвращаем повторную инициализацию
    }
    
    const loadInitialData = async () => {
      setHasInitialized(true);
      await refreshConnectionStatus();
      
      // Проверяем, есть ли токен Авито
      const avitoToken = localStorage.getItem('avito_token');
      if (avitoToken) {
        await syncListings(); // Загружаем объявления при инициализации
      }
      // refreshStats() будет вызван автоматически через useEffect при изменении listings
    };

    loadInitialData();
  }, [hasInitialized, refreshConnectionStatus, syncListings]); // Добавляем hasInitialized в зависимости

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
