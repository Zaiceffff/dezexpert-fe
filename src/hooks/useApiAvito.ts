import { useState, useEffect, useCallback } from 'react';
import { avitoService } from '../lib/services';
import { AvitoListing, PaginationParams, AvitoTokensStatus } from '../lib/api-types';

interface UseAvitoReturn {
  listings: AvitoListing[];
  aiActiveListings: AvitoListing[];
  tokensStatus: AvitoTokensStatus | null;
  isLoading: boolean;
  error: string | null;
  loadListings: (params?: PaginationParams) => Promise<void>;
  loadAiActiveListings: () => Promise<void>;
  toggleAiAssistant: (id: string, enabled: boolean) => Promise<boolean>;
  syncListings: () => Promise<boolean>;
  getOAuthUrl: () => Promise<string>;
  handleOAuthCallback: (code: string, state?: string) => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  searchListings: (query: string) => AvitoListing[];
  getListingsByCategory: (category: string) => AvitoListing[];
  getListingsByStatus: (status: string) => AvitoListing[];
  getListingsStats: () => Promise<any>;
  clearError: () => void;
}

export function useApiAvito(): UseAvitoReturn {
  const [listings, setListings] = useState<AvitoListing[]>([]);
  const [aiActiveListings, setAiActiveListings] = useState<AvitoListing[]>([]);
  const [tokensStatus, setTokensStatus] = useState<AvitoTokensStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadListings = useCallback(async (params: PaginationParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await avitoService.getListings(params);
      setListings(response.data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки объявлений');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAiActiveListings = useCallback(async () => {
    try {
      const activeListings = await avitoService.getAiActiveListings();
      setAiActiveListings(activeListings);
    } catch (err: any) {
      console.error('Failed to load AI active listings:', err);
    }
  }, []);

  const toggleAiAssistant = useCallback(async (id: string, enabled: boolean): Promise<boolean> => {
    try {
      const result = await avitoService.toggleAiAssistant(id, enabled);
      
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
      const result = await avitoService.syncListings();
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

  const getOAuthUrl = useCallback(async (): Promise<string> => {
    try {
      const response = await avitoService.getOAuthUrl();
      return response.url;
    } catch (err: any) {
      setError(err.message || 'Ошибка получения OAuth URL');
      throw err;
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code: string, state?: string): Promise<boolean> => {
    try {
      const result = await avitoService.handleOAuthCallback(code, state);
      if (result.success) {
        // Load tokens status after successful OAuth
        await loadTokensStatus();
      }
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Ошибка обработки OAuth callback');
      return false;
    }
  }, []);

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      const result = await avitoService.refreshTokens();
      if (result.success) {
        await loadTokensStatus();
      }
      return result.success;
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления токенов');
      return false;
    }
  }, []);

  const loadTokensStatus = useCallback(async () => {
    try {
      const status = await avitoService.getTokensStatus();
      setTokensStatus(status);
    } catch (err) {
      console.error('Failed to load tokens status:', err);
    }
  }, []);

  const searchListings = useCallback((query: string): AvitoListing[] => {
    if (!query.trim()) return listings;
    return listings.filter(listing =>
      listing.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [listings]);

  const getListingsByCategory = useCallback((category: string): AvitoListing[] => {
    return listings.filter(listing =>
      listing.category.toLowerCase().includes(category.toLowerCase())
    );
  }, [listings]);

  const getListingsByStatus = useCallback((status: string): AvitoListing[] => {
    return listings.filter(listing =>
      listing.status.toLowerCase() === status.toLowerCase()
    );
  }, [listings]);

  const getListingsStats = useCallback(async () => {
    try {
      return await avitoService.getListingsStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики объявлений');
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    loadListings();
    loadAiActiveListings();
    loadTokensStatus();
  }, [loadListings, loadAiActiveListings, loadTokensStatus]);

  return {
    listings,
    aiActiveListings,
    tokensStatus,
    isLoading,
    error,
    loadListings,
    loadAiActiveListings,
    toggleAiAssistant,
    syncListings,
    getOAuthUrl,
    handleOAuthCallback,
    refreshTokens,
    searchListings,
    getListingsByCategory,
    getListingsByStatus,
    getListingsStats,
    clearError,
  };
}
