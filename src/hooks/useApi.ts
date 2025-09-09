// Export all API hooks
export { useApiAuth } from './useApiAuth';
export { useApiAvito } from './useApiAvito';
export { useApiOrders } from './useApiOrders';
export { useApiAi } from './useApiAi';
export { useApiStats } from './useApiStats';

// Re-export from ApiContext for convenience
export { useAuth, useAvito, useOrders, useAi, useStats, useApiContext } from '../contexts/ApiContext';