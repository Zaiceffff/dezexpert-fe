'use client';

import React, { useState, useEffect } from 'react';
import { useApiAuth } from '../../hooks/useApiAuth';
import { useApiAvito } from '../../hooks/useApiAvito';
import { useApiOrders } from '../../hooks/useApiOrders';
import { useApiAi } from '../../hooks/useApiAi';
import { useApiStats } from '../../hooks/useApiStats';

export default function ApiExamplePage() {
  const [activeExample, setActiveExample] = useState<'auth' | 'avito' | 'orders' | 'ai' | 'stats'>('auth');
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Примеры использования API</h1>
        
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'auth', label: 'Аутентификация' },
                { id: 'avito', label: 'Avito' },
                { id: 'orders', label: 'Заявки' },
                { id: 'ai', label: 'ИИ' },
                { id: 'stats', label: 'Статистика' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveExample(id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeExample === id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Example */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Код</h3>
            </div>
            <div className="px-6 py-4">
              <CodeExample example={activeExample} />
            </div>
          </div>

          {/* Live Demo */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Демо</h3>
            </div>
            <div className="px-6 py-4">
              <LiveDemo example={activeExample} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeExample({ example }: { example: string }) {
  const codeExamples = {
    auth: `import { useApiAuth } from '../hooks/useApiAuth';

function AuthExample() {
  const { login, logout, isAuthenticated, user, isLoading } = useApiAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'test@test.com',
        password: 'password123'
      });
      console.log('Вход успешен');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Добро пожаловать, {user?.email}!</p>
          <button onClick={logout}>Выйти</button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      )}
    </div>
  );
}`,
    avito: `import { useApiAvito } from '../hooks/useApiAvito';

function AvitoExample() {
  const {
    listings,
    loadListings,
    toggleAiAssistant,
    syncListings,
    isLoading
  } = useApiAvito();

  useEffect(() => {
    loadListings();
  }, []);

  const handleToggleAi = async (id: string, enabled: boolean) => {
    const success = await toggleAiAssistant(id, enabled);
    if (success) {
      console.log('ИИ-ассистент переключен');
    }
  };

  return (
    <div>
      <button onClick={syncListings} disabled={isLoading}>
        Синхронизировать
      </button>
      {listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <button onClick={() => handleToggleAi(listing.id, !listing.aiAssistantIsOn)}>
            {listing.aiAssistantIsOn ? 'Выключить ИИ' : 'Включить ИИ'}
          </button>
        </div>
      ))}
    </div>
  );
}`,
    orders: `import { useApiOrders } from '../hooks/useApiOrders';

function OrdersExample() {
  const { orders, createOrder, loadOrders, isLoading } = useApiOrders();

  const handleCreateOrder = async () => {
    const orderData = {
      service: 'Дезинфекция',
      object: 'Квартира',
      count: '1',
      experience: 'Опытный',
      phoneNumber: '+7 999 999 99 99',
      address: 'Москва, ул. Тестовая, 1',
      name: 'Иван Иванов',
      expectDate: '2023-12-31'
    };

    try {
      await createOrder(orderData);
      console.log('Заявка создана');
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateOrder} disabled={isLoading}>
        Создать заявку
      </button>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.name}</h3>
          <p>Услуга: {order.service}</p>
          <p>Статус: {order.status}</p>
        </div>
      ))}
    </div>
  );
}`,
    ai: `import { useApiAi } from '../hooks/useApiAi';

function AiExample() {
  const { sendMessage, history, isLoading } = useApiAi();

  const handleSendMessage = async (message: string) => {
    try {
      const response = await sendMessage(message, 'gpt-3.5-turbo');
      console.log('Ответ ИИ:', response);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  return (
    <div>
      <div>
        {history.map((item, index) => (
          <div key={index}>
            <p><strong>Пользователь:</strong> {item.messages[0].content}</p>
            <p><strong>ИИ:</strong> {item.response}</p>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const message = e.target.message.value;
        handleSendMessage(message);
        e.target.reset();
      }}>
        <input name="message" placeholder="Введите сообщение..." />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
}`,
    stats: `import { useApiStats } from '../hooks/useApiStats';

function StatsExample() {
  const { general, ai, leads, avito, loadAllStats, isLoading } = useApiStats();

  useEffect(() => {
    loadAllStats();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Загрузка статистики...</p>
      ) : (
        <div>
          {general && (
            <div>
              <h3>Общая статистика</h3>
              <p>Пользователи: {general.totalUsers}</p>
              <p>Заявки: {general.totalOrders}</p>
              <p>Объявления: {general.totalListings}</p>
              <p>ИИ взаимодействия: {general.totalAiInteractions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}`
  };

  return (
    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
      <code>{codeExamples[example as keyof typeof codeExamples]}</code>
    </pre>
  );
}

function LiveDemo({ example }: { example: string }) {
  switch (example) {
    case 'auth':
      return <AuthDemo />;
    case 'avito':
      return <AvitoDemo />;
    case 'orders':
      return <OrdersDemo />;
    case 'ai':
      return <AiDemo />;
    case 'stats':
      return <StatsDemo />;
    default:
      return <div>Выберите пример</div>;
  }
}

function AuthDemo() {
  const { login, logout, isAuthenticated, user, isLoading, error } = useApiAuth();
  const [credentials, setCredentials] = useState({ email: 'test@test.com', password: 'password123' });

  const handleLogin = async () => {
    try {
      await login(credentials);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {isAuthenticated ? (
        <div>
          <p className="text-green-600">✅ Вход выполнен успешно</p>
          <p>Пользователь: {user?.email}</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email"
            />
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Пароль"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </div>
      )}
    </div>
  );
}

function AvitoDemo() {
  const { listings, loadListings, isLoading, error } = useApiAvito();

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="space-y-4">
      <button
        onClick={() => loadListings()}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Загрузка...' : 'Загрузить объявления'}
      </button>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <div className="space-y-2">
        {listings.slice(0, 3).map(listing => (
          <div key={listing.id} className="p-3 border border-gray-200 rounded-md">
            <h4 className="font-medium">{listing.title}</h4>
            <p className="text-sm text-gray-600">Цена: {listing.price} ₽</p>
            <p className="text-sm text-gray-600">Статус: {listing.status}</p>
          </div>
        ))}
      </div>
      
      {listings.length === 0 && !isLoading && (
        <p className="text-gray-500">Объявления не найдены</p>
      )}
    </div>
  );
}

function OrdersDemo() {
  const { orders, createOrder, isLoading, error } = useApiOrders();
  const [orderData, setOrderData] = useState({
    service: 'Дезинфекция',
    object: 'Квартира',
    count: '1',
    experience: 'Опытный',
    phoneNumber: '+7 999 999 99 99',
    address: 'Москва, ул. Тестовая, 1',
    name: 'Иван Иванов',
    expectDate: '2023-12-31'
  });

  const handleCreateOrder = async () => {
    try {
      await createOrder(orderData);
      alert('Заявка создана успешно!');
    } catch (err) {
      console.error('Create order error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={orderData.name}
          onChange={(e) => setOrderData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Имя"
        />
        <input
          type="text"
          value={orderData.service}
          onChange={(e) => setOrderData(prev => ({ ...prev, service: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Услуга"
        />
        <input
          type="tel"
          value={orderData.phoneNumber}
          onChange={(e) => setOrderData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Телефон"
        />
      </div>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <button
        onClick={handleCreateOrder}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Создание...' : 'Создать заявку'}
      </button>
      
      <div className="space-y-2">
        {orders.slice(0, 3).map(order => (
          <div key={order.id} className="p-3 border border-gray-200 rounded-md">
            <h4 className="font-medium">{order.name}</h4>
            <p className="text-sm text-gray-600">Услуга: {order.service}</p>
            <p className="text-sm text-gray-600">Статус: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiDemo() {
  const { sendMessage, history, isLoading, error } = useApiAi();
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
        {history.slice(0, 5).map((item, index) => (
          <div key={index} className="mb-2">
            <p className="text-sm"><strong>Пользователь:</strong> {item.messages[0].content}</p>
            <p className="text-sm"><strong>ИИ:</strong> {item.response}</p>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-gray-500 text-sm">История пуста</p>
        )}
      </div>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Введите сообщение..."
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}

function StatsDemo() {
  const { general, ai, leads, avito, loadAllStats, isLoading, error } = useApiStats();

  useEffect(() => {
    loadAllStats();
  }, []);

  return (
    <div className="space-y-4">
      <button
        onClick={loadAllStats}
        disabled={isLoading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Загрузка...' : 'Загрузить статистику'}
      </button>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      {isLoading ? (
        <p className="text-gray-500">Загрузка статистики...</p>
      ) : (
        <div className="space-y-4">
          {general && (
            <div className="p-3 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-900">Общая статистика</h4>
              <p className="text-sm text-blue-700">Пользователи: {general.totalUsers}</p>
              <p className="text-sm text-blue-700">Заявки: {general.totalOrders}</p>
              <p className="text-sm text-blue-700">Объявления: {general.totalListings}</p>
              <p className="text-sm text-blue-700">ИИ взаимодействия: {general.totalAiInteractions}</p>
            </div>
          )}
          
          {ai && (
            <div className="p-3 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-900">Статистика ИИ</h4>
              <p className="text-sm text-green-700">Взаимодействия: {ai.totalInteractions}</p>
              <p className="text-sm text-green-700">Токены: {ai.totalTokens}</p>
              <p className="text-sm text-green-700">Время ответа: {ai.averageResponseTime}мс</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
