import { getApiUrl } from './config';

// Улучшенные интерфейсы для ошибок

// Улучшенные интерфейсы для ошибок
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface OrdersApiResponse {
  data: Order[];
  count: number;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  haveTelegramToken: boolean;
  haveServicePrice: boolean;
  status?: string;
  company?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  profile: User;
  accessToken: string;
  refreshToken: string;
}

export interface Order {
  id: string;
  service: string;
  object: string;
  count: string;
  experience: string;
  phoneNumber: string;
  address: string;
  name: string;
  chatId: number;
  username: string;
  orderCreated: boolean;
  liquidPrice: number;
  jelPrice: number;
  realPrice: number;
  status: 'New' | 'Inprogress' | 'Done' | 'Denied';
  clientComment: string;
  dezinsectorComment: string;
  expectDate: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    surname: string;
    botToken: string;
    botLink: string;
    email: string;
    phone: string;
    password: string;
    isAdmin: boolean;
    isVerified: boolean;
    unlimitedAccount: boolean;
    linkId: string;
    passwordResetToken: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
    order: string[];
    tariff: {
      id: string;
      name: string;
      price: string;
      isPromo: boolean;
      isActive: boolean;
      advantages: string[];
      createdAt: string;
      updatedAt: string;
      user: string[];
    };
    service: {
      id: string;
      oneRoomLiquid: number;
      oneRoomGel: number;
      twoRoomLiquid: number;
      twoRoomGel: number;
      threeRoomLiquid: number;
      threeRoomGel: number;
      fourRoomLiquid: number;
      fourRoomGel: number;
      homeRoomLiquid: number;
      homeRoomGel: number;
      plotRoomLiquid: number;
      plotRoomGel: number;
      restaurantRoomLiquid: number;
      restaurantRoomGel: number;
      createdAt: string;
      updatedAt: string;
      user: string;
    };
    transaction: {
      id: string;
      purpose: string;
      amount: number;
      operationId: string;
      paymentLink: string;
      consumerId: string;
      status: 'Active' | 'Inactive';
      createdAt: string;
      updatedAt: string;
      user: string;
    }[];
  };
}

export interface CreateOrderRequest {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  phoneNumber: string;
  name: string;
  clientComment?: string;
  dezinsectorComment?: string;
  dezinsectorId: string;
  expectDate: string;
  liquidPrice?: number;
  jelPrice?: number;
  realPrice?: number;
}

export interface Tariff {
  id: string;
  name: string;
  price: string;
  isPromo: boolean;
  isActive: boolean;
  advantages: string[];
  createdAt: string;
  updatedAt: string;
}

// Новые интерфейсы для лидов
export interface Lead {
  id: string;
  partnerId: string;
  pestType: string;
  objectType: string;
  rooms?: number;
  infestation: string;
  previousTreatment: boolean;
  phone: string;
  address: string;
  name: string;
  expectedDate: string;
  clientComment?: string;
  approxPrice: number;
  source: string;
  status?: string;
  createdAt: string;
}

export interface CreateLeadRequest {
  partnerId: string;
  pestType: string;
  objectType: string;
  rooms?: number;
  infestation: string;
  previousTreatment: boolean;
  phone: string;
  address: string;
  name: string;
  expectedDate: string;
  clientComment?: string;
  approxPrice: number;
  source?: string;
}

export interface LeadListParams {
  partnerId?: string;
  limit?: number;
  search?: string;
  status?: string;
  page?: number; // Added for server-side pagination
  [key: string]: string | number | undefined;
}

// Интерфейсы для партнеров
export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  pricingRules: PricingRule[];
}

export interface PricingRule {
  partnerId: string;
  pestType: string;
  objectType: string;
  variant: '1' | '2' | '3' | '4' | 'default';
  basePrice: number;
}

// Интерфейсы для AI
export interface AiRequest {
  message: string;
  context?: Record<string, unknown>;
}

export interface AiResponse {
  textMessage: string;
  order: Partial<CreateLeadRequest>;
  isReady: boolean;
}

// Интерфейсы для SMS
export interface SmsRequest {
  to: string;
  text: string;
}

export interface SmsResponse {
  ok: boolean;
  messageId?: string;
  error?: string;
}

// Интерфейсы для напоминаний
export interface Reminder {
  id: string;
  leadId: string;
  scheduledAt: string;
  message: string;
  status: 'pending' | 'sent' | 'cancelled';
}

export interface ScheduleReminderRequest {
  leadId: string;
  scheduledAt: string;
  message: string;
}

export interface ServicePrices {
  id?: string;
  oneRoomLiquid: number;
  oneRoomGel: number;
  twoRoomLiquid: number;
  twoRoomGel: number;
  threeRoomLiquid: number;
  threeRoomGel: number;
  fourRoomLiquid: number;
  fourRoomGel: number;
  homeRoomLiquid: number;
  homeRoomGel: number;
  plotRoomLiquid: number;
  plotRoomGel: number;
  restaurantRoomLiquid: number;
  restaurantRoomGel: number;
  createdAt?: string;
  updatedAt?: string;
  user?: string;
}

class ApiClient {
  private token: string | null = null;
  private retryAttempts = 1;
  private retryDelay = 300;
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  setToken(token: string, refreshToken?: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      // Сохраняем время создания токена для проверки истечения
      localStorage.setItem('auth_token_created', Date.now().toString());
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      // Если токен есть, но нет времени создания, устанавливаем текущее время
      if (this.token && !localStorage.getItem('auth_token_created')) {
        localStorage.setItem('auth_token_created', Date.now().toString());
      }
    }
    return this.token;
  }

  // Проверяем, не истек ли токен (7 дней = 7 * 24 * 60 * 60 * 1000 мс)
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return false;
    
    const tokenCreated = localStorage.getItem('auth_token_created');
    if (!tokenCreated) {
      // Если нет времени создания, но есть токен, считаем что токен валидный
      // (это может быть старый токен без временной метки)
      return false;
    }
    
    const createdTime = parseInt(tokenCreated);
    const now = Date.now();
    const tokenLifetime = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
    
    return (now - createdTime) > tokenLifetime;
  }

  // Автоматическое обновление токена при приближении к истечению
  async autoRefreshTokenIfNeeded(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    
    // Если токен скоро истечет, обновляем его
    if (this.isTokenExpiringSoon()) {
      try {
        console.log('Токен скоро истечет, обновляем автоматически...');
        const response = await this.refreshToken(refreshToken);
        this.setToken(response.accessToken, refreshToken);
        return true;
      } catch (error) {
        console.error('Ошибка автоматического обновления токена:', error);
        return false;
      }
    }
    
    return false;
  }

  // Проверяем, скоро ли истечет токен (за 1 час до истечения)
  isTokenExpiringSoon(): boolean {
    if (typeof window === 'undefined') return false;
    
    const tokenCreated = localStorage.getItem('auth_token_created');
    if (!tokenCreated) {
      // Если нет времени создания, считаем что токен не истекает скоро
      return false;
    }
    
    const createdTime = parseInt(tokenCreated);
    const now = Date.now();
    const tokenLifetime = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
    const warningTime = 60 * 60 * 1000; // 1 час в миллисекундах
    
    return (now - createdTime) > (tokenLifetime - warningTime);
  }

  // Получаем время истечения токена
  getTokenExpirationTime(): Date | null {
    if (typeof window === 'undefined') return null;
    
    const tokenCreated = localStorage.getItem('auth_token_created');
    if (!tokenCreated) return null;
    
    const createdTime = parseInt(tokenCreated);
    const tokenLifetime = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
    
    return new Date(createdTime + tokenLifetime);
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_created');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = { /* TODO: implement */ },
    retryCount = 0
  ): Promise<T> {
    // Frontend should call external API directly
    const url = getApiUrl(endpoint);
    let token = this.getToken();
    
    // Проверяем, не истек ли токен
    if (token && this.isTokenExpired()) {
      console.warn('Токен истек, очищаем его');
      this.clearToken();
      throw new Error('Токен авторизации истек. Необходимо войти в систему заново.');
    }
    
    // Пытаемся автоматически обновить токен, если он скоро истечет
    if (token && this.isTokenExpiringSoon()) {
      try {
        await this.autoRefreshTokenIfNeeded();
        token = this.getToken(); // Получаем обновленный токен
      } catch (error) {
        console.warn('Не удалось автоматически обновить токен:', error);
      }
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: Record<string, unknown> = { /* TODO: implement */ };
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        const apiError: ApiError = {
          message: errorData.message as string || `HTTP error! status: ${response.status}`,
          status: response.status,
          code: errorData.code as string,
          details: errorData
        };

        // Логируем ошибку для отладки
        console.error(`API Error ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          errorData: JSON.stringify(errorData, null, 2)
        });

        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (retryCount < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'TypeError' || // Сетевые ошибки
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('Failed to fetch')
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Метод для настройки retry параметров
  setRetryConfig(attempts: number, delay: number) {
    this.retryAttempts = attempts;
    this.retryDelay = delay;
  }

  // Метод для очистки кэша
  clearAllCache(): void {
    this.clearCache();
  }

  // Метод для получения статистики кэша
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Метод для проверки состояния соединения
  async checkConnection(): Promise<boolean> {
    try {
      // Используем эндпоинт /order/list для проверки соединения
      const response = await fetch(getApiUrl('/order/list?pageSize=1&skipPages=0'), { 
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 секунд таймаут
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Метод для получения информации о пользователе с кэшированием
  async getProfileWithCache(): Promise<User> {
    const cacheKey = '/user/profile';
    const cached = this.getFromCache<User>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await this.request<User>('/user/profile');
    
    // Кэшируем профиль на 10 минут
    this.setCache(cacheKey, result, 10 * 60 * 1000);
    
    return result;
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Валидация
    this.validateRequired(data.email, 'Email');
    this.validateRequired(data.password, 'Password');
    
    if (!this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const result = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Очищаем кэш при смене пользователя
    this.clearCache();
    
    return result;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Валидация
    this.validateRequired(data.name, 'Name');
    this.validateRequired(data.surname, 'Surname');
    this.validateRequired(data.email, 'Email');
    this.validateRequired(data.phone, 'Phone');
    this.validateRequired(data.password, 'Password');

    if (!this.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.validatePhone(data.phone)) {
      throw new Error('Invalid phone format');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const result = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Очищаем кэш при регистрации
    this.clearCache();
    
    return result;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.request('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getProfile(): Promise<User> {
    return this.request('/user/profile');
  }

  async getTokenInfo(): Promise<{
    id: string;
    name: string;
    surname: string;
    botToken: string | null;
    botLink: string | null;
    email: string;
    phone: string;
    isAdmin: boolean;
    isVerified: boolean;
    unlimitedAccount: boolean;
    linkId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }> {
    return this.request('/user/token-info');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request(`/user/by-id/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return this.request('/user/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateUserById(id: string, data: Partial<User>): Promise<User> {
    return this.request(`/user/by-id/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getOrderList(): Promise<Order[]> {
    return this.request('/user/order-list');
  }

  async getUserService(): Promise<ServicePrices> {
    return this.request('/user/service');
  }

  async updateUserService(data: Partial<ServicePrices>): Promise<string> {
    return this.request('/user/service', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(): Promise<User> {
    // Проверяем кэш профиля
    const cachedProfile = localStorage.getItem('user_profile_cache');
    const cacheTimestamp = localStorage.getItem('user_profile_timestamp');
    const now = Date.now();
    
    // Если кэш не старше 5 минут, используем его
    if (cachedProfile && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 5 * 60 * 1000) {
      try {
        return JSON.parse(cachedProfile);
      } catch (e) {
        // Если кэш поврежден, удаляем его
        localStorage.removeItem('user_profile_cache');
        localStorage.removeItem('user_profile_timestamp');
      }
    }
    
    // Загружаем профиль с сервера
    const profile = await this.request<User>('/user/profile');
    
    // Кэшируем профиль
    localStorage.setItem('user_profile_cache', JSON.stringify(profile));
    localStorage.setItem('user_profile_timestamp', now.toString());
    
    return profile;
  }

  async getUserProfileFresh(): Promise<User> {
    // Принудительно загружаем свежий профиль с сервера
    const profile = await this.request<User>('/user/profile');
    
    // Обновляем кэш
    localStorage.setItem('user_profile_cache', JSON.stringify(profile));
    localStorage.setItem('user_profile_timestamp', Date.now().toString());
    
    return profile;
  }

  async getUserByLinkId(linkId: string): Promise<User> {
    return this.request(`/user/by-link-id/${linkId}`);
  }

  async getUsers(params: { skipPages?: number; pageSize?: number; searchValue?: string } = { /* TODO: implement */ }): Promise<{data: User[], count: number}> {
    const searchParams = new URLSearchParams();
    if (params.skipPages !== undefined) searchParams.append('skipPages', params.skipPages.toString());
    if (params.pageSize !== undefined) searchParams.append('pageSize', params.pageSize.toString());
    if (params.searchValue) searchParams.append('searchValue', params.searchValue);
    
    const query = searchParams.toString();
    const endpoint = query ? `/user/list?${query}` : '/user/list';
    
    return this.request<{data: User[], count: number}>(endpoint);
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/user/all');
  }

  async updateUserStatus(id: string, status: string): Promise<void> {
    return this.request(`/user/user-status/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteUser(id: string): Promise<string> {
    return this.request(`/user/by-id/${id}`, {
      method: 'DELETE',
    });
  }

  async recoverPassword(email: string): Promise<void> {
    return this.request('/user/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPasswordToken(token: string, newPassword: string): Promise<void> {
    return this.request('/user/password-reset-token', {
      method: 'PATCH',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Order endpoints с правильной пагинацией
  async getOrders(params: { skipPages?: number; pageSize?: number; linkId?: string; search?: string; status?: string } = { /* TODO: implement */ }): Promise<{data: Order[], count: number}> {
    const searchParams = new URLSearchParams();
    
    // Обязательные параметры пагинации
    if (params.skipPages !== undefined) searchParams.append('skipPages', params.skipPages.toString());
    if (params.pageSize !== undefined) searchParams.append('pageSize', params.pageSize.toString());
    
    // Дополнительные параметры фильтрации
    if (params.linkId) searchParams.append('linkId', params.linkId);
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    const endpoint = query ? `/order/list?${query}` : '/order/list';
    
    console.log('Загружаем заказы с эндпоинта:', endpoint, 'с параметрами:', params);
    
    const response = await this.request<OrdersApiResponse>(endpoint);
    
    console.log('Ответ от API заказов:', {
      endpoint,
      params,
      responseData: response?.data?.length || 0,
      totalCount: response?.count || 0,
      fullResponse: response
    });
    
    // API возвращает { data: [...], count: 48 }
    if (response && typeof response === 'object' && 'data' in response && 'count' in response) {
      return {
        data: response.data,
        count: response.count
      };
    }
    
    // Fallback для обратной совместимости
    return {
      data: [],
      count: 0
    };
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      // Валидация обязательных полей
      if (!data.service || !data.object || !data.count || !data.experience || 
          !data.address || !data.phoneNumber || !data.name || !data.expectDate || !data.dezinsectorId) {
        throw new Error('Все обязательные поля должны быть заполнены');
      }
      
      // Отправляем запрос на создание заказа
      const result = await this.request<Order>('/order', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request(`/order/by-id/${id}`);
  }

  async updateOrder(id: string, data: {
    service?: string;
    object?: string;
    count?: string;
    experience?: string;
    address?: string;
    name?: string;
    status?: 'New' | 'Inprogress' | 'Done' | 'Denied';
    clientComment?: string;
    dezinsectorComment?: string;
    realPrice?: number;
  }): Promise<Order> {
    return this.request(`/order/by-id/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Tariff endpoints
  async getTariffs(): Promise<Tariff[]> {
    return this.request('/tariff/list');
  }

  async getSubscriptionLink(tariffId: string): Promise<string> {
    return this.request(`/payment/subscription-link/${tariffId}`);
  }

  async getPaymentLink(tariffId: string): Promise<string> {
    return this.request(`/payment/payment-link/${tariffId}`);
  }

  // Seed endpoints
  async createSeeds(): Promise<void> {
    return this.request('/seed');
  }

  async createTariffSeeds(): Promise<void> {
    return this.request('/seed/tariff');
  }

  async cancelSubscription(): Promise<boolean> {
    return this.request('/payment/cancel-subscription', {
      method: 'POST'
    });
  }

  // Lead endpoints с серверной пагинацией (используем /order/list)
  async getLeads(params: LeadListParams = { /* TODO: implement */ }): Promise<{data: Lead[], count: number}> {
    const cacheKey = this.getCacheKey('/order/list', params);
    const cached = this.getFromCache<{data: Lead[], count: number}>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const searchParams = new URLSearchParams();
    
    // Добавляем параметры пагинации
    if (params.page && params.limit) {
      const skipPages = (params.page - 1) * params.limit;
      searchParams.append('skipPages', skipPages.toString());
      searchParams.append('pageSize', params.limit.toString());
    } else if (params.limit) {
      searchParams.append('pageSize', params.limit.toString());
      searchParams.append('skipPages', '0');
    } else {
      // По умолчанию показываем 10 элементов
      searchParams.append('pageSize', '10');
      searchParams.append('skipPages', '0');
    }
    
    // Добавляем параметры поиска и фильтрации
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    
    const query = searchParams.toString();
    const endpoint = `/order/list?${query}`;
    
    const result = await this.request<{data: Order[], count: number}>(endpoint);
    
    // Преобразуем заказы в лиды для совместимости
    const leads = result.data.map(order => {
      // Используем оригинальное значение из базы
      const pestType = order.service || 'Не указано';

      // Используем оригинальное значение из базы
      const objectType = order.object || 'Не указано';

      // Используем оригинальные значения из базы
      const infestation = order.count || 'Не указано';
      const previousTreatment = order.experience === 'Да' || order.experience === 'true';

      const result = {
        id: order.id,
        partnerId: 'default',
        pestType,
        objectType,
        rooms: 0,
        infestation,
        previousTreatment,
        phone: order.phoneNumber,
        address: order.address,
        name: order.name,
        expectedDate: order.expectDate,
        clientComment: order.clientComment || '',
        approxPrice: order.realPrice || 0,
        source: 'order',
        status: order.status,
        createdAt: order.createdAt
      };

      return result;
    });
    
    const response = {
      data: leads,
      count: result.count
    };
    
    // Временно отключаем кэширование для отладки
    // this.setCache(cacheKey, response, 2 * 60 * 1000);
    
    return response;
  }

  async createLead(data: CreateLeadRequest): Promise<{ leadId: string }> {
    // Валидация
    this.validateRequired(data.partnerId, 'Partner ID');
    this.validateRequired(data.pestType, 'Pest Type');
    this.validateRequired(data.objectType, 'Object Type');
    this.validateRequired(data.infestation, 'Infestation Level');
    this.validateRequired(data.phone, 'Phone');
    this.validateRequired(data.address, 'Address');
    this.validateRequired(data.name, 'Name');
    this.validateRequired(data.expectedDate, 'Expected Date');
    this.validateRequired(data.approxPrice, 'Approximate Price');

    if (!this.validatePhone(data.phone)) {
      throw new Error('Invalid phone format');
    }

    if (data.approxPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const result = await this.request<{ leadId: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Очищаем кэш лидов при создании нового
    this.clearCache('/leads');
    
    return result;
  }

  async getLead(id: string): Promise<Lead> {
    return this.request(`/leads/${id}`);
  }

  async updateLead(id: string, data: Partial<CreateLeadRequest>): Promise<Lead> {
    this.validateRequired(id, 'Lead ID');

    // Валидация обновляемых полей
    if (data.phone && !this.validatePhone(data.phone)) {
      throw new Error('Invalid phone format');
    }

    if (data.approxPrice !== undefined && data.approxPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const result = await this.request<Lead>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    // Очищаем кэш лидов при обновлении
    this.clearCache('/leads');
    
    return result;
  }

  // Partner endpoints
  async getPartners(): Promise<Partner[]> {
    return this.request('/partners');
  }

  async getPartner(id: string): Promise<Partner> {
    return this.request(`/partners/${id}`);
  }

  async getPartnerPricing(partnerId: string): Promise<PricingRule[]> {
    return this.request(`/partners/${partnerId}/pricing`);
  }

  // AI endpoints
  async callAi(data: AiRequest): Promise<AiResponse> {
    return this.request('/ai/proxy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // SMS endpoints
  async sendSms(data: SmsRequest): Promise<SmsResponse> {
    return this.request('/sms/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reminder endpoints
  async scheduleReminder(data: ScheduleReminderRequest): Promise<Reminder> {
    return this.request('/reminders/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReminders(): Promise<Reminder[]> {
    return this.request('/reminders');
  }

  async cancelReminder(id: string): Promise<void> {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Seed endpoints
  async makeSeeds(): Promise<unknown> {
    return this.request('/seed');
  }

  async makeTariffSeeds(): Promise<unknown> {
    return this.request('/seed/tariff');
  }

  // Hook endpoints
  async avitoHook(data: Record<string, unknown>): Promise<unknown> {
    return this.request('/hook/avito', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Валидация данных
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new Error(`${fieldName} is required`);
    }
  }

  // Кэширование
  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramsStr}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

export const apiClient = new ApiClient();