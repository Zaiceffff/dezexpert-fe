'use client';

import React, { useState, useEffect } from 'react';
import { useApiOrders } from '../hooks/useApiOrders';
import { Order, CreateOrderRequest } from '../lib/api-types';

export function ApiOrdersManager() {
  const {
    orders,
    stats,
    isLoading,
    error,
    loadOrders,
    createOrder,
    getOrdersByStatus,
    searchOrdersByPhone,
    searchOrdersByName,
    getRecentOrders,
    getTodaysOrders,
    getWeeklyOrders,
    getMonthlyOrders,
    clearError
  } = useApiOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'phone'>('name');
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | ''>('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const [createForm, setCreateForm] = useState<CreateOrderRequest>({
    service: '',
    object: '',
    count: '',
    experience: '',
    phoneNumber: '',
    address: '',
    name: '',
    expectDate: '',
  });

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, searchType, selectedStatus, timeFilter]);

  const filterOrders = async () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery) {
      if (searchType === 'name') {
        filtered = await searchOrdersByName(searchQuery);
      } else {
        filtered = await searchOrdersByPhone(searchQuery);
      }
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Apply time filter
    switch (timeFilter) {
      case 'today':
        filtered = await getTodaysOrders();
        break;
      case 'week':
        filtered = await getWeeklyOrders();
        break;
      case 'month':
        filtered = await getMonthlyOrders();
        break;
    }

    setFilteredOrders(filtered);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOrder(createForm);
      setCreateForm({
        service: '',
        object: '',
        count: '',
        experience: '',
        phoneNumber: '',
        address: '',
        name: '',
        expectDate: '',
      });
      setShowCreateForm(false);
      alert('Заявка создана успешно');
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCreateForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка заявок...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Управление заявками</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Создать заявку
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-600">Всего</p>
              <p className="text-xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-600">Новые</p>
              <p className="text-xl font-bold text-yellow-900">{stats.new}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-md">
              <p className="text-sm text-orange-600">В работе</p>
              <p className="text-xl font-bold text-orange-900">{stats.inProgress}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-sm text-green-600">Завершены</p>
              <p className="text-xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-600">Отменены</p>
              <p className="text-xl font-bold text-red-900">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <div className="flex">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'name' | 'phone')}
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name">По имени</option>
                <option value="phone">По телефону</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Введите поисковый запрос..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Все статусы</option>
              <option value="New">Новые</option>
              <option value="In Progress">В работе</option>
              <option value="Completed">Завершены</option>
              <option value="Cancelled">Отменены</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Период
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Все время</option>
              <option value="today">Сегодня</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={filterOrders}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Применить фильтры
            </button>
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

      {/* Create Order Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Создать заявку</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Услуга
                </label>
                <input
                  type="text"
                  name="service"
                  value={createForm.service}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Объект
                </label>
                <input
                  type="text"
                  name="object"
                  value={createForm.object}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Количество
                </label>
                <input
                  type="text"
                  name="count"
                  value={createForm.count}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Опыт
                </label>
                <input
                  type="text"
                  name="experience"
                  value={createForm.experience}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={createForm.phoneNumber}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес
                </label>
                <input
                  type="text"
                  name="address"
                  value={createForm.address}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ожидаемая дата
                </label>
                <input
                  type="date"
                  name="expectDate"
                  value={createForm.expectDate}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Заявки ({filteredOrders.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{order.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Услуга:</span> {order.service}
                    </div>
                    <div>
                      <span className="font-medium">Объект:</span> {order.object}
                    </div>
                    <div>
                      <span className="font-medium">Количество:</span> {order.count}
                    </div>
                    <div>
                      <span className="font-medium">Опыт:</span> {order.experience}
                    </div>
                    <div>
                      <span className="font-medium">Телефон:</span> {order.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Адрес:</span> {order.address}
                    </div>
                    <div>
                      <span className="font-medium">Ожидаемая дата:</span> {order.expectDate}
                    </div>
                    <div>
                      <span className="font-medium">Создано:</span> {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredOrders.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            Заявки не найдены
          </div>
        )}
      </div>
    </div>
  );
}
