// src/lib/apiUtils.ts — утилиты для работы с API

import { API_CONFIG, ENV } from './config';

// Типы для API ответов
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Базовый класс для API клиента
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Получение полного URL
  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  // Добавление токена авторизации
  private getAuthHeaders(token?: string): HeadersInit {
    if (!token) return this.defaultHeaders;
    
    return {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    };
  }

  // Обработка HTTP ответа
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: unknown = {};
      
      try {
        errorData = await response.json();
      } catch {
        // Если не удалось распарсить JSON, используем текст
        errorData = { message: await response.text() };
      }

      const error: ApiError = {
        message: (errorData && typeof errorData === 'object' && 'message' in errorData && typeof errorData.message === 'string') 
          ? errorData.message 
          : `HTTP ${response.status}`,
        status: response.status,
        details: errorData,
      };

      throw error;
    }

    try {
      return await response.json();
    } catch {
      throw new Error('Не удалось распарсить ответ сервера');
    }
  }

  // GET запрос
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getAuthHeaders(token);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  // POST запрос
  async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getAuthHeaders(token);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  // PUT запрос
  async put<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getAuthHeaders(token);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  // PATCH запрос
  async patch<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getAuthHeaders(token);

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  // DELETE запрос
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const url = this.getFullUrl(endpoint);
    const headers = this.getAuthHeaders(token);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }
}

// Создаем экземпляр API клиента
export const apiClient = new ApiClient();

// Утилиты для работы с токенами
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('auth_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('token');
};

// Утилиты для валидации
export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} обязателен для заполнения`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Введите корректный email адрес';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return 'Введите корректный номер телефона';
  }
  return null;
};

// Утилиты для форматирования
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    let formatted = '';
    if (cleaned.length > 0) formatted += '+7';
    if (cleaned.length > 1) formatted += ` (${cleaned.slice(1, 4)}`;
    if (cleaned.length > 4) formatted += `) ${cleaned.slice(4, 7)}`;
    if (cleaned.length > 7) formatted += `-${cleaned.slice(7, 9)}`;
    if (cleaned.length > 9) formatted += `-${cleaned.slice(9, 11)}`;
    return formatted;
  }
  return phone;
};

export const cleanPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('8')) {
    return `+7${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('7')) {
    return `+7${cleaned.slice(1)}`;
  } else {
    return `+7${cleaned}`;
  }
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Утилиты для логирования
export const logApiCall = (method: string, endpoint: string, data?: unknown): void => {
  if (ENV.NODE_ENV === 'development') {
    console.log(`API ${method}: ${endpoint}`, data);
  }
};

export const logApiError = (method: string, endpoint: string, error: unknown): void => {
  if (ENV.NODE_ENV === 'development') {
    console.error(`API ${method} Error: ${endpoint}`, error);
  }
};
