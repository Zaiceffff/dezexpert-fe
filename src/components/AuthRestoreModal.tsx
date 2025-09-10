'use client';

import { useState, useEffect } from 'react';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { Button } from './ui/button';
import { LoadingSpinner } from './ui/loading-spinner';
import { 
  AlertCircle, 
  RefreshCw, 
  CheckCircle,
  ExternalLink,
  X
} from 'lucide-react';

interface AuthRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthRestoreModal({ isOpen, onClose, onSuccess }: AuthRestoreModalProps) {
  const { authStatus, refreshAuth, checkAvitoConnection } = useAuthPersistence();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStep, setRestoreStep] = useState<'checking' | 'reconnecting' | 'success' | 'error'>('checking');

  useEffect(() => {
    if (isOpen) {
      handleRestore();
    }
  }, [isOpen]);

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      setRestoreStep('checking');

      // Проверяем основную авторизацию
      await refreshAuth();
      
      if (!authStatus.isAuthenticated) {
        setRestoreStep('error');
        return;
      }

      setRestoreStep('reconnecting');
      
      // Проверяем подключение Avito
      const avitoConnected = await checkAvitoConnection();
      
      if (avitoConnected) {
        setRestoreStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setRestoreStep('error');
      }
    } catch (error) {
      console.error('Auth restore error:', error);
      setRestoreStep('error');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleReconnect = async () => {
    try {
      const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://144.124.230.138:3005'}/api/avito/oauth/url`);
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank', 'width=600,height=700');
      }
    } catch (error) {
      console.error('Error getting OAuth URL:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Восстановление сессии
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Шаг проверки авторизации */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              {restoreStep === 'checking' ? (
                <LoadingSpinner size="sm" />
              ) : restoreStep === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Проверка авторизации
              </p>
              <p className="text-xs text-gray-500">
                {restoreStep === 'checking' && 'Проверяем токен...'}
                {restoreStep === 'error' && 'Ошибка авторизации'}
                {restoreStep !== 'checking' && restoreStep !== 'error' && 'Авторизация активна'}
              </p>
            </div>
          </div>

          {/* Шаг подключения Avito */}
          {restoreStep !== 'checking' && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                {restoreStep === 'reconnecting' ? (
                  <LoadingSpinner size="sm" />
                ) : restoreStep === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Подключение Avito
                </p>
                <p className="text-xs text-gray-500">
                  {restoreStep === 'reconnecting' && 'Проверяем подключение...'}
                  {restoreStep === 'success' && 'Avito подключен'}
                  {restoreStep === 'error' && 'Avito не подключен'}
                </p>
              </div>
            </div>
          )}

          {/* Результат */}
          {restoreStep === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 text-sm font-medium">
                  Сессия восстановлена успешно!
                </p>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Перенаправление в дашборд...
              </p>
            </div>
          )}

          {restoreStep === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm font-medium">
                  Не удалось восстановить сессию
                </p>
              </div>
              <p className="text-red-700 text-xs mt-1">
                Требуется повторная авторизация
              </p>
            </div>
          )}

          {/* Действия */}
          <div className="flex space-x-3 pt-4">
            {restoreStep === 'error' && (
              <>
                <Button
                  onClick={handleReconnect}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Подключить Avito
                </Button>
                <Button
                  onClick={handleRestore}
                  disabled={isRestoring}
                  variant="outline"
                >
                  {isRestoring ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Попробовать снова
                </Button>
              </>
            )}
            
            <Button
              onClick={onClose}
              variant="outline"
              className="ml-auto"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
