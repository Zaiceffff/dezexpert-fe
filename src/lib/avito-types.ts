// Типы для интеграции с Avito

export interface AvitoAccount {
  id: string;
  userId: string;
  avitoUserId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  scope: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoListing {
  id: string;
  avitoId: string;
  userId: string;
  title: string;
  category: string;
  price: number;
  status: string;
  raw: Record<string, any>;
  aiAssistantIsOn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoConversation {
  id: string;
  listingId: string;
  buyerId: string;
  externalConversationId: string;
  threadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoMessage {
  id: string;
  conversationId: string;
  externalMessageId: string;
  direction: 'IN' | 'OUT';
  text: string;
  payload: Record<string, any>;
  receivedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvitoOAuthUrlResponse {
  url: string;
  state: string;
  message?: string;
}

export interface AvitoOAuthCallbackResponse {
  success: boolean;
  account: AvitoAccount;
}

export interface AvitoListingsResponse {
  listings: AvitoListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvitoSyncResponse {
  success: boolean;
  syncedCount: number;
  listings: AvitoListing[];
}

export interface AvitoToggleResponse {
  success: boolean;
  listing: AvitoListing;
}

export interface AvitoActiveListingsResponse {
  listings: AvitoListing[];
  conversations: AvitoConversation[];
}

// Запросы
export interface AvitoToggleRequest {
  enabled: boolean;
}

export interface AvitoSyncRequest {
  force?: boolean;
}

// Статусы подключения
export interface AvitoConnectionStatus {
  hasToken: boolean;
  isExpired: boolean;
  expiresAt: string | null;
  willExpireSoon: boolean;
}

// Статистика
export interface AvitoStats {
  totalListings: number;
  activeAiListings: number;
  totalConversations: number;
  unreadMessages: number;
}
