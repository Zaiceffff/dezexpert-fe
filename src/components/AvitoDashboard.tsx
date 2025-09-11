'use client';

import { useState, useEffect } from 'react';
import { useAvitoListings } from '@/hooks/useAvitoListings';
import { useAvitoStats } from '@/hooks/useAvitoStats';
import { useAvitoOAuth } from '@/hooks/useAvitoOAuth';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { StatsCards } from './StatsCards';
import { ListingsTable } from './ListingsTable';
import { OAuthButton } from './OAuthButton';
import { TestDataManager } from './TestDataManager';
import { AuthStatusIndicator } from './AuthStatusIndicator';
import { AuthNotification } from './AuthNotification';
import { LoadingSpinner } from './ui/loading-spinner';
import { Button } from './ui/button';
import { RefreshCw, Settings, BarChart3, MessageSquare } from 'lucide-react';

export default function AvitoDashboard() {
  const { listings, loading, getListings, accessToken } = useAvitoListings();
  const { stats, fetchStats } = useAvitoStats();
  const { oauthUrl, initiateOAuth, checkConnection } = useAvitoOAuth();
  const { authStatus, refreshAuth, checkAvitoConnection } = useAuthPersistence();
  const [activeTab, setActiveTab] = useState<'listings' | 'analytics'>('listings');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Проверяем авторизацию и подключение Avito
      const avitoConnected = await checkAvitoConnection();
      setIsConnected(avitoConnected);
      
      // Загружаем данные только если авторизованы
      if (authStatus.isAuthenticated) {
        await Promise.all([
          getListings(),
          fetchStats()
        ]);
      }
    };
    
    loadData();
  }, [authStatus.isAuthenticated, checkAvitoConnection, getListings, fetchStats]);

  const handleOAuthSuccess = async () => {
    setIsConnected(true);
    // Обновляем статус авторизации
    await refreshAuth();
    await Promise.all([
      getListings(),
      fetchStats()
    ]);
  };

  const handleRefresh = async () => {
    // Обновляем статус авторизации
    await refreshAuth();
    await Promise.all([
      getListings(),
      fetchStats()
    ]);
  };

  const handleDataCreated = async () => {
    await Promise.all([
      getListings(),
      fetchStats()
    ]);
  };

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Уведомления о статусе авторизации */}
      <AuthNotification onReconnect={handleOAuthSuccess} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Дашборд Avito</h1>
                  <p className="text-gray-600 mt-1">
                    Управление объявлениями и статистика
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <OAuthButton 
                oauthUrl={oauthUrl} 
                onSuccess={handleOAuthSuccess}
                isConnected={isConnected}
              />
              <Button
                onClick={handleRefresh}
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
          </div>
          
          {/* Индикатор статуса авторизации */}
          <div className="mt-4">
            <AuthStatusIndicator 
              showDetails={true}
              onReconnect={handleOAuthSuccess}
            />
          </div>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Управление тестовыми данными */}
        <div className="mb-8">
          <TestDataManager onDataCreated={handleDataCreated} />
        </div>

        {/* Навигация по вкладкам */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'listings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Объявления</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Аналитика</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Контент вкладок */}
        <div className="space-y-6">
          {activeTab === 'listings' && (
            <ListingsTable 
              listings={listings} 
              loading={loading}
              onRefresh={handleRefresh}
            />
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Аналитика в разработке</h3>
              <p className="text-gray-600">
                Раздел аналитики будет доступен в следующих версиях. 
                Здесь вы сможете отслеживать эффективность ИИ-ассистента и статистику диалогов.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
