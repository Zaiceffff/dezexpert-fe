import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../lib/services/auth.service';
import { avitoService } from '../lib/services/avito.service';
import { ordersService } from '../lib/services/orders.service';
import { aiService } from '../lib/services/ai.service';
import { statsService } from '../lib/services/stats.service';

// Mock fetch
global.fetch = vi.fn();

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AuthService', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        access_token: 'mock-token',
        user: {
          id: '1',
          email: 'test@test.com',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123'
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test@test.com',
            password: 'password123'
          })
        })
      );
    });

    it('should handle login error', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      });

      await expect(authService.login({
        email: 'test@test.com',
        password: 'wrong-password'
      })).rejects.toThrow();
    });

    it('should get profile successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const result = await authService.getProfile();

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/auth/me',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });
  });

  describe('AvitoService', () => {
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

      const result = await avitoService.getListings({ page: 1, limit: 10 });

      expect(result).toEqual(mockListings);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/listings?page=1&limit=10',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should toggle AI assistant successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'ИИ-ассистент включен' })
      });

      const result = await avitoService.toggleAiAssistant('1', true);

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/avito/listings/1/ai-toggle',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ enabled: true })
        })
      );
    });
  });

  describe('OrdersService', () => {
    it('should create order successfully', async () => {
      const mockOrder = {
        id: '1',
        service: 'Дезинфекция',
        object: 'Квартира',
        count: '1',
        experience: 'Опытный',
        phoneNumber: '+7 999 999 99 99',
        address: 'Москва, ул. Тестовая, 1',
        name: 'Иван Иванов',
        status: 'New',
        expectDate: '2023-12-31',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOrder)
      });

      const orderData = {
        service: 'Дезинфекция',
        object: 'Квартира',
        count: '1',
        experience: 'Опытный',
        phoneNumber: '+7 999 999 99 99',
        address: 'Москва, ул. Тестовая, 1',
        name: 'Иван Иванов',
        expectDate: '2023-12-31'
      };

      const result = await ordersService.createOrder(orderData);

      expect(result).toEqual(mockOrder);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/order',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(orderData)
        })
      );
    });

    it('should get orders successfully', async () => {
      const mockOrders = {
        data: [
          {
            id: '1',
            service: 'Дезинфекция',
            object: 'Квартира',
            count: '1',
            experience: 'Опытный',
            phoneNumber: '+7 999 999 99 99',
            address: 'Москва, ул. Тестовая, 1',
            name: 'Иван Иванов',
            status: 'New',
            expectDate: '2023-12-31',
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
        json: () => Promise.resolve(mockOrders)
      });

      const result = await ordersService.getOrders({ page: 1, limit: 10 });

      expect(result).toEqual(mockOrders);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/order?page=1&limit=10',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('AiService', () => {
    it('should send message successfully', async () => {
      const mockResponse = {
        response: 'Hello! How can I help you?',
        model: 'gpt-3.5-turbo',
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await aiService.sendSimpleMessage('Hello', 'gpt-3.5-turbo');

      expect(result).toBe('Hello! How can I help you?');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/ai/chat',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello' }]
          })
        })
      );
    });

    it('should validate message correctly', () => {
      const validMessage = 'Hello, how are you?';
      const invalidMessage = '';
      const tooLongMessage = 'a'.repeat(4001);

      expect(aiService.validateMessage(validMessage)).toEqual({ isValid: true });
      expect(aiService.validateMessage(invalidMessage)).toEqual({
        isValid: false,
        error: 'Сообщение не может быть пустым'
      });
      expect(aiService.validateMessage(tooLongMessage)).toEqual({
        isValid: false,
        error: 'Сообщение слишком длинное (максимум 4000 символов)'
      });
    });
  });

  describe('StatsService', () => {
    it('should get general stats successfully', async () => {
      const mockStats = {
        totalUsers: 100,
        totalOrders: 500,
        totalListings: 50,
        totalAiInteractions: 1000
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats)
      });

      const result = await statsService.getGeneralStats();

      expect(result).toEqual(mockStats);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/stats',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should get health check successfully', async () => {
      const mockHealth = {
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00Z',
        services: {
          database: 'up',
          avito: 'up',
          ai: 'up'
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHealth)
      });

      const result = await statsService.getHealthCheck();

      expect(result).toEqual(mockHealth);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3005/api/health',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });
});
