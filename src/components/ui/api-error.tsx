import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './button';

interface ApiErrorProps {
  error: string | null;
  onRetry?: () => void;
  onClear?: () => void;
  className?: string;
}

export const ApiError: React.FC<ApiErrorProps> = ({
  error,
  onRetry,
  onClear,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Произошла ошибка
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4 flex space-x-3">
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Попробовать снова
              </Button>
            )}
            {onClear && (
              <Button
                variant="ghost"
                onClick={onClear}
                className="text-red-700 hover:bg-red-100"
              >
                Закрыть
              </Button>
            )}
          </div>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="ml-auto -mt-1 -mr-1 h-6 w-6 rounded-full text-red-400 hover:bg-red-100 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Компонент для отображения ошибок загрузки
export const LoadingError: React.FC<{
  error: string | null;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`text-center py-8 ${className}`}>
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Не удалось загрузить данные
      </h3>
      <p className="text-gray-500 mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Попробовать снова
        </Button>
      )}
    </div>
  );
};

// Компонент для отображения состояния загрузки
export const LoadingState: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isLoading, children, className = '' }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        <span className="text-gray-500">Загрузка...</span>
      </div>
    </div>
  );
};

// Компонент для отображения пустого состояния
export const EmptyState: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, icon, className = '' }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mx-auto h-12 w-12 text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};
