import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import type { AiRequest, AiResponse } from '@/lib/api';
import { toast } from 'sonner';

interface AiState {
  response: AiResponse | null;
  isLoading: boolean;
  error: string | null;
  conversationHistory: Array<{ request: string; response: AiResponse }>;
  
  // Actions
  sendMessage: (message: string, context?: Record<string, unknown>) => Promise<AiResponse | null>;
  clearConversation: () => void;
  clearError: () => void;
}

export const useAi = create<AiState>((set, get) => ({
  response: null,
  isLoading: false,
  error: null,
  conversationHistory: [],

  sendMessage: async (message: string, context?: Record<string, unknown>) => {
    try {
      set({ isLoading: true, error: null });
      
      const request: AiRequest = { message, context };
      const response = await apiClient.callAi(request);
      
      // Добавляем в историю
      const { conversationHistory } = get();
      const newHistory = [...conversationHistory, { request: message, response }];
      
      set({ 
        response, 
        isLoading: false, 
        conversationHistory: newHistory 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки сообщения';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  clearConversation: () => {
    set({ 
      response: null, 
      conversationHistory: [],
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Хук для использования в компонентах
export const useAiState = () => {
  return useAi();
};
