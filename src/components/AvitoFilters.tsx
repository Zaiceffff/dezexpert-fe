'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type AvitoStatus = 'active' | 'old' | 'removed' | 'blocked';

interface AvitoFiltersProps {
  selectedStatus: AvitoStatus | 'all';
  onStatusChange: (status: AvitoStatus | 'all') => void;
  totalCount: number;
  filteredCount: number;
}

const statusOptions = [
  { value: 'all', label: 'Все', color: 'bg-gray-100 text-gray-800' },
  { value: 'active', label: 'Активные', color: 'bg-green-100 text-green-800' },
  { value: 'old', label: 'Архив', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'removed', label: 'Удаленные', color: 'bg-red-100 text-red-800' },
  { value: 'blocked', label: 'Заблокированные', color: 'bg-gray-100 text-gray-800' },
] as const;

export function AvitoFilters({ selectedStatus, onStatusChange, totalCount, filteredCount }: AvitoFiltersProps) {
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Фильтры</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedStatus === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(option.value)}
                className="h-8"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Показано: <span className="font-semibold">{filteredCount}</span> из <span className="font-semibold">{totalCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
