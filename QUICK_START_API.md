# 🚀 Быстрый старт API интеграции

## Шаг 1: Запуск Backend API

```bash
# Перейдите в папку с backend
cd avitobotBE-main

# Установите зависимости
npm install

# Запустите API сервер
npm run start:dev
```

API будет доступен по адресу: `http://localhost:3005`

## Шаг 2: Настройка Frontend

```bash
# В корневой папке проекта
npm install

# Создайте файл с переменными окружения
cp env.local.example .env.local

# Запустите frontend
npm run dev
```

## Шаг 3: Открытие приложения

Перейдите по одному из адресов:

- **Полное приложение**: `http://localhost:3000/api-demo`
- **Примеры кода**: `http://localhost:3000/api-example`

## Шаг 4: Тестирование

### Тестовые данные для входа:
- **Email**: `test@test.com`
- **Пароль**: `password123`

### Проверка API:
```bash
# Проверка здоровья API
curl http://localhost:3005/api/health

# Тестовый вход
curl -X POST http://localhost:3005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 🎯 Основные функции

### 1. Аутентификация
- Вход/выход из системы
- Сохранение JWT токенов
- Автоматическое обновление токенов

### 2. Avito интеграция
- OAuth авторизация
- Синхронизация объявлений
- Управление ИИ-ассистентом
- Статистика объявлений

### 3. Управление заявками
- Создание заявок
- Просмотр и фильтрация
- Статистика по статусам
- Поиск по различным критериям

### 4. ИИ чат
- Отправка сообщений
- История взаимодействий
- Выбор модели ИИ
- Контекстные сообщения

### 5. Статистика
- Общая статистика
- Статистика по модулям
- Мониторинг здоровья API
- Тренды и метрики

## 🔧 Настройка

### Переменные окружения (.env.local):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
```

### Конфигурация API (src/lib/api-config.ts):
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005/api',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
};
```

## 📁 Структура файлов

```
src/
├── lib/
│   ├── api-config.ts          # Конфигурация
│   ├── api-types.ts           # TypeScript типы
│   ├── api-client.ts          # HTTP клиент
│   └── services/              # API сервисы
├── contexts/
│   └── ApiContext.tsx         # React контекст
├── hooks/
│   └── useApi*.ts             # Кастомные хуки
├── components/
│   └── Api*.tsx               # UI компоненты
└── app/
    ├── api-demo/              # Полное приложение
    └── api-example/           # Примеры кода
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

## 🐛 Решение проблем

### API недоступен
1. Проверьте, что backend запущен на порту 3005
2. Убедитесь в правильности URL в переменных окружения
3. Проверьте CORS настройки в backend

### Ошибки аутентификации
1. Проверьте тестовые данные: `test@test.com` / `password123`
2. Убедитесь, что токены сохраняются в localStorage
3. Проверьте консоль браузера на ошибки

### Проблемы с Avito
1. Убедитесь, что OAuth настроен в backend
2. Проверьте статус токенов Avito
3. Попробуйте обновить токены

### Ошибки сборки
1. Убедитесь, что все зависимости установлены
2. Проверьте версии Node.js и npm
3. Очистите кэш: `npm run clean`

## 📞 Поддержка

При возникновении проблем:

1. **Проверьте логи**: Откройте консоль браузера (F12)
2. **Запустите тесты**: `npm run test`
3. **Проверьте API**: `curl http://localhost:3005/api/health`
4. **Перезапустите сервисы**: Остановите и запустите заново

## 🎉 Готово!

Теперь у вас есть полная интеграция с AvitoBot Backend API:

- ✅ Аутентификация с JWT
- ✅ Управление Avito объявлениями
- ✅ Создание и управление заявками
- ✅ ИИ чат с историей
- ✅ Статистика и мониторинг
- ✅ Готовые UI компоненты
- ✅ Полное тестирование
- ✅ Документация и примеры

**Следующие шаги:**
1. Изучите код в `src/components/`
2. Посмотрите примеры в `src/app/api-example/`
3. Настройте под свои нужды
4. Добавьте новые функции по необходимости
