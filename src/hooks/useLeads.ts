import { create } from 'zustand';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Lead, CreateLeadRequest, LeadListParams } from '@/lib/api';
import { toast } from 'sonner';

interface LeadsState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  selectedLead: Lead | null;
  totalLeads: number;
  
  // Actions
  fetchLeads: (params?: LeadListParams) => Promise<void>;
  createLead: (data: CreateLeadRequest) => Promise<string | null>;
  updateLead: (id: string, data: Partial<CreateLeadRequest>) => Promise<boolean>;
  getLead: (id: string) => Promise<Lead | null>;
  selectLead: (lead: Lead | null) => void;
  clearError: () => void;
}

export const useLeads = create<LeadsState>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,
  selectedLead: null,
  totalLeads: 0,

  fetchLeads: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      // Добавляем параметры пагинации по умолчанию
      const defaultParams = {
        page: 1,
        limit: 10,
        ...params
      };
      
      const result = await apiClient.getLeads(defaultParams);
      
      // Предполагаем, что API возвращает объект с данными и общим количеством
      if (result && typeof result === 'object' && 'data' in result && 'count' in result) {
        set({ 
          leads: result.data, 
          totalLeads: result.count,
          isLoading: false 
        });
      } else {
        // Fallback для обратной совместимости
        set({ 
          leads: [], 
          totalLeads: 0,
          isLoading: false 
        });
      }


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки лидов';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },



  createLead: async (data: CreateLeadRequest) => {
    try {
      set({ isLoading: true, error: null });
      const result = await apiClient.createLead(data);
      set({ isLoading: false });
      
      // Обновляем список лидов
      await get().fetchLeads();
      
      toast.success('Лид успешно создан!');
      return result.leadId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания лида';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateLead: async (id: string, data: Partial<CreateLeadRequest>) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.updateLead(id, data);
      set({ isLoading: false });
      
      // Обновляем список лидов
      await get().fetchLeads();
      
      // Обновляем выбранный лид если он был изменен
      const { selectedLead } = get();
      if (selectedLead && selectedLead.id === id) {
        const updatedLead = await apiClient.getLead(id);
        if (updatedLead) {
          set({ selectedLead: updatedLead });
        }
      }
      
      toast.success('Лид успешно обновлен!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления лида';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  getLead: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const lead = await apiClient.getLead(id);
      set({ isLoading: false });
      return lead;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки лида';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  selectLead: (lead: Lead | null) => {
    set({ selectedLead: lead });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Хук для использования в компонентах
export const useLeadsState = () => {
  const { fetchLeads, ...state } = useLeads();
  
  // Автоматически загружаем лиды при первом использовании
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { ...state, fetchLeads };
};
