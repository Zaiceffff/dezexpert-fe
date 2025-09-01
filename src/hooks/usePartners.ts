import { create } from 'zustand';
import { useEffect } from 'react';

import type { Partner, PricingRule } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface PartnersState {
  partners: Partner[];
  selectedPartner: Partner | null;
  pricingRules: PricingRule[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPartners: () => Promise<void>;
  getPartner: (id: string) => Promise<Partner | null>;
  getPartnerPricing: (partnerId: string) => Promise<PricingRule[]>;
  selectPartner: (partner: Partner | null) => void;
  clearError: () => void;
}

export const usePartners = create<PartnersState>((set, get) => ({
  partners: [],
  selectedPartner: null,
  pricingRules: [],
  isLoading: false,
  error: null,

  fetchPartners: async () => {
    try {
      set({ isLoading: true, error: null });
      const partners = await apiClient.getPartners();
      set({ partners, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки партнеров';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  getPartner: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const partner = await apiClient.getPartner(id);
      set({ selectedPartner: partner, isLoading: false });
      return partner;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки партнера';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  getPartnerPricing: async (partnerId: string) => {
    try {
      set({ isLoading: true, error: null });
      const pricingRules = await apiClient.getPartnerPricing(partnerId);
      set({ pricingRules, isLoading: false });
      return pricingRules;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки цен партнера';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return [];
    }
  },

  selectPartner: (partner: Partner | null) => {
    set({ selectedPartner: partner });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Хук для использования в компонентах
export const usePartnersState = () => {
  const { fetchPartners, ...state } = usePartners();
  
  // Автоматически загружаем партнеров при первом использовании
  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return { ...state, fetchPartners };
};
