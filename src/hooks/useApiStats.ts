import { useState, useEffect, useCallback } from 'react';
import { statsService } from '../lib/services';
import { GeneralStats, AiStats, LeadsStats, AvitoStats, HealthCheck } from '../lib/api-types';

interface UseStatsReturn {
  general: GeneralStats | null;
  ai: AiStats | null;
  leads: LeadsStats | null;
  avito: AvitoStats | null;
  health: HealthCheck | null;
  isLoading: boolean;
  error: string | null;
  loadAllStats: () => Promise<void>;
  loadGeneralStats: () => Promise<void>;
  loadAiStats: () => Promise<void>;
  loadLeadsStats: () => Promise<void>;
  loadAvitoStats: () => Promise<void>;
  loadHealthCheck: () => Promise<void>;
  getExtendedStats: () => Promise<any>;
  getStatsForPeriod: (startDate: string, endDate: string) => Promise<any>;
  getTrends: () => Promise<any>;
  getTopMetrics: () => Promise<any>;
  getPerformanceStats: () => Promise<any>;
  getErrorStats: () => Promise<any>;
  getUserStats: () => Promise<any>;
  getRealTimeStats: () => Promise<any>;
  isApiAvailable: () => Promise<boolean>;
  clearError: () => void;
}

export function useApiStats(): UseStatsReturn {
  const [general, setGeneral] = useState<GeneralStats | null>(null);
  const [ai, setAi] = useState<AiStats | null>(null);
  const [leads, setLeads] = useState<LeadsStats | null>(null);
  const [avito, setAvito] = useState<AvitoStats | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await statsService.getAllStats();
      setGeneral(stats.general);
      setAi(stats.ai);
      setLeads(stats.leads);
      setAvito(stats.avito);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGeneralStats = useCallback(async () => {
    try {
      const stats = await statsService.getGeneralStats();
      setGeneral(stats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки общей статистики');
    }
  }, []);

  const loadAiStats = useCallback(async () => {
    try {
      const stats = await statsService.getAiStats();
      setAi(stats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики ИИ');
    }
  }, []);

  const loadLeadsStats = useCallback(async () => {
    try {
      const stats = await statsService.getLeadsStats();
      setLeads(stats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики лидов');
    }
  }, []);

  const loadAvitoStats = useCallback(async () => {
    try {
      const stats = await statsService.getAvitoStats();
      setAvito(stats);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статистики Avito');
    }
  }, []);

  const loadHealthCheck = useCallback(async () => {
    try {
      const healthData = await statsService.getHealthCheck();
      setHealth(healthData);
    } catch (err: any) {
      setError(err.message || 'Ошибка проверки здоровья системы');
    }
  }, []);

  const getExtendedStats = useCallback(async () => {
    try {
      return await statsService.getExtendedStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения расширенной статистики');
      return null;
    }
  }, []);

  const getStatsForPeriod = useCallback(async (startDate: string, endDate: string) => {
    try {
      return await statsService.getStatsForPeriod(startDate, endDate);
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики за период');
      return null;
    }
  }, []);

  const getTrends = useCallback(async () => {
    try {
      return await statsService.getTrends();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения трендов');
      return null;
    }
  }, []);

  const getTopMetrics = useCallback(async () => {
    try {
      return await statsService.getTopMetrics();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения топ метрик');
      return null;
    }
  }, []);

  const getPerformanceStats = useCallback(async () => {
    try {
      return await statsService.getPerformanceStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики производительности');
      return null;
    }
  }, []);

  const getErrorStats = useCallback(async () => {
    try {
      return await statsService.getErrorStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики ошибок');
      return null;
    }
  }, []);

  const getUserStats = useCallback(async () => {
    try {
      return await statsService.getUserStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики пользователей');
      return null;
    }
  }, []);

  const getRealTimeStats = useCallback(async () => {
    try {
      return await statsService.getRealTimeStats();
    } catch (err: any) {
      setError(err.message || 'Ошибка получения статистики в реальном времени');
      return null;
    }
  }, []);

  const isApiAvailable = useCallback(async () => {
    try {
      return await statsService.isApiAvailable();
    } catch {
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data
  useEffect(() => {
    loadAllStats();
    loadHealthCheck();
  }, [loadAllStats, loadHealthCheck]);

  return {
    general,
    ai,
    leads,
    avito,
    health,
    isLoading,
    error,
    loadAllStats,
    loadGeneralStats,
    loadAiStats,
    loadLeadsStats,
    loadAvitoStats,
    loadHealthCheck,
    getExtendedStats,
    getStatsForPeriod,
    getTrends,
    getTopMetrics,
    getPerformanceStats,
    getErrorStats,
    getUserStats,
    getRealTimeStats,
    isApiAvailable,
    clearError,
  };
}
