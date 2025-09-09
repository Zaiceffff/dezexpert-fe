import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_CODES } from './api-config';
import { ApiError, RequestConfig } from './api-types';

class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - добавляем токен авторизации
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - обрабатываем ошибки
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  private removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'Произошла ошибка',
      code: ERROR_CODES.NETWORK_ERROR,
    };

    if (error.response) {
      // Сервер ответил с ошибкой
      apiError.code = error.response.status;
      apiError.message = (error.response.data as any)?.message || error.message;
      apiError.details = error.response.data;

      // Обработка 401 ошибки - токен истек
      if (error.response.status === ERROR_CODES.UNAUTHORIZED) {
        this.removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      apiError.message = 'Сервер недоступен';
      apiError.code = ERROR_CODES.NETWORK_ERROR;
    } else {
      // Ошибка при настройке запроса
      apiError.message = error.message;
    }

    return apiError;
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    config?: RequestConfig
  ): Promise<AxiosResponse<T>> {
    const maxRetries = config?.retries || API_CONFIG.RETRY_ATTEMPTS;
    const retryDelay = config?.retryDelay || API_CONFIG.RETRY_DELAY;

    try {
      return await requestFn();
    } catch (error) {
      if (this.retryCount < maxRetries && this.shouldRetry(error as ApiError)) {
        this.retryCount++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.retryRequest(requestFn, config);
      }
      throw error;
    }
  }

  private shouldRetry(error: ApiError): boolean {
    // Повторяем запрос только для сетевых ошибок и 5xx ошибок
    return (
      error.code === ERROR_CODES.NETWORK_ERROR ||
      (typeof error.code === 'number' && error.code >= 500)
    );
  }

  // Public methods
  async get<T>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.get<T>(url, config),
      config
    );
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig & RequestConfig): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.post<T>(url, data, config),
      config
    );
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig & RequestConfig): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.put<T>(url, data, config),
      config
    );
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig & RequestConfig): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.patch<T>(url, data, config),
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig & RequestConfig): Promise<T> {
    const response = await this.retryRequest(
      () => this.client.delete<T>(url, config),
      config
    );
    return response.data;
  }

  // Auth methods
  setToken(token: string): void {
    this.setAuthToken(token);
  }

  clearToken(): void {
    this.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
