import { create } from 'zustand';
import { useEffect } from 'react';

import type { Tariff } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface BillingState {
  tariffs: Tariff[];
  selectedTariff: Tariff | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTariffs: () => Promise<void>;
  selectTariff: (tariff: Tariff | null) => void;
  getSubscriptionLink: (tariffId: string) => Promise<string | null>;
  getPaymentLink: (tariffId: string) => Promise<string | null>;
  cancelSubscription: () => Promise<boolean>;
  clearError: () => void;
}

export const useBilling = create<BillingState>((set, get) => ({
  tariffs: [],
  selectedTariff: null,
  isLoading: false,
  error: null,

  fetchTariffs: async () => {
    try {
      set({ isLoading: true, error: null });
      const tariffs = await apiClient.getTariffs();
      set({ tariffs, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки тарифов';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  selectTariff: (tariff: Tariff | null) => {
    set({ selectedTariff: tariff });
  },

  getSubscriptionLink: async (tariffId: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await apiClient.getSubscriptionLink(tariffId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения ссылки на подписку';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  getPaymentLink: async (tariffId: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await apiClient.getPaymentLink(tariffId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения ссылки на оплату';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  cancelSubscription: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.cancelSubscription();
      set({ isLoading: false });
      
      toast.success('Подписка успешно отменена!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отмены подписки';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Хук для использования в компонентах
export const useBillingState = () => {
  const { fetchTariffs, ...state } = useBilling();
  
  // Автоматически загружаем тарифы при первом использовании
  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  return { ...state, fetchTariffs };
};
