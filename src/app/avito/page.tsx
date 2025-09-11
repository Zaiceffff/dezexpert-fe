'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

function AvitoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('OAuth Callback received:', { code, state, error });

    if (error) {
      setStatus('error');
      setMessage('Ошибка авторизации: ' + error);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Отсутствует код авторизации');
      return;
    }

    // Обрабатываем OAuth callback
    handleOAuthCallback(code, state || undefined);
  }, [searchParams]);

  const handleOAuthCallback = async (code: string, state?: string) => {
    try {
      setIsProcessing(true);
      setStatus('loading');
      setMessage('Подключение к Avito...');

      // Вызываем API для получения токена
      const params = new URLSearchParams({ code });
      if (state) params.append('state', state);

      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://v467850.hosted-by-vdsina.com';
      const apiUrl = `${backendUrl}/api/avito/oauth/callback/public?${params}`;
      
      console.log('Environment variables:');
      console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log('Backend URL:', backendUrl);
      console.log('Code:', code);
      console.log('State:', state);
      console.log('Making request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        console.error('Error response:', responseText);
        throw new Error(`Ошибка подключения к Avito (${response.status})`);
      }

      // Проверяем, является ли ответ HTML (ошибка) или JSON (успех)
      if (responseText.includes('<html>')) {
        // Это HTML страница с ошибкой
        if (responseText.includes('❌ Ошибка подключения')) {
          throw new Error('Ошибка подключения к Avito: не удалось получить токен');
        } else if (responseText.includes('✅ Подключение успешно')) {
          // Это успешный HTML ответ
          setStatus('success');
          setMessage('✅ Avito успешно подключен');
          toast.success('Avito успешно подключен!');
          
          // Запускаем обратный отсчет
          startCountdown();
          return;
        } else {
          throw new Error('Неожиданный ответ от сервера');
        }
      }

      // Пытаемся распарсить JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Response data:', data);
      } catch {
        throw new Error('Не удалось обработать ответ сервера');
      }
      
      if (data.success || data.access_token) {
        setStatus('success');
        setMessage('✅ Avito успешно подключен');
        toast.success('Avito успешно подключен!');
        
        // Запускаем обратный отсчет
        startCountdown();
      } else {
        throw new Error('Не удалось подключиться к Avito');
      }
    } catch (error) {
      console.error('OAuth Callback Error:', error);
      setStatus('error');
      setMessage('❌ Ошибка подключения');
      toast.error('Ошибка подключения к Avito');
    } finally {
      setIsProcessing(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRedirect = () => {
    window.location.href = '/dashboard';
  };

  const handleRetry = () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (code) {
      handleOAuthCallback(code, state || undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Логотип */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">DEZ</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">DEZEXPERT</h1>
          </div>

          {/* Статус */}
          {status === 'loading' && (
            <div className="space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600">{message}</p>
              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    Подключение к Avito...
                  </p>
                </div>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {message}
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Через {countdown} секунд вы будете перенаправлены в дашборд
                </p>
              </div>
              <Button
                onClick={handleRedirect}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Перейти в дашборд
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {message}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  Попробуйте подключиться заново
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleRetry}
                  disabled={isProcessing}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isProcessing ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Попробовать снова
                </Button>
                <Button
                  onClick={handleRedirect}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Вернуться в дашборд
                </Button>
              </div>
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Если перенаправление не произошло автоматически, нажмите кнопку выше
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AvitoCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Загрузка...</p>
          </div>
        </div>
      </div>
    }>
      <AvitoCallbackContent />
    </Suspense>
  );
}