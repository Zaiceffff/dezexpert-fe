# 🚀 Быстрый тест интеграции Avito

## 📋 Что нужно для тестирования:

### 1. **Получить API ключи (минимум):**

#### A. Avito API ключи:
1. **Перейдите на:** https://developers.avito.ru/
2. **Создайте приложение** в личном кабинете
3. **Получите:**
   - `AVITO_CLIENT_ID` - ID приложения
   - `AVITO_CLIENT_SECRET` - Секретный ключ

#### B. OpenAI API ключ:
1. **Перейдите на:** https://platform.openai.com/api-keys
2. **Создайте новый API ключ**
3. **Получите:** `OPENAI_API_KEY` (начинается с `sk-`)

### 2. **Настроить переменные окружения:**

Отредактируйте файл `.env.avito`:

```bash
# Avito OAuth Credentials
AVITO_CLIENT_ID=ваш_реальный_client_id
AVITO_CLIENT_SECRET=ваш_реальный_client_secret

# OpenAI API
OPENAI_API_KEY=sk-ваш_реальный_openai_key

# DezExpert API Integration (можно оставить пустым для теста)
DEZEXPERT_API_KEY=test_key

# JWT Secret для аутентификации
JWT_SECRET=test_jwt_secret_key

# Webhook Signature Secret для безопасности
WEBHOOK_SIGNATURE_SECRET=test_webhook_secret

# Database (используем SQLite для простоты)
POSTGRES_USER=dez
POSTGRES_PASSWORD=dezpass
POSTGRES_DB=dez_avito
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis (можно отключить для теста)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. **Запустить Avito backend:**

```bash
cd avitobotBE-main
npm install
npm run start:dev
```

### 4. **Проверить работу:**

```bash
# Проверить статус
curl http://localhost:3001/health

# Должен вернуть: {"status":"ok"}
```

### 5. **Тестировать в браузере:**

1. **Откройте:** http://localhost:3000/app/dashboard
2. **Перейдите на вкладку "Avito"**
3. **Нажмите "Подключить Avito аккаунт"**
4. **Выполните OAuth авторизацию**
5. **Проверьте синхронизацию объявлений**

## 🎯 **Что будет работать:**

- ✅ **OAuth авторизация** - каждый пользователь подключает свой Avito
- ✅ **Синхронизация объявлений** - каждый видит только свои объявления
- ✅ **Переключение ИИ ассистента** - для каждого объявления отдельно
- ✅ **Автоматические ответы** - через OpenAI для каждого пользователя

## 🚨 **Важные моменты:**

1. **Каждый пользователь** подключает свой Avito аккаунт
2. **Отдельные токены** для каждого пользователя
3. **Отдельные объявления** для каждого пользователя
4. **Отдельные ИИ ассистенты** для каждого пользователя

## 🆘 **Если что-то не работает:**

1. **Проверьте логи:** `npm run start:dev` в папке avitobotBE-main
2. **Проверьте порты:** `lsof -i :3001`
3. **Проверьте API ключи:** Убедитесь что ключи действительны
4. **Проверьте настройки:** В личном кабинете Avito

## 📞 **Поддержка:**

Если возникнут проблемы, проверьте:
- Логи в терминале
- Статус сервисов
- Настройки API ключей
- Настройки webhook'ов в Avito
