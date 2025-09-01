import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface SeedState {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  makeSeeds: () => Promise<boolean>;
  makeTariffSeeds: () => Promise<boolean>;
  clearError: () => void;
}

export const useSeed = create<SeedState>((set) => ({
  isLoading: false,
  error: null,

  makeSeeds: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.makeSeeds();
      set({ isLoading: false });
      toast.success('Тестовые данные успешно созданы!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания тестовых данных';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  makeTariffSeeds: async () => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.makeTariffSeeds();
      set({ isLoading: false });
      toast.success('Тестовые тарифы успешно созданы!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания тестовых тарифов';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
