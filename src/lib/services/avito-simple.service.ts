import { apiClient } from '../api-client';
import { API_ENDPOINTS, API_CONFIG } from '../api-config';
import { 
  AvitoListing, 
  AvitoOAuthUrlResponse, 
  AvitoTokensStatus, 
  AvitoSyncResponse, 
  AvitoAiToggleRequest,
  PaginationParams,
  PaginatedResponse 
} from '../api-types';

export class AvitoSimpleService {
  /**
   * Получение URL для OAuth авторизации
   * Используем статический URL с правильными параметрами
   */
  async getOAuthUrl(): Promise<AvitoOAuthUrlResponse> {
    // Статический OAuth URL для Avito
    const oauthUrl = `https://avito.ru/oauth?response_type=code&client_id=hF49pA0JvwucazxwgIel&scope=items:info,messenger:read,messenger:write,user:read&redirect_uri=${encodeURIComponent(API_CONFIG.AVITO_OAUTH_REDIRECT_URI)}&state=${Date.now()}`;
    
    return {
      url: oauthUrl
    };
  }

  /**
   * Обработка OAuth callback
   * Этот метод вызывается после успешной авторизации на Avito
   */
  async handleOAuthCallback(code: string, state?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AVITO.OAUTH_CALLBACK, {
        params: { code, state }
      });
      return { success: true, message: 'Авторизация успешна' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Ошибка авторизации' 
      };
    }
  }

  /**
   * Синхронизация объявлений с Avito
   */
  async syncListings(): Promise<AvitoSyncResponse> {
    return apiClient.post<AvitoSyncResponse>(API_ENDPOINTS.AVITO.SYNC_LISTINGS);
  }

  /**
   * Получение объявлений с пагинацией
   */
  async getListings(params: PaginationParams = {}): Promise<PaginatedResponse<AvitoListing>> {
    const { page = 1, limit = 10 } = params;
    return apiClient.get<PaginatedResponse<AvitoListing>>(
      API_ENDPOINTS.AVITO.LISTINGS,
      { params: { page, limit } }
    );
  }

  /**
   * Получение всех объявлений (без пагинации)
   */
  async getAllListings(): Promise<AvitoListing[]> {
    const response = await this.getListings({ page: 1, limit: 1000 });
    return response.data;
  }

  /**
   * Включение/выключение ИИ-ассистента для объявления
   */
  async toggleAiAssistant(listingId: string, enabled: boolean): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.post(
        API_ENDPOINTS.AVITO.LISTING_AI_TOGGLE(listingId),
        { enabled } as AvitoAiToggleRequest
      );
      return { 
        success: true, 
        message: `ИИ-ассистент ${enabled ? 'включен' : 'выключен'}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Ошибка изменения настроек ИИ' 
      };
    }
  }

  /**
   * Получение объявлений с активным ИИ
   */
  async getAiActiveListings(): Promise<AvitoListing[]> {
    return apiClient.get<AvitoListing[]>(API_ENDPOINTS.AVITO.AI_ACTIVE_LISTINGS);
  }

  /**
   * Получение статуса токенов Avito
   */
  async getTokensStatus(): Promise<AvitoTokensStatus> {
    return apiClient.get<AvitoTokensStatus>(API_ENDPOINTS.AVITO.TOKENS_STATUS);
  }

  /**
   * Принудительное обновление токенов
   */
  async refreshTokens(): Promise<{ success: boolean; message: string }> {
    try {
      await apiClient.post(API_ENDPOINTS.AVITO.TOKENS_REFRESH);
      return { success: true, message: 'Токены обновлены' };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Ошибка обновления токенов' 
      };
    }
  }

  /**
   * Проверка подключения к Avito API
   */
  async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const status = await this.getTokensStatus();
      // Проверяем, что есть токены и они действительны
      const isConnected = !!(status.accessToken && status.refreshToken && status.isValid);
      return {
        connected: isConnected,
        message: isConnected ? 'Подключено к Avito' : 'Не подключено к Avito'
      };
    } catch (error: any) {
      return {
        connected: false,
        message: 'Ошибка проверки подключения'
      };
    }
  }

  /**
   * Получение статистики объявлений
   */
  async getListingsStats(): Promise<{
    total: number;
    withAi: number;
    withoutAi: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    try {
      const listings = await this.getAllListings();
      
      const stats = {
        total: listings.length,
        withAi: listings.filter(l => l.aiAssistantIsOn).length,
        withoutAi: listings.filter(l => !l.aiAssistantIsOn).length,
        byStatus: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
      };

      listings.forEach(listing => {
        // Статистика по статусам
        stats.byStatus[listing.status] = (stats.byStatus[listing.status] || 0) + 1;
        
        // Статистика по категориям
        stats.byCategory[listing.category] = (stats.byCategory[listing.category] || 0) + 1;
      });

      return stats;
    } catch {
      return {
        total: 0,
        withAi: 0,
        withoutAi: 0,
        byStatus: {},
        byCategory: {},
      };
    }
  }
}

// Export singleton instance
export const avitoSimpleService = new AvitoSimpleService();
export default avitoSimpleService;
