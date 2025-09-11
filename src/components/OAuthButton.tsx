'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { LoadingSpinner } from './ui/loading-spinner';
import { useAvitoOAuth } from '@/hooks/useAvitoOAuth';
import { 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Settings
} from 'lucide-react';

interface OAuthButtonProps {
  oauthUrl: string | null;
  onSuccess: () => void;
  isConnected: boolean;
}

export function OAuthButton({ oauthUrl, onSuccess, isConnected }: OAuthButtonProps) {
  const { initiateOAuth, loading } = useAvitoOAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Открываем прямое окно авторизации Avito
      const oauthUrl = 'https://avito.ru/oauth?response_type=code&client_id=hF49pA0JvwucazxwgIel&scope=items:info,messenger:read,messenger:write,user:read';
      window.open(oauthUrl, '_blank', 'width=600,height=700');
      
      // Проверяем подключение через некоторое время
      setTimeout(async () => {
        try {
          const response = await fetch(`${process.env.AVITO_BACKEND_URL || 'https://v467850.hosted-by-vdsina.com/api/docs'}/api/avito/listings/public?page=1&limit=1`);
          if (response.ok) {
            onSuccess();
          }
        } catch (error) {
          console.error('Ошибка проверки подключения:', error);
        }
        setIsConnecting(false);
      }, 3000);
    } catch (error) {
      console.error('Ошибка подключения:', error);
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <Button
        disabled
        className="bg-green-600 hover:bg-green-700 text-white cursor-not-allowed"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Подключено
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading || isConnecting}
      className="bg-orange-600 hover:bg-orange-700 text-white"
    >
      {loading || isConnecting ? (
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
  );
}
