# 🔐 OAuth Callback для Avito

Создана система обработки OAuth callback для авторизации через Avito с красивым интерфейсом и автоматическим перенаправлением.

## 📁 Структура страниц

### 1. Основная страница callback
**URL**: `https://dezexpert.pro/avito?code=...&state=...`
**Файл**: `src/app/avito/page.tsx`

**Функционал**:
- Обработка OAuth параметров (code, state, error)
- Вызов API для валидации авторизации
- Отображение статуса авторизации
- Автоматическое перенаправление через 5 секунд
- Обработка ошибок с возможностью повтора

### 2. Дополнительная страница callback
**URL**: `https://dezexpert.pro/avito/callback?code=...&state=...`
**Файл**: `src/app/avito/callback/page.tsx`

**Функционал**:
- Расширенная обработка OAuth callback
- Более детальная обработка ошибок
- Логирование для отладки
- Toast уведомления

### 3. Страница успеха
**URL**: `https://dezexpert.pro/avito/success`
**Файл**: `src/app/avito/success/page.tsx`

**Функционал**:
- Простое отображение успешной авторизации
- Обратный отсчет 5 секунд
- Кнопка ручного перенаправления

### 4. Страница ошибки
**URL**: `https://dezexpert.pro/avito/error?error=...&error_description=...`
**Файл**: `src/app/avito/error/page.tsx`

**Функционал**:
- Отображение ошибок авторизации
- Описание возможных причин
- Кнопки для повтора или возврата

## 🎨 Дизайн страниц

### Общие элементы
- **Логотип DEZEXPERT** - оранжевый градиентный круг
- **Цветовая схема** - оранжевый/красный (стиль Avito)
- **Адаптивность** - работает на всех устройствах
- **Анимации** - плавные переходы и загрузка

### Состояния интерфейса

#### 1. Загрузка
```tsx
<LoadingSpinner size="lg" />
<p>Обработка авторизации...</p>
```

#### 2. Успех
```tsx
<CheckCircle className="w-8 h-8 text-green-600" />
<h2>Авторизация успешна!</h2>
<p>Через {countdown} секунд перенаправление...</p>
```

#### 3. Ошибка
```tsx
<AlertCircle className="w-8 h-8 text-red-600" />
<h2>Ошибка авторизации</h2>
<p>Код ошибки: {error}</p>
```

## 🔧 API интеграция

### OAuth Callback API
```typescript
// Эндпоинт для обработки callback
GET http://localhost:3005/api/avito/oauth/callback/public?code=...&state=...

// Ответ при успехе
{
  "success": true,
  "account": { ... }
}

// Ответ при ошибке
{
  "success": false,
  "error": "Описание ошибки"
}
```

### Обработка параметров
```typescript
const code = searchParams.get('code');        // Код авторизации
const state = searchParams.get('state');      // Состояние для безопасности
const error = searchParams.get('error');      // Код ошибки
const errorDescription = searchParams.get('error_description'); // Описание ошибки
```

## 🚀 Логика работы

### 1. Успешная авторизация
1. Пользователь переходит по ссылке с `code` и `state`
2. Страница извлекает параметры из URL
3. Вызывается API для валидации авторизации
4. При успехе показывается сообщение об успехе
5. Запускается обратный отсчет 5 секунд
6. Автоматическое перенаправление в дашборд

### 2. Ошибка авторизации
1. Пользователь переходит по ссылке с `error`
2. Страница извлекает код и описание ошибки
3. Отображается сообщение об ошибке
4. Предлагается повторить авторизацию

### 3. Отсутствие параметров
1. Пользователь переходит без параметров
2. Отображается ошибка "Отсутствует код авторизации"
3. Предлагается вернуться в дашборд

## 🎯 Использование

### Настройка OAuth в Avito
```javascript
// Redirect URI для OAuth
const redirectUri = 'https://dezexpert.pro/avito';

// Или для дополнительной страницы
const redirectUri = 'https://dezexpert.pro/avito/callback';
```

### Тестирование
```bash
# Успешная авторизация
https://dezexpert.pro/avito?code=kuxjCa2rT-aT0OKMhd7Pfw&state=qggq4

# Ошибка авторизации
https://dezexpert.pro/avito/error?error=access_denied&error_description=User%20denied%20access

# Отсутствие параметров
https://dezexpert.pro/avito
```

## 🔍 Отладка

### Логирование
```typescript
console.log('OAuth Callback Error:', error);
console.log('Code:', code);
console.log('State:', state);
```

### Проверка API
```bash
# Тест API callback
curl "http://localhost:3005/api/avito/oauth/callback/public?code=test&state=test"
```

### Проверка параметров
```typescript
// В консоли браузера
console.log(window.location.search);
// ?code=kuxjCa2rT-aT0OKMhd7Pfw&state=qggq4
```

## 🛡️ Безопасность

### Валидация параметров
- Проверка наличия `code`
- Валидация `state` (если используется)
- Обработка ошибок OAuth

### Защита от CSRF
- Использование `state` параметра
- Валидация на сервере

### Обработка ошибок
- Graceful fallback для всех состояний
- Информативные сообщения об ошибках
- Возможность повтора операции

## 📱 Адаптивность

### Мобильные устройства
- Компактный дизайн
- Крупные кнопки
- Читаемый текст

### Планшеты
- Оптимизированная сетка
- Удобные элементы управления

### Десктоп
- Полный функционал
- Дополнительная информация

## 🎨 Кастомизация

### Изменение таймаута
```typescript
const [countdown, setCountdown] = useState(10); // 10 секунд вместо 5
```

### Изменение сообщений
```typescript
const message = 'Ваше кастомное сообщение!';
```

### Изменение стилей
```typescript
// Кастомные цвета
className="bg-custom-color hover:bg-custom-color-dark"
```

## 🚀 Готово к использованию!

OAuth callback система полностью готова и протестирована. Все страницы адаптивны, безопасны и предоставляют отличный пользовательский опыт.

### Следующие шаги:
1. Настройте OAuth в Avito с правильным redirect URI
2. Протестируйте все сценарии авторизации
3. Настройте мониторинг ошибок
4. Добавьте аналитику для отслеживания конверсии
