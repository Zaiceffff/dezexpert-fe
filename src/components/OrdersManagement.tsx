import React, { useState, useMemo } from 'react';
import { useOrdersState } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Pagination } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Package, Edit, MapPin, Phone, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar } from 'lucide-react';

import type { Order } from '@/lib/api';

export const OrdersManagement: React.FC = () => {
  const { 
    orders, 
    isLoading, 
    error, 
    fetchOrders, 
    updateOrder, 
    getOrderById,
    totalOrders,
    currentPage,
    itemsPerPage,
    setPage,
    setPageSize,
    resetPagination
  } = useOrdersState();
  
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce поиска
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Сброс страницы при изменении поиска
  React.useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      resetPagination();
    }
  }, [debouncedSearch, searchTerm, resetPagination]);

  // Загрузка заказов при изменении параметров
  React.useEffect(() => {
    fetchOrders({ 
      page: currentPage,
      pageSize: itemsPerPage,
      search: debouncedSearch
    });
  }, [fetchOrders, currentPage, itemsPerPage, debouncedSearch]);

  // Обработчик поиска
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    resetPagination();
  };

  // Обработчик смены страницы
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setPage(newPage);
  };

  // Обработчик изменения размера страницы
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // Вычисляем количество страниц на основе общего количества заказов
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const handleUpdateOrder = async (id: string, data: {
    service?: string;
    object?: string;
    count?: string;
    experience?: string;
    address?: string;
    name?: string;
    status?: 'New' | 'Inprogress' | 'Done' | 'Denied';
    clientComment?: string;
    dezinsectorComment?: string;
    realPrice?: number;
  }) => {
    try {
      await updateOrder(id, data);
      setEditingOrder(null);
      toast.success('Заказ успешно обновлен!');
    } catch (error) {
      toast.error('Ошибка обновления заказа');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'New': { label: 'Новый', variant: 'default' as const },
      'Inprogress': { label: 'В работе', variant: 'secondary' as const },
      'Done': { label: 'Завершен', variant: 'default' as const },
      'Denied': { label: 'Отменен', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Ошибка загрузки заказов</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => fetchOrders()} variant="outline">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
          <p className="text-gray-600">Просмотр и управление всеми заказами</p>
        </div>
      </div>

      {/* Поиск */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Поиск по имени, телефону или адресу..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Селектор размера страницы */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Показывать по:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Показано {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalOrders)} из {totalOrders}
        </div>
      </div>

      {/* Таблица заказов */}
      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Всего заказов: {totalOrders}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Заказы не найдены" : "Заказы отсутствуют"}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Услуга</TableHead>
                      <TableHead>Объект</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.name}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Phone className="h-3 w-3" />
                              {order.phoneNumber}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {order.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>{order.object}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {order.realPrice ? (
                            <span className="font-medium">{order.realPrice} ₽</span>
                          ) : (
                            <span className="text-gray-500">{order.jelPrice} ₽ (гель)</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(order.expectDate).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingOrder(order)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Изменить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalOrders}
                    showPageSizeSelector={false}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно редактирования */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Редактировать заказ</CardTitle>
              <CardDescription>
                Измените информацию о заказе для клиента {editingOrder.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Статус
                    </label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        status: e.target.value as 'New' | 'Inprogress' | 'Done' | 'Denied'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="New">Новый</option>
                      <option value="Inprogress">В работе</option>
                      <option value="Done">Завершен</option>
                      <option value="Denied">Отменен</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Реальная цена (₽)
                    </label>
                    <input
                      type="number"
                      value={editingOrder.realPrice || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        realPrice: e.target.value ? Number(e.target.value) : 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите цену"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий дезинсектора
                  </label>
                  <textarea
                    value={editingOrder.dezinsectorComment || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      dezinsectorComment: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Введите комментарий"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingOrder(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={() => handleUpdateOrder(editingOrder.id, {
                      status: editingOrder.status,
                      realPrice: editingOrder.realPrice,
                      dezinsectorComment: editingOrder.dezinsectorComment
                    })}
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
