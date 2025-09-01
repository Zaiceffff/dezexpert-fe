import { getApiUrl } from './config';

export interface ServicePrices {
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
}

export interface PricingApiResponse {
  success: boolean;
  data?: ServicePrices;
  error?: string;
}

// Получение цен пользователя
export const getUserPrices = async (token: string): Promise<ServicePrices | null> => {
  try {
    console.log('🔄 Загрузка цен пользователя...');
    
    // Сначала проверяем кэш в localStorage
    const cachedPrices = localStorage.getItem('user_prices');
    if (cachedPrices) {
      try {
        const parsed = JSON.parse(cachedPrices);
        console.log('📦 Используем кэшированные цены:', parsed);
        return parsed;
      } catch (e) {
        console.warn('⚠️ Ошибка парсинга кэшированных цен, загружаем с сервера');
        localStorage.removeItem('user_prices');
      }
    }

    // Сначала пробуем загрузить цены напрямую через /user/service
    console.log('📡 Пробуем загрузить цены через /user/service...');
    const serviceResponse = await fetch(getApiUrl('/user/service'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (serviceResponse.ok) {
      const serviceData = await serviceResponse.json();
      console.log('✅ Цены загружены через /user/service:', serviceData);
      
      // Кэшируем полученные цены
      localStorage.setItem('user_prices', JSON.stringify(serviceData));
      return serviceData as ServicePrices;
    } else {
      console.log('⚠️ /user/service не доступен, пробуем /user/profile');
      
      // Fallback: пробуем загрузить через профиль
      const profileResponse = await fetch(getApiUrl('/user/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Ответ от /user/profile:', profileResponse.status, profileResponse.ok);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('📊 Данные профиля:', profileData);
        
        // Проверяем, есть ли цены в профиле
        if (profileData.service && typeof profileData.service === 'object') {
          // Кэшируем полученные цены
          localStorage.setItem('user_prices', JSON.stringify(profileData.service));
          console.log('✅ Цены загружены из профиля и закэшированы:', profileData.service);
          return profileData.service;
        } else {
          console.log('⚠️ Цены не найдены в профиле, используем значения по умолчанию');
          const defaultPrices = getDefaultPrices();
          localStorage.setItem('user_prices', JSON.stringify(defaultPrices));
          return defaultPrices;
        }
      } else {
        console.warn('⚠️ Ошибка загрузки профиля:', profileResponse.status);
        // Если не удалось загрузить, используем кэш или значения по умолчанию
        if (cachedPrices) {
          try {
            return JSON.parse(cachedPrices);
          } catch (e) {
            console.warn('⚠️ Кэш поврежден, используем значения по умолчанию');
          }
        }
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Ошибка получения цен:', error);
    // При ошибке сети используем кэш или значения по умолчанию
    const cachedPrices = localStorage.getItem('user_prices');
    if (cachedPrices) {
      try {
        return JSON.parse(cachedPrices);
      } catch (e) {
        console.warn('⚠️ Кэш поврежден, используем значения по умолчания');
      }
    }
    return null;
  }
};

// Обновление цен пользователя
export const updateUserPrices = async (
  token: string, 
  userId: string, 
  prices: ServicePrices
): Promise<PricingApiResponse> => {
  try {
    console.log('🔄 Обновление цен:', { userId, prices });
    
    // Пробуем обновить через правильный endpoint
    const response = await fetch(getApiUrl(`/user/${userId}/service`), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prices),
    });

    console.log('📡 Ответ от /user/${userId}/service:', response.status, response.ok);

    if (response.ok) {
      // Кэшируем цены в localStorage
      localStorage.setItem('user_prices', JSON.stringify(prices));
      console.log('✅ Цены успешно обновлены через /user/${userId}/service');
      return { success: true, data: prices };
    } else {
      console.log('⚠️ Fallback к /user/service');
      // Fallback: пробуем через старый endpoint
      const fallbackResponse = await fetch(getApiUrl('/user/service'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prices),
      });

      console.log('📡 Ответ от /user/service:', fallbackResponse.status, fallbackResponse.ok);

      if (fallbackResponse.ok) {
        // Кэшируем цены в localStorage
        localStorage.setItem('user_prices', JSON.stringify(prices));
        console.log('✅ Цены успешно обновлены через /user/service');
        return { success: true, data: prices };
      } else {
        const errorText = await fallbackResponse.text();
        console.error('❌ Ошибка обновления цен:', fallbackResponse.status, errorText);
        return { 
          success: false, 
          error: `Ошибка обновления цен: ${fallbackResponse.status} - ${errorText}` 
        };
      }
    }
  } catch (error) {
    console.error('❌ Ошибка подключения при обновлении цен:', error);
    return { 
      success: false, 
      error: 'Ошибка подключения к серверу' 
    };
  }
};

// Значения по умолчанию для цен
export const getDefaultPrices = (): ServicePrices => ({
  oneRoomLiquid: 1500,
  oneRoomGel: 1200,
  twoRoomLiquid: 2000,
  twoRoomGel: 1700,
  threeRoomLiquid: 2500,
  threeRoomGel: 2200,
  fourRoomLiquid: 3000,
  fourRoomGel: 2700,
  homeRoomLiquid: 3500,
  homeRoomGel: 3200,
  plotRoomLiquid: 4000,
  plotRoomGel: 3700,
  restaurantRoomLiquid: 5000,
  restaurantRoomGel: 4700,
});

// Валидация цен
export const validatePrices = (prices: ServicePrices): boolean => {
  return Object.values(prices).every(price => typeof price === 'number' && price >= 0);
};

// Очистка кэша цен
export const clearPricesCache = (): void => {
  localStorage.removeItem('user_prices');
  console.log('🗑️ Кэш цен очищен');
};

// Принудительная загрузка цен с сервера (игнорируя кэш)
export const forceRefreshPrices = async (token: string): Promise<ServicePrices | null> => {
  console.log('🔄 Принудительная загрузка цен с сервера...');
  clearPricesCache();
  return getUserPrices(token);
};
