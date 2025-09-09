import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import { 
  AvitoListing, 
  AvitoOAuthUrlResponse, 
  AvitoTokensStatus, 
  AvitoSyncResponse, 
  AvitoAiToggleRequest,
  PaginationParams,
  PaginatedResponse 
} from '../api-types';

export class AvitoService {
  /**
   * Получение URL для OAuth авторизации
   */
  async getOAuthUrl(): Promise<AvitoOAuthUrlResponse> {
    return apiClient.get<AvitoOAuthUrlResponse>(API_ENDPOINTS.AVITO.OAUTH_URL);
  }

  /**
   * Обработка OAuth callback
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
   * Синхронизация объявлений
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
   * Получение объявления по ID
   */
  async getListingById(id: string): Promise<AvitoListing | null> {
    try {
      const listings = await this.getAllListings();
      return listings.find(listing => listing.id === id) || null;
    } catch {
      return null;
    }
  }

  /**
   * Поиск объявлений по названию
   */
  async searchListings(query: string): Promise<AvitoListing[]> {
    try {
      const listings = await this.getAllListings();
      return listings.filter(listing => 
        listing.title.toLowerCase().includes(query.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение объявлений по категории
   */
  async getListingsByCategory(category: string): Promise<AvitoListing[]> {
    try {
      const listings = await this.getAllListings();
      return listings.filter(listing => 
        listing.category.toLowerCase().includes(category.toLowerCase())
      );
    } catch {
      return [];
    }
  }

  /**
   * Получение объявлений по статусу
   */
  async getListingsByStatus(status: string): Promise<AvitoListing[]> {
    try {
      const listings = await this.getAllListings();
      return listings.filter(listing => 
        listing.status.toLowerCase() === status.toLowerCase()
      );
    } catch {
      return [];
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
export const avitoService = new AvitoService();
export default avitoService;
