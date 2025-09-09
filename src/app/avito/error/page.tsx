'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AvitoErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const error = searchParams.get('error') || 'Неизвестная ошибка';
  const errorDescription = searchParams.get('error_description') || 'Произошла ошибка при авторизации';

  const handleRetry = () => {
    router.push('/app/avito');
  };

  const handleBackToHome = () => {
    router.push('/');
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

          {/* Ошибка авторизации */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">
              Ошибка авторизации
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-red-800 text-sm font-medium mb-2">
                Код ошибки: {error}
              </p>
              <p className="text-red-700 text-sm">
                {errorDescription}
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Возможные причины:
              </p>
              <ul className="text-yellow-700 text-xs mt-2 space-y-1 text-left">
                <li>• Пользователь отменил авторизацию</li>
                <li>• Истек срок действия запроса</li>
                <li>• Неверные параметры авторизации</li>
                <li>• Проблемы с сетью</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleRetry}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Попробовать снова
              </Button>
              
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Если проблема повторяется, обратитесь в поддержку
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
