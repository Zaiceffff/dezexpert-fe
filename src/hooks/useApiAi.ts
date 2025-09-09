import { useState, useEffect, useCallback } from 'react';
import { aiService } from '../lib/services';
import { AiHistoryItem, AiMessage } from '../lib/api-types';

interface UseAiReturn {
  history: AiHistoryItem[];
  isLoading: boolean;
  error: string | null;
  loadHistory: (limit?: number) => Promise<void>;
  sendMessage: (message: string, model?: string) => Promise<string | null>;
  sendMessageWithContext: (message: string, context: string, model?: string) => Promise<string | null>;
  searchHistory: (query: string) => Promise<AiHistoryItem[]>;
  getHistoryByModel: (model: string) => Promise<AiHistoryItem[]>;
  getRecentHistory: (limit?: number) => Promise<AiHistoryItem[]>;
  getUsageStats: () => Promise<any>;
  getPopularQueries: (limit?: number) => Promise<Array<{ query: string; count: number }>>;
  getAvailableModels: () => string[];
  validateMessage: (message: string) => { isValid: boolean; error?: string };
  clearError: () => void;
}

export function useApiAi(): UseAiReturn {
  const [history, setHistory] = useState<AiHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const historyData = await aiService.getHistory({ limit });
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки истории ИИ');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (message: string, model: string = 'gpt-3.5-turbo'): Promise<string | null> => {
    // Validate message first
    const validation = aiService.validateMessage(message);
    if (!validation.isValid) {
      setError(validation.error || 'Неверное сообщение');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.sendSimpleMessage(message, model);
      
      // Create history item
      const historyItem: AiHistoryItem = {
        id: Date.now().toString(),
        messages: [{ role: 'user', content: message }],
        response,
        model,
        createdAt: new Date().toISOString(),
      };
      
      // Add to history
      setHistory(prev => [historyItem, ...prev]);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки сообщения');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessageWithContext = useCallback(async (
    message: string, 
    context: string, 
    model: string = 'gpt-3.5-turbo'
  ): Promise<string | null> => {
    // Validate message first
    const validation = aiService.validateMessage(message);
    if (!validation.isValid) {
      setError(validation.error || 'Неверное сообщение');
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiService.sendMessageWithContext(message, context, model);
      
      // Create history item with context
      const historyItem: AiHistoryItem = {
        id: Date.now().toString(),
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
        response,
        model,
        createdAt: new Date().toISOString(),
      };
      
      // Add to history
      setHistory(prev => [historyItem, ...prev]);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки сообщения с контекстом');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchHistory = useCallback(async (query: string): Promise<AiHistoryItem[]> => {
    try {
      return await aiService.searchHistory(query);
    } catch (err: any) {
      setError(err.message || 'Ошибка поиска в истории');
      return [];
    }
  }, []);

  const getHistoryByModel = useCallback(async (model: string): Promise<AiHistoryItem[]> => {
    try {
      return await aiService.getHistoryByModel(model);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения истории по модели');
      return [];
    }
  }, []);

  const getRecentHistory = useCallback(async (limit: number = 10): Promise<AiHistoryItem[]> => {
    try {
      return await aiService.getRecentHistory(limit);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения последней истории');
      return [];
    }
  }, []);

  const getUsageStats = useCallback(async () => {
    try {
      return await aiService.getUsageStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики использования');
      return null;
    }
  }, []);

  const getPopularQueries = useCallback(async (limit: number = 10) => {
    try {
      return await aiService.getPopularQueries(limit);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения популярных запросов');
      return [];
    }
  }, []);

  const getAvailableModels = useCallback(() => {
    return aiService.getAvailableModels();
  }, []);

  const validateMessage = useCallback((message: string) => {
    return aiService.validateMessage(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial history
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    error,
    loadHistory,
    sendMessage,
    sendMessageWithContext,
    searchHistory,
    getHistoryByModel,
    getRecentHistory,
    getUsageStats,
    getPopularQueries,
    getAvailableModels,
    validateMessage,
    clearError,
  };
}
