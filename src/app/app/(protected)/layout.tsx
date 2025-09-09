'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { AvitoProvider } from '@/contexts/AvitoContext';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Проверка аутентификации через API
    const checkAuth = async () => {
      try {
        // Проверяем есть ли токен
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Нет токена авторизации');
        }

        // Устанавливаем токен в API клиент
        apiClient.setToken(token);
        
        // Получаем профиль пользователя
        const profile = await apiClient.getProfile();
        const user: User = {
          id: profile.id,
          name: profile.name,
          surname: profile.surname,
          email: profile.email,
          phone: profile.phone
        };
        setUser(user);
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        // Очищаем токен при ошибке
        apiClient.clearToken();
        // Перенаправляем на страницу входа при ошибке авторизации
        router.push('/app/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Очищаем токен и данные пользователя
    apiClient.clearToken();
    setUser(null);
    toast.success('Выход выполнен');
    router.push('/app/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AvitoProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-2 pt-0 pb-2">
          {children}
        </main>
      </div>
    </AvitoProvider>
  );
}
