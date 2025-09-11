'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface AvitoPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function AvitoPagination({ pagination, onPageChange }: AvitoPaginationProps) {
  const { page, total_pages, total } = pagination;

  if (total_pages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(total_pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < total_pages - 1) {
      rangeWithDots.push('...', total_pages);
    } else {
      rangeWithDots.push(total_pages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-4">
      <div className="text-sm text-gray-600">
        Показано {((page - 1) * pagination.per_page) + 1}-{Math.min(page * pagination.per_page, total)} из {total} объявлений
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  className="w-10 h-8"
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          className="flex items-center gap-1"
        >
          Вперед
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
