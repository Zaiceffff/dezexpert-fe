// Export all services
export { authService } from './auth.service';
export { avitoService } from './avito.service';
export { ordersService } from './orders.service';
export { aiService } from './ai.service';
export { statsService } from './stats.service';

// Export service classes for direct instantiation if needed
export { AuthService } from './auth.service';
export { AvitoService } from './avito.service';
export { OrdersService } from './orders.service';
export { AiService } from './ai.service';
export { StatsService } from './stats.service';

// Export API client and config
export { apiClient } from '../api-client';
export { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, ERROR_CODES } from '../api-config';
export * from '../api-types';
