# AvitoBot API Integration

Полная интеграция фронтенда с AvitoBot Backend API.

## 🚀 Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env.local` на основе `env.local.example`:

```bash
cp env.local.example .env.local
```

### 2. Запуск Backend API

Убедитесь, что AvitoBot Backend API запущен на `http://localhost:3005`:

```bash
# В папке avitobotBE-main
npm install
npm run start:dev
```

### 3. Запуск Frontend

```bash
npm install
npm run dev
```

### 4. Открыть демо

Перейдите по адресу: `http://localhost:3000/api-demo`

## 📁 Структура проекта

```
src/
├── lib/
│   ├── api-config.ts          # Конфигурация API
│   ├── api-types.ts           # TypeScript типы
│   ├── api-client.ts          # HTTP клиент с Axios
│   └── services/              # Сервисы для каждого модуля
│       ├── auth.service.ts    # Аутентификация
│       ├── avito.service.ts   # Avito интеграция
│       ├── orders.service.ts  # Управление заявками
│       ├── ai.service.ts      # ИИ сервис
│       ├── stats.service.ts   # Статистика
│       └── index.ts           # Экспорт всех сервисов
├── contexts/
│   └── ApiContext.tsx         # React контекст для состояния
├── hooks/
│   ├── useApiAuth.ts          # Хук для аутентификации
│   ├── useApiAvito.ts         # Хук для Avito
│   ├── useApiOrders.ts        # Хук для заявок
│   ├── useApiAi.ts            # Хук для ИИ
│   ├── useApiStats.ts         # Хук для статистики
│   └── useApi.ts              # Экспорт всех хуков
├── components/
│   ├── ApiApp.tsx             # Главное приложение
│   ├── ApiLoginForm.tsx       # Форма входа
│   ├── ApiDashboard.tsx       # Дашборд
│   ├── ApiAvitoManager.tsx    # Управление Avito
│   ├── ApiOrdersManager.tsx   # Управление заявками
│   └── ApiAiChat.tsx          # ИИ чат
└── app/
    └── api-demo/
        └── page.tsx           # Демо страница
```

## 🔧 Конфигурация

### Переменные окружения

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# Test Credentials
NEXT_PUBLIC_TEST_EMAIL=test@test.com
NEXT_PUBLIC_TEST_PASSWORD=password123
```

### Настройка API

Все настройки находятся в `src/lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005/api',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
};
```

## 🎯 Основные функции

### 1. Аутентификация

```typescript
import { useApiAuth } from '../hooks/useApiAuth';

function LoginComponent() {
  const { login, logout, isAuthenticated, user } = useApiAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'test@test.com', password: 'password123' });
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
        <button onClick={handleLogin}>Войти</button>
      )}
    </div>
  );
}
```

### 2. Работа с Avito

```typescript
import { useApiAvito } from '../hooks/useApiAvito';

function AvitoComponent() {
  const {
    listings,
    loadListings,
    toggleAiAssistant,
    syncListings
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
      <button onClick={syncListings}>Синхронизировать</button>
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
}
```

### 3. Управление заявками

```typescript
import { useApiOrders } from '../hooks/useApiOrders';

function OrdersComponent() {
  const { orders, createOrder, loadOrders } = useApiOrders();

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
      <button onClick={handleCreateOrder}>Создать заявку</button>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.name}</h3>
          <p>Услуга: {order.service}</p>
          <p>Статус: {order.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. ИИ чат

```typescript
import { useApiAi } from '../hooks/useApiAi';

function AiChatComponent() {
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
}
```

### 5. Статистика

```typescript
import { useApiStats } from '../hooks/useApiStats';

function StatsComponent() {
  const { general, ai, leads, avito, loadAllStats } = useApiStats();

  useEffect(() => {
    loadAllStats();
  }, []);

  return (
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
  );
}
```

## 🧪 Тестирование

Запуск тестов:

```bash
npm run test
```

Тесты покрывают:
- Аутентификацию
- Работу с Avito API
- Управление заявками
- ИИ сервис
- Статистику

## 🔒 Безопасность

- JWT токены сохраняются в localStorage
- Автоматическое добавление токена в заголовки запросов
- Обработка 401 ошибок с перенаправлением на логин
- Валидация входных данных

## 📊 Мониторинг

- Проверка здоровья API
- Статистика использования
- Обработка ошибок
- Retry логика для сетевых запросов

## 🚀 Масштабирование

Архитектура позволяет легко:
- Добавлять новые API endpoints
- Создавать новые сервисы
- Расширять функциональность
- Интегрировать с другими системами

## 📝 API Endpoints

### Аутентификация
- `POST /auth/login` - Вход в систему
- `GET /auth/me` - Профиль пользователя

### Avito
- `GET /avito/oauth/url` - OAuth URL
- `GET /avito/oauth/callback` - OAuth callback
- `POST /avito/sync/listings` - Синхронизация объявлений
- `GET /avito/listings` - Получение объявлений
- `POST /avito/listings/:id/ai-toggle` - Переключение ИИ
- `GET /avito/listings/ai-active` - Активные с ИИ
- `GET /avito/tokens/status` - Статус токенов
- `POST /avito/tokens/refresh` - Обновление токенов

### Заявки
- `POST /order` - Создание заявки
- `GET /order` - Получение заявок
- `GET /order/link/:linkId` - Заявки по Link ID
- `GET /order/stats` - Статистика заявок
- `GET /order/:id` - Конкретная заявка

### ИИ
- `POST /ai/chat` - Отправка сообщения
- `GET /ai/history` - История взаимодействий

### Статистика
- `GET /stats` - Общая статистика
- `GET /stats/ai` - Статистика ИИ
- `GET /stats/leads` - Статистика лидов
- `GET /stats/avito` - Статистика Avito
- `GET /health` - Проверка здоровья

## 🎨 UI Компоненты

Все компоненты используют Tailwind CSS и готовы к использованию:
- `ApiLoginForm` - Форма входа
- `ApiDashboard` - Главный дашборд
- `ApiAvitoManager` - Управление Avito
- `ApiOrdersManager` - Управление заявками
- `ApiAiChat` - ИИ чат

## 📞 Поддержка

При возникновении проблем:
1. Проверьте, что Backend API запущен
2. Убедитесь в правильности переменных окружения
3. Проверьте консоль браузера на ошибки
4. Запустите тесты для диагностики
