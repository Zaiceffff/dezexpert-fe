'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { X, Phone, Edit, Save, MapPin, User, Bug, Building, Clock, MessageSquare, RussianRuble, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/config';
import type { Order } from '@/lib/types';

import { getStatusText, getServiceText, getObjectText } from '@/lib/translations';

// Функция для перевода количества
const getCountText = (count: string) => {
  const countMap: Record<string, string> = {
    'rare': 'Редко встречаются',
    'sometimes': 'Иногда встречаются',
    'often': 'Часто встречаются',
    'very_often': 'Очень часто встречаются',
    'infested': 'Сильно заражены'
  };
  return countMap[count] || count;
};

// Функция для перевода опыта
const getExperienceText = (experience: string) => {
  const experienceMap: Record<string, string> = {
    'no': 'Нет, не травил',
    'yes': 'Да, травил',
    'partial': 'Частично травил'
  };
  return experienceMap[experience] || experience;
};

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderUpdate?: (updatedOrder: Order) => void;
  authToken?: string; // Добавляем токен через props
}

interface EditFormData {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  name: string;
  status: string;
  clientComment: string;
  dezinsectorComment: string;
  realPrice: number;
  phoneNumber: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ isOpen, onClose, order, onOrderUpdate, authToken }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Функция для закрытия модального окна с сбросом состояния
  const handleClose = () => {
    setIsEditing(false);
    setEditFormData(null);
    onClose();
  };

  // Логируем токен при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      console.log('OrderDetails: Модальное окно открыто');
      console.log('OrderDetails: authToken из props:', !!authToken);
      if (authToken) {
        console.log('OrderDetails: Токен (первые 20 символов):', authToken.substring(0, 20) + '...');
      } else {
        console.log('OrderDetails: authToken не передан в props');
      }
      
      // Проверяем localStorage
      const localToken = localStorage.getItem('auth_token');
      console.log('OrderDetails: Токен в localStorage (auth_token):', !!localToken);
      if (localToken) {
        console.log('OrderDetails: localStorage токен (первые 20 символов):', localToken.substring(0, 20) + '...');
      }
      
      // Проверяем все возможные ключи токена
      const allTokens = {
        'auth_token': localStorage.getItem('auth_token'),
        'token': localStorage.getItem('token'),
        'authToken': localStorage.getItem('authToken'),
        'accessToken': localStorage.getItem('accessToken'),
        'jwt': localStorage.getItem('jwt')
      };
      console.log('OrderDetails: Все токены в localStorage:', allTokens);
      
      // Сбрасываем состояние редактирования при открытии новой заявки
      setIsEditing(false);
      setEditFormData(null);
    }
  }, [isOpen, authToken, order?.id]);

  if (!isOpen || !order) return null;

  const handleCall = () => {
    if (order.phoneNumber) {
      window.open(`tel:${order.phoneNumber}`, '_self');
    } else {
      toast.error('Номер телефона не указан');
    }
  };

  const handleEdit = () => {
    setEditFormData({
      service: order.service,
      object: order.object,
      count: order.count,
      experience: order.experience,
      address: order.address,
      name: order.name,
      status: order.status,
      clientComment: order.clientComment || '',
      dezinsectorComment: order.dezinsectorComment || '',
      realPrice: order.realPrice || 0,
      phoneNumber: order.phoneNumber || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editFormData) return;

    setIsSaving(true);
    try {
      console.log('handleSave: Отправляем данные:', editFormData);
      console.log('handleSave: ID заявки:', order.id);
      
      // Получаем токен
      console.log('handleSave: Получаем токен...');
      console.log('handleSave: authToken из props:', !!authToken);
      if (authToken) {
        console.log('handleSave: authToken из props (первые 20 символов):', authToken.substring(0, 20) + '...');
      }
      
      const token = await getAuthToken();
      
      console.log('handleSave: Токен найден:', !!token);
      if (token) {
        console.log('handleSave: Токен (первые 20 символов):', token.substring(0, 20) + '...');
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Добавляем токен, если он есть
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('handleSave: Добавляем токен в заголовки');
      } else {
        console.warn('handleSave: Токен не найден! Возможно, нужно войти в систему.');
        toast.error('Требуется авторизация. Пожалуйста, войдите в систему.');
        return;
      }
      
      console.log('handleSave: Заголовки запроса:', headers);
      
      const url = `${getApiUrl('/order/by-id')}/${order.id}`;
      console.log('handleSave: Отправляем запрос на:', url);
        
      const requestBody = JSON.stringify(editFormData);
      console.log('handleSave: Метод запроса: PATCH');
      console.log('handleSave: Тело запроса:', requestBody);
        
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: requestBody
      });

      console.log('handleSave: Статус ответа:', response.status);
      console.log('handleSave: Заголовки ответа:', response.headers);

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log('handleSave: Успешный ответ:', updatedOrder);
        toast.success('Заявка успешно обновлена!');
        setIsEditing(false);
        
        // Обновляем список заявок в родительском компоненте
        if (onOrderUpdate) {
          console.log('handleSave: Вызываем onOrderUpdate для обновления списка');
          onOrderUpdate(updatedOrder);
        } else {
          console.log('handleSave: onOrderUpdate не передан, список не обновится');
        }
        
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('handleSave: Ошибка API:', errorText);
        throw new Error(`Ошибка при обновлении заявки: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('handleSave: Ошибка при обновлении заявки:', error);
      toast.error(`Не удалось обновить заявку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  // Функция для быстрого изменения статуса
  const handleQuickStatusChange = async (newStatus: string) => {
    console.log('handleQuickStatusChange: Начинаем изменение статуса', { newStatus, currentStatus: order?.status });
    
    if (!order || newStatus === order.status) {
      console.log('handleQuickStatusChange: Статус не изменился или заказ отсутствует');
      return;
    }

    setIsChangingStatus(true);
    try {
      const token = await getAuthToken();
      
      if (!token) {
        toast.error('Требуется авторизация');
        return;
      }

      const url = `${getApiUrl('/order/by-id')}/${order.id}`;
      console.log('handleQuickStatusChange: Отправляем запрос на', url);
      console.log('handleQuickStatusChange: Тело запроса:', { status: newStatus });
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('handleQuickStatusChange: Ответ получен:', response.status, response.statusText);

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log('handleQuickStatusChange: Заказ обновлен:', updatedOrder);
        toast.success(`Статус изменен на: ${getStatusText(newStatus)}`);
        
        // Обновляем editFormData, если форма редактирования открыта
        if (isEditing && editFormData) {
          setEditFormData(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        // Обновляем список заявок в родительском компоненте
        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }
      } else {
        const errorText = await response.text();
        console.error('handleQuickStatusChange: Ошибка API:', errorText);
        throw new Error(`Ошибка при изменении статуса: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('handleQuickStatusChange: Ошибка при изменении статуса:', error);
      toast.error(`Не удалось изменить статус: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleInputChange = (field: keyof EditFormData, value: string | number) => {
    if (editFormData) {
      setEditFormData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Функция для получения токена
  const getAuthToken = async (): Promise<string | null> => {
    try {
      console.log('getAuthToken: Начинаем поиск токена...');
      
      // Сначала проверяем токен из props
      if (authToken) {
        console.log('getAuthToken: Токен найден в props');
        return authToken;
      }
      
      console.log('getAuthToken: Токен в props не найден, проверяем localStorage...');
      
      // Затем пробуем получить токен из localStorage
      console.log('getAuthToken: Проверяем localStorage...');
      console.log('getAuthToken: auth_token:', !!localStorage.getItem('auth_token'));
      console.log('getAuthToken: token:', !!localStorage.getItem('token'));
      console.log('getAuthToken: authToken:', !!localStorage.getItem('authToken'));
      console.log('getAuthToken: accessToken:', !!localStorage.getItem('accessToken'));
      console.log('getAuthToken: jwt:', !!localStorage.getItem('jwt'));
      
      // Приоритет: auth_token (как в dashboard), затем остальные
      const token = localStorage.getItem('auth_token') || // Проверяем auth_token первым
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('token') ||
                  localStorage.getItem('authToken') ||
                  sessionStorage.getItem('authToken') ||
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('accessToken') ||
                  localStorage.getItem('jwt') ||
                  sessionStorage.getItem('jwt');
      
      if (token) {
        console.log('getAuthToken: Токен найден в localStorage');
        return token;
      }
      
      console.log('getAuthToken: Токен в localStorage не найден');
      
      // Если токена нет, пробуем получить через API без credentials
      console.log('getAuthToken: Токен не найден, пробуем получить через API...');
      
      // Попробуем получить профиль пользователя (может быть доступен без токена)
      const profileResponse = await fetch(`${getApiUrl('/user/profile')}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileInfo = await profileResponse.json();
        console.log('getAuthToken: Информация о профиле:', profileInfo);
        
        // Если профиль получен, возможно токен в заголовках или cookies
        console.log('getAuthToken: Профиль получен, но токен не найден в ответе');
      }
      
      console.log('getAuthToken: Не удалось получить токен');
      return null;
      
    } catch (error) {
      console.error('getAuthToken: Ошибка при получении токена:', error);
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
          <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Детали заказа</h2>
              <p className="text-gray-600">Информация о заявке клиента</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {isEditing && editFormData ? (
            // Форма редактирования
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Имя клиента</Label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Введите имя клиента"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Телефон</Label>
                    <Input
                      value={editFormData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Телефон клиента"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Адрес</Label>
                    <Input
                      value={editFormData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Введите адрес"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Тип услуги</Label>
                    <Select value={editFormData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип услуги" />
                      </SelectTrigger>
                      <SelectContent className="select-content-fixed">
                        <SelectItem value="cockroaches" className="select-item-fixed">Тараканы</SelectItem>
                        <SelectItem value="bedbugs" className="select-item-fixed">Клопы</SelectItem>
                        <SelectItem value="flies" className="select-item-fixed">Мухи</SelectItem>
                        <SelectItem value="ticks" className="select-item-fixed">Клещи</SelectItem>
                        <SelectItem value="mice" className="select-item-fixed">Мыши</SelectItem>
                        <SelectItem value="rats" className="select-item-fixed">Крысы</SelectItem>
                        <SelectItem value="ants" className="select-item-fixed">Муравьи</SelectItem>
                        <SelectItem value="wasps" className="select-item-fixed">Осы</SelectItem>
                        <SelectItem value="hornets" className="select-item-fixed">Шершни</SelectItem>
                        <SelectItem value="other" className="select-item-fixed">Другие насекомые</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Тип объекта</Label>
                    <Select value={editFormData.object} onValueChange={(value) => handleInputChange('object', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип объекта" />
                      </SelectTrigger>
                      <SelectContent className="select-content-fixed">
                        <SelectItem value="apartment1" className="select-item-fixed">1 комнатная квартира</SelectItem>
                        <SelectItem value="apartment2" className="select-item-fixed">2 комнатная квартира</SelectItem>
                        <SelectItem value="apartment3" className="select-item-fixed">3 комнатная квартира</SelectItem>
                        <SelectItem value="apartment4" className="select-item-fixed">4+ комнатная квартира</SelectItem>
                        <SelectItem value="house" className="select-item-fixed">Частный дом</SelectItem>
                        <SelectItem value="dacha" className="select-item-fixed">Дача</SelectItem>
                        <SelectItem value="plot" className="select-item-fixed">Участок</SelectItem>
                        <SelectItem value="office" className="select-item-fixed">Офис</SelectItem>
                        <SelectItem value="shop" className="select-item-fixed">Магазин</SelectItem>
                        <SelectItem value="restaurant" className="select-item-fixed">Ресторан</SelectItem>
                        <SelectItem value="warehouse" className="select-item-fixed">Склад</SelectItem>
                        <SelectItem value="production" className="select-item-fixed">Производство</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Количество вредителей</Label>
                    <Select value={editFormData.count} onValueChange={(value) => handleInputChange('count', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent className="select-content-fixed">
                        <SelectItem value="rare" className="select-item-fixed">Редко встречаются</SelectItem>
                        <SelectItem value="sometimes" className="select-item-fixed">Иногда встречаются</SelectItem>
                        <SelectItem value="often" className="select-item-fixed">Часто встречаются</SelectItem>
                        <SelectItem value="very_often" className="select-item-fixed">Очень часто встречаются</SelectItem>
                        <SelectItem value="infested" className="select-item-fixed">Сильно заражены</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Опыт обработки</Label>
                    <Select value={editFormData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите опыт" />
                      </SelectTrigger>
                      <SelectContent className="select-content-fixed">
                        <SelectItem value="no" className="select-item-fixed">Нет, не травил</SelectItem>
                        <SelectItem value="yes" className="select-item-fixed">Да, травил</SelectItem>
                        <SelectItem value="partial" className="select-item-fixed">Частично травил</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Статус заявки</Label>
                    <Select value={editFormData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent className="select-content-fixed">
                        <SelectItem value="New" className="select-item-fixed">Новый</SelectItem>
                        <SelectItem value="Inprogress" className="select-item-fixed">В работе</SelectItem>
                        <SelectItem value="Done" className="select-item-fixed">Завершен</SelectItem>
                        <SelectItem value="Denied" className="select-item-fixed">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Финальная цена (₽)</Label>
                    <Input
                      type="number"
                      value={editFormData.realPrice}
                      onChange={(e) => handleInputChange('realPrice', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Комментарий клиента</Label>
                    <Textarea
                      value={editFormData.clientComment}
                      onChange={(e) => handleInputChange('clientComment', e.target.value)}
                      placeholder="Комментарий клиента"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">Комментарий дезинсектора</Label>
                    <Textarea
                      value={editFormData.dezinsectorComment}
                      onChange={(e) => handleInputChange('dezinsectorComment', e.target.value)}
                      placeholder="Ваш комментарий"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Просмотр деталей
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">Информация о клиенте</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-blue-700">Имя:</span>
                          <span className="ml-2 text-sm text-blue-900">{order.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-blue-700">Телефон:</span>
                          <span className="ml-2 text-sm text-blue-900">{order.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-blue-700">Адрес:</span>
                          <span className="ml-2 text-sm text-blue-900">{order.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Bug className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-900">Детали услуги</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Bug className="h-4 w-4 text-green-500" />
                        <div>
                          <span className="text-sm font-medium text-green-700">Сервис:</span>
                          <span className="ml-2 text-sm text-green-900">{getServiceText(order.service)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-green-500" />
                        <div>
                          <span className="text-sm font-medium text-green-700">Объект:</span>
                          <span className="ml-2 text-sm text-green-900">{getObjectText(order.object)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-4 w-4 text-green-500">📊</span>
                        <div>
                          <span className="text-sm font-medium text-green-700">Количество:</span>
                          <span className="ml-2 text-sm text-green-900">{getCountText(order.count)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-4 w-4 text-green-500">🎯</span>
                        <div>
                          <span className="text-sm font-medium text-green-700">Опыт:</span>
                          <span className="ml-2 text-sm text-green-900">{getExperienceText(order.experience)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-purple-900">Временные рамки</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-purple-700">Ожидаемая дата:</span>
                          <span className="ml-2 text-sm text-purple-900">{formatDate(order.expectDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-purple-700">Дата создания:</span>
                          <span className="ml-2 text-sm text-purple-900">{formatDateTime(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-4 w-4 text-purple-500">📊</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-purple-700">Статус:</span>
                          <Select 
                            value={order.status} 
                            onValueChange={handleQuickStatusChange}
                            disabled={isChangingStatus}
                          >
                            <SelectTrigger className="w-32 h-7 text-xs border-purple-200 bg-purple-50 hover:bg-purple-100">
                              <SelectValue>
                                {isChangingStatus ? (
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                                    <span>...</span>
                                  </div>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                    {getStatusText(order.status)}
                                  </span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="select-content-fixed">
                              <SelectItem value="New" className="select-item-fixed">
                                Новый
                              </SelectItem>
                              <SelectItem value="Inprogress" className="select-item-fixed">
                                В работе
                              </SelectItem>
                              <SelectItem value="Done" className="select-item-fixed">
                                Завершен
                              </SelectItem>
                              <SelectItem value="Denied" className="select-item-fixed">
                                Отменен
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.realPrice && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <RussianRuble className="h-5 w-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-900">Финансовая информация</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <RussianRuble className="h-4 w-4 text-amber-500" />
                          <div>
                            <span className="text-sm font-medium text-amber-700">Финальная цена:</span>
                            <span className="ml-2 text-lg font-bold text-amber-900">{order.realPrice} ₽</span>
                          </div>
                        </div>
                        {order.liquidPrice && order.liquidPrice > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="h-4 w-4 text-amber-500">💧</span>
                            <div>
                              <span className="text-sm font-medium text-amber-700">Жидкость:</span>
                              <span className="ml-2 text-sm text-amber-900">{order.liquidPrice} ₽</span>
                            </div>
                          </div>
                        )}
                        {order.jelPrice && order.jelPrice > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="h-4 w-4 text-amber-500">🧴</span>
                            <div>
                              <span className="text-sm font-medium text-amber-700">Гель:</span>
                              <span className="ml-2 text-sm text-amber-900">{order.jelPrice} ₽</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Комментарии */}
                  {(order.clientComment || order.dezinsectorComment) && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Комментарии</h3>
                      </div>
                      <div className="space-y-3">
                        {order.clientComment && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Клиент:</span>
                            <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">{order.clientComment}</p>
                          </div>
                        )}
                        {order.dezinsectorComment && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">Дезинсектор:</span>
                            <p className="text-sm text-gray-900 mt-1 bg-white p-2 rounded border">{order.dezinsectorComment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCall}
              className="flex items-center gap-2 px-4 py-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Phone className="h-4 w-4" />
              Позвонить
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
