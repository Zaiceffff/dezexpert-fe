import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import { 
  AiChatRequest, 
  AiChatResponse, 
  AiHistoryItem, 
  AiMessage,
  PaginationParams 
} from '../api-types';

export class AiService {
  /**
   * Отправка сообщения в ИИ чат
   */
  async sendMessage(
    messages: AiMessage[], 
    model: string = 'gpt-3.5-turbo'
  ): Promise<AiChatResponse> {
    const request: AiChatRequest = {
      model,
      messages
    };

    return apiClient.post<AiChatResponse>(API_ENDPOINTS.AI.CHAT, request);
  }

  /**
   * Отправка простого текстового сообщения
   */
  async sendSimpleMessage(
    message: string, 
    model: string = 'gpt-3.5-turbo'
  ): Promise<string> {
    const messages: AiMessage[] = [
      { role: 'user', content: message }
    ];

    const response = await this.sendMessage(messages, model);
    return response.response;
  }

  /**
   * Отправка сообщения с контекстом
   */
  async sendMessageWithContext(
    message: string,
    context: string,
    model: string = 'gpt-3.5-turbo'
  ): Promise<string> {
    const messages: AiMessage[] = [
      { role: 'system', content: context },
      { role: 'user', content: message }
    ];

    const response = await this.sendMessage(messages, model);
    return response.response;
  }

  /**
   * Получение истории взаимодействий с ИИ
   */
  async getHistory(params: PaginationParams = {}): Promise<AiHistoryItem[]> {
    const { limit = 10 } = params;
    return apiClient.get<AiHistoryItem[]>(
      API_ENDPOINTS.AI.HISTORY,
      { params: { limit } }
    );
  }

  /**
   * Получение всех записей истории
   */
  async getAllHistory(): Promise<AiHistoryItem[]> {
    return apiClient.get<AiHistoryItem[]>(API_ENDPOINTS.AI.HISTORY, {
      params: { limit: 1000 }
    });
  }

  /**
   * Получение конкретной записи истории по ID
   */
  async getHistoryItemById(id: string): Promise<AiHistoryItem | null> {
    try {
      const history = await this.getAllHistory();
      return history.find(item => item.id === id) || null;
    } catch {
      return null;
    }
  }

  /**
   * Получение истории по модели
   */
  async getHistoryByModel(model: string): Promise<AiHistoryItem[]> {
    try {
      const history = await this.getAllHistory();
      return history.filter(item => item.model === model);
    } catch {
      return [];
    }
  }

  /**
   * Получение последних взаимодействий
   */
  async getRecentHistory(limit: number = 10): Promise<AiHistoryItem[]> {
    try {
      const history = await this.getAllHistory();
      return history
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Поиск в истории по содержимому
   */
  async searchHistory(query: string): Promise<AiHistoryItem[]> {
    try {
      const history = await this.getAllHistory();
      return history.filter(item => 
        item.messages.some(msg => 
          msg.content.toLowerCase().includes(query.toLowerCase())
        ) ||
        item.response.toLowerCase().includes(query.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение истории за период
   */
  async getHistoryByDateRange(startDate: string, endDate: string): Promise<AiHistoryItem[]> {
    try {
      const history = await this.getAllHistory();
      return history.filter(item => {
        const itemDate = new Date(item.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    } catch {
      return [];
    }
  }

  /**
   * Получение статистики использования ИИ
   */
  async getUsageStats(): Promise<{
    totalInteractions: number;
    totalTokens: number;
    averageTokensPerInteraction: number;
    byModel: Record<string, number>;
    byDate: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      const history = await this.getAllHistory();
      
      const stats = {
        totalInteractions: history.length,
        totalTokens: 0,
        averageTokensPerInteraction: 0,
        byModel: {} as Record<string, number>,
        byDate: {} as Record<string, number>,
        recentActivity: 0,
      };

      history.forEach(item => {
        // Подсчет токенов (если доступно в ответе)
        if (item.response) {
          // Примерная оценка токенов (1 токен ≈ 4 символа)
          stats.totalTokens += Math.ceil(item.response.length / 4);
        }

        // Статистика по моделям
        stats.byModel[item.model] = (stats.byModel[item.model] || 0) + 1;

        // Статистика по датам
        const date = item.createdAt.split('T')[0];
        stats.byDate[date] = (stats.byDate[date] || 0) + 1;
      });

      // Среднее количество токенов
      stats.averageTokensPerInteraction = stats.totalInteractions > 0 
        ? Math.round(stats.totalTokens / stats.totalInteractions)
        : 0;

      // Активность за последние 7 дней
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      stats.recentActivity = history.filter(item => 
        new Date(item.createdAt) >= weekAgo
      ).length;

      return stats;
    } catch {
      return {
        totalInteractions: 0,
        totalTokens: 0,
        averageTokensPerInteraction: 0,
        byModel: {},
        byDate: {},
        recentActivity: 0,
      };
    }
  }

  /**
   * Получение популярных запросов
   */
  async getPopularQueries(limit: number = 10): Promise<Array<{
    query: string;
    count: number;
  }>> {
    try {
      const history = await this.getAllHistory();
      const queryCounts: Record<string, number> = {};

      history.forEach(item => {
        const userMessages = item.messages.filter(msg => msg.role === 'user');
        userMessages.forEach(msg => {
          const query = msg.content.toLowerCase().trim();
          if (query) {
            queryCounts[query] = (queryCounts[query] || 0) + 1;
          }
        });
      });

      return Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Получение доступных моделей
   */
  getAvailableModels(): string[] {
    return [
      'gpt-3.5-turbo',
      'gpt-4',
      'gpt-4-turbo',
      'claude-3-sonnet',
      'claude-3-opus'
    ];
  }

  /**
   * Валидация сообщения
   */
  validateMessage(message: string): { isValid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { isValid: false, error: 'Сообщение не может быть пустым' };
    }

    if (message.length > 4000) {
      return { isValid: false, error: 'Сообщение слишком длинное (максимум 4000 символов)' };
    }

    return { isValid: true };
  }

  /**
   * Форматирование сообщения для отправки
   */
  formatMessage(message: string, role: 'user' | 'assistant' | 'system' = 'user'): AiMessage {
    return {
      role,
      content: message.trim()
    };
  }

  /**
   * Создание контекстного сообщения
   */
  createContextualMessage(
    userMessage: string, 
    context: string, 
    systemPrompt?: string
  ): AiMessage[] {
    const messages: AiMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'system', content: `Контекст: ${context}` });
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }
}

// Export singleton instance
export const aiService = new AiService();
export default aiService;
