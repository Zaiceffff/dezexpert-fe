# 🚀 Настройка реальной интеграции с Avito

## 📋 Что нужно сделать:

### 1. **Получить API ключи**

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

#### C. DezExpert API ключ:
1. **Нужен API ключ** для интеграции с вашим основным проектом
2. **Получите:** `DEZEXPERT_API_KEY`

### 2. **Настроить переменные окружения**

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
```

### 3. **Запустить Avito backend**

```bash
# Запуск через Docker Compose
docker-compose -f docker-compose.avito.yml up -d

# Или через скрипт
./scripts/start-avito.sh
```

### 4. **Проверить работу**

1. **Откройте:** http://localhost:3000/app/dashboard
2. **Перейдите на вкладку "Avito"**
3. **Нажмите "Подключить Avito аккаунт"**
4. **Выполните OAuth авторизацию**
5. **Проверьте синхронизацию объявлений**

## 🔧 Структура интеграции:

```
Frontend (Next.js) → API Routes → Avito Backend (NestJS) → Avito API
                                    ↓
                              OpenAI API
                                    ↓
                              DezExpert CRM
```

## 📊 Что будет работать:

- ✅ **OAuth авторизация** с Avito
- ✅ **Синхронизация объявлений** с Avito
- ✅ **Переключение ИИ ассистента** для каждого объявления
- ✅ **Автоматические ответы** через OpenAI
- ✅ **Создание лидов** в DezExpert CRM
- ✅ **Обработка webhook'ов** от Avito

## 🚨 Важные моменты:

1. **Webhook URL:** Настройте в Avito: `http://your-domain.com/api/avito/webhook`
2. **Redirect URI:** Настройте в Avito: `http://your-domain.com/api/avito/oauth/callback`
3. **SSL:** Для продакшена нужен HTTPS
4. **Rate Limits:** Учитывайте лимиты API Avito и OpenAI

## 🆘 Если что-то не работает:

1. **Проверьте логи:** `docker-compose -f docker-compose.avito.yml logs`
2. **Проверьте переменные:** Убедитесь что все ключи заполнены
3. **Проверьте доступность:** Avito backend должен быть доступен на порту 3001
4. **Проверьте API ключи:** Убедитесь что ключи действительны

## 📞 Поддержка:

Если возникнут проблемы, проверьте:
- Логи в терминале
- Логи Docker контейнеров
- Статус API ключей
- Настройки webhook'ов в Avito
