// src/lib/config.ts — упрощенная конфигурация

// Базовый URL для API - используем HTTP для локальной разработки, HTTPS для продакшена
const getApiBaseUrl = () => {
  // Если есть переменная окружения, используем её
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (process.env.HOST) {
    return process.env.HOST;
  }
  
  // Для локальной разработки используем HTTP
  if (process.env.NODE_ENV === 'development') {
    return process.env.API_BASE_URL || 'https://api.bugbot.ru/api';
  }
  
  // Для продакшена используем HTTPS
  return process.env.API_BASE_URL || 'https://api.bugbot.ru/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Функция для получения полного URL эндпоинта
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// API конфигурация для совместимости
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      REFRESH: '/api/auth/refresh',
      RECOVER_PASSWORD: '/api/auth/recover-password',
      RESET_PASSWORD: '/api/auth/reset-password',
    },
    USER: {
      PROFILE: '/api/user/profile',
      SERVICE: '/api/user/service',
      TOKEN_INFO: '/api/user/token-info',
      BY_ID: '/api/user/by-id',
      BY_LINK_ID: '/api/user/by-link-id',
      UPDATE_STATUS: '/api/user/update-status',
      DELETE: '/api/user/delete',
    },
    ORDER: {
      CREATE: '/api/order',
      LIST: '/api/order/list',
      BY_ID: '/api/order/by-id',
      UPDATE: '/api/order/update',
    },
    LEADS: {
      CREATE: '/api/leads',
      LIST: '/api/leads',
      BY_ID: '/api/leads',
      UPDATE_STATUS: '/api/leads',
    },
    PARTNERS: {
      PRICING: '/api/partners',
    },
    PAYMENT: {
      SUBSCRIPTION_LINK: '/api/payment/subscription-link',
      PAYMENT_LINK: '/api/payment/payment-link',
    },
    TARIFF: {
      LIST: '/api/tariff/list',
    },
    REMINDERS: {
      SCHEDULE: '/api/reminders/schedule',
    },
    SMS: {
      SEND: '/api/sms/send',
    },
    AI: {
      PROXY: '/api/ai/proxy',
    },
    AVITO: {
      OAUTH_URL: '/api/avito/oauth/url',
      OAUTH_CALLBACK: '/api/avito/oauth/callback',
      LISTINGS: '/api/avito/listings',
      LISTINGS_AI_ACTIVE: '/api/avito/listings/ai-active',
      SYNC_LISTINGS: '/api/avito/sync/listings',
      AI_TOGGLE: '/api/avito/listings/:id/ai-toggle',
    },
  },
} as const;

// UI конфигурация для совместимости
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 2000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ANIMATION_DURATION: 200,
  HOVER_SCALE: 1.05,
} as const;

// Переменные окружения для совместимости
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: API_BASE_URL,
  API_BASE_URL: API_BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SMS_API_KEY: process.env.SMS_API_KEY,
  AI_API_KEY: process.env.AI_API_KEY,
} as const;

// Конфигурация приложения
export const APP_CONFIG = {
  NAME: 'DEZEXPERT',
  VERSION: '2.0.0',
  DESCRIPTION: 'Система управления заявками на дезинсекцию',
  DEFAULT_LOCALE: 'ru',
  SUPPORT_EMAIL: 'support@dezexpert.ru',
} as const;
