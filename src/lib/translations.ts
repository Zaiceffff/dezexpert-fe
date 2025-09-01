// src/lib/translations.ts — централизованные функции перевода

// Перевод статусов заказов
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'New': return 'Новый';
    case 'Inprogress': return 'В работе';
    case 'InProgress': return 'В работе';
    case 'Done': return 'Завершен';
    case 'Denied': return 'Отменен';
    case 'success': return 'Успешно';
    case 'error': return 'Ошибка';
    case 'pending': return 'В ожидании';
    default: return status;
  }
};

// Перевод типов вредителей
export const getPestText = (pestType: string): string => {
  switch (pestType) {
    case 'tarakany':
    case 'cockroaches': return 'Тараканы';
    case 'klopy':
    case 'bedbugs': return 'Клопы';
    case 'muravi':
    case 'ants': return 'Муравьи';
    case 'gryzuny':
    case 'rodents': return 'Грызуны';
    case 'bleshi':
    case 'fleas': return 'Блохи';
    case 'kleshchi':
    case 'ticks': return 'Клещи';
    case 'plesen':
    case 'mold': return 'Плесень';
    case 'mukhi':
    case 'flies': return 'Мухи';
    default: return pestType;
  }
};

// Перевод типов объектов
export const getObjectText = (objectType: string): string => {
  switch (objectType) {
    case 'apartment':
    case 'kvartira': return 'Квартира';
    case 'apartment1': return '1 комнатная квартира';
    case 'apartment2': return '2 комнатная квартира';
    case 'apartment3': return '3 комнатная квартира';
    case 'apartment4': return '4+ комнатная квартира';
    case 'house':
    case 'dom': return 'Дом';
    case 'plot':
    case 'uchastok': return 'Участок';
    case 'commercial':
    case 'kommercheskiy': return 'Коммерческий объект';
    default: return objectType;
  }
};

// Перевод типов услуг
export const getServiceText = (service: string): string => {
  switch (service) {
    case 'cockroaches': return 'Тараканы';
    case 'bedbugs': return 'Клопы';
    case 'flies': return 'Мухи';
    case 'ticks': return 'Клещи';
    case 'ants': return 'Муравьи';
    case 'rodents': return 'Грызуны';
    case 'fleas': return 'Блохи';
    case 'mold': return 'Плесень';
    default: return service;
  }
};

// Цвета для статусов
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'New': return '#10B981'; // green-500
    case 'Inprogress':
    case 'InProgress': return '#F59E0B'; // amber-500
    case 'Done': return '#3B82F6'; // blue-500
    case 'Denied': return '#EF4444'; // red-500
    case 'success': return '#10B981'; // green-500
    case 'error': return '#EF4444'; // red-500
    case 'pending': return '#F59E0B'; // amber-500
    default: return '#6B7280'; // gray-500
  }
};
