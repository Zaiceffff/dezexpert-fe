import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showPageSizeSelector?: boolean;
  itemsPerPage?: number;
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showPageSizeSelector = false,
  itemsPerPage = 10,
  onPageSizeChange,
  totalItems = 0,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Информация о страницах */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Показано {startItem} - {endItem} из {totalItems}
        </div>
        
        {/* Селектор размера страницы */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">На странице:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={isLoading}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Навигация по страницам */}
      <div className="flex items-center gap-2">
        {/* Кнопка "В начало" */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="px-2"
          title="Первая страница"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Кнопка "Назад" */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          title="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Номера страниц с умной отрисовкой */}
        <div className="flex items-center space-x-1">
          {(() => {
            const pages = [];
            const maxVisiblePages = 7;
            
            if (totalPages <= maxVisiblePages) {
              // Показываем все страницы
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              // Умная отрисовка страниц
              if (currentPage <= 4) {
                // В начале: 1, 2, 3, 4, 5, ..., последняя
                for (let i = 1; i <= 5; i++) {
                  pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
              } else if (currentPage >= totalPages - 3) {
                // В конце: 1, ..., предпоследние 5
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // В середине: 1, ..., текущая-1, текущая, текущая+1, ..., последняя
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                  pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
              }
            }
            
            return pages.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={isLoading}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )
            ));
          })()}
        </div>
        
        {/* Кнопка "Вперед" */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          title="Следующая страница"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Кнопка "В конец" */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="px-2"
          title="Последняя страница"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
