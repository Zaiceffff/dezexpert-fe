import { apiClient } from '../api-client';
import { API_ENDPOINTS, STORAGE_KEYS } from '../api-config';
import { LoginRequest, LoginResponse, User } from '../api-types';

export class AuthService {
  /**
   * Вход в систему
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Сохраняем токен и данные пользователя
    apiClient.setToken(response.access_token);
    this.saveUserData(response.user);
    
    return response;
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Выход из системы
   */
  logout(): void {
    apiClient.clearToken();
    this.clearUserData();
  }

  /**
   * Проверка аутентификации
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Получение текущего пользователя из localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Сохранение данных пользователя
   */
  private saveUserData(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  /**
   * Очистка данных пользователя
   */
  private clearUserData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Обновление данных пользователя
   */
  updateUserData(user: User): void {
    this.saveUserData(user);
  }

  /**
   * Проверка валидности токена
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      this.logout();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
