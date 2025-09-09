'use client';

import { useEffect, useState } from 'react';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { Button } from './ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  X, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AuthNotificationProps {
  onReconnect?: () => void;
}

export function AuthNotification({ onReconnect }: AuthNotificationProps) {
  const { authStatus, refreshAuth } = useAuthPersistence();
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Показываем уведомление если есть проблемы с авторизацией
    if (!authStatus.isLoading && (!authStatus.isAuthenticated || !authStatus.isAvitoConnected)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [authStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAuth();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = () => {
    if (onReconnect) {
      onReconnect();
    } else {
      // Открываем OAuth URL
      fetch('http://localhost:3005/api/avito/oauth/url')
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            window.open(data.url, '_blank', 'width=600,height=700');
          }
        })
        .catch(error => console.error('Error getting OAuth URL:', error));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {!authStatus.isAuthenticated ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : !authStatus.isAvitoConnected ? (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              {!authStatus.isAuthenticated 
                ? 'Проблема с авторизацией' 
                : 'Avito не подключен'
              }
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {!authStatus.isAuthenticated 
                ? 'Ваша сессия истекла. Необходима повторная авторизация.'
                : 'Подключение к Avito потеряно. Переподключитесь для продолжения работы.'
              }
            </p>
            
            <div className="flex space-x-2 mt-3">
              <Button
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="text-xs"
              >
                {isRefreshing ? (
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3 mr-1" />
                )}
                Проверить
              </Button>
              
              {!authStatus.isAuthenticated ? (
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/app/auth'}
                  className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Войти
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleReconnect}
                  className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Подключить
                </Button>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
