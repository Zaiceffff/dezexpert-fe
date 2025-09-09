'use client';

import React, { useState, useEffect } from 'react';
import { useAvitoSimple } from '../hooks/useAvitoSimple';
import { AvitoListing } from '../lib/api-types';

export function AvitoSimpleManager() {
  const {
    listings,
    aiActiveListings,
    tokensStatus,
    isLoading,
    error,
    isConnected,
    loadListings,
    loadAiActiveListings,
    toggleAiAssistant,
    syncListings,
    refreshTokens,
    checkConnection,
    getOAuthUrl,
    clearError
  } = useAvitoSimple();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  // Фильтрация объявлений
  const filteredListings = React.useMemo(() => {
    let filtered = listings;

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(listing =>
        listing.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(listing =>
        listing.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return filtered;
  }, [listings, searchQuery, selectedCategory, selectedStatus]);

  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(listings.map(l => l.category))];
    return uniqueCategories;
  }, [listings]);

  const statuses = React.useMemo(() => {
    const uniqueStatuses = [...new Set(listings.map(l => l.status))];
    return uniqueStatuses;
  }, [listings]);

  const handleOAuth = async () => {
    setIsOAuthLoading(true);
    try {
      const url = await getOAuthUrl();
      // Открываем OAuth URL в новом окне
      window.open(url, '_blank', 'width=600,height=600');
    } catch (err) {
      console.error('OAuth error:', err);
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleRefreshTokens = async () => {
    const success = await refreshTokens();
    if (success) {
      alert('Токены обновлены успешно');
    } else {
      alert('Ошибка обновления токенов');
    }
  };

  const handleSync = async () => {
    const success = await syncListings();
    if (success) {
      alert('Синхронизация завершена');
    } else {
      alert('Ошибка синхронизации');
    }
  };

  const handleToggleAi = async (id: string, enabled: boolean) => {
    const success = await toggleAiAssistant(id, enabled);
    if (success) {
      alert(`ИИ-ассистент ${enabled ? 'включен' : 'выключен'}`);
    } else {
      alert('Ошибка изменения настроек ИИ');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка данных Avito...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Управление Avito</h2>
          <div className="flex space-x-2">
            <button
              onClick={checkConnection}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Проверить подключение
            </button>
            <button
              onClick={handleOAuth}
              disabled={isOAuthLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isOAuthLoading ? 'Загрузка...' : 'Подключить Avito'}
            </button>
            <button
              onClick={handleRefreshTokens}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Обновить токены
            </button>
            <button
              onClick={handleSync}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Синхронизировать
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Подключено к Avito' : 'Не подключено к Avito'}
            </span>
            {tokensStatus && (
              <span className="text-sm text-gray-500">
                (Токены: {tokensStatus.accessToken ? 'есть' : 'нет'}, 
                Действительны: {tokensStatus.isValid ? 'да' : 'нет'})
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-600">Всего объявлений</p>
            <p className="text-xl font-bold text-blue-900">{listings.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-green-600">С ИИ</p>
            <p className="text-xl font-bold text-green-900">
              {listings.filter(l => l.aiAssistantIsOn).length}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-md">
            <p className="text-sm text-orange-600">Без ИИ</p>
            <p className="text-xl font-bold text-orange-900">
              {listings.filter(l => !l.aiAssistantIsOn).length}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="text-sm text-purple-600">Активных с ИИ</p>
            <p className="text-xl font-bold text-purple-900">{aiActiveListings.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск по названию
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введите название..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все статусы</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>

      {/* Listings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Объявления ({filteredListings.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">{listing.title}</h4>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Категория: {listing.category}</span>
                    <span>Статус: {listing.status}</span>
                    <span>Цена: {listing.price} ₽</span>
                    <span>ID: {listing.avitoId}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Создано: {new Date(listing.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.aiAssistantIsOn
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.aiAssistantIsOn ? 'ИИ включен' : 'ИИ выключен'}
                  </div>
                  <button
                    onClick={() => handleToggleAi(listing.id, !listing.aiAssistantIsOn)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      listing.aiAssistantIsOn
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {listing.aiAssistantIsOn ? 'Выключить ИИ' : 'Включить ИИ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredListings.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            Объявления не найдены
          </div>
        )}
      </div>
    </div>
  );
}
