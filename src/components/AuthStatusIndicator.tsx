'use client';

import { useState, useEffect } from 'react';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { Button } from './ui/button';
import { LoadingSpinner } from './ui/loading-spinner';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  ExternalLink,
  Settings
} from 'lucide-react';

interface AuthStatusIndicatorProps {
  showDetails?: boolean;
  onReconnect?: () => void;
}

export function AuthStatusIndicator({ showDetails = false, onReconnect }: AuthStatusIndicatorProps) {
  const { authStatus, refreshAuth, checkAvitoConnection } = useAuthPersistence();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAuth();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = async () => {
    if (onReconnect) {
      onReconnect();
    } else {
      // Открываем OAuth URL
      try {
        const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/oauth/url`);
        const data = await response.json();
        if (data.url) {
          window.open(data.url, '_blank', 'width=600,height=700');
        }
      } catch (error) {
        console.error('Error getting OAuth URL:', error);
      }
    }
  };

  if (authStatus.isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <LoadingSpinner size="sm" />
        <span className="text-sm">Проверка авторизации...</span>
      </div>
    );
  }

  if (!authStatus.isAuthenticated) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Не авторизован</span>
        {showDetails && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/auth/login'}
            className="ml-2"
          >
            Войти
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Статус основной авторизации */}
      <div className="flex items-center space-x-1 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Авторизован</span>
      </div>

      {/* Статус подключения Avito */}
      <div className="flex items-center space-x-1">
        {authStatus.isAvitoConnected ? (
          <div className="flex items-center space-x-1 text-green-600">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Avito подключен</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-orange-600">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Avito не подключен</span>
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 px-2"
        >
          {isRefreshing ? (
            <LoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>

        {!authStatus.isAvitoConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReconnect}
            className="h-8 px-2 text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Дополнительная информация */}
      {showDetails && (
        <div className="text-xs text-gray-500">
          Обновлено: {new Date(authStatus.lastChecked).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
