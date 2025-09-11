'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAvitoListings } from '@/hooks/useAvitoListings';
import { AvitoPagination } from '@/components/AvitoPagination';
import type { AvitoListing } from '@/components/AvitoListingCard';
import { 
  RefreshCw, 
  Bot, 
  BotOff, 
  ExternalLink, 
  Calendar,
  DollarSign,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AvitoListingsProps {
  onListingUpdate?: (listing: AvitoListing) => void;
}

export function AvitoListings({ onListingUpdate }: AvitoListingsProps) {
  const { 
    listings, 
    pagination,
    getListings, 
    getAvitoToken,
    getAvitoItems,
    accessToken,
    setAccessToken,
    loading, 
    error,
    clearError 
  } = useAvitoListings();

  const [syncingListingId, setSyncingListingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSync = async () => {
    if (accessToken) {
      await getListings(1, 'active');
    }
  };

  const handleToggleAi = async (listing: AvitoListing) => {
    setSyncingListingId(listing.id);
    try {
      // TODO: Реализовать переключение ИИ ассистента
      // const success = await toggleAiAssistant(listing.id, !listing.aiAssistantIsOn);
      // if (success && onListingUpdate) {
      //   onListingUpdate(listing);
      // }
      console.log('Toggle AI for listing:', listing.id);
    } finally {
      setSyncingListingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getListings(page, 'active');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Активно';
      case 'paused':
        return 'Приостановлено';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  if (loading && listings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Загружаем объявления...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Компактный заголовок и статистика */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Мои объявления</h3>
              <p className="text-xs text-gray-500">
                {listings.length} объявлений • {listings.filter(l => l.aiAssistantIsOn).length} с ИИ
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSync}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 px-3 py-1"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-1" />
                Синхронизация...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 mr-1" />
                Синхронизировать
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Список объявлений */}
      {listings.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Объявления</h4>
            <p className="text-sm text-gray-600 mt-1">
              Включите ИИ-ассистент для автоматических ответов клиентам
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <div key={listing.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-lg font-medium text-gray-900 truncate">
                        {listing.title}
                      </h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(listing.status)}`}>
                        {getStatusText(listing.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{listing.category?.name || 'Не указано'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatPrice(listing.price)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{listing.createdAt ? formatDate(listing.createdAt) : 'Не указано'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {listing.aiAssistantIsOn ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">ИИ-ассистент активен</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">ИИ-ассистент выключен</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    <Button
                      onClick={() => handleToggleAi(listing)}
                      disabled={syncingListingId === listing.id}
                      variant={listing.aiAssistantIsOn ? "outline" : "default"}
                      className={
                        listing.aiAssistantIsOn
                          ? "border-red-300 text-red-700 hover:bg-red-50"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }
                    >
                      {syncingListingId === listing.id ? (
                        <LoadingSpinner size="sm" />
                      ) : listing.aiAssistantIsOn ? (
                        <>
                          <BotOff className="w-4 h-4 mr-2" />
                          Выключить ИИ
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 mr-2" />
                          Включить ИИ
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(listing.url || `https://www.avito.ru/user/items/${listing.id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {pagination && pagination.total_pages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <AvitoPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Объявления не найдены</h3>
          <p className="text-gray-600 mb-4">
            Синхронизируйте ваши объявления с Avito, чтобы начать работу с ИИ-ассистентом
          </p>
          <Button
            onClick={handleSync}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Синхронизация...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Синхронизировать объявления
              </>
            )}
          </Button>
        </div>
      )}

    </div>
  );
}
