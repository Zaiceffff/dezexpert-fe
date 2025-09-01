# Примеры использования API - DezExpert Pro

## 🔐 Аутентификация

### Вход в систему
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.status === 201) {
      const data = await response.json();
      
      // Сохраняем токены
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.profile));
      
      return data.profile;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
};

// Использование
const user = await login('user@example.com', 'password123');
```

### Регистрация
```javascript
const register = async (userData) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (response.status === 201) {
      return { success: true, message: 'Пользователь успешно зарегистрирован' };
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

// Использование
const newUser = await register({
  name: 'Иван',
  surname: 'Иванов',
  email: 'newuser@example.com',
  phone: '87515000000',
  password: 'Abc$12345'
});
```

### Обновление токена
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Refresh token не найден');
    }
    
    const response = await fetch('http://195.200.17.116:3000/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Обновляем токены
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      return data.accessToken;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    throw error;
  }
};

// Использование
const newAccessToken = await refreshToken();

## 📊 Работа с лидами

### Получение списка лидов
```javascript
const getLeads = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Обязательные параметры
    params.append('partnerId', filters.partnerId);
    
    // Опциональные параметры
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await fetch(`/api/leads?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения лидов:', error);
    throw error;
  }
};

// Примеры использования
const allLeads = await getLeads({ partnerId: '123' });
const newLeads = await getLeads({ 
  partnerId: '123', 
  status: 'new', 
  limit: 10 
});
const searchResults = await getLeads({ 
  partnerId: '123', 
  search: 'Иван' 
});
```

### Создание нового лида
```javascript
const createLead = async (leadData) => {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка создания лида');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка создания лида:', error);
    throw error;
  }
};

// Пример создания лида
const newLead = await createLead({
  partnerId: '123',
  name: 'Петр Петров',
  phone: '+79001234567',
  address: 'ул. Ленина, 10, кв. 5',
  pestType: 'cockroaches',
  objectType: 'apartment',
  rooms: '2',
  infestation: 'medium',
  previousTreatment: 'none',
  expectedDate: '2024-01-20',
  clientComment: 'Срочно нужно обработать кухню',
  approxPrice: 3500
});
```

### Обновление лида
```javascript
const updateLead = async (leadId, updateData) => {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка обновления лида');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка обновления лида:', error);
    throw error;
  }
};

// Пример обновления
const updatedLead = await updateLead('lead123', {
  status: 'in_progress',
  clientComment: 'Клиент подтвердил время обработки'
});
```

### Удаление лида
```javascript
const deleteLead = async (leadId) => {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка удаления лида');
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка удаления лида:', error);
    throw error;
  }
};

// Использование
await deleteLead('lead123');
```

## 🛒 Работа с заказами

### Получение списка заказов
```javascript
const getOrders = async (skipPages = 0, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('skipPages', skipPages.toString());
    params.append('pageSize', pageSize.toString());
    
    const response = await fetch(`http://195.200.17.116:3000/order/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    throw error;
  }
};

// Примеры использования
const firstPage = await getOrders(0, 10);
const secondPage = await getOrders(1, 20);
console.log(`Всего заказов: ${firstPage.count}`);

// Работа с конкретным заказом
firstPage.data.forEach(order => {
  console.log(`Заказ ${order.id}:`);
  console.log(`  Клиент: ${order.name}`);
  console.log(`  Услуга: ${order.service}`);
  console.log(`  Объект: ${order.object}`);
  console.log(`  Статус: ${order.status}`);
  console.log(`  Цена: ${order.realPrice || `Жидкость: ${order.liquidPrice}₽, Гель: ${order.jelPrice}₽`}`);
  console.log(`  Дата: ${order.expectDate}`);
  if (order.clientComment) {
    console.log(`  Комментарий клиента: ${order.clientComment}`);
  }
});
```

### Создание заказа
```javascript
const createOrder = async (orderData) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка создания заказа');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    throw error;
  }
};

// Пример создания заказа
const newOrder = await createOrder({
  service: 'Тараканы',
  object: '2 комнатная квартира',
  count: 'Много',
  experience: 'Нет, не травил',
  address: 'ул. Ленина, 10, кв. 5',
  phoneNumber: '+79001234567',
  name: 'Иван Иванов',
  clientComment: 'Срочно нужно обработать кухню',
  dezinsectorComment: 'Обработать все углы и плинтусы',
  dezinsectorId: 'dez123',
  expectDate: '2025-01-20'
});

// Примеры реальных данных из API
const realOrderExamples = [
  {
    service: 'cockroaches',
    object: 'apartment1',
    count: 'sometimes',
    experience: 'yes',
    address: 'Витебская 47',
    phoneNumber: '+79005553322',
    name: 'Юрийййййййй',
    clientComment: 'коммент',
    expectDate: '2025-08-18'
  },
  {
    service: 'Клещи',
    object: '3 комнатная квартира',
    count: 'Нужна просто профилактика',
    experience: 'Да, вызывал специалиста',
    address: 'зщшгнек',
    phoneNumber: '+72345678900',
    name: 'ооол',
    clientComment: 'лолол',
    expectDate: '2025-09-05'
  }
];
```

### Обновление заказа
```javascript
const updateOrder = async (orderId, updateData) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/order/by-id/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка обновления заказа');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    throw error;
  }
};

// Примеры обновления заказа
const updatedOrder = await updateOrder('order123', {
  status: 'Inprogress',
  dezinsectorComment: 'Заказ принят в работу, выезд 20 января в 14:00',
  realPrice: 3500
});

// Обновление комментария клиента
await updateOrder('order123', {
  clientComment: 'Клиент подтвердил время обработки'
});
```

### Работа с заказами по статусам
```javascript
const getOrdersByStatus = async (status, skipPages = 0, pageSize = 10) => {
  try {
    const orders = await getOrders(skipPages, pageSize);
    
    // Фильтруем заказы по статусу
    const filteredOrders = orders.data.filter(order => order.status === status);
    
    return {
      data: filteredOrders,
      count: filteredOrders.length,
      totalCount: orders.count
    };
  } catch (error) {
    console.error('Ошибка получения заказов по статусу:', error);
    throw error;
  }
};

// Примеры использования
const newOrders = await getOrdersByStatus('New', 0, 20);
const inProgressOrders = await getOrdersByStatus('Inprogress', 0, 10);

console.log(`Новых заказов: ${newOrders.count}`);
console.log(`Заказов в работе: ${inProgressOrders.count}`);
```

### Поиск заказов по клиенту
```javascript
const searchOrdersByClient = async (searchTerm, skipPages = 0, pageSize = 10) => {
  try {
    const orders = await getOrders(skipPages, pageSize);
    
    // Ищем заказы по имени или телефону клиента
    const searchResults = orders.data.filter(order => 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm)
    );
    
    return {
      data: searchResults,
      count: searchResults.length,
      totalCount: orders.count
    };
  } catch (error) {
    console.error('Ошибка поиска заказов:', error);
    throw error;
  }
};

// Пример использования
const clientOrders = await searchOrdersByClient('Иван', 0, 50);
console.log(`Найдено заказов для клиента: ${clientOrders.count}`);

### Анализ заказов по типам услуг
```javascript
const analyzeOrdersByService = (orders) => {
  const serviceStats = {};
  
  orders.data.forEach(order => {
    const service = order.service;
    if (!serviceStats[service]) {
      serviceStats[service] = {
        count: 0,
        totalLiquidPrice: 0,
        totalGelPrice: 0,
        totalRealPrice: 0,
        statuses: {}
      };
    }
    
    serviceStats[service].count++;
    serviceStats[service].totalLiquidPrice += order.liquidPrice || 0;
    serviceStats[service].totalGelPrice += order.jelPrice || 0;
    serviceStats[service].totalRealPrice += order.realPrice || 0;
    
    const status = order.status;
    serviceStats[service].statuses[status] = (serviceStats[service].statuses[status] || 0) + 1;
  });
  
  return serviceStats;
};

// Пример использования
const serviceAnalysis = analyzeOrdersByService(firstPage);
console.log('Статистика по услугам:', serviceAnalysis);

// Выводим детальную статистику
Object.entries(serviceAnalysis).forEach(([service, stats]) => {
  console.log(`\n${service}:`);
  console.log(`  Всего заказов: ${stats.count}`);
  console.log(`  Средняя цена жидкости: ${Math.round(stats.totalLiquidPrice / stats.count)}₽`);
  console.log(`  Средняя цена геля: ${Math.round(stats.totalGelPrice / stats.count)}₽`);
  console.log(`  Статусы:`, stats.statuses);
});
```
```

### Работа с ценами заказов
```javascript
const calculateOrderPrice = (order) => {
  const liquidPrice = order.liquidPrice || 0;
  const gelPrice = order.jelPrice || 0;
  const realPrice = order.realPrice || 0;
  
  return {
    liquidPrice,
    gelPrice,
    realPrice,
    totalPrice: realPrice > 0 ? realPrice : Math.max(liquidPrice, gelPrice),
    hasRealPrice: realPrice > 0
  };
};

const getOrdersByPriceRange = async (minPrice, maxPrice, skipPages = 0, pageSize = 10) => {
  try {
    const orders = await getOrders(skipPages, pageSize);
    
    // Фильтруем заказы по диапазону цен
    const filteredOrders = orders.data.filter(order => {
      const price = order.realPrice || Math.max(order.liquidPrice, order.jelPrice);
      return price >= minPrice && price <= maxPrice;
    });
    
    return {
      data: filteredOrders,
      count: filteredOrders.length,
      totalCount: orders.count
    };
  } catch (error) {
    console.error('Ошибка получения заказов по цене:', error);
    throw error;
  }
};

// Примеры использования
const priceInfo = calculateOrderPrice(newOrder);
console.log(`Цена заказа: ${priceInfo.totalPrice} руб.`);

const expensiveOrders = await getOrdersByPriceRange(5000, 15000, 0, 20);
console.log(`Дорогих заказов: ${expensiveOrders.count}`);
```

## 💳 Работа с платежами

### Создание ссылки для подписки
```javascript
const createSubscriptionLink = async (tariffId) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/payment/subscription-link/${tariffId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const paymentLink = await response.text();
    return paymentLink;
  } catch (error) {
    console.error('Ошибка создания ссылки подписки:', error);
    throw error;
  }
};

// Использование
const subscriptionLink = await createSubscriptionLink('tariff123');
console.log('Ссылка на подписку:', subscriptionLink);
```

### Создание ссылки для разовой оплаты
```javascript
const createPaymentLink = async (tariffId) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/payment/payment-link/${tariffId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const paymentLink = await response.text();
    return paymentLink;
  } catch (error) {
    console.error('Ошибка создания ссылки оплаты:', error);
    throw error;
  }
};

// Использование
const paymentLink = await createPaymentLink('tariff123');
console.log('Ссылка на оплату:', paymentLink);
```

### Отмена подписки
```javascript
const cancelSubscription = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/payment/cancel-subscription', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Ошибка отмены подписки:', error);
    throw error;
  }
};

// Использование
const cancelResult = await cancelSubscription();
console.log('Результат отмены:', cancelResult);
```

### Обработка webhook от Точка Банка
```javascript
const handleTochkaWebhook = async (webhookData) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/payment/tochka-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Ошибка обработки webhook:', error);
    throw error;
  }
};

// Пример webhook данных
const webhookData = {
  operationId: 'op123456',
  amount: 1500,
  status: 'success',
  consumerId: 'user123',
  purpose: 'Подписка на тариф "Базовый"',
  timestamp: new Date().toISOString()
};

// Использование
const webhookResult = await handleTochkaWebhook(webhookData);
console.log('Webhook обработан:', webhookResult);
```

### Управление платежами
```javascript
const processPayment = async (tariffId, paymentType = 'subscription') => {
  try {
    let paymentLink;
    
    if (paymentType === 'subscription') {
      paymentLink = await createSubscriptionLink(tariffId);
    } else {
      paymentLink = await createPaymentLink(tariffId);
    }
    
    // Перенаправляем пользователя на страницу оплаты
    window.location.href = paymentLink;
    
    return paymentLink;
  } catch (error) {
    console.error('Ошибка обработки платежа:', error);
    throw error;
  }
};

// Примеры использования
await processPayment('tariff123', 'subscription');  // Подписка
await processPayment('tariff123', 'payment');       // Разовая оплата
```

## 📋 Работа с тарифами

### Получение списка тарифов
```javascript
const getTariffs = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/tariff/list');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения тарифов:', error);
    throw error;
  }
};

// Использование
const tariffs = await getTariffs();
console.log('Доступные тарифы:', tariffs);
```

### Анализ тарифов
```javascript
const analyzeTariffs = (tariffs) => {
  const analysis = {
    total: tariffs.length,
    active: tariffs.filter(t => t.isActive).length,
    promo: tariffs.filter(t => t.isPromo).length,
    totalUsers: tariffs.reduce((sum, t) => sum + t.user.length, 0),
    averagePrice: 0,
    mostPopular: null
  };
  
  // Вычисляем среднюю цену
  const prices = tariffs
    .filter(t => t.isActive)
    .map(t => parseFloat(t.price.replace(/[^\d.]/g, '')));
  
  if (prices.length > 0) {
    analysis.averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }
  
  // Находим самый популярный тариф
  analysis.mostPopular = tariffs.reduce((max, current) => 
    current.user.length > max.user.length ? current : max
  );
  
  return analysis;
};

// Использование
const tariffAnalysis = analyzeTariffs(tariffs);
console.log('Анализ тарифов:', tariffAnalysis);
```

### Фильтрация тарифов
```javascript
const filterTariffs = (tariffs, filters = {}) => {
  let filtered = [...tariffs];
  
  // Фильтр по активности
  if (filters.activeOnly !== undefined) {
    filtered = filtered.filter(t => t.isActive === filters.activeOnly);
  }
  
  // Фильтр по промо
  if (filters.promoOnly !== undefined) {
    filtered = filtered.filter(t => t.isPromo === filters.promoOnly);
  }
  
  // Фильтр по цене
  if (filters.maxPrice) {
    filtered = filtered.filter(t => 
      parseFloat(t.price.replace(/[^\d.]/g, '')) <= filters.maxPrice
    );
  }
  
  // Фильтр по количеству пользователей
  if (filters.minUsers) {
    filtered = filtered.filter(t => t.user.length >= filters.minUsers);
  }
  
  return filtered;
};

// Примеры использования
const activeTariffs = filterTariffs(tariffs, { activeOnly: true });
const promoTariffs = filterTariffs(tariffs, { promoOnly: true });
const affordableTariffs = filterTariffs(tariffs, { maxPrice: 1000 });
const popularTariffs = filterTariffs(tariffs, { minUsers: 5 });
```

### Работа с пользователями тарифов
```javascript
const getTariffUsers = (tariffId) => {
  const tariff = tariffs.find(t => t.id === tariffId);
  return tariff ? tariff.user : [];
};

const getTariffStats = (tariffId) => {
  const tariff = tariffs.find(t => t.id === tariffId);
  if (!tariff) return null;
  
  const users = tariff.user;
  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.isVerified).length,
    adminUsers: users.filter(u => u.isAdmin).length,
    unlimitedUsers: users.filter(u => u.unlimitedAccount).length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    totalOrders: users.reduce((sum, u) => sum + u.order.length, 0),
    totalTransactions: users.reduce((sum, u) => sum + u.transaction.length, 0)
  };
  
  return stats;
};

// Примеры использования
const basicTariffUsers = getTariffUsers('tariff123');
const basicTariffStats = getTariffStats('tariff123');

console.log(`Пользователей базового тарифа: ${basicTariffUsers.length}`);
console.log('Статистика тарифа:', basicTariffStats);
```

### Сравнение тарифов
```javascript
const compareTariffs = (tariffIds) => {
  const selectedTariffs = tariffs.filter(t => tariffIds.includes(t.id));
  
  const comparison = selectedTariffs.map(tariff => ({
    id: tariff.id,
    name: tariff.name,
    price: tariff.price,
    isPromo: tariff.isPromo,
    isActive: tariff.isActive,
    advantages: tariff.advantages,
    userCount: tariff.user.length,
    features: {
      hasUnlimitedAccount: tariff.user.some(u => u.unlimitedAccount),
      hasVerifiedUsers: tariff.user.some(u => u.isVerified),
      hasAdminUsers: tariff.user.some(u => u.isAdmin)
    }
  }));
  
  return comparison;
};

// Пример использования
const comparison = compareTariffs(['tariff1', 'tariff2', 'tariff3']);
console.log('Сравнение тарифов:', comparison);
```

## 🔗 Работа с Webhook'ами

### Обработка webhook от Avito
```javascript
const handleAvitoWebhook = async (webhookData) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/hook/avito', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Ошибка обработки webhook Avito:', error);
    throw error;
  }
};

// Пример webhook данных от Avito
const avitoWebhookData = {
  id: 'webhook123',
  version: '1.0',
  timestamp: Date.now(),
  payload: {
    type: 'message',
    value: {
      id: '53f57d1952c49cd6dffccff932e348ce',
      chat_id: 'u2i-63gpJp6lGXnE0D3bP3PYKw',
      user_id: 72671872,
      author_id: 72671872,
      created: 1748508977,
      type: 'text',
      chat_type: 'u2i',
      content: {
        text: '3-2-1 Костюшкин Стас'
      },
      item_id: 7395100555,
      published_at: '2025-05-29T08:56:17Z'
    }
  }
};

// Использование
const webhookResult = await handleAvitoWebhook(avitoWebhookData);
console.log('Webhook Avito обработан:', webhookResult);
```

### Парсинг сообщений от Avito
```javascript
const parseAvitoMessage = (webhookData) => {
  const { payload } = webhookData;
  
  if (payload.type !== 'message') {
    return null;
  }
  
  const message = payload.value;
  
  return {
    messageId: message.id,
    chatId: message.chat_id,
    userId: message.user_id,
    authorId: message.author_id,
    createdAt: new Date(message.created * 1000),
    contentType: message.type,
    chatType: message.chat_type,
    text: message.content.text,
    itemId: message.item_id,
    publishedAt: new Date(message.published_at)
  };
};

// Использование
const parsedMessage = parseAvitoMessage(avitoWebhookData);
if (parsedMessage) {
  console.log('Сообщение от пользователя:', parsedMessage.text);
  console.log('Время получения:', parsedMessage.createdAt);
  console.log('ID объявления:', parsedMessage.itemId);
}
```

### Валидация webhook данных
```javascript
const validateAvitoWebhook = (webhookData) => {
  const errors = [];
  
  // Проверяем обязательные поля
  if (!webhookData.id) errors.push('Отсутствует ID webhook\'а');
  if (!webhookData.version) errors.push('Отсутствует версия webhook\'а');
  if (!webhookData.timestamp) errors.push('Отсутствует timestamp');
  if (!webhookData.payload) errors.push('Отсутствует payload');
  
  if (webhookData.payload) {
    const { payload } = webhookData;
    
    if (!payload.type) errors.push('Отсутствует тип payload');
    if (!payload.value) errors.push('Отсутствует значение payload');
    
    if (payload.value) {
      const { value } = payload;
      
      if (!value.id) errors.push('Отсутствует ID сообщения');
      if (!value.chat_id) errors.push('Отсутствует ID чата');
      if (!value.user_id) errors.push('Отсутствует ID пользователя');
      if (!value.content?.text) errors.push('Отсутствует текст сообщения');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Использование
const validation = validateAvitoWebhook(avitoWebhookData);
if (!validation.isValid) {
  console.error('Ошибки валидации:', validation.errors);
} else {
  console.log('Webhook данные валидны');
}
```

### Обработка различных типов сообщений
```javascript
const processAvitoMessage = async (webhookData) => {
  const parsedMessage = parseAvitoMessage(webhookData);
  
  if (!parsedMessage) {
    console.log('Неизвестный тип сообщения');
    return;
  }
  
  // Обрабатываем текстовые сообщения
  if (parsedMessage.contentType === 'text') {
    const text = parsedMessage.text.toLowerCase();
    
    // Анализируем содержимое сообщения
    if (text.includes('костюшкин') || text.includes('стас')) {
      console.log('Получено сообщение от Костюшкина Стаса');
      // Здесь можно добавить специальную логику обработки
    }
    
    // Проверяем на команды
    if (text.startsWith('/')) {
      await handleCommand(parsedMessage);
    } else {
      await handleRegularMessage(parsedMessage);
    }
  }
  
  // Обрабатываем другие типы контента
  if (parsedMessage.contentType === 'image') {
    await handleImageMessage(parsedMessage);
  }
};

const handleCommand = async (message) => {
  console.log('Обработка команды:', message.text);
  // Логика обработки команд
};

const handleRegularMessage = async (message) => {
  console.log('Обработка обычного сообщения:', message.text);
  // Логика обработки обычных сообщений
};

const handleImageMessage = async (message) => {
  console.log('Обработка изображения');
  // Логика обработки изображений
};

// Использование
await processAvitoMessage(avitoWebhookData);
```

## 👥 Работа с пользователями

### Получение профиля пользователя
```javascript
const getUserProfile = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    throw error;
  }
};

// Использование
const profile = await getUserProfile();
console.log('Пользователь:', profile.name, profile.surname);
console.log('Тариф:', profile.tariff?.name);
console.log('Ссылка на бота:', profile.botLink);
```

### Работа с тарифом пользователя
```javascript
const getUserTariffInfo = (profile) => {
  if (!profile.tariff) {
    return {
      hasTariff: false,
      message: 'У пользователя нет активного тарифа'
    };
  }
  
  const tariff = profile.tariff;
  return {
    hasTariff: true,
    name: tariff.name,
    price: tariff.price,
    isPromo: tariff.isPromo,
    isActive: tariff.isActive,
    advantages: tariff.advantages,
    formattedPrice: `${tariff.price} ₽`,
    advantagesList: tariff.advantages.join(', ')
  };
};

// Использование
const tariffInfo = getUserTariffInfo(profile);
if (tariffInfo.hasTariff) {
  console.log(`Тариф: ${tariffInfo.name} за ${tariffInfo.formattedPrice}`);
  console.log(`Преимущества: ${tariffInfo.advantagesList}`);
} else {
  console.log(tariffInfo.message);
}
```

### Получение списка пользователей
```javascript
const getUserList = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('skipPages', filters.skipPages || 0);
    params.append('pageSize', filters.pageSize || 10);
    
    if (filters.searchValue) {
      params.append('searchValue', filters.searchValue);
    }
    
    const response = await fetch(`http://195.200.17.116:3000/user/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения списка пользователей:', error);
    throw error;
  }
};

// Примеры использования
const firstPage = await getUserList({ skipPages: 0, pageSize: 10 });
const searchResults = await getUserList({ skipPages: 0, pageSize: 20, searchValue: 'Иван' });
```

### Изменение пароля
```javascript
const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Ошибка изменения пароля:', error);
    throw error;
  }
};

// Использование
await changePassword('oldPassword123', 'newPassword456');
```

### Сброс пароля
```javascript
const requestPasswordReset = async (email) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/password-reset-token', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка запроса сброса пароля:', error);
    throw error;
  }
};

// Использование
await requestPasswordReset('user@example.com');
```

### Восстановление пароля
```javascript
const recoverPassword = async (newPassword, token) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/recover-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPassword, token })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    throw error;
  }
};

// Использование
await recoverPassword('newPassword123', 'reset-token-here');
```

### Обновление цен на услуги
```javascript
const updateServicePricing = async (pricing) => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/service', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(pricing)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Ошибка обновления цен:', error);
    throw error;
  }
};

// Пример использования
await updateServicePricing({
  oneRoomLiquid: 1500,
  oneRoomGel: 2000,
  twoRoomLiquid: 2500,
  twoRoomGel: 3000,
  threeRoomLiquid: 3500,
  threeRoomGel: 4000
});
```

### Получение заказов пользователя
```javascript
const getUserOrders = async (skipPages = 0, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('skipPages', skipPages.toString());
    params.append('pageSize', pageSize.toString());
    
    const response = await fetch(`http://195.200.17.116:3000/user/order-list?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    throw error;
  }
};

// Использование
const orders = await getUserOrders(0, 20);
```

### Управление пользователями (для администраторов)
```javascript
const updateUserStatus = async (userId, status) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/user/user-status/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка обновления статуса пользователя:', error);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/user/by-id/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/user/by-id/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    throw error;
  }
};

// Примеры использования
await updateUserStatus('user123', 'Active');
await updateUser('user123', { 
  name: 'Новое имя', 
  isVerified: true 
});
await deleteUser('user123');
```

### Получение информации о токене (для разработки)
```javascript
const getTokenInfo = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/user/token-info', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Ошибка получения информации о токене:', error);
    throw error;
  }
};

// Использование
const tokenInfo = await getTokenInfo();
console.log('Token info:', tokenInfo);
```

## 🌱 Работа с сидами (тестовыми данными)

### Создание основных сидов
```javascript
const createSeeds = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/seed');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка создания сидов:', error);
    throw error;
  }
};

// Использование
const seedResult = await createSeeds();
console.log('Сиды созданы:', seedResult);
```

### Создание сидов для тарифов
```javascript
const createTariffSeeds = async () => {
  try {
    const response = await fetch('http://195.200.17.116:3000/seed/tariff');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка создания сидов тарифов:', error);
    throw error;
  }
};

// Использование
const tariffSeedResult = await createTariffSeeds();
console.log('Сиды тарифов созданы:', tariffSeedResult);
```

### Пакетное создание всех сидов
```javascript
const createAllSeeds = async () => {
  try {
    const results = {};
    
    // Создаем основные сиды
    results.mainSeeds = await createSeeds();
    
    // Создаем сиды тарифов
    results.tariffSeeds = await createTariffSeeds();
    
    return results;
  } catch (error) {
    console.error('Ошибка создания всех сидов:', error);
    throw error;
  }
};

// Использование
const allSeeds = await createAllSeeds();
console.log('Все сиды созданы:', allSeeds);
```
```

## 🤝 Работа с партнерами

### Получение цен партнера
```javascript
const getPartnerPricing = async (partnerId) => {
  try {
    const response = await fetch(`http://195.200.17.116:3000/partners/${partnerId}/pricing`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка получения цен партнера:', error);
    throw error;
  }
};

// Использование
const pricing = await getPartnerPricing('123');
```

## 📱 Отправка SMS

### Отправка SMS сообщения
```javascript
const sendSms = async (phone, message) => {
  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ phone, message })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка отправки SMS');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка отправки SMS:', error);
    throw error;
  }
};

// Пример отправки
await sendSms('+79001234567', 'Ваш заказ подтвержден на 20 января в 14:00');
```

## 🔧 Утилиты и хелперы

### Проверка авторизации
```javascript
const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
};
```

### Получение access токена
```javascript
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};
```

### Получение refresh токена
```javascript
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};
```

### Выход из системы
```javascript
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Перенаправление на страницу входа
  window.location.href = '/auth';
};
```

### Обработка ошибок API
```javascript
const handleApiError = (error) => {
  if (error.status === 401) {
    // Не авторизован - перенаправляем на вход
    logout();
    return;
  }
  
  if (error.status === 403) {
    // Доступ запрещен
    console.error('Доступ запрещен');
    return;
  }
  
  if (error.status === 404) {
    // Не найдено
    console.error('Ресурс не найден');
    return;
  }
  
  // Общая ошибка
  console.error('Ошибка API:', error.message);
};
```

### Создание заголовков для запросов
```javascript
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }
  
  return headers;
};

// Использование
const headers = createHeaders();
const response = await fetch('http://195.200.17.116:3000/leads', { headers });
```

## 📊 Примеры фильтрации и поиска

### Поиск лидов по дате
```javascript
const getLeadsByDateRange = async (partnerId, dateFrom, dateTo) => {
  return await getLeads({
    partnerId,
    dateFrom: dateFrom.toISOString().split('T')[0],
    dateTo: dateTo.toISOString().split('T')[0]
  });
};

// Использование
const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const recentLeads = await getLeadsByDateRange('123', weekAgo, today);
```

### Поиск по статусу и типу вредителя
```javascript
const getLeadsByPestType = async (partnerId, pestType, status = null) => {
  const leads = await getLeads({ partnerId, status });
  
  if (pestType) {
    return leads.filter(lead => lead.pestType === pestType);
  }
  
  return leads;
};

// Использование
const cockroachLeads = await getLeadsByPestType('123', 'cockroaches', 'new');
```

## 🚀 Асинхронная обработка

### Пакетная обработка лидов
```javascript
const processLeadsBatch = async (leadIds, action) => {
  const results = [];
  
  for (const leadId of leadIds) {
    try {
      const result = await action(leadId);
      results.push({ leadId, success: true, result });
    } catch (error) {
      results.push({ leadId, success: false, error: error.message });
    }
  }
  
  return results;
};

// Пример использования
const leadIds = ['lead1', 'lead2', 'lead3'];
const results = await processLeadsBatch(leadIds, async (id) => {
  return await updateLead(id, { status: 'completed' });
});
```

### Обработка с задержкой
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processWithDelay = async (items, processor, delayMs = 1000) => {
  const results = [];
  
  for (const item of items) {
    const result = await processor(item);
    results.push(result);
    await delay(delayMs); // Задержка между запросами
  }
  
  return results;
};
```
