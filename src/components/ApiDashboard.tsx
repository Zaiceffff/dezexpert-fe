'use client';

import React, { useEffect } from 'react';
import { useApiStats } from '../hooks/useApiStats';
import { useApiAuth } from '../hooks/useApiAuth';

export function ApiDashboard() {
  const { general, ai, leads, avito, health, isLoading, loadAllStats } = useApiStats();
  const { user, isAuthenticated } = useApiAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadAllStats();
    }
  }, [isAuthenticated, loadAllStats]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Необходимо войти в систему</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка статистики...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Добро пожаловать, {user?.email}!
        </h1>
        
        {/* Health Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              API {health?.status === 'healthy' ? 'работает' : 'недоступен'}
            </span>
          </div>
        </div>

        {/* General Stats */}
        {general && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Пользователи</h3>
              <p className="text-2xl font-bold text-blue-900">{general.totalUsers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">Заявки</h3>
              <p className="text-2xl font-bold text-green-900">{general.totalOrders}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600">Объявления</h3>
              <p className="text-2xl font-bold text-purple-900">{general.totalListings}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-600">ИИ взаимодействия</h3>
              <p className="text-2xl font-bold text-orange-900">{general.totalAiInteractions}</p>
            </div>
          </div>
        )}

        {/* AI Stats */}
        {ai && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Статистика ИИ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Всего взаимодействий</p>
                <p className="text-xl font-bold">{ai.totalInteractions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего токенов</p>
                <p className="text-xl font-bold">{ai.totalTokens}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Среднее время ответа</p>
                <p className="text-xl font-bold">{ai.averageResponseTime}мс</p>
              </div>
            </div>
          </div>
        )}

        {/* Leads Stats */}
        {leads && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Статистика лидов</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Всего лидов</p>
                <p className="text-xl font-bold">{leads.totalLeads}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Новых лидов</p>
                <p className="text-xl font-bold">{leads.newLeads}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Конвертированных</p>
                <p className="text-xl font-bold">{leads.convertedLeads}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Конверсия</p>
                <p className="text-xl font-bold">{leads.conversionRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Avito Stats */}
        {avito && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Статистика Avito</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Всего объявлений</p>
                <p className="text-xl font-bold">{avito.totalListings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Активных</p>
                <p className="text-xl font-bold">{avito.activeListings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">С ИИ</p>
                <p className="text-xl font-bold">{avito.aiEnabledListings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Последняя синхронизация</p>
                <p className="text-xl font-bold">
                  {avito.lastSync ? new Date(avito.lastSync).toLocaleDateString() : 'Никогда'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
