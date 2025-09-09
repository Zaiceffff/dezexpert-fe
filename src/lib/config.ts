// src/lib/config.ts — упрощенная конфигурация

// Базовый URL для API
export const API_BASE_URL = process.env.HOST || 'http://195.200.17.116:3000';

// Функция для получения полного URL эндпоинта
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// API конфигурация для совместимости
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      RECOVER_PASSWORD: '/auth/recover-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/user/profile',
      SERVICE: '/user/service',
      TOKEN_INFO: '/user/token-info',
      BY_ID: '/user/by-id',
      BY_LINK_ID: '/user/by-link-id',
      UPDATE_STATUS: '/user/update-status',
      DELETE: '/user/delete',
    },
    ORDER: {
      CREATE: '/order',
      LIST: '/order/list',
      BY_ID: '/order/by-id',
      UPDATE: '/order/update',
    },
    LEADS: {
      CREATE: '/leads',
      LIST: '/leads',
      BY_ID: '/leads',
      UPDATE_STATUS: '/leads',
    },
    PARTNERS: {
      PRICING: '/partners',
    },
    PAYMENT: {
      SUBSCRIPTION_LINK: '/payment/subscription-link',
      PAYMENT_LINK: '/payment/payment-link',
    },
    TARIFF: {
      LIST: '/tariff/list',
    },
    REMINDERS: {
      SCHEDULE: '/reminders/schedule',
    },
    SMS: {
      SEND: '/sms/send',
    },
    AI: {
      PROXY: '/ai/proxy',
    },
    AVITO: {
      OAUTH_URL: '/avito/oauth/url',
      OAUTH_CALLBACK: '/avito/oauth/callback',
      LISTINGS: '/avito/listings',
      LISTINGS_AI_ACTIVE: '/avito/listings/ai-active',
      SYNC_LISTINGS: '/avito/sync/listings',
      AI_TOGGLE: '/avito/listings/:id/ai-toggle',
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
  HOST: process.env.HOST || 'http://195.200.17.116:3000',
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
