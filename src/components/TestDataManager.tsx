'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { LoadingSpinner } from './ui/loading-spinner';
import { toast } from 'sonner';
import { Database, RefreshCw, AlertCircle } from 'lucide-react';

interface TestDataManagerProps {
  onDataCreated?: () => void;
}

export function TestDataManager({ onDataCreated }: TestDataManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3005/api/avito/listings/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка создания тестовых данных');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Создано ${data.count} тестовых объявлений`);
        if (onDataCreated) {
          onDataCreated();
        }
      } else {
        throw new Error('Не удалось создать тестовые данные');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка создания тестовых данных';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRealData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3005/api/avito/listings/fetch-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка загрузки реальных данных');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Загружено ${data.count} реальных объявлений`);
        if (onDataCreated) {
          onDataCreated();
        }
      } else {
        throw new Error('Не удалось загрузить реальные данные');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка загрузки реальных данных';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Управление данными</h3>
          <p className="text-sm text-gray-600">
            Создайте тестовые данные или загрузите реальные объявления
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={handleCreateTestData}
          disabled={loading}
          variant="outline"
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Database className="w-4 h-4 mr-2" />
          )}
          Создать тестовые данные
        </Button>

        <Button
          onClick={handleFetchRealData}
          disabled={loading}
          variant="outline"
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Загрузить реальные данные
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Тестовые данные: создает фиктивные объявления для демонстрации</p>
        <p>• Реальные данные: загружает объявления из подключенного аккаунта Avito</p>
      </div>
    </div>
  );
}
