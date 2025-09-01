# API Документация - DezExpert Pro

## Общая информация

Этот документ содержит описание всех API эндпоинтов проекта DezExpert Pro. API построено на Next.js App Router с использованием TypeScript.

## Базовый URL

```
http://195.200.17.116:3000
```

**Примечание:** API использует прямые эндпоинты без префикса `/api`

## Аутентификация

Большинство эндпоинтов требуют аутентификации через JWT токен, который передается в заголовке `Authorization: Bearer {token}`.

## Эндпоинты

### 🔐 Аутентификация

#### POST /auth/login
**Описание:** Авторизация пользователя
**URL:** `http://195.200.17.116:3000/auth/login`
**Тело запроса:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Ответ (201 Created):**
```json
{
  "profile": {
    "email": "string",
    "id": "string",
    "name": "string",
    "surname": "string",
    "phone": "string",
    "haveTelegramToken": "boolean",
    "haveServicePrice": "boolean"
  },
  "accessToken": "string",
  "refreshToken": "string"
}
```
**Заголовки ответа:**
- `access-control-allow-origin: *`
- `content-type: application/json; charset=utf-8`

#### POST /auth/register
**Описание:** Регистрация нового пользователя
**URL:** `http://195.200.17.116:3000/auth/register`
**Тело запроса:**
```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```
**Ответ:** 201 Created (без тела ответа)

#### POST /auth/refresh-token
**Описание:** Обновление access token
**URL:** `http://195.200.17.116:3000/auth/refresh-token`
**Тело запроса:**
```json
{
  "refreshToken": "string"
}
```
**Ответы:**
- `200 OK` - Успешное обновление токена
- `201 Created` - Токен обновлен
- `400 Bad Request` - Ошибка в запросе

### 👥 Пользователи

#### GET /user/token-info
**Описание:** Получение информации о JWT токене (для разработки)
**URL:** `http://195.200.17.116:3000/user/token-info`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Ответ:** `200 OK` - строка с информацией о токене

#### GET /user/list
**Описание:** Получение списка пользователей с пагинацией
**URL:** `http://195.200.17.116:3000/user/list`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Параметры запроса:**
- `skipPages` (обязательный) - количество страниц для пропуска (по умолчанию 0)
- `pageSize` (обязательный) - количество элементов на странице (по умолчанию 10)
- `searchValue` (опционально) - значение для поиска (по умолчанию "User")

#### GET /user/all
**Описание:** Получение всех пользователей
**URL:** `http://195.200.17.116:3000/user/all`
**Заголовки:** `Authorization: Bearer {accessToken}`

#### GET /user/profile
**Описание:** Получение профиля текущего пользователя
**URL:** `http://195.200.17.116:3000/user/profile`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Ответ:**
```json
{
  "id": "string",
  "name": "string",
  "surname": "string",
  "botToken": "string | null",
  "botLink": "string",
  "email": "string",
  "phone": "string",
  "isAdmin": "boolean",
  "isVerified": "boolean",
  "unlimitedAccount": "boolean",
  "linkId": "string",
  "status": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "tariff": {
    "id": "string",
    "name": "string",
    "price": "string",
    "isPromo": "boolean",
    "isActive": "boolean",
    "advantages": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### PATCH /user/password-reset-token
**Описание:** Запрос токена для сброса пароля
**URL:** `http://195.200.17.116:3000/user/password-reset-token`
**Тело запроса:**
```json
{
  "email": "string"
}
```

#### PATCH /user/user-status/{id}
**Описание:** Изменение статуса пользователя
**URL:** `http://195.200.17.116:3000/user/user-status/{id}`
**Параметры:** `id` - идентификатор пользователя
**Тело запроса:**
```json
{
  "status": "Active"
}
```

#### POST /user/recover-password
**Описание:** Восстановление пароля
**URL:** `http://195.200.17.116:3000/user/recover-password`
**Тело запроса:**
```json
{
  "newPassword": "string",
  "token": "string"
}
```

#### DELETE /user/delete-user
**Описание:** Удаление текущего пользователя
**URL:** `http://195.200.17.116:3000/user/delete-user`
**Заголовки:** `Authorization: Bearer {accessToken}`

#### DELETE /user/by-id/{id}
**Описание:** Удаление пользователя по ID
**URL:** `http://195.200.17.116:3000/user/by-id/{id}`
**Параметры:** `id` - идентификатор пользователя
**Заголовки:** `Authorization: Bearer {accessToken}`

#### PATCH /user/by-id/{id}
**Описание:** Обновление пользователя по ID
**URL:** `http://195.200.17.116:3000/user/by-id/{id}`
**Параметры:** `id` - идентификатор пользователя
**Тело запроса:**
```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "isVerified": "boolean",
  "status": "string"
}
```

#### PATCH /user/password
**Описание:** Изменение пароля
**URL:** `http://195.200.17.116:3000/user/password`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Тело запроса:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### GET /user/order-list
**Описание:** Получение списка заказов пользователя
**URL:** `http://195.200.17.116:3000/user/order-list`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Параметры запроса:**
- `skipPages` (обязательный) - количество страниц для пропуска
- `pageSize` (обязательный) - количество элементов на странице

#### PATCH /user/service
**Описание:** Обновление цен на услуги пользователя
**URL:** `http://195.200.17.116:3000/user/service`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Тело запроса:**
```json
{
  "oneRoomLiquid": "number",
  "oneRoomGel": "number",
  "twoRoomLiquid": "number",
  "twoRoomGel": "number",
  "threeRoomLiquid": "number",
  "threeRoomGel": "number",
  "fourRoomLiquid": "number",
  "fourRoomGel": "number",
  "homeRoomLiquid": "number",
  "homeRoomGel": "number",
  "plotRoomLiquid": "number",
  "plotRoomGel": "number",
  "restaurantRoomLiquid": "number",
  "restaurantRoomGel": "number"
}
```

#### GET /user/service
**Описание:** Получение цен на услуги пользователя
**URL:** `http://195.200.17.116:3000/user/service`
**Заголовки:** `Authorization: Bearer {accessToken}`

### 💳 Платежи

#### GET /payment/subscription-link/{tariffId}
**Описание:** Создание ссылки для подписки на тариф
**URL:** `http://195.200.17.116:3000/payment/subscription-link/{tariffId}`
**Параметры:** `tariffId` - идентификатор тарифа
**Заголовки:** `Authorization: Bearer {accessToken}`
**Ответ:** `200 OK` - строка с ссылкой на оплату

#### GET /payment/payment-link/{tariffId}
**Описание:** Создание ссылки для разовой оплаты тарифа
**URL:** `http://195.200.17.116:3000/payment/payment-link/{tariffId}`
**Параметры:** `tariffId` - идентификатор тарифа
**Заголовки:** `Authorization: Bearer {accessToken}`
**Ответ:** `200 OK` - строка с ссылкой на оплату

#### GET /payment/cancel-subscription
**Описание:** Отмена подписки
**URL:** `http://195.200.17.116:3000/payment/cancel-subscription`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Ответ:** `200 OK` - строка с подтверждением отмены

#### POST /payment/tochka-webhook
**Описание:** Webhook для обработки платежей от Точка Банка
**URL:** `http://195.200.17.116:3000/payment/tochka-webhook`
**Ответ:** `200 OK` - строка с результатом обработки

**Примечание:** Эндпоинты платежей используются для интеграции с платежными системами и управления подписками на тарифы.

### 📋 Тарифы

#### GET /tariff/list
**Описание:** Получение списка всех тарифов
**URL:** `http://195.200.17.116:3000/tariff/list`
**Ответ:** `200 OK` - массив тарифов с информацией о пользователях

**Структура ответа:**
```json
{
  "id": "string",
  "name": "string",
  "price": "string",
  "isPromo": "boolean",
  "isActive": "boolean",
  "advantages": ["string"],
  "createdAt": "string",
  "updatedAt": "string",
  "user": [
    {
      "id": "string",
      "name": "string",
      "surname": "string",
      "botToken": "string",
      "botLink": "string",
      "email": "string",
      "phone": "string",
      "password": "string",
      "isAdmin": "boolean",
      "isVerified": "boolean",
      "unlimitedAccount": "boolean",
      "linkId": "string",
      "passwordResetToken": "string",
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": ["Order"],
      "tariff": "string",
      "service": "Service",
      "transaction": ["Transaction"]
    }
  ]
}
```

**Примечание:** Эндпоинт тарифов предоставляет полную информацию о доступных тарифах и пользователях, которые их используют.

### 🔗 Webhook'и

#### POST /hook/avito
**Описание:** Webhook для обработки сообщений от Avito
**URL:** `http://195.200.17.116:3000/hook/avito`
**Тело запроса:**
```json
{
  "id": "string",
  "version": "string",
  "timestamp": "number",
  "payload": {
    "type": "string",
    "value": {
      "id": "string",
      "chat_id": "string",
      "user_id": "number",
      "author_id": "number",
      "created": "number",
      "type": "string",
      "chat_type": "string",
      "content": {
        "text": "string"
      },
      "item_id": "number",
      "published_at": "string"
    }
  }
}
```

**Ответ:** `200 OK` - `true` при успешной обработке

**Примечание:** Webhook используется для интеграции с Avito и обработки входящих сообщений от пользователей.

### 🌱 Сиды (Тестовые данные)

#### GET /seed
**Описание:** Создание основных сидов (тестовых данных)
**URL:** `http://195.200.17.116:3000/seed`
**Ответ:** `200 OK` - сиды успешно созданы

#### GET /seed/tariff
**Описание:** Создание сидов для тарифов
**URL:** `http://195.200.17.116:3000/seed/tariff`
**Ответ:** `200 OK` - сиды тарифов успешно созданы

**Примечание:** Эндпоинты сидов используются для разработки и тестирования. Они создают тестовые данные в базе данных.

### 🛒 Заказы

#### GET /order/list
**Описание:** Получение списка заказов с пагинацией
**URL:** `http://195.200.17.116:3000/order/list`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Параметры запроса:**
- `skipPages` (обязательный) - количество страниц для пропуска
- `pageSize` (обязательный) - количество элементов на странице

**Ответ:**
```json
{
  "data": [
    {
      "id": "65d61648-d5a9-49bb-a990-a11c0ffb69f7",
      "service": "cockroaches",
      "object": "apartment1",
      "count": "sometimes",
      "experience": "yes",
      "phoneNumber": "+79005553322",
      "address": "Витебская 47",
      "name": "Юрийййййййй",
      "chatId": null,
      "username": null,
      "orderCreated": true,
      "liquidPrice": 0,
      "jelPrice": 3000,
      "realPrice": 3000,
      "status": "Inprogress",
      "clientComment": "коммент",
      "dezinsectorComment": "",
      "expectDate": "2025-08-18",
      "createdAt": "2025-08-18T15:21:10.303Z",
      "updatedAt": "2025-08-18T15:44:14.843Z"
    }
  ],
  "count": 57
}
```

**Примечание:** API возвращает реальные данные. Поля `chatId` и `username` могут быть `null`. Поле `realPrice` может быть `null`, если финальная цена еще не установлена.

**Возможные статусы заказов:**
- `New` - Новый заказ
- `Inprogress` - Заказ в работе
- `completed` - Завершен
- `cancelled` - Отменен

**Примеры услуг:**
- `cockroaches` - Тараканы
- `Клещи` - Клещи
- `Тараканы` - Тараканы (русский)
- `Мухи и клопы` - Комбинированная услуга
- `Клопы` - Клопы

#### POST /order
**Описание:** Создание нового заказа
**URL:** `http://195.200.17.116:3000/order`
**Заголовки:** `Authorization: Bearer {accessToken}`
**Тело запроса:**
```json
{
  "service": "string",
  "object": "string",
  "count": "string",
  "experience": "string",
  "address": "string",
  "phoneNumber": "string",
  "name": "string",
  "clientComment": "string",
  "dezinsectorComment": "string",
  "dezinsectorId": "string",
  "expectDate": "string"
}
```

#### PATCH /order/by-id/{id}
**Описание:** Обновление заказа по ID
**URL:** `http://195.200.17.116:3000/order/by-id/{id}`
**Параметры:** `id` - идентификатор заказа
**Заголовки:** `Authorization: Bearer {accessToken}`
**Тело запроса:**
```json
{
  "service": "string",
  "object": "string",
  "count": "string",
  "experience": "string",
  "address": "string",
  "name": "string",
  "status": "string",
  "clientComment": "string",
  "dezinsectorComment": "string",
  "realPrice": "number"
}
```

### 📊 Лиды

#### GET /api/leads
**Описание:** Получение списка лидов
**Параметры запроса:**
- `partnerId` (обязательный) - ID партнера
- `limit` (опционально) - количество записей (по умолчанию 50)
- `search` (опционально) - поиск по имени или телефону
- `status` (опционально) - фильтр по статусу

**Пример:**
```
GET /api/leads?partnerId=123&limit=20&search=Иван&status=new
```

**Ответ:**
```json
[
  {
    "id": "string",
    "partnerId": "string",
    "pestType": "string",
    "objectType": "string",
    "rooms": "string",
    "infestation": "string",
    "previousTreatment": "string",
    "phone": "string",
    "address": "string",
    "name": "string",
    "expectedDate": "string",
    "clientComment": "string",
    "approxPrice": "number",
    "status": "string",
    "source": "string",
    "createdAt": "string"
  }
]
```

#### GET /api/leads/[id]
**Описание:** Получение детальной информации о лиде
**Параметры:** `id` - идентификатор лида

#### POST /api/leads
**Описание:** Создание нового лида
**Тело запроса:**
```json
{
  "partnerId": "string",
  "pestType": "string",
  "objectType": "string",
  "rooms": "string",
  "infestation": "string",
  "previousTreatment": "string",
  "phone": "string",
  "address": "string",
  "name": "string",
  "expectedDate": "string",
  "clientComment": "string",
  "approxPrice": "number"
}
```

#### PUT /api/leads/[id]
**Описание:** Обновление лида
**Параметры:** `id` - идентификатор лида

#### DELETE /api/leads/[id]
**Описание:** Удаление лида
**Параметры:** `id` - идентификатор лида

### 🛒 Заказы

#### GET /api/order/list
**Описание:** Получение списка заказов
**Параметры запроса:**
- `partnerId` (обязательный) - ID партнера
- `status` (опционально) - фильтр по статусу
- `limit` (опционально) - количество записей

#### GET /api/order/[id]
**Описание:** Получение детальной информации о заказе
**Параметры:** `id` - идентификатор заказа

#### POST /api/order
**Описание:** Создание нового заказа

### 🤝 Партнеры

#### GET /api/partners/[id]/pricing
**Описание:** Получение цен партнера
**Параметры:** `id` - идентификатор партнера

### 📱 SMS

#### POST /api/sms/send
**Описание:** Отправка SMS сообщения
**Тело запроса:**
```json
{
  "phone": "string",
  "message": "string"
}
```

### 🤖 AI

#### POST /api/ai/proxy
**Описание:** Прокси для AI API
**Тело запроса:** Зависит от конкретного AI сервиса

### ⏰ Напоминания

#### GET /api/reminders/schedule
**Описание:** Получение расписания напоминаний

## Коды ошибок

- `200` - Успешно (OK)
- `201` - Создано (Created)
- `400` - Неверный запрос (Bad Request)
- `401` - Не авторизован (Unauthorized)
- `403` - Доступ запрещен (Forbidden)
- `404` - Не найдено (Not Found)
- `500` - Внутренняя ошибка сервера (Internal Server Error)

## Особенности аутентификации

- **Access Token** - используется для авторизации API запросов
- **Refresh Token** - используется для обновления access token
- **Bearer Token** - передается в заголовке `Authorization: Bearer {token}`
- **Автоматическое обновление** - рекомендуется обновлять токен при получении 401 ошибки

## Примеры использования

### Получение лидов с фильтрацией
```javascript
const response = await fetch('http://195.200.17.116:3000/leads?partnerId=123&status=new&limit=10', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const leads = await response.json();
```

### Создание нового лида
```javascript
const response = await fetch('http://195.200.17.116:3000/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    partnerId: '123',
    name: 'Иван Иванов',
    phone: '+79001234567',
    address: 'ул. Примерная, 1',
    pestType: 'Тараканы',
    objectType: 'Квартира',
    rooms: '2',
    infestation: 'Средняя',
    previousTreatment: 'Нет',
    expectedDate: '2024-01-15',
    clientComment: 'Срочно нужно обработать',
    approxPrice: 5000
  })
});
```

## Примечания

- Все даты передаются в формате ISO 8601 (YYYY-MM-DD)
- Цены указываются в рублях
- Телефоны должны быть в международном формате (+7XXXXXXXXXX)
- Статусы лидов: `new`, `in_progress`, `completed`, `cancelled`
- Статусы заказов: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

## Пример обновления токена

```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://195.200.17.116:3000/auth/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (response.ok) {
    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  }
};
```
