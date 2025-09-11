'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAvitoContext } from '@/contexts/AvitoContext';
import { toast } from 'sonner';
import { ExternalLink, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface AvitoConnectionProps {
  onConnected?: () => void;
}

export function AvitoConnection({ onConnected }: AvitoConnectionProps) {
  const { getOAuthUrl, connectAccount, isConnecting, connectionStatus, error, clearError } = useAvitoContext();
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
          connectAccount(code, state).then((success) => {
            if (success && onConnected) {
              onConnected();
            }
          });
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
    } finally {
      setIsConnectingToAvito(false);
    }
  };

  const isConnected = connectionStatus?.hasToken;
  const isLoading = isConnecting || isConnectingToAvito;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Подключение к Avito</h3>
            <p className="text-sm text-gray-600">
              Подключите свой аккаунт Avito для автоматизации ответов
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Подключено</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Не подключено</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Информация о демо режиме */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-semibold">i</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Демо режим</h4>
              <p className="text-sm text-blue-800">
                Для полной работы с Avito настройте переменные окружения и запустите Avito backend.
                Сейчас доступен демо режим для тестирования интерфейса.
              </p>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Для начала работы с ИИ-ассистентом необходимо подключить ваш аккаунт Avito.
              Это позволит системе автоматически отвечать на сообщения клиентов.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Подключение...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Подключить Avito
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Аккаунт подключен</span>
              </div>
              <p className="text-sm text-green-600">
                Теперь вы можете управлять объявлениями и настраивать ИИ-ассистента
              </p>
            </div>
            
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Обновление...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Переподключить
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Подключение происходит через официальный API Avito</p>
          <p>• Ваши данные защищены и не передаются третьим лицам</p>
          <p>• Вы можете отключить интеграцию в любое время</p>
        </div>
      </div>
    </div>
  );
}
