'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAvitoListings } from '@/hooks/useAvitoListings';
import { toast } from 'sonner';
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface AvitoConnectionProps {
  onConnected?: () => void;
}

export function AvitoConnection({ onConnected }: AvitoConnectionProps) {
  const { getAvitoToken, getAvitoItems, setAccessToken, setListings, accessToken, error, clearError } = useAvitoListings();
  const [isConnectingToAvito, setIsConnectingToAvito] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnectingToAvito(true);
      clearError();
      
      // Открываем прямое окно авторизации Avito
      const oauthUrl = 'https://avito.ru/oauth?response_type=code&client_id=hF49pA0JvwucazxwgIel&scope=items:info,messenger:read,messenger:write,user:read';
      
      const popup = window.open(
        oauthUrl,
        'avito-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Не удалось открыть окно авторизации. Разрешите всплывающие окна.');
      }

      // Слушаем сообщения от popup окна
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'AVITO_OAUTH_SUCCESS') {
          const { code, state } = event.data;
          popup.close();
          window.removeEventListener('message', messageListener);
          
          // Подключаем аккаунт
          handleOAuthCallback(code, state);
        } else if (event.data.type === 'AVITO_OAUTH_ERROR') {
          popup.close();
          window.removeEventListener('message', messageListener);
          throw new Error(event.data.error || 'Ошибка авторизации');
        }
      };

      window.addEventListener('message', messageListener);

      // Проверяем, не закрыли ли popup вручную
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setIsConnectingToAvito(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Ошибка подключения к Avito:', error);
      // Показать пользователю сообщение об ошибке
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error('Ошибка подключения к Avito: ' + errorMessage);
    } finally {
      setIsConnectingToAvito(false);
    }
  };

  const handleOAuthCallback = async (code: string, state?: string) => {
    try {
      // Получаем токен
      const token = await getAvitoToken(code);
      
      // Получаем только активные объявления с токеном
      const items = await getAvitoItems(token, 1, 'active');
      
      // Устанавливаем токен и объявления
      setAccessToken(token);
      setListings(items);
      
      toast.success('Avito успешно подключен!');
      
      if (onConnected) {
        onConnected();
      }
    } catch (error) {
      console.error('Ошибка:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error('Ошибка подключения к Avito: ' + errorMessage);
    }
  };

  const isConnected = !!accessToken;
  const isLoading = isConnectingToAvito;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {!isConnected ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Подключение к Avito</h3>
                <p className="text-xs text-gray-500">Подключите для автоматизации ответов</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Не подключено</span>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-center">
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Подключение...
                </>
              ) : (
                <>
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Подключить Avito
                </>
              )}
            </Button>
          </div>

          {/* Информация о безопасности */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-400 text-center">
              Официальный API Avito • Данные защищены • Отключение в любое время
            </div>
          </div>
        </>
      ) : (
        <>
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Компактная кнопка переподключения */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Avito подключен</span>
            </div>
            
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 px-3 py-1"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-1" />
                  Обновление...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Переподключить
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
