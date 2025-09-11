'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

function AvitoSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Запускаем обратный отсчет
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          router.push('/app/avito');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    router.push('/app/avito');
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

          {/* Успешная авторизация */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">
              Авторизация успешна!
            </h2>
            
            <p className="text-gray-600">
              Вы успешно авторизовались с Avito!
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                {isRedirecting ? (
                  'Перенаправление...'
                ) : (
                  `Через ${countdown} секунд вы будете перенаправлены в дашборд`
                )}
              </p>
            </div>
            
            {isRedirecting ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-gray-600">Перенаправление...</span>
              </div>
            ) : (
              <Button
                onClick={handleRedirect}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Перейти в дашборд
              </Button>
            )}
          </div>

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

export default function AvitoSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AvitoSuccessContent />
    </Suspense>
  );
}
