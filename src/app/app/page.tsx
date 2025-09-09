'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

export default function AppPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = apiClient.getToken();
        
        // Если нет токена, перенаправляем на страницу входа
        if (!token) {
          router.push('/app/auth');
          return;
        }
        
        // Если токен есть, перенаправляем на дашборд
        // Проверка валидности токена будет выполнена в защищенном layout
        router.push('/app/dashboard');
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        router.push('/app/auth');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return null;
}
