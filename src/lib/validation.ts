// src/lib/validation.ts — централизованные функции валидации

// Валидация телефона
export const isValidPhone = (phone: string): boolean => {
  // Убираем все символы кроме цифр и +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Проверяем формат: +7XXXXXXXXXX или 8XXXXXXXXXX
  const phoneRegex = /^(\+7|8)\d{10}$/;
  
  return phoneRegex.test(cleanPhone);
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  // Минимум 6 символов, хотя бы одна буква и одна цифра
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Валидация имени
export const isValidName = (name: string): boolean => {
  // Минимум 2 символа, только буквы, пробелы и дефисы
  const nameRegex = /^[А-Яа-яA-Za-z\s-]{2,}$/;
  return nameRegex.test(name.trim());
};

// Валидация адреса
export const isValidAddress = (address: string): boolean => {
  // Минимум 3 символа
  return address.trim().length >= 3;
};

// Валидация цены
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0 && price <= 100000;
};

// Валидация даты
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
};

// Валидация количества комнат
export const isValidRooms = (rooms: number): boolean => {
  return typeof rooms === 'number' && rooms >= 1 && rooms <= 10;
};

// Валидация CSRF токена
export const isValidCsrfToken = (token: string): boolean => {
  return typeof token === 'string' && token.length >= 32;
};

// Валидация UUID
export const isValidUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Валидация статуса заказа
export const isValidOrderStatus = (status: string): boolean => {
  const validStatuses = ['New', 'Inprogress', 'InProgress', 'Done', 'Denied'];
  return validStatuses.includes(status);
};

// Валидация типа вредителя
export const isValidPestType = (pestType: string): boolean => {
  const validPestTypes = [
    'tarakany', 'cockroaches',
    'klopy', 'bedbugs',
    'muravi', 'ants',
    'gryzuny', 'rodents',
    'bleshi', 'fleas',
    'kleshchi', 'ticks',
    'plesen', 'mold',
    'mukhi', 'flies'
  ];
  return validPestTypes.includes(pestType);
};

// Валидация типа объекта
export const isValidObjectType = (objectType: string): boolean => {
  const validObjectTypes = [
    'apartment', 'kvartira',
    'apartment1', 'apartment2', 'apartment3', 'apartment4',
    'house', 'dom',
    'plot', 'uchastok',
    'commercial', 'kommercheskiy'
  ];
  return validObjectTypes.includes(objectType);
};
