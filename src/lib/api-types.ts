// Base API Response
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Avito Types
export interface AvitoListing {
  id: string;
  avitoId: string;
  title: string;
  category: string;
  price: number;
  status: string;
  aiAssistantIsOn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoOAuthUrlResponse {
  url: string;
}

export interface AvitoTokensStatus {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isValid: boolean;
}

export interface AvitoSyncResponse {
  synced: number;
  total: number;
  message: string;
}

export interface AvitoAiToggleRequest {
  enabled: boolean;
}

// Order Types
export interface Order {
  id: string;
  service: string;
  object: string;
  count: string;
  experience: string;
  phoneNumber: string;
  address: string;
  name: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Cancelled';
  expectDate: string;
  createdAt: string;
  updatedAt: string;
  linkId?: string;
}

export interface CreateOrderRequest {
  service: string;
  object: string;
  count: string;
  experience: string;
  phoneNumber: string;
  address: string;
  name: string;
  expectDate: string;
}

export interface OrderStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

// AI Types
export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiChatRequest {
  model: string;
  messages: AiMessage[];
}

export interface AiChatResponse {
  response: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AiHistoryItem {
  id: string;
  messages: AiMessage[];
  response: string;
  model: string;
  createdAt: string;
}

// Stats Types
export interface GeneralStats {
  totalUsers: number;
  totalOrders: number;
  totalListings: number;
  totalAiInteractions: number;
}

export interface AiStats {
  totalInteractions: number;
  totalTokens: number;
  averageResponseTime: number;
  mostUsedModel: string;
}

export interface LeadsStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

export interface AvitoStats {
  totalListings: number;
  activeListings: number;
  aiEnabledListings: number;
  lastSync: string | null;
}

// Error Types
export interface ApiError {
  message: string;
  code: string | number;
  details?: any;
}

// Request Types
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Health Check
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    avito: 'up' | 'down';
    ai: 'up' | 'down';
  };
}
