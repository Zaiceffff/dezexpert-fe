# Интеграция Avito с DezExpert

## Обзор

Интеграция Avito позволяет автоматизировать ответы на сообщения клиентов через ИИ-ассистента. Система подключается к аккаунту пользователя на Avito и автоматически отвечает на сообщения, создавая заявки в CRM.

## Архитектура

```
Frontend (DezExpert) ←→ API Routes ←→ Avito Backend ←→ Avito API
                              ↓
                         OpenAI API
                              ↓
                         DezExpert CRM
```

## Компоненты

### 1. API Routes (`/src/app/api/avito/`)
- `oauth/url` - получение OAuth URL для авторизации
- `oauth/callback` - обработка OAuth callback
- `listings` - получение и синхронизация объявлений
- `listings/[id]/ai-toggle` - включение/выключение ИИ ассистента
- `listings/ai-active` - получение активных объявлений

### 2. React Hooks (`/src/hooks/useAvito.ts`)
- Управление состоянием подключения
- Синхронизация объявлений
- Переключение ИИ ассистента
- Обработка ошибок

### 3. Компоненты (`/src/components/`)
- `AvitoConnection` - подключение аккаунта Avito
- `AvitoListings` - управление объявлениями

### 4. Страница (`/src/app/app/(protected)/avito/`)
- Полноценная страница для управления интеграцией

## Настройка

### 1. Переменные окружения

Создайте файл `.env.avito` с переменными:

```bash
# Avito OAuth
AVITO_CLIENT_ID=your_client_id
AVITO_CLIENT_SECRET=your_client_secret

# OpenAI
OPENAI_API_KEY=sk-your_key

# DezExpert API
DEZEXPERT_API_KEY=your_api_key

# JWT
JWT_SECRET=your_secret

# Webhook
WEBHOOK_SIGNATURE_SECRET=your_webhook_secret
```

### 2. Запуск Avito Backend

```bash
# Запуск через Docker Compose
docker-compose -f docker-compose.avito.yml up -d

# Или запуск вручную
cd avitobotBE-main
npm install
npm run migration:run
npm run start:dev
```

### 3. Настройка API URL

Обновите `src/lib/config.ts`:

```typescript
export const API_BASE_URL = process.env.HOST || 'https://api.bugbot.ru/api';
export const AVITO_API_BASE_URL = process.env.AVITO_API_URL || 'http://localhost:3001';
```

## Использование

### 1. Подключение аккаунта

1. Перейдите на вкладку "Авито" в дашборде
2. Нажмите "Подключить Avito"
3. Авторизуйтесь через OAuth
4. Аккаунт будет подключен автоматически

### 2. Управление объявлениями

1. После подключения синхронизируйте объявления
2. Включите ИИ-ассистент для нужных объявлений
3. Система будет автоматически отвечать на сообщения

### 3. Мониторинг

- Статистика подключенных объявлений
- Количество активных ИИ-ассистентов
- Статистика диалогов

## API Endpoints

### Frontend → Avito Backend

- `GET /api/avito/oauth/url` - получение OAuth URL
- `GET /api/avito/oauth/callback` - обработка callback
- `GET /api/avito/listings` - получение объявлений
- `POST /api/avito/listings` - синхронизация объявлений
- `POST /api/avito/listings/:id/ai-toggle` - переключение ИИ
- `GET /api/avito/listings/ai-active` - активные объявления

### Avito Backend → External APIs

- `Avito API` - получение объявлений и отправка сообщений
- `OpenAI API` - генерация ответов
- `DezExpert API` - создание заявок

## Безопасность

- OAuth 2.0 авторизация через Avito
- JWT токены для аутентификации
- Безопасное хранение токенов в БД
- Автоматическое обновление токенов

## Мониторинг

- Health checks для всех сервисов
- Логирование всех операций
- Обработка ошибок и retry логика
- Webhook для событий от Avito

## Разработка

### Добавление новых функций

1. Обновите типы в `src/lib/avito-types.ts`
2. Добавьте API route в `src/app/api/avito/`
3. Обновите хук `useAvito.ts`
4. Создайте компонент в `src/components/`
5. Обновите страницу `src/app/app/(protected)/avito/`

### Тестирование

```bash
# Запуск тестов
npm test

# E2E тесты
npm run test:e2e

# Линтинг
npm run lint
```

## Troubleshooting

### Частые проблемы

1. **Ошибка авторизации**
   - Проверьте AVITO_CLIENT_ID и AVITO_CLIENT_SECRET
   - Убедитесь, что redirect URI настроен правильно

2. **Не синхронизируются объявления**
   - Проверьте токены доступа
   - Убедитесь, что Avito backend запущен

3. **ИИ не отвечает**
   - Проверьте OPENAI_API_KEY
   - Убедитесь, что объявление активно

### Логи

```bash
# Логи Avito backend
docker-compose -f docker-compose.avito.yml logs -f avito-backend

# Логи базы данных
docker-compose -f docker-compose.avito.yml logs -f avito-postgres
```

## Roadmap

- [ ] Аналитика диалогов
- [ ] Настройка шаблонов ответов
- [ ] Интеграция с другими платформами
- [ ] Мобильное приложение
- [ ] Расширенная статистика
