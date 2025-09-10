// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.bugbot.ru',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
  // Avito OAuth configuration
  AVITO_OAUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI || 'https://144.124.230.138:3005/api/avito/oauth/callback',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  
  // Avito
  AVITO: {
    OAUTH_URL: '/avito/oauth/url',
    OAUTH_CALLBACK: '/avito/oauth/callback',
    SYNC_LISTINGS: '/avito/sync/listings',
    LISTINGS: '/avito/listings',
    LISTING_AI_TOGGLE: (id: string) => `/avito/listings/${id}/ai-toggle`,
    AI_ACTIVE_LISTINGS: '/avito/listings/ai-active',
    TOKENS_STATUS: '/avito/tokens/status',
    TOKENS_REFRESH: '/avito/tokens/refresh',
  },
  
  // Orders
  ORDERS: {
    CREATE: '/order',
    LIST: '/order',
    BY_LINK: (linkId: string) => `/order/link/${linkId}`,
    STATS: '/order/stats',
    BY_ID: (id: string) => `/order/${id}`,
  },
  
  // AI
  AI: {
    CHAT: '/ai/chat',
    HISTORY: '/ai/history',
  },
  
  // Stats
  STATS: {
    GENERAL: '/stats',
    AI: '/stats/ai',
    LEADS: '/stats/leads',
    AVITO: '/stats/avito',
  },
  
  // Health
  HEALTH: '/health',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
} as const;

// Error Codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;
