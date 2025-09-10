import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AvitoStats {
  total: number;
  active: number;
  withAi: number;
  blocked: number;
  statusStats: Array<{ status: string; count: string }>;
  categoryStats: Array<{ category: string; count: string }>;
}

export interface AvitoStatsResponse {
  success: boolean;
  data: AvitoStats;
}

export interface UseAvitoStatsReturn {
  stats: AvitoStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: (userId?: string) => Promise<void>;
  clearError: () => void;
}

export function useAvitoStats(): UseAvitoStatsReturn {
  const [stats, setStats] = useState<AvitoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    const message = error?.message || error?.error || defaultMessage;
    setError(message);
    toast.error(message);
    console.error('Avito Stats API Error:', error);
  }, []);

  const fetchStats = useCallback(async (userId?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(
        `${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/listings/stats?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка загрузки статистики');
      }

      const data: AvitoStatsResponse = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error('Не удалось загрузить статистику');
      }
    } catch (error) {
      handleError(error, 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    clearError,
  };
}
