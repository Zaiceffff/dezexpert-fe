// Экспорт всех хуков для удобного импорта
export { useAuth } from './useAuth';
export { useLeads, useLeadsState } from './useLeads';
export { usePartners, usePartnersState } from './usePartners';
export { useAi, useAiState } from './useAi';
export { useSms, useSmsState } from './useSms';
export { useReminders, useRemindersState } from './useReminders';
export { useBilling, useBillingState } from './useBilling';
export { useOrders, useOrdersState } from './useOrders';
export { useUsersState } from './useUsers';
export { useSeed } from './useSeed';
export { useWebhooks } from './useWebhooks';
export * from './useApi';

// Avito хуки
export { useAvitoListings } from './useAvitoListings';
export { useAvitoStats } from './useAvitoStats';
export { useAvitoOAuth } from './useAvitoOAuth';

// Авторизация и персистентность
export { useAuthPersistence } from './useAuthPersistence';
