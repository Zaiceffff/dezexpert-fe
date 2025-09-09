import { describe, it, expect, beforeEach, vi } from 'vitest';
import { avitoSimpleService } from '../lib/services/avito-simple.service';

// Mock fetch
global.fetch = vi.fn();

describe('Avito Simple Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OAuth', () => {
    it('should get OAuth URL successfully', async () => {
      const mockResponse = {
        url: 'https://www.avito.ru/oauth/authorize?client_id=test&redirect_uri=http://localhost:3005/api/avito/oauth/callback&response_type=code&state=test'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await avitoSimpleService.getOAuthUrl();

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/oauth/url',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle OAuth callback successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const result = await avitoSimpleService.handleOAuthCallback('test-code', 'test-state');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/oauth/callback?code=test-code&state=test-state',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('Listings', () => {
    it('should get listings successfully', async () => {
      const mockListings = {
        data: [
          {
            id: '1',
            avitoId: 'avito-1',
            title: 'Test Listing',
            category: 'Test Category',
            price: 1000,
            status: 'active',
            aiAssistantIsOn: false,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListings)
      });

      const result = await avitoSimpleService.getListings({ page: 1, limit: 10 });

      expect(result).toEqual(mockListings);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/listings?page=1&limit=10',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should sync listings successfully', async () => {
      const mockResponse = {
        synced: 5,
        total: 10,
        message: 'Синхронизация завершена'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await avitoSimpleService.syncListings();

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/sync/listings',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('AI Assistant', () => {
    it('should toggle AI assistant successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'ИИ-ассистент включен' })
      });

      const result = await avitoSimpleService.toggleAiAssistant('1', true);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/listings/1/ai-toggle',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ enabled: true })
        })
      );
    });

    it('should get AI active listings successfully', async () => {
      const mockListings = [
        {
          id: '1',
          avitoId: 'avito-1',
          title: 'Test Listing',
          category: 'Test Category',
          price: 1000,
          status: 'active',
          aiAssistantIsOn: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockListings)
      });

      const result = await avitoSimpleService.getAiActiveListings();

      expect(result).toEqual(mockListings);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/listings/ai-active',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('Tokens', () => {
    it('should get tokens status successfully', async () => {
      const mockStatus = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresAt: '2023-12-31T23:59:59Z',
        isValid: true
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus)
      });

      const result = await avitoSimpleService.getTokensStatus();

      expect(result).toEqual(mockStatus);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/tokens/status',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should refresh tokens successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Токены обновлены' })
      });

      const result = await avitoSimpleService.refreshTokens();

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/tokens/refresh',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  describe('Connection Check', () => {
    it('should check connection successfully when connected', async () => {
      const mockStatus = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        expiresAt: '2023-12-31T23:59:59Z',
        isValid: true
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus)
      });

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(true);
      expect(result.message).toBe('Подключено к Avito');
    });

    it('should check connection successfully when not connected', async () => {
      const mockStatus = {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isValid: false
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus)
      });

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(false);
      expect(result.message).toBe('Не подключено к Avito');
    });

    it('should handle connection check error', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(false);
      expect(result.message).toBe('Ошибка проверки подключения');
    });
  });

  describe('Statistics', () => {
    it('should get listings stats successfully', async () => {
      const mockListings = [
        {
          id: '1',
          avitoId: 'avito-1',
          title: 'Test Listing 1',
          category: 'Category 1',
          price: 1000,
          status: 'active',
          aiAssistantIsOn: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          avitoId: 'avito-2',
          title: 'Test Listing 2',
          category: 'Category 2',
          price: 2000,
          status: 'inactive',
          aiAssistantIsOn: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ];

      // Mock getAllListings method
      vi.spyOn(avitoSimpleService, 'getAllListings').mockResolvedValue(mockListings);

      const result = await avitoSimpleService.getListingsStats();

      expect(result).toEqual({
        total: 2,
        withAi: 1,
        withoutAi: 1,
        byStatus: { active: 1, inactive: 1 },
        byCategory: { 'Category 1': 1, 'Category 2': 1 }
      });
    });
  });
});
