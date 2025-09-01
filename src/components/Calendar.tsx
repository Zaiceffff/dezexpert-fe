'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, MapPin, Phone, Clock, User } from 'lucide-react';
import type { Order } from '@/lib/types';

interface CalendarProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  currentDate?: Date;
}

type ViewMode = 'month' | 'week' | 'day';

// Компонент модального окна для отображения заказов на день
function DayOrdersModal({ 
  isOpen, 
  onClose, 
  date, 
  orders, 
  onOrderClick 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  date: Date | null; 
  orders: Order[]; 
  onOrderClick: (order: Order) => void; 
}) {
  if (!isOpen || !date) return null;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Inprogress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Done': return 'bg-green-100 text-green-800 border-green-200';
      case 'Denied': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'New': return 'Новая';
      case 'Inprogress': return 'В работе';
      case 'Done': return 'Завершена';
      case 'Denied': return 'Отклонена';
      default: return status;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Заказы на {formatDate(date)}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Всего заказов: {orders.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Содержимое */}
        <div className="px-8 py-6">
          {orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    onOrderClick(order);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Заголовок заказа */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      {/* Основная информация */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Услуга:</span>
                            <span className="text-gray-900">{order.service}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">Адрес:</span>
                            <span className="text-gray-900">{order.address}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">Телефон:</span>
                            <span className="text-gray-900">{order.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Дата:</span>
                            <span className="text-gray-900">
                              {new Date(order.expectDate).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Комментарии */}
                      {(order.clientComment || order.dezinsectorComment) && (
                        <div className="space-y-2">
                          {order.clientComment && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Комментарий клиента:</span>
                              <p className="text-gray-600 mt-1">{order.clientComment}</p>
                            </div>
                          )}
                          {order.dezinsectorComment && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Комментарий дезинсектора:</span>
                              <p className="text-gray-600 mt-1">{order.dezinsectorComment}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Цены */}
                      {(order.liquidPrice || order.jelPrice || order.realPrice) && (
                        <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                          {order.liquidPrice > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-600">Жидкость:</span>
                              <span className="font-semibold text-green-600 ml-1">{order.liquidPrice} ₽</span>
                            </div>
                          )}
                          {order.jelPrice > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-600">Гель:</span>
                              <span className="font-semibold text-blue-600 ml-1">{order.jelPrice} ₽</span>
                            </div>
                          )}
                          {order.realPrice > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-600">Итого:</span>
                              <span className="font-bold text-gray-900 ml-1">{order.realPrice} ₽</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">На этот день заказов нет</h3>
              <p className="text-gray-500">Выберите другой день или создайте новую заявку</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Calendar({ orders, onOrderClick, currentDate = new Date() }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showDayModal, setShowDayModal] = useState(false);

  // Получаем первый день месяца
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  // Получаем последний день месяца
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  // Получаем день недели первого дня месяца (0 = воскресенье, 1 = понедельник)
  const firstDayWeekday = firstDayOfMonth.getDay();
  // Корректируем для начала недели с понедельника
  const adjustedFirstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

  // Получаем текущую неделю для недельного режима
  const getCurrentWeek = () => {
    const current = new Date();
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Понедельник
    const monday = new Date(current.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(monday.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return week;
  };

  // Генерируем массив дней для месячного режима
  const generateMonthDays = () => {
    const days = [];
    
    // Добавляем дни предыдущего месяца для заполнения первой недели
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    for (let i = adjustedFirstDayWeekday - 1; i >= 0; i--) {
      const day = new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i);
      days.push({ date: day, isCurrentMonth: false, orders: [] });
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayOrders = getOrdersForDate(date);
      days.push({ date, isCurrentMonth: true, orders: dayOrders });
    }
    
    // Добавляем дни следующего месяца для заполнения последней недели
    const remainingDays = 42 - days.length; // 6 недель * 7 дней = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      days.push({ date, isCurrentMonth: false, orders: [] });
    }
    
    return days;
  };

  // Генерируем массив дней для недельного режима
  const generateWeekDays = () => {
    const weekStart = new Date(currentMonth);
    weekStart.setDate(currentMonth.getDate() - currentMonth.getDay() + (currentMonth.getDay() === 0 ? -6 : 1));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOrders = getOrdersForDate(date);
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      days.push({ date, isCurrentMonth, orders: dayOrders });
    }
    
    return days;
  };

  // Генерируем массив дней для дневного режима
  const generateDayView = () => {
    const dayOrders = getOrdersForDate(currentMonth);
    return [{ date: currentMonth, isCurrentMonth: true, orders: dayOrders }];
  };

  // Получаем заявки для конкретной даты
  const getOrdersForDate = (date: Date) => {
    return orders.filter(order => {
      const orderDate = new Date(order.expectDate);
      return orderDate.toDateString() === date.toDateString();
    });
  };

  // Переход к предыдущему периоду
  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentMonth);
      newDate.setDate(currentMonth.getDate() - 7);
      setCurrentMonth(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentMonth);
      newDate.setDate(currentMonth.getDate() - 1);
      setCurrentMonth(newDate);
    }
  };

  // Переход к следующему периоду
  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentMonth);
      newDate.setDate(currentMonth.getDate() + 7);
      setCurrentMonth(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentMonth);
      newDate.setDate(currentMonth.getDate() + 1);
      setCurrentMonth(newDate);
    }
  };

  // Переход к текущему периоду
  const goToCurrent = () => {
    setCurrentMonth(new Date());
  };

  // Форматирование названия месяца
  const getMonthName = (date: Date) => {
    const months = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return months[date.getMonth()];
  };

  // Форматирование года
  const getYear = (date: Date) => date.getFullYear();

  // Форматирование даты для недельного и дневного режима
  const formatDateRange = () => {
    if (viewMode === 'month') {
      return `${getMonthName(currentMonth)} ${getYear(currentMonth)} г.`;
    } else if (viewMode === 'week') {
      const weekDays = generateWeekDays();
      const start = weekDays[0].date;
      const end = weekDays[6].date;
      return `${start.getDate()} ${getMonthName(start)} - ${end.getDate()} ${getMonthName(end)} ${getYear(start)} г.`;
    } else if (viewMode === 'day') {
      return `${currentMonth.getDate()} ${getMonthName(currentMonth)} ${getYear(currentMonth)} г.`;
    }
    return '';
  };

  // Получение названий дней недели
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Генерируем дни в зависимости от режима
  const getCalendarDays = () => {
    switch (viewMode) {
      case 'month':
        return generateMonthDays();
      case 'week':
        return generateWeekDays();
      case 'day':
        return generateDayView();
      default:
        return generateMonthDays();
    }
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Заголовок календаря */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToCurrent}
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm"
            >
              Сегодня
            </Button>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevious}
                className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNext}
                className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xl font-semibold text-gray-800">
              {formatDateRange()}
              {currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear() && (
                <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  🎯 Текущий месяц
                </span>
              )}
              <div className="mt-2 text-sm text-gray-600 font-normal">
                💡 Кликните на любой день для просмотра заказов
              </div>
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'month' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('month')}
              className={viewMode === 'month' ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'border-gray-300 hover:bg-gray-50'}
            >
              Месяц
            </Button>
            <Button 
              variant={viewMode === 'week' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'border-gray-300 hover:bg-gray-50'}
            >
              Неделя
            </Button>
            <Button 
              variant={viewMode === 'day' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('day')}
              className={viewMode === 'day' ? 'bg-blue-600 hover:bg-blue-700 shadow-sm' : 'border-gray-300 hover:bg-gray-50'}
            >
              День
            </Button>
          </div>
        </div>
      </div>

      {/* Календарная сетка */}
      <div className="p-4">
        {viewMode === 'day' ? (
          // Дневной режим
          <div className="max-w-2xl mx-auto">
            <div className={`rounded-lg p-6 ${
              currentMonth.toDateString() === new Date().toDateString()
                ? 'bg-green-50 border-2 border-green-500 shadow-lg'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="text-center mb-4">
                <div className={`text-2xl font-bold ${
                  currentMonth.toDateString() === new Date().toDateString()
                    ? 'text-green-800'
                    : 'text-blue-800'
                }`}>
                  {currentMonth.getDate()} {getMonthName(currentMonth)}
                </div>
                <div className={`text-lg ${
                  currentMonth.toDateString() === new Date().toDateString()
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`}>
                  {getYear(currentMonth)} г.
                </div>
              </div>
              
              <div className="space-y-3">
                {calendarDays[0]?.orders.length > 0 ? (
                  calendarDays[0].orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onOrderClick(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{order.name}</div>
                          <div className="text-sm text-gray-600">{order.service}</div>
                          <div className="text-sm text-gray-500">{order.address}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>На этот день заявок нет</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Месячный и недельный режим
          <div className="grid grid-cols-7 gap-1">
            {/* Заголовки дней недели */}
            {weekdays.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
            
            {/* Дни календаря */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[130px] p-3 border transition-all duration-200 rounded-lg ${
                  day.isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50'
                } ${
                  selectedDate && day.date.toDateString() === selectedDate.toDateString()
                    ? 'ring-2 ring-blue-400 ring-opacity-60 shadow-md border-blue-300'
                    : day.date.toDateString() === new Date().toDateString()
                    ? 'border-2 border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-100 hover:border-blue-200'
                }`}
                onClick={() => {
                  setSelectedDate(day.date);
                  setShowDayModal(true);
                }}
              >
                {/* Номер дня */}
                <div className={`text-sm font-medium mb-3 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  day.date.toDateString() === new Date().toDateString() 
                    ? 'text-green-700 font-bold text-lg bg-green-200 rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                    : ''
                }`}>
                  {day.date.getDate()}
                </div>
                
                {/* Заявки на этот день */}
                <div className="space-y-1.5">
                  {day.orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-2 text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-md cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all duration-200 font-medium shadow-sm border border-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderClick(order);
                      }}
                      title={`${order.name} - ${order.service}`}
                    >
                      {order.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Легенда */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full border border-blue-200"></div>
            <span>Заявка</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full border border-gray-200"></div>
            <span>Текущий месяц</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-50 rounded-full border border-gray-200"></div>
            <span>Другие месяцы</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-50 rounded-full border-2 border-green-500"></div>
            <span>Сегодня</span>
          </div>
        </div>
      </div>

      {/* Модальное окно с заказами на день */}
      <DayOrdersModal
        isOpen={showDayModal}
        onClose={() => setShowDayModal(false)}
        date={selectedDate}
        orders={selectedDate ? getOrdersForDate(selectedDate) : []}
        onOrderClick={onOrderClick}
      />
    </div>
  );
}
