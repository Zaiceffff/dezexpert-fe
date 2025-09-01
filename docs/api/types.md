# Типы данных API - DezExpert Pro

## Основные интерфейсы

### Lead (Лид)
```typescript
interface Lead {
  id: string;
  partnerId: string;
  pestType: string;           // Тип вредителя
  objectType: string;         // Тип объекта
  rooms: string;              // Количество комнат
  infestation: string;        // Степень заражения
  previousTreatment: string;  // Предыдущая обработка
  phone: string;              // Телефон клиента
  address: string;            // Адрес объекта
  name: string;               // Имя клиента
  expectedDate: string;       // Ожидаемая дата обработки
  clientComment: string;      // Комментарий клиента
  approxPrice: number;        // Примерная цена
  status: LeadStatus;         // Статус лида
  source: string;             // Источник лида
  createdAt: string;          // Дата создания
}
```

### Order (Заказ)
```typescript
interface Order {
  id: string;
  service: string;                // Тип услуги
  object: string;                 // Тип объекта
  count: string;                  // Количество/степень заражения
  experience: string;             // Опыт предыдущих обработок
  phoneNumber: string;            // Номер телефона клиента
  address: string;                // Адрес объекта
  name: string;                   // Имя клиента
  chatId: number | null;          // ID чата в Telegram
  username: string | null;        // Username в Telegram
  orderCreated: boolean;          // Создан ли заказ
  liquidPrice: number;            // Цена жидкого препарата
  jelPrice: number;               // Цена геля
  realPrice: number | null;       // Реальная цена
  status: OrderStatus;            // Статус заказа
  clientComment: string | null;   // Комментарий клиента
  dezinsectorComment: string | null; // Комментарий дезинсектора
  expectDate: string;             // Ожидаемая дата
  createdAt: string;              // Дата создания
  updatedAt: string;              // Дата обновления
  user?: User;                    // Информация о пользователе (опционально)
}
```

### User (Пользователь)
```typescript
interface User {
  id: string;
  name: string;                    // Имя пользователя
  surname: string;                 // Фамилия пользователя
  botToken: string;                // Telegram бот токен
  botLink: string;                 // Ссылка на бота
  email: string;                   // Email пользователя
  phone: string;                   // Телефон пользователя
  password: string;                // Пароль (зашифрованный)
  isAdmin: boolean;                // Является ли администратором
  isVerified: boolean;             // Подтвержден ли аккаунт
  unlimitedAccount: boolean;       // Безлимитный аккаунт
  linkId: string;                  // ID ссылки
  passwordResetToken: string;      // Токен для сброса пароля
  status: UserStatus;              // Статус пользователя
  createdAt: string;               // Дата создания
  updatedAt: string;               // Дата обновления
  tariff?: Tariff;                 // Тариф пользователя (опционально)
}
```

### Partner (Партнер)
```typescript
interface Partner {
  id: string;
  name: string;               // Название компании
  contactPerson: string;      // Контактное лицо
  phone: string;              // Телефон
  email: string;              // Email
  address: string;            // Адрес
  services: Service[];        // Предоставляемые услуги
  pricing: Pricing[];         // Цены на услуги
  isActive: boolean;          // Активен ли партнер
}
```

### Service (Услуга)
```typescript
interface Service {
  id: string;
  oneRoomLiquid: number;         // Цена для 1 комнаты (жидкость)
  oneRoomGel: number;            // Цена для 1 комнаты (гель)
  twoRoomLiquid: number;         // Цена для 2 комнат (жидкость)
  twoRoomGel: number;            // Цена для 2 комнат (гель)
  threeRoomLiquid: number;       // Цена для 3 комнат (жидкость)
  threeRoomGel: number;          // Цена для 3 комнат (гель)
  fourRoomLiquid: number;        // Цена для 4 комнат (жидкость)
  fourRoomGel: number;           // Цена для 4 комнат (гель)
  homeRoomLiquid: number;        // Цена для частного дома (жидкость)
  homeRoomGel: number;           // Цена для частного дома (гель)
  plotRoomLiquid: number;        // Цена для участка (жидкость)
  plotRoomGel: number;           // Цена для участка (гель)
  restaurantRoomLiquid: number;  // Цена для ресторана (жидкость)
  restaurantRoomGel: number;     // Цена для ресторана (гель)
  createdAt: string;              // Дата создания
  updatedAt: string;              // Дата обновления
  user: string;                   // ID пользователя
}
```

### Tariff (Тариф)
```typescript
interface Tariff {
  id: string;
  name: string;                   // Название тарифа
  price: string;                  // Цена тарифа
  isPromo: boolean;               // Является ли промо
  isActive: boolean;               // Активен ли тариф
  advantages: string[];           // Преимущества тарифа
  createdAt: string;              // Дата создания
  updatedAt: string;              // Дата обновления
}
```

### Transaction (Транзакция)
```typescript
interface Transaction {
  id: string;
  purpose: string;                // Назначение транзакции
  amount: number;                 // Сумма
  operationId: string;            // ID операции
  paymentLink: string;            // Ссылка на оплату
  consumerId: string;             // ID потребителя
  status: TransactionStatus;      // Статус транзакции
  createdAt: string;              // Дата создания
  updatedAt: string;              // Дата обновления
  user: string;                   // ID пользователя
}
```

### Pricing (Ценообразование)
```typescript
interface Pricing {
  id: string;
  partnerId: string;          // ID партнера
  serviceId: string;          // ID услуги
  price: number;              // Цена
  minArea?: number;           // Минимальная площадь
  maxArea?: number;           // Максимальная площадь
  isActive: boolean;          // Активна ли цена
}
```

## Перечисления (Enums)

### LeadStatus
```typescript
enum LeadStatus {
  NEW = 'new',                    // Новый
  IN_PROGRESS = 'in_progress',    // В работе
  COMPLETED = 'completed',        // Завершен
  CANCELLED = 'cancelled'         // Отменен
}
```

### OrderStatus
```typescript
enum OrderStatus {
  NEW = 'New',                    // Новый
  INPROGRESS = 'Inprogress',      // В работе
  PENDING = 'pending',            // Ожидает подтверждения
  CONFIRMED = 'confirmed',        // Подтвержден
  IN_PROGRESS = 'in_progress',    // В работе (альтернативный)
  COMPLETED = 'completed',        // Завершен
  CANCELLED = 'cancelled'         // Отменен
}
```

### UserStatus
```typescript
enum UserStatus {
  ACTIVE = 'Active',              // Активный
  INACTIVE = 'Inactive',          // Неактивный
  SUSPENDED = 'Suspended',        // Приостановлен
  DELETED = 'Deleted'             // Удален
}
```

### TransactionStatus
```typescript
enum TransactionStatus {
  ACTIVE = 'Active',              // Активная
  PENDING = 'Pending',            // Ожидает
  COMPLETED = 'Completed',        // Завершена
  FAILED = 'Failed',              // Неудачная
  CANCELLED = 'Cancelled'         // Отменена
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  SUCCESS = 'success',            // Успешно
  PENDING = 'pending',            // Ожидает
  FAILED = 'failed',              // Неудачно
  CANCELLED = 'cancelled',        // Отменено
  REFUNDED = 'refunded'          // Возвращено
}
```

### UserRole
```typescript
enum UserRole {
  ADMIN = 'admin',                // Администратор
  PARTNER = 'partner',            // Партнер
  MANAGER = 'manager',            // Менеджер
  USER = 'user'                   // Обычный пользователь
}
```

### ServiceCategory
```typescript
enum ServiceCategory {
  PEST_CONTROL = 'pest_control',      // Дезинсекция
  DISINFECTION = 'disinfection',      // Дезинфекция
  DERATIZATION = 'deratization',      // Дератизация
  SANITARY = 'sanitary',              // Санитарная обработка
  OTHER = 'other'                     // Прочее
}
```

### PestType
```typescript
enum PestType {
  COCKROACHES = 'cockroaches',        // Тараканы
  BEDBUGS = 'bedbugs',                // Клопы
  RATS = 'rats',                      // Крысы
  MICE = 'mice',                      // Мыши
  ANTS = 'ants',                      // Муравьи
  MOSQUITOES = 'mosquitoes',          // Комары
  FLIES = 'flies',                    // Мухи
  OTHER = 'other'                     // Прочие
}
```

### ObjectType
```typescript
enum ObjectType {
  APARTMENT = 'apartment',            // Квартира
  HOUSE = 'house',                    // Частный дом
  OFFICE = 'office',                  // Офис
  WAREHOUSE = 'warehouse',            // Склад
  RESTAURANT = 'restaurant',          // Ресторан
  HOTEL = 'hotel',                    // Гостиница
  SHOP = 'shop',                      // Магазин
  OTHER = 'other'                     // Прочее
}
```

## Запросы и ответы

### LoginRequest
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### LoginResponse
```typescript
interface LoginResponse {
  profile: User;
  accessToken: string;
  refreshToken: string;
}
```

### RegisterRequest
```typescript
interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
}
```

### RefreshTokenRequest
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

### PasswordResetRequest
```typescript
interface PasswordResetRequest {
  email: string;
}
```

### PasswordChangeRequest
```typescript
interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}
```

### PasswordRecoveryRequest
```typescript
interface PasswordRecoveryRequest {
  newPassword: string;
  token: string;
}
```

### UserStatusUpdateRequest
```typescript
interface UserStatusUpdateRequest {
  status: UserStatus;
}
```

### UserUpdateRequest
```typescript
interface UserUpdateRequest {
  name?: string;
  surname?: string;
  email?: string;
  isVerified?: boolean;
  status?: UserStatus;
}
```

### ServicePricingRequest
```typescript
interface ServicePricingRequest {
  oneRoomLiquid?: number;
  oneRoomGel?: number;
  twoRoomLiquid?: number;
  twoRoomGel?: number;
  threeRoomLiquid?: number;
  threeRoomGel?: number;
  fourRoomLiquid?: number;
  fourRoomGel?: number;
  homeRoomLiquid?: number;
  homeRoomGel?: number;
  plotRoomLiquid?: number;
  plotRoomGel?: number;
  restaurantRoomLiquid?: number;
  restaurantRoomGel?: number;
}

### UserListFilters
```typescript
interface UserListFilters {
  skipPages: number;
  pageSize: number;
  searchValue?: string;
}

### UserOrderListFilters
```typescript
interface UserOrderListFilters {
  skipPages: number;
  pageSize: number;
}
```

### OrderListResponse
```typescript
interface OrderListResponse {
  data: Order[];
  count: number;
}
```

### CreateOrderRequest
```typescript
interface CreateOrderRequest {
  service: string;                 // Тип услуги
  object: string;                  // Тип объекта
  count: string;                   // Количество/степень заражения
  experience: string;              // Опыт предыдущих обработок
  address: string;                 // Адрес объекта
  phoneNumber: string;             // Номер телефона клиента
  name: string;                    // Имя клиента
  clientComment?: string;          // Комментарий клиента
  dezinsectorComment?: string;     // Комментарий дезинсектора
  dezinsectorId?: string;          // ID дезинсектора
  expectDate: string;              // Ожидаемая дата
}
```

### UpdateOrderRequest
```typescript
interface UpdateOrderRequest {
  service?: string;                // Тип услуги
  object?: string;                 // Тип объекта
  count?: string;                  // Количество/степень заражения
  experience?: string;             // Опыт предыдущих обработок
  address?: string;                // Адрес объекта
  name?: string;                   // Имя клиента
  status?: OrderStatus;            // Статус заказа
  clientComment?: string;          // Комментарий клиента
  dezinsectorComment?: string;     // Комментарий дезинсектора
  realPrice?: number;              // Реальная цена
}
```

### OrderListFilters
```typescript
interface OrderListFilters {
  skipPages: number;               // Количество страниц для пропуска
  pageSize: number;                // Количество элементов на странице
}
```

### PaymentResponse
```typescript
interface PaymentResponse {
  success: boolean;
  message: string;
  paymentLink?: string;            // Ссылка на оплату
  subscriptionId?: string;         // ID подписки
}
```

### SubscriptionLinkRequest
```typescript
interface SubscriptionLinkRequest {
  tariffId: string;                // ID тарифа для подписки
}
```

### PaymentLinkRequest
```typescript
interface PaymentLinkRequest {
  tariffId: string;                // ID тарифа для разовой оплаты
}
```

### TochkaWebhookData
```typescript
interface TochkaWebhookData {
  operationId: string;             // ID операции
  amount: number;                  // Сумма платежа
  status: PaymentStatus;           // Статус платежа
  consumerId: string;              // ID потребителя
  purpose: string;                 // Назначение платежа
  timestamp: string;               // Время операции
}
```

### TariffWithUsers
```typescript
interface TariffWithUsers {
  id: string;                      // ID тарифа
  name: string;                    // Название тарифа
  price: string;                   // Цена тарифа
  isPromo: boolean;                // Является ли промо
  isActive: boolean;               // Активен ли тариф
  advantages: string[];            // Преимущества тарифа
  createdAt: string;               // Дата создания
  updatedAt: string;               // Дата обновления
  user: User[];                    // Пользователи с этим тарифом
}
```

### TariffListResponse
```typescript
interface TariffListResponse {
  data: TariffWithUsers[];         // Массив тарифов с пользователями
  count?: number;                  // Общее количество тарифов
}
```

### AvitoWebhookPayload
```typescript
interface AvitoWebhookPayload {
  type: string;                    // Тип сообщения
  value: {
    id: string;                    // ID сообщения
    chat_id: string;               // ID чата
    user_id: number;               // ID пользователя
    author_id: number;             // ID автора
    created: number;               // Время создания (timestamp)
    type: string;                  // Тип контента
    chat_type: string;             // Тип чата
    content: {
      text: string;                // Текст сообщения
    };
    item_id: number;               // ID объявления
    published_at: string;          // Время публикации
  };
}
```

### AvitoWebhookRequest
```typescript
interface AvitoWebhookRequest {
  id: string;                      // ID webhook'а
  version: string;                 // Версия webhook'а
  timestamp: number;               // Время получения
  payload: AvitoWebhookPayload;    // Данные сообщения
}
```

### WebhookResponse
```typescript
interface WebhookResponse {
  success: boolean;                // Успешность обработки
  message?: string;                // Сообщение о результате
}
```

### SeedResponse
```typescript
interface SeedResponse {
  success: boolean;
  message: string;
  count?: number;              // Количество созданных записей
}
```

### CreateLeadRequest
```typescript
interface CreateLeadRequest {
  partnerId: string;
  pestType: string;
  objectType: string;
  rooms: string;
  infestation: string;
  previousTreatment: string;
  phone: string;
  address: string;
  name: string;
  expectedDate: string;
  clientComment?: string;
  approxPrice?: number;
}
```

### UpdateLeadRequest
```typescript
interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  id: string;
}
```

### LeadFilters
```typescript
interface LeadFilters {
  partnerId: string;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  dateFrom?: string;
  dateTo?: string;
}
```

### OrderFilters
```typescript
interface OrderFilters {
  partnerId: string;
  status?: OrderStatus;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}
```

## Валидация

### Телефон
- Формат: `+7XXXXXXXXXX` (11 цифр, начинается с +7)
- Пример: `+79001234567`

### Email
- Стандартный формат email
- Пример: `user@example.com`

### Дата
- Формат: `YYYY-MM-DD`
- Пример: `2024-01-15`

### Цена
- Число в рублях
- Минимальное значение: 0
- Максимальное значение: 999999

### Площадь
- Число в квадратных метрах
- Минимальное значение: 1
- Максимальное значение: 99999
