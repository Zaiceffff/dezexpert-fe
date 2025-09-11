'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, AlertCircle, RefreshCw, Package, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAvitoListings } from '@/hooks/useAvitoListings';
import { AvitoListingCard, AvitoListing } from '@/components/AvitoListingCard';
import { AvitoFilters, AvitoStatus } from '@/components/AvitoFilters';
import { AvitoPagination } from '@/components/AvitoPagination';

function AvitoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'listings'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AvitoStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    listings,
    pagination,
    loading,
    error,
    accessToken,
    getToken,
    getListings,
    getAvitoToken,
    getAvitoItems,
    setAccessToken,
    setListings,
    clearError,
  } = useAvitoListings();

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error in useEffect:', error);
      setStatus('error');
      setMessage('Ошибка обработки параметров');
    }
  }, [searchParams]);

  const handleOAuthCallback = async (code: string, state?: string) => {
    try {
      setIsProcessing(true);
      setStatus('loading');
      setMessage('Подключение к Avito...');

      // Получаем токен
      const token = await getAvitoToken(code);
      
      // Получаем объявления с токеном
      const items = await getAvitoItems(token, 1);
      
      setStatus('success');
      setMessage('✅ Avito успешно подключен');
      toast.success('Avito успешно подключен!');
      
      // Устанавливаем токен и объявления
      setAccessToken(token);
      setListings(items);
      setStatus('listings');
      
      // Запускаем обратный отсчет для редиректа
      startCountdown();
    } catch (error) {
      console.error('Ошибка:', error);
      setStatus('error');
      setMessage('❌ Ошибка подключения');
      // Показать пользователю сообщение об ошибке
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error('Ошибка подключения к Avito: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/app/dashboard';
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

  const handleStatusChange = (status: AvitoStatus | 'all') => {
    setSelectedStatus(status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getListings(page);
  };

  // Фильтрация объявлений
  const filteredListings = useMemo(() => {
    if (selectedStatus === 'all') {
      return listings;
    }
    return listings.filter(listing => listing.status === selectedStatus);
  }, [listings, selectedStatus]);

  // Если есть ошибка от хука, показываем её
  useEffect(() => {
    if (error && status === 'listings') {
      setStatus('error');
      setMessage('❌ Ошибка загрузки объявлений');
    }
  }, [error, status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AV</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Объявления Avito</h1>
          </div>
          <p className="text-gray-600">Управление вашими объявлениями на Avito</p>
        </div>

        {/* Статус подключения */}
        {status === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">{message}</p>
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-800 text-sm">
                  Подключение к Avito...
                </p>
              </div>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">
                Попробуйте подключиться заново
              </p>
            </div>
            <div className="flex justify-center gap-3">
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

        {/* Список объявлений */}
        {status === 'listings' && (
          <div>
            {/* Фильтры */}
            <AvitoFilters
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              totalCount={listings.length}
              filteredCount={filteredListings.length}
            />

            {/* Загрузка */}
            {loading && (
              <div className="bg-white rounded-lg border p-8 text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600 mt-4">Загрузка объявлений...</p>
              </div>
            )}

            {/* Список объявлений */}
            {!loading && filteredListings.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <AvitoListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {/* Пагинация */}
                {pagination && pagination.total_pages > 1 && (
                  <AvitoPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}

            {/* Пустое состояние */}
            {!loading && filteredListings.length === 0 && listings.length === 0 && (
              <div className="bg-white rounded-lg border p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Нет объявлений
                </h3>
                <p className="text-gray-600 mb-4">
                  У вас пока нет объявлений на Avito или они не загрузились
                </p>
                <Button
                  onClick={() => getListings(currentPage)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Обновить
                </Button>
              </div>
            )}

            {/* Пустое состояние после фильтрации */}
            {!loading && filteredListings.length === 0 && listings.length > 0 && (
              <div className="bg-white rounded-lg border p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Нет объявлений с выбранным статусом
                </h3>
                <p className="text-gray-600 mb-4">
                  Попробуйте выбрать другой статус или сбросить фильтр
                </p>
                <Button
                  onClick={() => setSelectedStatus('all')}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Показать все
                </Button>
              </div>
            )}
          </div>
        )}
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