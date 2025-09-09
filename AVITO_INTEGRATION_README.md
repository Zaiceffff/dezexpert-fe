# 🔗 Avito API Integration

Простая интеграция только с Avito API для управления объявлениями и ИИ-ассистентом.

## 🚀 Быстрый старт

### 1. Настройка Backend

Убедитесь, что ваш AvitoBot Backend API запущен на `http://localhost:3005`:

```bash
cd avitobotBE-main
npm install
npm run start:dev
```

### 2. Настройка Frontend

```bash
# Создайте файл с переменными окружения
cp env.local.example .env.local

# Запустите frontend
npm run dev
```

### 3. Открыть Avito Manager

Перейдите по адресу: `http://localhost:3000/avito`

## 🔧 Конфигурация OAuth

**ВАЖНО**: OAuth redirect_uri должен указывать на ваш backend (порт 3005), а не на frontend!

В файле `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005/api
NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI=http://localhost:3005/api/avito/oauth/callback
```

## 📁 Структура Avito интеграции

```
src/
├── lib/
│   ├── api-config.ts              # Конфигурация API
│   ├── api-types.ts               # TypeScript типы
│   ├── api-client.ts              # HTTP клиент
│   └── services/
│       └── avito-simple.service.ts  # Avito сервис
├── hooks/
│   └── useAvitoSimple.ts          # Хук для Avito
├── components/
│   └── AvitoSimpleManager.tsx     # UI компонент
└── app/
    └── avito/
        └── page.tsx               # Страница Avito
```

## 🎯 Основные функции

### 1. Подключение к Avito
- OAuth авторизация через Avito
- Проверка статуса подключения
- Обновление токенов

### 2. Управление объявлениями
- Синхронизация объявлений с Avito
- Просмотр всех объявлений
- Фильтрация по категориям и статусам
- Поиск по названию

### 3. ИИ-ассистент
- Включение/выключение ИИ для объявлений
- Просмотр объявлений с активным ИИ
- Статистика использования ИИ

## 🔄 API Endpoints

Все запросы идут на ваш backend (порт 3005):

```
GET  /api/avito/oauth/url              # Получить OAuth URL
GET  /api/avito/oauth/callback         # Обработка OAuth callback
POST /api/avito/sync/listings          # Синхронизация объявлений
GET  /api/avito/listings               # Получение объявлений
POST /api/avito/listings/:id/ai-toggle # Переключение ИИ
GET  /api/avito/listings/ai-active     # Активные с ИИ
GET  /api/avito/tokens/status          # Статус токенов
POST /api/avito/tokens/refresh         # Обновление токенов
```

## 💻 Использование

### Базовое использование

```typescript
import { useAvitoSimple } from '../hooks/useAvitoSimple';

function MyComponent() {
  const {
    listings,
    isLoading,
    isConnected,
    loadListings,
    toggleAiAssistant,
    syncListings
  } = useAvitoSimple();

  // Загрузить объявления
  useEffect(() => {
    loadListings();
  }, []);

  // Переключить ИИ
  const handleToggleAi = async (id: string, enabled: boolean) => {
    await toggleAiAssistant(id, enabled);
  };

  return (
    <div>
      {isConnected ? (
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
      ) : (
        <p>Не подключено к Avito</p>
      )}
    </div>
  );
}
```

### OAuth авторизация

```typescript
const { getOAuthUrl, handleOAuthCallback } = useAvitoSimple();

// Получить OAuth URL и открыть в новом окне
const handleOAuth = async () => {
  try {
    const url = await getOAuthUrl();
    window.open(url, '_blank', 'width=600,height=600');
  } catch (error) {
    console.error('OAuth error:', error);
  }
};

// Обработать callback (если нужно)
const handleCallback = async (code: string, state?: string) => {
  const success = await handleOAuthCallback(code, state);
  if (success) {
    console.log('Авторизация успешна');
  }
};
```

## 🐛 Решение проблем

### OAuth redirect_uri ошибка

**Проблема**: OAuth ведет на `localhost:3001` вместо `localhost:3005`

**Решение**: 
1. Проверьте переменную `NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI` в `.env.local`
2. Убедитесь, что она указывает на `http://localhost:3005/api/avito/oauth/callback`
3. Перезапустите frontend после изменения переменных

### Backend недоступен

**Проблема**: Ошибки 404 или 500 при запросах к API

**Решение**:
1. Убедитесь, что backend запущен на порту 3005
2. Проверьте URL в `NEXT_PUBLIC_API_BASE_URL`
3. Проверьте CORS настройки в backend

### Токены недействительны

**Проблема**: Ошибки 401 при запросах к Avito API

**Решение**:
1. Нажмите "Обновить токены"
2. Если не помогает, переподключитесь через OAuth
3. Проверьте настройки OAuth в Avito Developer Console

## 🔍 Отладка

### Проверка подключения

```typescript
const { checkConnection, isConnected, tokensStatus } = useAvitoSimple();

// Проверить подключение
await checkConnection();
console.log('Connected:', isConnected);
console.log('Tokens valid:', tokensStatus?.isValid);
```

### Логирование запросов

В `src/lib/api-client.ts` добавьте логирование:

```typescript
// В request interceptor
console.log('API Request:', config.url, config.data);

// В response interceptor
console.log('API Response:', response.data);
```

## 📊 Мониторинг

- **Статус подключения**: Зеленый/красный индикатор
- **Статистика объявлений**: Общее количество, с ИИ, без ИИ
- **Статус токенов**: Действительны/недействительны
- **Ошибки**: Отображаются в UI с возможностью закрытия

## 🎉 Готово!

Теперь у вас есть простая и надежная интеграция с Avito API:

- ✅ OAuth авторизация
- ✅ Синхронизация объявлений
- ✅ Управление ИИ-ассистентом
- ✅ Фильтрация и поиск
- ✅ Статистика и мониторинг
- ✅ Обработка ошибок

**Следующие шаги**:
1. Откройте `http://localhost:3000/avito`
2. Нажмите "Подключить Avito" для OAuth
3. Синхронизируйте объявления
4. Управляйте ИИ-ассистентом
