import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import { 
  GeneralStats, 
  AiStats, 
  LeadsStats, 
  AvitoStats, 
  HealthCheck 
} from '../api-types';

export class StatsService {
  /**
   * Получение общей статистики
   */
  async getGeneralStats(): Promise<GeneralStats> {
    return apiClient.get<GeneralStats>(API_ENDPOINTS.STATS.GENERAL);
  }

  /**
   * Получение статистики ИИ
   */
  async getAiStats(): Promise<AiStats> {
    return apiClient.get<AiStats>(API_ENDPOINTS.STATS.AI);
  }

  /**
   * Получение статистики лидов
   */
  async getLeadsStats(): Promise<LeadsStats> {
    return apiClient.get<LeadsStats>(API_ENDPOINTS.STATS.LEADS);
  }

  /**
   * Получение статистики Avito
   */
  async getAvitoStats(): Promise<AvitoStats> {
    return apiClient.get<AvitoStats>(API_ENDPOINTS.STATS.AVITO);
  }

  /**
   * Получение всех статистик одновременно
   */
  async getAllStats(): Promise<{
    general: GeneralStats;
    ai: AiStats;
    leads: LeadsStats;
    avito: AvitoStats;
  }> {
    try {
      const [general, ai, leads, avito] = await Promise.all([
        this.getGeneralStats(),
        this.getAiStats(),
        this.getLeadsStats(),
        this.getAvitoStats()
      ]);

      return { general, ai, leads, avito };
    } catch (error) {
      throw new Error('Ошибка получения статистики');
    }
  }

  /**
   * Проверка здоровья системы
   */
  async getHealthCheck(): Promise<HealthCheck> {
    return apiClient.get<HealthCheck>(API_ENDPOINTS.HEALTH);
  }

  /**
   * Проверка доступности API
   */
  async isApiAvailable(): Promise<boolean> {
    try {
      const health = await this.getHealthCheck();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Получение расширенной статистики с дополнительными метриками
   */
  async getExtendedStats(): Promise<{
    general: GeneralStats;
    ai: AiStats;
    leads: LeadsStats;
    avito: AvitoStats;
    health: HealthCheck;
    apiStatus: 'online' | 'offline';
    lastUpdated: string;
  }> {
    try {
      const [allStats, health] = await Promise.all([
        this.getAllStats(),
        this.getHealthCheck()
      ]);

      return {
        ...allStats,
        health,
        apiStatus: health.status === 'healthy' ? 'online' : 'offline',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return {
        general: { totalUsers: 0, totalOrders: 0, totalListings: 0, totalAiInteractions: 0 },
        ai: { totalInteractions: 0, totalTokens: 0, averageResponseTime: 0, mostUsedModel: '' },
        leads: { totalLeads: 0, newLeads: 0, convertedLeads: 0, conversionRate: 0 },
        avito: { totalListings: 0, activeListings: 0, aiEnabledListings: 0, lastSync: null },
        health: { status: 'unhealthy', timestamp: new Date().toISOString(), services: { database: 'down', avito: 'down', ai: 'down' } },
        apiStatus: 'offline',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Получение статистики за период
   */
  async getStatsForPeriod(startDate: string, endDate: string): Promise<{
    period: { start: string; end: string };
    general: GeneralStats;
    ai: AiStats;
    leads: LeadsStats;
    avito: AvitoStats;
  }> {
    try {
      // В реальном API здесь были бы параметры для фильтрации по дате
      // Пока возвращаем общую статистику
      const allStats = await this.getAllStats();
      
      return {
        period: { start: startDate, end: endDate },
        ...allStats
      };
    } catch (error) {
      throw new Error('Ошибка получения статистики за период');
    }
  }

  /**
   * Получение трендов (изменения за последние периоды)
   */
  async getTrends(): Promise<{
    users: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    listings: { current: number; previous: number; change: number };
    aiInteractions: { current: number; previous: number; change: number };
  }> {
    try {
      // В реальном API здесь была бы логика сравнения с предыдущими периодами
      // Пока возвращаем текущие значения
      const stats = await this.getGeneralStats();
      
      return {
        users: { current: stats.totalUsers, previous: 0, change: 0 },
        orders: { current: stats.totalOrders, previous: 0, change: 0 },
        listings: { current: stats.totalListings, previous: 0, change: 0 },
        aiInteractions: { current: stats.totalAiInteractions, previous: 0, change: 0 }
      };
    } catch (error) {
      throw new Error('Ошибка получения трендов');
    }
  }

  /**
   * Получение топ метрик
   */
  async getTopMetrics(): Promise<{
    mostActiveService: string;
    mostUsedAiModel: string;
    conversionRate: number;
    averageResponseTime: number;
  }> {
    try {
      const [general, ai, leads] = await Promise.all([
        this.getGeneralStats(),
        this.getAiStats(),
        this.getLeadsStats()
      ]);

      return {
        mostActiveService: 'Дезинфекция', // Заглушка
        mostUsedAiModel: ai.mostUsedModel || 'gpt-3.5-turbo',
        conversionRate: leads.conversionRate,
        averageResponseTime: ai.averageResponseTime
      };
    } catch (error) {
      return {
        mostActiveService: 'Неизвестно',
        mostUsedAiModel: 'gpt-3.5-turbo',
        conversionRate: 0,
        averageResponseTime: 0
      };
    }
  }

  /**
   * Получение статистики производительности
   */
  async getPerformanceStats(): Promise<{
    apiResponseTime: number;
    databaseStatus: 'up' | 'down';
    avitoStatus: 'up' | 'down';
    aiStatus: 'up' | 'down';
    uptime: number;
  }> {
    try {
      const health = await this.getHealthCheck();
      
      return {
        apiResponseTime: 0, // Заглушка
        databaseStatus: health.services.database,
        avitoStatus: health.services.avito,
        aiStatus: health.services.ai,
        uptime: 99.9 // Заглушка
      };
    } catch (error) {
      return {
        apiResponseTime: 0,
        databaseStatus: 'down',
        avitoStatus: 'down',
        aiStatus: 'down',
        uptime: 0
      };
    }
  }

  /**
   * Получение статистики ошибок
   */
  async getErrorStats(): Promise<{
    totalErrors: number;
    errorsByType: Record<string, number>;
    lastError: string | null;
    errorRate: number;
  }> {
    try {
      // В реальном API здесь была бы статистика ошибок
      return {
        totalErrors: 0,
        errorsByType: {},
        lastError: null,
        errorRate: 0
      };
    } catch (error) {
      return {
        totalErrors: 0,
        errorsByType: {},
        lastError: null,
        errorRate: 0
      };
    }
  }

  /**
   * Получение статистики пользователей
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
  }> {
    try {
      const general = await this.getGeneralStats();
      
      return {
        totalUsers: general.totalUsers,
        activeUsers: Math.floor(general.totalUsers * 0.7), // Заглушка
        newUsers: Math.floor(general.totalUsers * 0.1), // Заглушка
        userGrowth: 15.5 // Заглушка
      };
    } catch (error) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        userGrowth: 0
      };
    }
  }

  /**
   * Получение статистики в реальном времени
   */
  async getRealTimeStats(): Promise<{
    onlineUsers: number;
    activeOrders: number;
    processingAiRequests: number;
    lastActivity: string;
  }> {
    try {
      // В реальном API здесь были бы данные в реальном времени
      return {
        onlineUsers: 0,
        activeOrders: 0,
        processingAiRequests: 0,
        lastActivity: new Date().toISOString()
      };
    } catch (error) {
      return {
        onlineUsers: 0,
        activeOrders: 0,
        processingAiRequests: 0,
        lastActivity: new Date().toISOString()
      };
    }
  }
}

// Export singleton instance
export const statsService = new StatsService();
export default statsService;
