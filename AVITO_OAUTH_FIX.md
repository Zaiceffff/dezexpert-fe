# 🔧 Исправление OAuth проблемы

## Проблема

При нажатии на "Подключить Avito" происходит перенаправление на:
```
https://www.avito.ru/oauth/authorize?client_id=hF49pA0JvwucazxwgIel&redirect_uri=http://localhost:3001/api/avito/oauth/callback&response_type=code&state=2z1dqa
```

**Неправильно**: `redirect_uri=http://localhost:3001/api/avito/oauth/callback`
**Правильно**: `redirect_uri=http://localhost:3005/api/avito/oauth/callback`

## ✅ Решение

### 1. Проверьте переменные окружения

Создайте файл `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005/api
NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI=http://localhost:3005/api/avito/oauth/callback
```

### 2. Убедитесь, что backend запущен на порту 3005

```bash
cd avitobotBE-main
npm run start:dev
```

Backend должен быть доступен по адресу: `http://localhost:3005`

### 3. Проверьте настройки OAuth в Avito Developer Console

В настройках вашего приложения в Avito Developer Console должен быть указан правильный redirect_uri:
```
http://localhost:3005/api/avito/oauth/callback
```

### 4. Перезапустите frontend

```bash
npm run dev
```

## 🔍 Отладка

### Проверка переменных окружения

В консоли браузера выполните:
```javascript
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
console.log('OAuth Redirect URI:', process.env.NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI);
```

### Проверка API запросов

1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Нажмите "Подключить Avito"
4. Проверьте, что запрос идет на `http://localhost:3005/api/avito/oauth/url`

### Проверка backend

```bash
# Проверка здоровья API
curl http://localhost:3005/api/health

# Проверка OAuth URL
curl http://localhost:3005/api/avito/oauth/url
```

## 📁 Файлы для проверки

### 1. `.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3005/api
NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI=http://localhost:3005/api/avito/oauth/callback
```

### 2. `src/lib/api-config.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005/api',
  AVITO_OAUTH_REDIRECT_URI: process.env.NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI || 'http://localhost:3005/api/avito/oauth/callback',
};
```

### 3. Backend настройки

Убедитесь, что в вашем backend правильно настроен OAuth redirect_uri:
```javascript
// В настройках OAuth
redirect_uri: 'http://localhost:3005/api/avito/oauth/callback'
```

## 🚀 Тестирование

### 1. Откройте страницу Avito
```
http://localhost:3000/avito
```

### 2. Нажмите "Подключить Avito"

### 3. Проверьте URL в новом окне

URL должен содержать:
```
redirect_uri=http://localhost:3005/api/avito/oauth/callback
```

### 4. После авторизации

Вы должны быть перенаправлены на:
```
http://localhost:3005/api/avito/oauth/callback?code=...&state=...
```

## 🐛 Частые проблемы

### Проблема: Переменные окружения не загружаются

**Решение**: Перезапустите frontend после изменения `.env.local`

### Проблема: Backend не отвечает

**Решение**: 
1. Проверьте, что backend запущен
2. Проверьте порт (должен быть 3005)
3. Проверьте CORS настройки

### Проблема: OAuth URL неправильный

**Решение**:
1. Проверьте переменную `NEXT_PUBLIC_AVITO_OAUTH_REDIRECT_URI`
2. Убедитесь, что она указывает на порт 3005
3. Проверьте настройки в Avito Developer Console

## ✅ Готово!

После исправления OAuth должен работать правильно:

1. ✅ OAuth URL содержит правильный redirect_uri
2. ✅ Перенаправление идет на backend (порт 3005)
3. ✅ Backend обрабатывает callback
4. ✅ Токены сохраняются
5. ✅ Можно синхронизировать объявления

**Следующие шаги**:
1. Исправьте переменные окружения
2. Перезапустите сервисы
3. Протестируйте OAuth
4. Синхронизируйте объявления
5. Управляйте ИИ-ассистентом
