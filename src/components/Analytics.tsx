'use client';

import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Download,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order } from '@/lib/types';
import { getStatusText, getStatusColor } from '@/lib/translations';

interface AnalyticsProps {
  orders: Order[];
  userProfile: unknown;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  orders: number;
  revenue: number;
}

export function Analytics({ orders, userProfile }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState('30');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Фильтрация заявок по выбранным параметрам
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Фильтр по дате
    const now = new Date();
    const daysAgo = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
    
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= daysAgo;
    });

    // Фильтр по услуге
    if (selectedService !== 'all') {
      filtered = filtered.filter(order => order.service === selectedService);
    }

    // Фильтр по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    return filtered;
  }, [orders, dateRange, selectedService, selectedStatus]);

  // Статистика по статусам
  const statusStats = useMemo(() => {
    const stats = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, { /* TODO: implement */ } as Record<string, number>);

    return Object.entries(stats).map(([status, count]) => ({
      name: getStatusText(status),
      value: count,
      color: getStatusColor(status)
    }));
  }, [filteredOrders]);

  // Статистика по услугам
  const serviceStats = useMemo(() => {
    const stats = filteredOrders.reduce((acc, order) => {
      acc[order.service] = (acc[order.service] || 0) + 1;
      return acc;
    }, { /* TODO: implement */ } as Record<string, number>);

    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({
        name: service,
        value: count,
        color: getRandomColor(service)
      }));
  }, [filteredOrders]);

  // Статистика по объектам
  const objectStats = useMemo(() => {
    const stats = filteredOrders.reduce((acc, order) => {
      acc[order.object] = (acc[order.object] || 0) + 1;
      return acc;
    }, { /* TODO: implement */ } as Record<string, number>);

    return Object.entries(stats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([object, count]) => ({
        name: object,
        value: count,
        color: getRandomColor(object)
      }));
  }, [filteredOrders]);

  // Временной ряд заявок
  const timeSeriesData = useMemo(() => {
    const days = parseInt(dateRange);
    const data: TimeSeriesData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = order.createdAt.split('T')[0];
        return orderDate === dateStr;
      });

      data.push({
        date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.realPrice || 0), 0)
      });
    }

    return data;
  }, [filteredOrders, dateRange]);

  // Общая статистика
  const totalStats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.realPrice || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = filteredOrders.filter(order => order.status === 'Done').length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      completionRate
    };
  }, [filteredOrders]);

  function getRandomColor(seed: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    const index = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  // Экспорт данных
  const exportData = () => {
    const csvContent = [
      ['Дата', 'Услуга', 'Объект', 'Статус', 'Клиент', 'Телефон', 'Адрес', 'Цена'],
      ...filteredOrders.map(order => [
        new Date(order.createdAt).toLocaleDateString('ru-RU'),
        order.service,
        order.object,
        getStatusText(order.status),
        order.name,
        order.phoneNumber,
        order.address,
        order.realPrice || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="dateRange">Период</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Последние 7 дней</SelectItem>
                <SelectItem value="30">Последние 30 дней</SelectItem>
                <SelectItem value="90">Последние 90 дней</SelectItem>
                <SelectItem value="365">Последний год</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="service">Услуга</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все услуги</SelectItem>
                {Array.from(new Set(orders.map(o => o.service))).map(service => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="status">Статус</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="New">Новые</SelectItem>
                <SelectItem value="InProgress">В работе</SelectItem>
                <SelectItem value="Done">Завершены</SelectItem>
                <SelectItem value="Cancelled">Отменены</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={exportData} variant="outline" className="flex-shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего заявок</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalRevenue.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.avgOrderValue.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Выполнено</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График по статусам */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Заявки по статусам</h3>
          <div className="space-y-3">
            {statusStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{item.value}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(item.value / totalStats.totalOrders) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* График по услугам */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные услуги</h3>
          <div className="space-y-3">
            {serviceStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{item.value}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(item.value / totalStats.totalOrders) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Временной ряд */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика заявок по дням</h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {timeSeriesData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-2">{item.date}</div>
                <div className="w-8 bg-blue-100 rounded-t-sm" style={{ height: `${Math.max(item.orders * 10, 20)}px` }}>
                  <div 
                    className="w-full bg-blue-600 rounded-t-sm" 
                    style={{ height: `${Math.max(item.orders * 10, 20)}px` }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-700 mt-1">{item.orders}</div>
                <div className="text-xs text-gray-500">{item.revenue} ₽</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Статистика по объектам */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Типы объектов</h3>
          <div className="space-y-3">
            {objectStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{item.value}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(item.value / totalStats.totalOrders) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* География */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">География заявок</h3>
          <div className="space-y-3">
            {Array.from(new Set(filteredOrders.map(o => o.address)))
              .slice(0, 5)
              .map((address, index) => {
                const count = filteredOrders.filter(o => o.address === address).length;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-32">
                        {address}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
