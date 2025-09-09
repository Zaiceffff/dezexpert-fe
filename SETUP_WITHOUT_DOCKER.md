# 🚀 Настройка Avito интеграции без Docker

## 📋 Что нужно сделать:

### 1. **Установить зависимости**

```bash
# Установить PostgreSQL
brew install postgresql
brew services start postgresql

# Установить Redis
brew install redis
brew services start redis

# Или через npm (если есть)
npm install -g postgresql redis
```

### 2. **Настроить базу данных**

```bash
# Создать базу данных
createdb dez_avito

# Создать пользователя
psql -c "CREATE USER dez WITH PASSWORD 'dezpass';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE dez_avito TO dez;"
```

### 3. **Настроить переменные окружения**

Отредактируйте файл `.env.avito` и заполните реальными данными:

```bash
# Avito OAuth Credentials
AVITO_CLIENT_ID=ваш_реальный_client_id
AVITO_CLIENT_SECRET=ваш_реальный_client_secret

# OpenAI API
OPENAI_API_KEY=sk-ваш_реальный_openai_key

# DezExpert API Integration
DEZEXPERT_API_KEY=ваш_реальный_dezexpert_key

# JWT Secret для аутентификации
JWT_SECRET=ваш_секретный_jwt_ключ

# Webhook Signature Secret для безопасности
WEBHOOK_SIGNATURE_SECRET=ваш_секретный_webhook_ключ

# Database
POSTGRES_USER=dez
POSTGRES_PASSWORD=dezpass
POSTGRES_DB=dez_avito
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. **Запустить Avito backend**

```bash
cd avitobotBE-main
npm install
npm run start:dev
```

### 5. **Проверить работу**

```bash
# Проверить статус
curl http://localhost:3001/health

# Должен вернуть: {"status":"ok"}
```

### 6. **Настроить webhook в Avito**

1. **Перейдите в личный кабинет Avito:** https://developers.avito.ru/
2. **Настройте webhook URL:** `http://your-domain.com/api/avito/webhook`
3. **Настройте redirect URI:** `http://your-domain.com/api/avito/oauth/callback`

## 🔧 Альтернативный способ - через Docker Desktop

Если у вас установлен Docker Desktop:

```bash
# Запустить через Docker Compose
docker compose -f docker-compose.avito.yml up -d

# Проверить статус
docker compose -f docker-compose.avito.yml ps

# Посмотреть логи
docker compose -f docker-compose.avito.yml logs -f
```

## 🚨 Важные моменты:

1. **Порты:** Avito backend должен быть доступен на порту 3001
2. **База данных:** PostgreSQL должна быть запущена
3. **Redis:** Redis должен быть запущен для очередей
4. **API ключи:** Все ключи должны быть действительны

## 🆘 Если что-то не работает:

1. **Проверьте логи:** `npm run start:dev` в папке avitobotBE-main
2. **Проверьте порты:** `lsof -i :3001`
3. **Проверьте базу данных:** `psql -d dez_avito -c "SELECT 1;"`
4. **Проверьте Redis:** `redis-cli ping`

## 📞 Поддержка:

Если возникнут проблемы, проверьте:
- Логи в терминале
- Статус сервисов (PostgreSQL, Redis)
- Настройки API ключей
- Настройки webhook'ов в Avito
