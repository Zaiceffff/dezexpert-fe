import { create } from 'zustand';
import { apiClient, SmsRequest, SmsResponse } from '@/lib/api';
import { toast } from 'sonner';

interface SmsState {
  isLoading: boolean;
  error: string | null;
  lastSentSms: SmsResponse | null;
  
  // Actions
  sendSms: (to: string, text: string) => Promise<boolean>;
  clearError: () => void;
  clearLastSent: () => void;
}

export const useSms = create<SmsState>((set) => ({
  isLoading: false,
  error: null,
  lastSentSms: null,

  sendSms: async (to: string, text: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const request: SmsRequest = { to, text };
      const response = await apiClient.sendSms(request);
      
      set({ 
        isLoading: false, 
        lastSentSms: response 
      });
      
      if (response.ok) {
        toast.success('SMS успешно отправлено!');
        return true;
      } else {
        toast.error(`Ошибка отправки SMS: ${response.error || 'Неизвестная ошибка'}`);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки SMS';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearLastSent: () => {
    set({ lastSentSms: null });
  },
}));

// Хук для использования в компонентах
export const useSmsState = () => {
  return useSms();
};
