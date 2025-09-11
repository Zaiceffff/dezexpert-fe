// src/app/payment_v2/page.tsx — страница тарифов Dezexpert
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Check, Star, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, getAuthToken, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';
import { track } from '@/lib/analytics';

// Типы
interface User {
  id: string;
  status?: string;
  tariff?: Tariff;
  unlimitedAccount?: boolean;
}

interface Tariff {
  id: string;
  name?: string;
  price?: string;
  planName?: string;
  period?: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
  cta: string;
  href: string | null;
  isFree: boolean;
  isPromo: boolean;
  originalPrice: string;
  limits: {
    users: number;
    leads: number;
    sms: number;
  };
  savings?: string;
}

// Константы
const TARIFF_PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Пробный план',
    price: '₽0',
    period: '/месяц',
    description: 'Бесплатный пробный период для знакомства с системой',
    popular: false,
    features: ['1 Пользователь', '5 заявок', 'Персональная ссылка'],
    cta: 'Попробовать',
    href: null,
    isFree: true,
    isPromo: false,
    originalPrice: '0',
    limits: { users: 1, leads: 5, sms: 0 },
    savings: undefined
  },
  {
    id: '64ba2dda-5ef2-45d7-abc6-efe8cfd51fac',
    name: 'Всегда вместе Промо',
    price: '1 ₽',
    period: '/мес',
    description: 'Специальное предложение для быстрого старта',
    popular: false,
    features: ['1 Пользователь', '5 заявок', 'Персональная ссылка'],
    cta: 'Попробовать',
    href: null,
    isFree: false,
    isPromo: true,
    originalPrice: '1',
    limits: { users: 1, leads: 5, sms: 0 },
    savings: 'Акция! 99% скидка'
  },
  {
    id: 'always-together',
    name: 'Всегда вместе',
    price: '1 990 ₽',
    period: '/мес',
    description: 'Для растущих компаний с активным потоком заявок',
    popular: true,
    features: ['1 Пользователь', 'Безлимит заявок', 'Персональная ссылка'],
    cta: 'Выбрать план',
    href: null,
    isFree: false,
    isPromo: false,
    originalPrice: '1990',
    limits: { users: 1, leads: -1, sms: 100 },
    savings: 'Экономия до 18%'
  },
  {
    id: 'always-together-plus',
    name: 'Всегда вместе +',
    price: '2 990 ₽',
    period: '/мес',
    description: 'Для команд и компаний с высокими требованиями',
    popular: false,
    features: [
      '1 Пользователь', 
      'Безлимит заявок', 
      'Персональная ссылка',
      'Аналитика',
      'SMS Уведомления для клиентов'
    ],
    cta: 'Выбрать план',
    href: null,
    isFree: false,
    isPromo: false,
    originalPrice: '2990',
    limits: { users: 1, leads: -1, sms: 500 },
    savings: 'Лучше для команд'
  },
  {
    id: 'corporate',
    name: 'Корпоративный',
    price: 'ОБСУДИМ',
    period: '',
    description: 'Индивидуальные решения для крупных компаний',
    popular: false,
    features: [
      'от 1 до 100 Пользователей',
      'Безлимит заявок',
      'Персональная ссылка',
      'Продвинутая Аналитика',
      'Персональные доработки под нужды компании',
      'Выделенный сервер'
    ],
    cta: 'Связаться',
    href: null,
    isFree: false,
    isPromo: false,
    originalPrice: '0',
    limits: { users: 100, leads: -1, sms: -1 }
  }
];



function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Состояние
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTariff, setUserTariff] = useState<Tariff | string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSwitchingToTrial, setIsSwitchingToTrial] = useState(false);

  // Обработка URL параметров для редиректа от банка
  useEffect(() => {
    const result = searchParams.get('result');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (result === 'success') {
      // Редирект на страницу успешного платежа
      router.push('/payment_v2/success');
      return;
    }
    
    if (result === 'error' || error) {
      // Редирект на страницу ошибки с параметрами
      const errorParams = new URLSearchParams();
      if (error) errorParams.set('error', error);
      if (message) errorParams.set('message', message);
      
      const errorUrl = `/payment_v2/error?${errorParams.toString()}`;
      router.push(errorUrl);
      return;
    }
    
    if (result === 'pending') {
      // Редирект на страницу ожидания
      router.push('/payment_v2/pending');
      return;
    }
  }, [searchParams, router]);

  // Загрузка тарифов
  const fetchTariffs = useCallback(async () => {
    try {
      setIsLoadingPlans(true);
      setPlans(TARIFF_PLANS);
    } catch (error) {
      console.error('Ошибка при загрузке тарифов:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  // Загрузка информации о пользователе
  const fetchUserInfo = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      logApiCall('GET', '/user/profile');
      
      const userData = await apiClient.get<User>('/user/profile', token);
      setCurrentUser(userData);
      
      // Определяем текущий тариф пользователя
      let userTariffData: Tariff | string | null = null;
      
      if (userData.tariff && typeof userData.tariff === 'object' && userData.tariff.id) {
        userTariffData = userData.tariff;
      } else if (userData.status === 'Trial' || userData.status === 'trial') {
        userTariffData = 'Пробный план';
      } else if (userData.status === 'Active' || userData.status === 'active') {
        userTariffData = 'Базовый план';
      }
      
      setUserTariff(userTariffData);
    } catch (error) {
      logApiError('GET', '/user/profile', error);
    }
  }, []);

  // Создание ссылки на оплату
  const createPaymentLink = useCallback(async (tariffId: string) => {
    const selectedTariff = plans.find(plan => plan.id === tariffId);
    const token = getAuthToken();
    
    if (!token) {
      toast.error('Требуется авторизация');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [tariffId]: true }));

    try {
      const endpoint = `${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIPTION_LINK}/${tariffId}`;
      logApiCall('GET', endpoint);
      
      const responseData = await apiClient.get<Record<string, unknown>>(endpoint, token);
      
      // API может возвращать строку напрямую или объект с полем url/link
      let paymentLink: string = '';
      
      if (typeof responseData === 'string') {
        paymentLink = responseData;
      } else if (typeof responseData === 'object' && responseData !== null) {
        if ('url' in responseData && typeof responseData.url === 'string') {
          paymentLink = responseData.url;
        } else if ('link' in responseData && typeof responseData.link === 'string') {
          paymentLink = responseData.link;
        } else if ('paymentUrl' in responseData && typeof responseData.paymentUrl === 'string') {
          paymentLink = responseData.paymentUrl;
        } else if ('subscriptionUrl' in responseData && typeof responseData.subscriptionUrl === 'string') {
          paymentLink = responseData.subscriptionUrl;
        } else {
          // Ищем любое поле, содержащее 'http' или 'https'
          const urlField = Object.entries(responseData).find(([, value]) => 
            typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
          );
          if (urlField) {
            paymentLink = urlField[1] as string;
          }
        }
      }
      
      if (typeof paymentLink !== 'string' || !paymentLink) {
        throw new Error('Ссылка на оплату не найдена в ответе');
      }

      // Проверяем корректность URL
      try {
        new URL(paymentLink);
      } catch (urlError) {
        throw new Error('Некорректная ссылка на оплату');
      }

      // Исправляем редирект на локальный домен (если нужно)
      if (paymentLink.includes('dezexpert.pro')) {
        const currentOrigin = window.location.origin;
        const localPaymentLink = paymentLink.replace('https://dezexpert.pro', currentOrigin);
        paymentLink = localPaymentLink;
      }

      // Открываем ссылку в новом окне
      window.open(paymentLink, '_blank');
      toast.success('Ссылка на оплату создана!');
      track('pricing_select_plan', { plan: selectedTariff?.name, price: selectedTariff?.originalPrice });
    } catch (error: unknown) {
      logApiError('GET', `/payment/subscription-link/${tariffId}`, error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при создании ссылки на оплату');
    } finally {
      setLoadingStates(prev => ({ ...prev, [tariffId]: false }));
    }
  }, [plans]);

  // Переход на пробный период
  const switchToTrial = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error('Требуется авторизация');
      return;
    }

    setIsSwitchingToTrial(true);
    
    try {
      // 1) Попробуем отменить подписку (если есть)
      try {
        await apiClient.post('/user/cancel-subscription', {}, token);
      } catch {
        // Игнорируем ошибку
      }

      // 2) Выставим статус Trial на бэкенде и отвяжем тариф
      const userId = currentUser?.id;
      if (userId) {
        try {
          await apiClient.patch(`/user/by-id/${userId}`, { status: 'Trial' }, token);
        } catch {
          // Игнорируем ошибку
        }

        let tariffCleared = false;
        try {
          await apiClient.patch(`/user/by-id/${userId}`, { tariffId: null }, token);
          tariffCleared = true;
        } catch {
          // Игнорируем ошибку
        }

        if (!tariffCleared) {
          try {
            await apiClient.patch(`/user/by-id/${userId}`, { tariff: null }, token);
          } catch {
            // Игнорируем ошибку
          }
        }
      }

      // 3) Обновляем информацию о пользователе
      await fetchUserInfo();
      
      // 4) Проверяем, что статус действительно изменился на Trial
      try {
        const updatedUserData = await apiClient.get<User>('/user/profile', token);
        
        if (updatedUserData.status === 'Trial') {
          toast.success('Переведено на пробный период!');
        } else {
          toast.warning('Статус обновлен, но может потребоваться время для полного применения изменений');
        }
      } catch {
        toast.success('Запрос на переход на пробный период отправлен!');
      }
    } catch (error: unknown) {
      logApiError('PATCH', '/user/by-id', error);
      toast.error('Не удалось перевести на пробный период');
    } finally {
      setIsSwitchingToTrial(false);
    }
  }, [currentUser?.id, fetchUserInfo]);

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchTariffs();
    fetchUserInfo();
  }, [fetchTariffs, fetchUserInfo]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex flex-col">
        <div className="flex-1">
          {/* Header Section */}
          <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Выберите подходящий тариф
              </h1>
              <p className="text-base text-gray-600">
                Прозрачные тарифы без скрытых комиссий. Начните бесплатно и масштабируйтесь по мере роста.
              </p>
              
              {/* Информация о текущем тарифе */}
              {currentUser && userTariff ? (
                <div className="mt-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-sm mx-auto">
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-500 mb-1">Текущий тариф</p>
                      <h3 className="text-base font-medium text-gray-900">
                        {typeof userTariff === 'string' ? userTariff : (userTariff.name || userTariff.planName || 'Не выбран')}
                      </h3>
                    </div>
                    
                    <div className="text-center mb-3">
                      <div className="text-sm text-gray-600">
                        {userTariff && typeof userTariff === 'object' && userTariff.price && (
                          <span className="font-medium text-green-600">
                            {userTariff.price} {userTariff.period || '/месяц'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Кнопка действия */}
                    {userTariff && typeof userTariff === 'object' && userTariff.id !== 'basic' && userTariff.price !== '0' && (
                      <div className="text-center">
                        <Button
                          onClick={switchToTrial}
                          className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-50 py-2 px-4 rounded-lg text-sm font-medium"
                          disabled={isSwitchingToTrial}
                        >
                          {isSwitchingToTrial ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Переход...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <RefreshCw className="w-4 h-4" />
                              Перейти на пробный
                            </span>
                          )}
                        </Button>
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Отмена текущей подписки и переход на бесплатный пробный период
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-medium text-green-700 mb-4">Для выбора платных тарифов требуется авторизация</p>
                      <div className="flex gap-3 justify-center">
                        <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6">
                          <Link href="/login">Войти</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-green-300 text-green-600 hover:bg-green-50 px-6">
                          <Link href="/register">Регистрация</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16 relative">
            {/* Декоративный фон */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-emerald-50/30 rounded-3xl"></div>
            <div className="relative max-w-6xl mx-auto">
              {isLoadingPlans ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка тарифов...</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 md:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col min-h-[500px] shadow-lg w-full ${
                        plan.popular 
                          ? 'ring-4 ring-green-500/20 shadow-green-200/50 bg-gradient-to-br from-green-50/30 to-white' 
                          : 'hover:ring-2 hover:ring-green-300/30 hover:shadow-green-100/30'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2">
                          <div className="rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white flex items-center gap-2 shadow-lg animate-pulse">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                            Популярный выбор
                          </div>
                        </div>
                      )}
                      {plan.isPromo && (
                        <div className="absolute -top-4 sm:-top-5 right-4">
                          <div className="rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white flex items-center gap-2 shadow-lg animate-bounce">
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                            Промо
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-6 sm:mb-8 flex-1 flex flex-col justify-center">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 px-2">{plan.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed px-2">{plan.description}</p>
                        <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-100">
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{plan.price}</span>
                          <span className="text-gray-500 text-sm ml-2">{plan.period}</span>
                        </div>
                        
                        {/* Лимиты */}
                        <div className="mb-4 space-y-2 px-2">
                          <div className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Пользователи:</span> {plan.limits.users === -1 ? '∞' : plan.limits.users}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Заявки:</span> {plan.limits.leads === -1 ? '∞' : plan.limits.leads}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">SMS:</span> {plan.limits.sms === -1 ? '∞' : plan.limits.sms}
                          </div>
                        </div>
                        
                        {/* Бейдж выгоды */}
                        {plan.savings && (
                          <div className="mb-4 px-2">
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                              {plan.savings}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-center mb-6">
                        {/* Показываем все функции для каждого тарифа */}
                        <ul className="space-y-3 sm:space-y-4 px-2">
                          {plan.features.map((feature: string, idx: number) => (
                            <li 
                              key={idx} 
                              className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-green-50/50 transition-all duration-500 ease-out hover:scale-105 hover:shadow-sm"
                              style={{
                                animationDelay: `${idx * 50}ms`,
                                animationFillMode: 'both'
                              }}
                            >
                              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center transition-all duration-500 ease-out hover:bg-green-200 hover:scale-110 hover:shadow-md">
                                <Check className="h-3 w-3 text-green-600 transition-all duration-300" />
                              </div>
                              <span className="text-xs sm:text-sm text-gray-700 leading-relaxed transition-all duration-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Кнопка действия */}
                      <div className="mt-auto px-2">
                        {plan.href ? (
                          <Button asChild className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            <Link href={plan.href}>
                              {plan.cta}
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            onClick={() => createPaymentLink(plan.id)}
                            disabled={loadingStates[plan.id]}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                          >
                            {loadingStates[plan.id] ? (
                              <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Создание ссылки...
                              </span>
                            ) : (
                              plan.cta
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
          
        </div>
        
        <Footer />
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
