import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthStatus {
  isAuthenticated: boolean;
  isAvitoConnected: boolean;
  isLoading: boolean;
  lastChecked: number;
}

interface UseAuthPersistenceReturn {
  authStatus: AuthStatus;
  checkAuth: () => Promise<void>;
  checkAvitoConnection: () => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  clearAuth: () => void;
}

export function useAuthPersistence(): UseAuthPersistenceReturn {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isAvitoConnected: false,
    isLoading: true,
    lastChecked: 0,
  });

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setAuthStatus(prev => ({ ...prev, isLoading: true }));

      // Проверяем наличие токена в localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthStatus({
          isAuthenticated: false,
          isAvitoConnected: false,
          isLoading: false,
          lastChecked: Date.now(),
        });
        return;
      }

      // Проверяем валидность токена через API
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthStatus({
          isAuthenticated: true,
          isAvitoConnected: false, // Будет проверено отдельно
          isLoading: false,
          lastChecked: Date.now(),
        });
      } else {
        // Токен недействителен, очищаем
        localStorage.removeItem('auth_token');
        setAuthStatus({
          isAuthenticated: false,
          isAvitoConnected: false,
          isLoading: false,
          lastChecked: Date.now(),
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthStatus({
        isAuthenticated: false,
        isAvitoConnected: false,
        isLoading: false,
        lastChecked: Date.now(),
      });
    }
  }, []);

  const checkAvitoConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.bugbot.ru/api'}/avito/listings/public?page=1&limit=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isConnected = response.ok;
      
      setAuthStatus(prev => ({
        ...prev,
        isAvitoConnected: isConnected,
      }));

      return isConnected;
    } catch (error) {
      console.error('Avito connection check error:', error);
      setAuthStatus(prev => ({
        ...prev,
        isAvitoConnected: false,
      }));
      return false;
    }
  }, []);

  const refreshAuth = useCallback(async (): Promise<void> => {
    await Promise.all([
      checkAuth(),
      checkAvitoConnection(),
    ]);
  }, [checkAuth, checkAvitoConnection]);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuthStatus({
      isAuthenticated: false,
      isAvitoConnected: false,
      isLoading: false,
      lastChecked: Date.now(),
    });
    router.push('/auth/login');
  }, [router]);

  // Автоматическая проверка при монтировании
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Периодическая проверка каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      if (authStatus.isAuthenticated) {
        refreshAuth();
      }
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [authStatus.isAuthenticated, refreshAuth]);

  // Проверка при фокусе на окне
  useEffect(() => {
    const handleFocus = () => {
      if (authStatus.isAuthenticated) {
        refreshAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authStatus.isAuthenticated, refreshAuth]);

  return {
    authStatus,
    checkAuth,
    checkAvitoConnection,
    refreshAuth,
    clearAuth,
  };
}
