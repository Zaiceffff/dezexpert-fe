import React from 'react';
import { create } from 'zustand';
import { apiClient, User } from '@/lib/api';
import { toast } from 'sonner';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useUsers = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.getUsers();
      const users = response.data;
      set({ users, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки пользователей';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchAllUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const users = await apiClient.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки всех пользователей';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  updateUserStatus: async (id: string, status: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.updateUserStatus(id, status);
      
      // Обновляем локальное состояние
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, status } : user
        ),
        isLoading: false
      }));
      
      toast.success('Статус пользователя обновлен!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления статуса';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.deleteUser(id);
      
      // Удаляем пользователя из локального состояния
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        isLoading: false
      }));
      
      toast.success('Пользователь удален!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления пользователя';
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
export const useUsersState = () => {
  const { fetchUsers, ...state } = useUsers();
  
  // Автоматически загружаем пользователей при первом использовании
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { ...state, fetchUsers };
};
