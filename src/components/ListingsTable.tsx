'use client';

import { useState } from 'react';
import { AvitoListing } from '@/hooks/useAvitoListings';
import { LoadingSpinner } from './ui/loading-spinner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  ExternalLink, 
  Bot, 
  BotOff,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ListingsTableProps {
  listings: AvitoListing[];
  loading: boolean;
  onRefresh: () => void;
}

export function ListingsTable({ listings, loading, onRefresh }: ListingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Фильтрация и сортировка
  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || listing.status.toLowerCase() === statusFilter;
      const matchesCategory = categoryFilter === 'all' || listing.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Пагинация
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

  const handleSort = (field: 'title' | 'price' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const uniqueCategories = [...new Set(listings.map(l => l.category))];
  const uniqueStatuses = [...new Set(listings.map(l => l.status))];

  if (loading && listings.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Загружаем объявления...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Заголовок и фильтры */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Объявления</h3>
              <p className="text-sm text-gray-600">
                Управляйте ИИ-ассистентом для каждого объявления
              </p>
            </div>
          </div>
          
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Обновить
          </Button>
        </div>

        {/* Фильтры и поиск */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status.toLowerCase()}>
                {getStatusText(status)}
              </option>
            ))}
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'title' | 'price' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="createdAt-desc">Дата создания (новые)</option>
            <option value="createdAt-asc">Дата создания (старые)</option>
            <option value="title-asc">Название (А-Я)</option>
            <option value="title-desc">Название (Я-А)</option>
            <option value="price-desc">Цена (высокая)</option>
            <option value="price-asc">Цена (низкая)</option>
          </select>
        </div>
      </div>

      {/* Таблица */}
      {paginatedListings.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Объявление
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ИИ ассистент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {listing.avitoId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(listing.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(listing.status)}`}>
                        {getStatusText(listing.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {listing.aiAssistantIsOn ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Включен</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Выключен</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={listing.aiAssistantIsOn ? "outline" : "default"}
                          className={
                            listing.aiAssistantIsOn
                              ? "border-red-300 text-red-700 hover:bg-red-50"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        >
                          {listing.aiAssistantIsOn ? (
                            <>
                              <BotOff className="w-3 h-3 mr-1" />
                              Выключить
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3 mr-1" />
                              Включить
                            </>
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://www.avito.ru/user/items/${listing.avitoId}`, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Предыдущая
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Следующая
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Показано{' '}
                    <span className="font-medium">{startIndex + 1}</span>
                    {' '}до{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredListings.length)}</span>
                    {' '}из{' '}
                    <span className="font-medium">{filteredListings.length}</span>
                    {' '}результатов
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="relative inline-flex items-center px-4 py-2"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Объявления не найдены</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Попробуйте изменить фильтры поиска'
              : 'Подключите аккаунт Avito для загрузки объявлений'
            }
          </p>
          <Button
            onClick={onRefresh}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Обновить
          </Button>
        </div>
      )}
    </div>
  );
}
