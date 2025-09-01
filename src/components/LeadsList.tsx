import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ApiError, LoadingState, EmptyState, Pagination } from '@/components/ui';
import { useLeads } from '@/hooks/useLeads';
import { formatDate } from '@/lib/apiUtils';
import type { Lead } from '@/lib/api';

interface LeadsListProps {
  partnerId?: string;
  onLeadSelect?: (lead: Lead) => void;
  onCreateNew?: () => void;
  className?: string;
}

export const LeadsList: React.FC<LeadsListProps> = ({
  partnerId,
  onLeadSelect,
  onCreateNew,
  className = '',
}) => {
  const {
    leads,
    isLoading,
    error,
    fetchLeads,
    clearError,
    totalLeads: hookTotalLeads,
  } = useLeads();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [localTotalLeads, setLocalTotalLeads] = useState(0);

  // Debounce поиска
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Загрузка лидов при изменении параметров поиска и фильтров
  React.useEffect(() => {
    if (debouncedSearch !== search || statusFilter !== '') {
      setCurrentPage(1); // Сбрасываем на первую страницу при изменении параметров
    }
    
    fetchLeads({ 
      partnerId, 
      search: debouncedSearch, 
      status: statusFilter,
      page: 1, // Всегда начинаем с первой страницы при изменении параметров
      limit: itemsPerPage
    });
  }, [fetchLeads, partnerId, debouncedSearch, statusFilter, itemsPerPage]);

  // Загрузка лидов при смене страницы
  React.useEffect(() => {
    if (currentPage > 1) {
      fetchLeads({ 
        partnerId, 
        search: debouncedSearch, 
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage
      });
    }
  }, [fetchLeads, partnerId, debouncedSearch, statusFilter, currentPage, itemsPerPage]);

  // Обновляем localTotalLeads при изменении leads
  React.useEffect(() => {
    // Используем totalLeads из хука, если он доступен
    if (hookTotalLeads > 0) {
      // totalLeads уже обновлен в хуке
    } else if (leads.length > 0) {
      // Fallback: используем длину массива leads
      setLocalTotalLeads(leads.length);
    }
  }, [leads, hookTotalLeads]);

  // Обработчик смены страницы
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    
    // Загружаем данные для новой страницы
    fetchLeads({ 
      partnerId, 
      search: debouncedSearch, 
      status: statusFilter,
      page: newPage,
      limit: itemsPerPage
    });
  };

  // Обработчик изменения размера страницы
  const handlePageSizeChange = (newPageSize: number) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1); // Сбрасываем на первую страницу
    
    // Загружаем данные с новым размером страницы
    fetchLeads({ 
      partnerId, 
      search: debouncedSearch, 
      status: statusFilter,
      page: 1,
      limit: newPageSize
    });
  };

  // Вычисляем количество страниц
  const totalPages = Math.ceil((hookTotalLeads || localTotalLeads || leads.length) / itemsPerPage);

  const handleRetry = () => {
    fetchLeads({ 
      partnerId, 
      search: debouncedSearch, 
      status: statusFilter,
      page: 1, // При retry начинаем с первой страницы
      limit: itemsPerPage
    });
    setCurrentPage(1);
  };

  const handleLeadClick = (lead: Lead) => {
    onLeadSelect?.(lead);
  };

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Лиды</h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {onCreateNew && (
            <Button onClick={onCreateNew} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Новый лид</span>
              <span className="sm:hidden">Новый</span>
            </Button>
          )}
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Поиск по имени, телефону или адресу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все статусы</option>
            <option value="new">Новый</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
      </div>

      {/* Легенда цветов статусов */}
      <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Новый</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">В работе</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Завершен</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Отменен</span>
          </div>
        </div>
      </div>

      {/* Селектор размера страницы */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Показывать по:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Показано {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, hookTotalLeads || localTotalLeads || leads.length)} из {hookTotalLeads || localTotalLeads || leads.length}
        </div>
      </div>

      {/* Состояния загрузки и ошибок */}
      {isLoading && <LoadingState isLoading={isLoading}><div /></LoadingState>}
      {error && <ApiError error={error} onRetry={handleRetry} onClear={clearError} />}
      {!isLoading && !error && leads.length === 0 && (
        <EmptyState 
          title={search || statusFilter ? "Лиды не найдены" : "Лиды отсутствуют"} 
          description={search || statusFilter ? "Попробуйте изменить параметры поиска" : "Создайте первый лид для начала работы"}
        />
      )}

      {/* Список лидов */}
      {!isLoading && !error && leads.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleLeadClick(lead)}
              className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {lead.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                    title={
                      lead.status === 'new' ? 'Новый лид - заявка только что поступила и ожидает обработки' :
                      lead.status === 'in_progress' ? 'В работе - заявка обрабатывается специалистом' :
                      lead.status === 'completed' ? 'Завершен - работа по заявке выполнена' :
                      'Отменен - заявка была отменена'
                    }>
                      {lead.status === 'new' ? 'Новый' :
                       lead.status === 'in_progress' ? 'В работе' :
                       lead.status === 'completed' ? 'Завершен' :
                       'Отменен'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Телефон:</span>
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Адрес:</span>
                      <span className="truncate">{lead.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Вредитель:</span>
                      <span className="truncate">{lead.pestType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Цена:</span>
                      <span className="truncate">{lead.approxPrice} ₽</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>Создан:</span>
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                  {lead.expectedDate && (
                    <div className="flex items-center gap-1">
                      <span>Дата:</span>
                      <span>{formatDate(lead.expectedDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          itemsPerPage={itemsPerPage}
          totalItems={hookTotalLeads || localTotalLeads || leads.length}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
};
