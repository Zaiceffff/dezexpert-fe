import { create } from 'zustand';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Reminder, ScheduleReminderRequest } from '@/lib/api';
import { toast } from 'sonner';

interface RemindersState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchReminders: () => Promise<void>;
  scheduleReminder: (data: ScheduleReminderRequest) => Promise<boolean>;
  cancelReminder: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useReminders = create<RemindersState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  fetchReminders: async () => {
    try {
      set({ isLoading: true, error: null });
      const reminders = await apiClient.getReminders();
      set({ reminders, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки напоминаний';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  scheduleReminder: async (data: ScheduleReminderRequest) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.scheduleReminder(data);
      set({ isLoading: false });
      
      // Обновляем список напоминаний
      await get().fetchReminders();
      
      toast.success('Напоминание успешно запланировано!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка планирования напоминания';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  cancelReminder: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.cancelReminder(id);
      set({ isLoading: false });
      
      // Обновляем список напоминаний
      await get().fetchReminders();
      
      toast.success('Напоминание отменено!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка отмены напоминания';
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
export const useRemindersState = () => {
  const { fetchReminders, ...state } = useReminders();
  
  // Автоматически загружаем напоминания при первом использовании
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return { ...state, fetchReminders };
};
