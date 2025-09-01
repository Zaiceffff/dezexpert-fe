'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useOrdersState } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Search, Plus, Loader2, Copy, Users, RefreshCw, Calendar, BarChart3 } from 'lucide-react';
import type { Order } from '@/lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'calendar' | 'analytics'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { orders, isLoading, error, fetchOrders } = useOrdersState();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Фильтрация заказов по поиску
  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phoneNumber.includes(searchTerm) ||
    order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Статистика
  const totalOrders = orders.length;
  const newOrders = orders.filter(order => order.status === 'New').length;
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.expectDate).toDateString();
    return orderDate === today;
  }).length;

  // Логирование для отладки
  console.log('Dashboard - Всего заявок:', totalOrders);
  console.log('Dashboard - Новые заявки:', newOrders);
  console.log('Dashboard - Заявки сегодня:', todayOrders);
  console.log('Dashboard - Первые 5 заявок:', orders.slice(0, 5).map(o => ({ id: o.id, name: o.name, status: o.status })));

  const handleAddRequest = () => {
    // TODO: Открыть модал добавления заявки
    console.log('Функция добавления заявки будет доступна позже');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/app`);
    console.log('Персональная ссылка скопирована');
  };

  const getStatusColor = (status: string) => {
    const statusConfig = {
      'New': 'bg-blue-500',
      'Inprogress': 'bg-yellow-500',
      'Done': 'bg-green-500',
      'Denied': 'bg-red-500',
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const statusConfig = {
      'New': 'Новый',
      'Inprogress': 'В работе',
      'Done': 'Завершен',
      'Denied': 'Отменен',
    };
    return statusConfig[status as keyof typeof statusConfig] || status;
  };

  const renderAllRequests = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Input
              placeholder="Поиск по имени, телефону, адресу или услуге..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={handleAddRequest} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Добавить заявку
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адрес
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Объект
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Загрузка заказов...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-red-600">
                    Ошибка загрузки: {error}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Заказы не найдены' : 'Заказы отсутствуют'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                        <span className="ml-2 text-sm text-gray-900">{getStatusText(order.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.expectDate).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.object}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline">Сегодня</Button>
          <div className="flex space-x-2">
            <Button variant="outline">‹</Button>
            <Button variant="outline">›</Button>
          </div>
        </div>
        <Button variant="outline">Календарь</Button>
      </div>
      <div className="text-center text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Календарь заявок будет доступен в следующем обновлении</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Аналитика и отчеты будут доступны в следующем обновлении</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
            <p className="mt-2 text-gray-600">
              Добро пожаловать, {user?.name || 'Пользователь'}! Управляйте своими заявками и аналитикой.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => fetchOrders()} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить ({orders.length})
            </Button>
            <Button onClick={handleCopyLink} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Скопировать персональную ссылку
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего заявок</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ожидающие</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.filter(o => o.status === 'New').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">В работе</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.filter(o => o.status === 'Inprogress').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Все заявки
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Календарь
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Аналитика
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' && renderAllRequests()}
      {activeTab === 'calendar' && renderCalendar()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
}

