import { useState, useEffect, useCallback } from 'react';
import { avitoSimpleService } from '../lib/services/avito-simple.service';
import { AvitoListing, PaginationParams, AvitoTokensStatus } from '../lib/api-types';

interface UseAvitoSimpleReturn {
  listings: AvitoListing[];
  aiActiveListings: AvitoListing[];
  tokensStatus: AvitoTokensStatus | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Основные методы
  loadListings: (params?: PaginationParams) => Promise<void>;
  loadAiActiveListings: () => Promise<void>;
  toggleAiAssistant: (id: string, enabled: boolean) => Promise<boolean>;
  syncListings: () => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  checkConnection: () => Promise<void>;
  
  // OAuth методы
  getOAuthUrl: () => Promise<string>;
  handleOAuthCallback: (code: string, state?: string) => Promise<boolean>;
  
  // Утилиты
  clearError: () => void;
}

export function useAvitoSimple(): UseAvitoSimpleReturn {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [aiActiveListings, setAiActiveListings] = useState<AvitoListing[]>([]);
  const [tokensStatus, setTokensStatus] = useState<AvitoTokensStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const loadListings = useCallback(async (params: PaginationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await avitoSimpleService.getListings(params);
      setListings(response.data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки объявлений');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAiActiveListings = useCallback(async () => {
    try {
      const activeListings = await avitoSimpleService.getAiActiveListings();
      setAiActiveListings(activeListings);
    } catch (err: any) {
      console.error('Failed to load AI active listings:', err);
    }
  }, []);

  const loadTokensStatus = useCallback(async () => {
    try {
      const status = await avitoSimpleService.getTokensStatus();
      setTokensStatus(status);
      // Проверяем, что есть токены и они действительны
      const isConnected = !!(status.accessToken && status.refreshToken && status.isValid);
      setIsConnected(isConnected);
    } catch (err) {
      console.error('Failed to load tokens status:', err);
      setIsConnected(false);
    }
  }, []);

  const toggleAiAssistant = useCallback(async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      const result = await avitoSimpleService.toggleAiAssistant(id, enabled);
      
      if (result.success) {
        // Update local state
        setListings(prev => prev.map(listing =>
          listing.id === id ? { ...listing, aiAssistantIsOn: enabled } : listing
        ));
        
        // Update AI active listings
        if (enabled) {
          const listing = listings.find(l => l.id === id);
          if (listing) {
            setAiActiveListings(prev => [...prev, { ...listing, aiAssistantIsOn: true }]);
          }
        } else {
          setAiActiveListings(prev => prev.filter(l => l.id !== id));
        }
      }
      
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Ошибка изменения настроек ИИ');
      return false;
    }
  }, [listings]);

  const syncListings = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await avitoSimpleService.syncListings();
      if (result.synced > 0) {
        // Reload listings after sync
        await loadListings();
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка синхронизации объявлений');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadListings]);

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      const result = await avitoSimpleService.refreshTokens();
      if (result.success) {
        await loadTokensStatus();
      }
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления токенов');
      return false;
    }
  }, [loadTokensStatus]);

  const checkConnection = useCallback(async () => {
    try {
      const result = await avitoSimpleService.checkConnection();
      setIsConnected(result.connected);
      if (!result.connected) {
        setError(result.message);
      }
    } catch (err: any) {
      setIsConnected(false);
      setError('Ошибка проверки подключения');
    }
  }, []);

  const getOAuthUrl = useCallback(async (): Promise<string> => {
    try {
      const response = await avitoSimpleService.getOAuthUrl();
      return response.url;
    } catch (err: any) {
      setError(err.message || 'Ошибка получения OAuth URL');
      throw err;
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code: string, state?: string): Promise<boolean> => {
    try {
      const result = await avitoSimpleService.handleOAuthCallback(code, state);
      if (result.success) {
        // Load tokens status after successful OAuth
        await loadTokensStatus();
      }
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Ошибка обработки OAuth callback');
      return false;
    }
  }, [loadTokensStatus]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    loadTokensStatus();
    loadListings();
    loadAiActiveListings();
  }, [loadTokensStatus, loadListings, loadAiActiveListings]);

  return {
    listings,
    aiActiveListings,
    tokensStatus,
    isLoading,
    error,
    isConnected,
    loadListings,
    loadAiActiveListings,
    toggleAiAssistant,
    syncListings,
    refreshTokens,
    checkConnection,
    getOAuthUrl,
    handleOAuthCallback,
    clearError,
  };
}
