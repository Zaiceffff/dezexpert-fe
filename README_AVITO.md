# 🚀 Интеграция Avito с DezExpert

## ✅ Что реализовано

### 1. **API Routes** (`/src/app/api/avito/`)
- ✅ OAuth авторизация через Avito
- ✅ Синхронизация объявлений
- ✅ Управление ИИ-ассистентом
- ✅ Получение активных объявлений

### 2. **React Components** (`/src/components/`)
- ✅ `AvitoConnection` - подключение аккаунта
- ✅ `AvitoListings` - управление объявлениями
- ✅ Красивый UI с Tailwind CSS

### 3. **React Hooks** (`/src/hooks/`)
- ✅ `useAvito` - полный хук для работы с API
- ✅ Управление состоянием и ошибками
- ✅ Автоматическое обновление данных

### 4. **Страницы** (`/src/app/app/(protected)/`)
- ✅ Отдельная страница `/avito`
- ✅ Интеграция в основной дашборд
- ✅ Вкладка "Авито" в навигации

### 5. **Типы и конфигурация**
- ✅ TypeScript типы для всех API
- ✅ Конфигурация API endpoints
- ✅ Docker Compose для Avito backend

## 🎯 Как использовать

### 1. **Быстрый старт**

```bash
# 1. Скопируйте файл с переменными окружения
cp env.avito.example .env.avito

# 2. Заполните переменные в .env.avito
# - AVITO_CLIENT_ID
# - AVITO_CLIENT_SECRET  
# - OPENAI_API_KEY
# - DEZEXPERT_API_KEY
# - JWT_SECRET

# 3. Запустите интеграцию
./scripts/start-avito.sh
```

### 2. **Ручной запуск**

```bash
# Запуск Avito backend
docker-compose -f docker-compose.avito.yml up -d

# Запуск основного приложения
npm run dev
```

### 3. **Использование в интерфейсе**

1. Откройте http://localhost:3000/app/dashboard
2. Перейдите на вкладку **"Авито"**
3. Нажмите **"Подключить Avito"**
4. Авторизуйтесь через OAuth
5. Синхронизируйте объявления
6. Включите ИИ-ассистент для нужных объявлений

## 🔧 Настройка

### Переменные окружения

Создайте файл `.env.avito`:

```bash
# Avito OAuth (обязательно)
AVITO_CLIENT_ID=your_client_id
AVITO_CLIENT_SECRET=your_client_secret

# OpenAI API (обязательно)
OPENAI_API_KEY=sk-your_key

# DezExpert API (обязательно)
DEZEXPERT_API_KEY=your_api_key

# JWT Secret (обязательно)
JWT_SECRET=your_secret

# Webhook Secret (обязательно)
WEBHOOK_SIGNATURE_SECRET=your_webhook_secret
```

### Получение API ключей

#### Avito OAuth
1. Зайдите на https://developers.avito.ru/
2. Создайте приложение
3. Получите Client ID и Client Secret
4. Настройте Redirect URI: `http://localhost:3001/api/avito/oauth/callback`

#### OpenAI API
1. Зайдите на https://platform.openai.com/api-keys
2. Создайте новый API ключ
3. Скопируйте ключ в переменную `OPENAI_API_KEY`

## 📁 Структура файлов

```
src/
├── app/
│   ├── api/avito/           # API routes для Avito
│   └── app/(protected)/
│       ├── avito/           # Страница Avito
│       └── dashboard/       # Обновленный дашборд
├── components/
│   ├── AvitoConnection.tsx  # Подключение аккаунта
│   └── AvitoListings.tsx   # Управление объявлениями
├── hooks/
│   └── useAvito.ts         # Хук для работы с API
├── lib/
│   └── avito-types.ts      # TypeScript типы
└── tests/
    └── avito-integration.test.ts  # Тесты
```

## 🎨 UI/UX

### Дизайн
- ✅ Современный дизайн с Tailwind CSS
- ✅ Оранжевая цветовая схема для Avito
- ✅ Адаптивная верстка
- ✅ Анимации и переходы

### Компоненты
- ✅ Карточки подключения
- ✅ Таблица объявлений
- ✅ Переключатели ИИ-ассистента
- ✅ Статистика и метрики
- ✅ Обработка ошибок

## 🔒 Безопасность

- ✅ OAuth 2.0 авторизация
- ✅ JWT токены
- ✅ Безопасное хранение токенов
- ✅ Валидация входных данных
- ✅ Обработка ошибок

## 📊 Мониторинг

### Health Checks
```bash
# Проверка Avito backend
curl http://localhost:3001/api/health

# Проверка основного приложения
curl http://localhost:3000/api/health
```

### Логи
```bash
# Логи Avito backend
docker-compose -f docker-compose.avito.yml logs -f avito-backend

# Логи базы данных
docker-compose -f docker-compose.avito.yml logs -f avito-postgres
```

## 🐛 Troubleshooting

### Частые проблемы

#### 1. Ошибка авторизации
```
❌ Ошибка: "Не удалось подключить аккаунт"
✅ Решение: Проверьте AVITO_CLIENT_ID и AVITO_CLIENT_SECRET
```

#### 2. Не синхронизируются объявления
```
❌ Ошибка: "Ошибка синхронизации объявлений"
✅ Решение: Убедитесь, что Avito backend запущен на порту 3001
```

#### 3. ИИ не отвечает
```
❌ Ошибка: "Ошибка переключения ИИ ассистента"
✅ Решение: Проверьте OPENAI_API_KEY
```

### Отладка

```bash
# Проверка статуса сервисов
docker-compose -f docker-compose.avito.yml ps

# Перезапуск сервисов
docker-compose -f docker-compose.avito.yml restart

# Очистка и перезапуск
docker-compose -f docker-compose.avito.yml down
docker-compose -f docker-compose.avito.yml up -d
```

## 🚀 Развертывание

### Production

1. **Обновите переменные окружения:**
   ```bash
   AVITO_REDIRECT_URI=https://yourdomain.com/api/avito/oauth/callback
   DEZEXPERT_API_URL=https://yourdomain.com
   ```

2. **Запустите сервисы:**
   ```bash
   docker-compose -f docker-compose.avito.yml up -d
   ```

3. **Настройте reverse proxy (nginx):**
   ```nginx
   location /api/avito/ {
       proxy_pass http://localhost:3001/api/avito/;
   }
   ```

## 📈 Roadmap

### Ближайшие планы
- [ ] Аналитика диалогов
- [ ] Настройка шаблонов ответов
- [ ] Уведомления о новых сообщениях
- [ ] Экспорт статистики

### Долгосрочные планы
- [ ] Интеграция с другими платформами (Яндекс.Недвижимость, ЦИАН)
- [ ] Мобильное приложение
- [ ] Расширенная аналитика
- [ ] A/B тестирование ответов

## 🤝 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [Troubleshooting](#-troubleshooting)
2. Посмотрите логи сервисов
3. Убедитесь, что все переменные окружения настроены
4. Проверьте доступность API endpoints

## 📝 Лицензия

Интеграция Avito является частью проекта DezExpert и распространяется под той же лицензией.

---

**🎉 Готово! Интеграция Avito полностью интегрирована в ваш проект DezExpert.**
