'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AvitoDashboard from '@/components/AvitoDashboard';
import { AuthRestoreModal } from '@/components/AuthRestoreModal';

export default function AvitoPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { authStatus, refreshAuth } = useAuthPersistence();
  const router = useRouter();
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const handleBackToDashboard = () => {
    router.push('/app/dashboard');
  };

  const handleRestoreSuccess = () => {
    setShowRestoreModal(false);
    // Обновляем страницу для применения изменений
    window.location.reload();
  };

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    if (!hasCheckedAuth && !authLoading) {
      setHasCheckedAuth(true);
      
      // Если пользователь не авторизован, показываем модалку восстановления
      if (!user && !authStatus.isAuthenticated) {
        setShowRestoreModal(true);
      }
    }
  }, [user, authStatus.isAuthenticated, authLoading, hasCheckedAuth]);

  if (authLoading || authStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user && !authStatus.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-6">Необходима авторизация для доступа к этой странице</p>
          <div className="space-x-3">
            <Button onClick={() => router.push('/app/auth')}>
              Войти в систему
            </Button>
            <Button 
              onClick={() => setShowRestoreModal(true)}
              variant="outline"
            >
              Восстановить сессию
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок с кнопкой назад */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад к дашборду</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Основной дашборд */}
        <AvitoDashboard />
      </div>

      {/* Модалка восстановления сессии */}
      <AuthRestoreModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onSuccess={handleRestoreSuccess}
      />
    </div>
  );
}
