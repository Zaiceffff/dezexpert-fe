import { describe, it, expect } from 'vitest';
import { avitoSimpleService } from '../lib/services/avito-simple.service';

describe('Avito OAuth Tests', () => {
  describe('OAuth URL Generation', () => {
    it('should generate correct OAuth URL', async () => {
      const result = await avitoSimpleService.getOAuthUrl();
      
      expect(result.url).toContain('https://avito.ru/oauth');
      expect(result.url).toContain('response_type=code');
      expect(result.url).toContain('client_id=hF49pA0JvwucazxwgIel');
      expect(result.url).toContain('scope=items:info,messenger:read,messenger:write,user:read');
      expect(result.url).toContain('redirect_uri=');
      expect(result.url).toContain('state=');
    });

    it('should include correct redirect_uri', async () => {
      const result = await avitoSimpleService.getOAuthUrl();
      
      // Проверяем, что redirect_uri содержит правильный URL
      expect(result.url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3005%2Fapi%2Favito%2Foauth%2Fcallback');
    });

    it('should include state parameter', async () => {
      const result = await avitoSimpleService.getOAuthUrl();
      
      // Проверяем, что есть параметр state
      expect(result.url).toMatch(/state=\d+/);
    });

    it('should have all required parameters', async () => {
      const result = await avitoSimpleService.getOAuthUrl();
      const url = new URL(result.url);
      
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('client_id')).toBe('hF49pA0JvwucazxwgIel');
      expect(url.searchParams.get('scope')).toBe('items:info,messenger:read,messenger:write,user:read');
      expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:3005/api/avito/oauth/callback');
      expect(url.searchParams.get('state')).toBeTruthy();
    });
  });

  describe('Connection Status', () => {
    it('should correctly identify connection status', async () => {
      // Mock tokens status
      const mockStatus = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        expiresAt: '2023-12-31T23:59:59Z',
        isValid: true
      };

      // Mock the getTokensStatus method
      const originalGetTokensStatus = avitoSimpleService.getTokensStatus;
      avitoSimpleService.getTokensStatus = async () => mockStatus;

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(true);
      expect(result.message).toBe('Подключено к Avito');

      // Restore original method
      avitoSimpleService.getTokensStatus = originalGetTokensStatus;
    });

    it('should correctly identify no connection when no tokens', async () => {
      // Mock tokens status with no tokens
      const mockStatus = {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isValid: false
      };

      // Mock the getTokensStatus method
      const originalGetTokensStatus = avitoSimpleService.getTokensStatus;
      avitoSimpleService.getTokensStatus = async () => mockStatus;

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(false);
      expect(result.message).toBe('Не подключено к Avito');

      // Restore original method
      avitoSimpleService.getTokensStatus = originalGetTokensStatus;
    });

    it('should correctly identify no connection when tokens invalid', async () => {
      // Mock tokens status with invalid tokens
      const mockStatus = {
        accessToken: 'test-token',
        refreshToken: 'test-refresh',
        expiresAt: '2023-12-31T23:59:59Z',
        isValid: false
      };

      // Mock the getTokensStatus method
      const originalGetTokensStatus = avitoSimpleService.getTokensStatus;
      avitoSimpleService.getTokensStatus = async () => mockStatus;

      const result = await avitoSimpleService.checkConnection();

      expect(result.connected).toBe(false);
      expect(result.message).toBe('Не подключено к Avito');

      // Restore original method
      avitoSimpleService.getTokensStatus = originalGetTokensStatus;
    });
  });
});
