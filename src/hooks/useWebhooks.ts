import { create } from 'zustand';

import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface WebhookState {
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendAvitoHook: (data: Record<string, unknown>) => Promise<boolean>;
  clearError: () => void;
}

export const useWebhooks = create<WebhookState>((set) => ({
  isLoading: false,
  error: null,

  sendAvitoHook: async (data: Record<string, unknown>) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.avitoHook(data);
      set({ isLoading: false });
      toast.success('Webhook Avito успешно отправлен!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки webhook Avito';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
