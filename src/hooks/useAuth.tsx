import { useState, useEffect, createContext, useContext } from 'react';

import type { User } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserStatus: (id: string, status: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const checkAuth = async () => {
      try {
        const token = apiClient.getToken();
        
        if (token) {
          // Сначала пытаемся получить профиль пользователя
          try {
            const response = await fetch('/api/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else if (response.status === 401) {
              // Если получили 401, токен недействителен
              console.warn('Токен недействителен, очищаем его');
              apiClient.clearToken();
              setUser(null);
            } else {
              // Другие ошибки - не очищаем токен
              console.error('Ошибка загрузки профиля:', response.status);
            }
          } catch (profileError) {
            console.error('Ошибка загрузки профиля:', profileError);
            // Не очищаем токен при сетевых ошибках
          }
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.refreshToken(refreshToken);
      apiClient.setToken(response.accessToken, refreshToken);
      
      // Обновляем пользователя
      try {
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${response.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setUser(userData);
        }
      } catch (profileError) {
        console.error('Ошибка загрузки профиля после обновления токена:', profileError);
      }
    } catch (error) {
      // Если обновление токена не удалось, очищаем все токены
      apiClient.clearToken();
      setUser(null);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      apiClient.setToken(response.accessToken, response.refreshToken);
      setUser(response.profile);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.register(userData);
      apiClient.setToken(response.accessToken, response.refreshToken);
      setUser(response.profile);
      toast.success('Регистрация выполнена успешно!');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiClient.clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token');
      // Очищаем кэш профиля при выходе
      localStorage.removeItem('user_profile_cache');
      localStorage.removeItem('user_profile_timestamp');
    }
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      // TODO: Получить данные пользователя из API
      // setUser(userData);
    } catch (error) {
      logout();
    }
  };

  const recoverPassword = async (email: string) => {
    try {
      await apiClient.recoverPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await apiClient.resetPasswordToken(token, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      await apiClient.updateUserStatus(id, status);
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.deleteUser(id);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    refreshToken,
    recoverPassword,
    resetPassword,
    updateUserStatus,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
