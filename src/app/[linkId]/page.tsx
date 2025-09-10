'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/badge';

import { format } from 'date-fns';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Phone, 
  User, 
  Bug, 
  Home, 
  Clock,
  MessageSquare,
  Calendar,
  Shield,
  Star,
  Clock3,
  Zap,
  Award,
  ThumbsUp,

  Users,
  CheckCircle2
} from 'lucide-react';
import { 
  validateRequired, 
  validatePhone, 
  formatPhone, 
  cleanPhone,
  logApiCall,
  logApiError
} from '@/lib/apiUtils';
import { getApiUrl } from '@/lib/config';
import { dashboardEvents, DASHBOARD_EVENTS } from '@/lib/events';

// Типы для лендинга
interface DezinsectorProfile {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  company?: string;
  address?: string;
  linkId?: string;
  experience: number;
  rating: number;
  completedOrders: number;
  specialties: string[];
  guarantees: string[];
  workingHours: string;
  responseTime: string;
  prices: ServicePrice[];
  // Дополнительные поля для API
  isAdmin?: boolean;
  isVerified?: boolean;
  unlimitedAccount?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Новые поля из /user/profile
  botLink?: string;
  tariff?: {
    id: string;
    name: string;
    price: string;
    isPromo: boolean;
    isActive: boolean;
    advantages: string[];
    createdAt: string;
    updatedAt: string;
  };
  service?: {
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
  };
}

interface ServicePrice {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  features: string[];
  popular?: boolean;
}

interface CreateOrderRequest {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  phoneNumber: string;
  name: string;
  clientComment: string;
  dezinsectorComment: string;
  dezinsectorId: string;
  expectDate: string;
}

interface FormData {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  phone: string;
  clientName: string;
  visitDate: string;
  comment: string;
}



// Константы для лендинга
const DEFAULT_DEZINSECTOR_PROFILE: DezinsectorProfile = {
  id: '',
  name: 'Загружается...',
  surname: '',
  phone: '+7 (___) ___-__-__',
  email: 'Загружается...',
  company: 'Дезинфектор Эксперт',
  address: 'Загружается...',
  linkId: '',
  experience: 0,
  rating: 0,
  completedOrders: 0,
  specialties: ['Загружается...'],
  guarantees: ['Загружается...'],
  workingHours: 'Загружается...',
  responseTime: 'Загружается...',
  prices: [
    {
      id: '1',
      name: 'Загружается...',
      description: 'Загружается...',
      price: 0,
      oldPrice: 0,
      features: ['Загружается...'],
      popular: false
    }
  ]
};

const DEFAULT_FORM_DATA: FormData = {
  service: 'Тараканы',
  object: 'Частный дом',
  count: 'Иногда встречаются',
  experience: 'Нет, не травил',
  address: '',
  phone: '',
  clientName: '',
  visitDate: format(new Date(), 'yyyy-MM-dd'),
  comment: ''
};

const SERVICE_OPTIONS = [
  'Тараканы', 'Клопы', 'Мухи', 'Клещи', 'Муравьи', 'Осы', 'Шершни', 'Другие насекомые'
];

const OBJECT_OPTIONS = [
  '1 комнатная квартира', '2 комнатная квартира', '3 комнатная квартира', 
  '4 комнатная квартира', 'Частный дом', 'Дача', 'Участок', 'Офис', 
  'Магазин', 'Ресторан', 'Склад', 'Производство'
];

const COUNT_OPTIONS = [
  'Иногда встречаются', 'Регулярно появляются', 'Очень много', 
  'Массовое заражение', 'Нужна просто профилактика', 'Единичные особи'
];

const EXPERIENCE_OPTIONS = [
  'Да, вызывал специалиста', 'Да, самостоятельно', 'Нет, не травил', 
  'Нет, первый раз', 'Да, но не помогло'
];

// Маппинги для API
const SERVICE_MAP: Record<string, string> = {
  'Тараканы': 'cockroaches',
  'Клопы': 'bedbugs',
  'Мухи': 'flies',
  'Клещи': 'ticks',
  'Муравьи': 'ants',
  'Осы': 'wasps',
  'Шершни': 'hornets'
};

const OBJECT_MAP: Record<string, string> = {
  '1 комнатная квартира': 'apartment1',
  '2 комнатная квартира': 'apartment2',
  '3 комнатная квартира': 'apartment3',
  '4 комнатная квартира': 'apartment4',
  'Дом': 'house',
  'Частный дом': 'house',
  'Участок': 'plot',
  'Коммерческий объект': 'commercial',
  'Другое': 'other'
};

const COUNT_MAP: Record<string, string> = {
  'Очень много': 'very_often',
  'Иногда встречаются': 'sometimes',
  'Нужна просто профилактика': 'rare',
  'Редко встречаются': 'rare',
  'Часто встречаются': 'often',
  'Очень часто встречаются': 'very_often',
  'Сильно заражены': 'infested',
  'Регулярно появляются': 'often'
};

const EXPERIENCE_MAP: Record<string, string> = {
  'Да, самостоятельно': 'yes',
  'Да, вызывал специалиста': 'yes',
  'Нет, не травил': 'no',
  'Да, травил': 'yes',
  'Частично травил': 'partial',
  'Нет, первый раз': 'no'
};

export default function ReferralPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const linkId = params.linkId as string;
  const dezinsectorId = searchParams.get('id') || linkId;
  
  // Состояние
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dezinsectorProfile, setDezinsectorProfile] = useState<DezinsectorProfile>(DEFAULT_DEZINSECTOR_PROFILE);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);



  // Функция для генерации цен из данных сервиса
  const generatePricesFromService = useCallback((serviceData: any) => {
    const prices: ServicePrice[] = [];
    
    // Базовый тариф - 1-2 комнаты
    if (serviceData.oneRoomLiquid > 0 || serviceData.oneRoomGel > 0) {
      const liquidPrice = serviceData.oneRoomLiquid || 2500;
      const gelPrice = serviceData.oneRoomGel || 2500;
      const minPrice = Math.min(liquidPrice, gelPrice);
      
      prices.push({
        id: '1',
        name: 'Базовый',
        description: 'Обработка от основных видов насекомых',
        price: minPrice,
        oldPrice: Math.round(minPrice * 1.4),
        features: [
          'Обработка 1-2 комнат', 
          'Сертифицированные препараты', 
          'Гарантия 6 месяцев',
          liquidPrice > 0 ? `Жидкость: ${liquidPrice} ₽` : '',
          gelPrice > 0 ? `Гель: ${gelPrice} ₽` : ''
        ].filter(Boolean),
        popular: false
      });
    }
    
    // Стандартный тариф - 2-3 комнаты
    if (serviceData.twoRoomLiquid > 0 || serviceData.twoRoomGel > 0) {
      const liquidPrice = serviceData.twoRoomLiquid || 3500;
      const gelPrice = serviceData.twoRoomGel || 3500;
      const minPrice = Math.min(liquidPrice, gelPrice);
      
      prices.push({
        id: '2',
        name: 'Стандарт',
        description: 'Комплексная обработка с профилактикой',
        price: minPrice,
        oldPrice: Math.round(minPrice * 1.3),
        features: [
          'Обработка 2-3 комнат', 
          'Двойная обработка', 
          'Гарантия 1 год', 
          'Повторный выезд',
          liquidPrice > 0 ? `Жидкость: ${liquidPrice} ₽` : '',
          gelPrice > 0 ? `Гель: ${gelPrice} ₽` : ''
        ].filter(Boolean),
        popular: true
      });
    }
    
    // Премиум тариф - 3+ комнаты
    if (serviceData.threeRoomLiquid > 0 || serviceData.threeRoomGel > 0) {
      const liquidPrice = serviceData.threeRoomLiquid || 5000;
      const gelPrice = serviceData.threeRoomGel || 5000;
      const minPrice = Math.min(liquidPrice, gelPrice);
      
      prices.push({
        id: '3',
        name: 'Премиум',
        description: 'Максимальная защита и комфорт',
        price: minPrice,
        oldPrice: Math.round(minPrice * 1.3),
        features: [
          'Обработка 3+ комнат', 
          'Тройная обработка', 
          'Гарантия 2 года', 
          'Бесплатные консультации',
          liquidPrice > 0 ? `Жидкость: ${liquidPrice} ₽` : '',
          gelPrice > 0 ? `Гель: ${gelPrice} ₽` : ''
        ].filter(Boolean),
        popular: false
      });
    }
    
    // Дом/участок
    if (serviceData.homeRoomLiquid > 0 || serviceData.homeRoomGel > 0 || serviceData.plotRoomLiquid > 0 || serviceData.plotRoomGel > 0) {
      const homeLiquid = serviceData.homeRoomLiquid || 0;
      const homeGel = serviceData.homeRoomGel || 0;
      const plotLiquid = serviceData.plotRoomLiquid || 0;
      const plotGel = serviceData.plotRoomGel || 0;
      const minPrice = Math.min(homeLiquid || 6000, homeGel || 6000, plotLiquid || 8000, plotGel || 8000);
      
      if (minPrice > 0) {
        prices.push({
          id: '4',
          name: 'Дом/Участок',
          description: 'Обработка частных домов и участков',
          price: minPrice,
          oldPrice: Math.round(minPrice * 1.3),
          features: [
            'Обработка дома и участка', 
            'Комплексная защита', 
            'Гарантия 1 год',
            homeLiquid > 0 ? `Дом жидкость: ${homeLiquid} ₽` : '',
            homeGel > 0 ? `Дом гель: ${homeGel} ₽` : '',
            plotLiquid > 0 ? `Участок жидкость: ${plotLiquid} ₽` : '',
            plotGel > 0 ? `Участок гель: ${plotGel} ₽` : ''
          ].filter(Boolean),
          popular: false
        });
      }
    }
    
    // Коммерческие объекты
    if (serviceData.restaurantRoomLiquid > 0 || serviceData.restaurantRoomGel > 0) {
      const liquidPrice = serviceData.restaurantRoomLiquid || 10000;
      const gelPrice = serviceData.restaurantRoomGel || 10000;
      const minPrice = Math.min(liquidPrice, gelPrice);
      
      prices.push({
        id: '5',
        name: 'Коммерческий',
        description: 'Обработка ресторанов и коммерческих объектов',
        price: minPrice,
        oldPrice: Math.round(minPrice * 1.2),
        features: [
          'Обработка коммерческих объектов', 
          'Специальные препараты', 
          'Гарантия 1 год',
          'Работа в нерабочее время',
          liquidPrice > 0 ? `Жидкость: ${liquidPrice} ₽` : '',
          gelPrice > 0 ? `Гель: ${gelPrice} ₽` : ''
        ].filter(Boolean),
        popular: false
      });
    }
    
    // Если нет данных о ценах, возвращаем дефолтные
    if (prices.length === 0) {
      return [
        {
          id: '1',
          name: 'Базовый',
          description: 'Обработка от основных видов насекомых',
          price: 2500,
          oldPrice: 3500,
          features: ['Обработка 1-2 комнат', 'Сертифицированные препараты', 'Гарантия 6 месяцев'],
          popular: false
        },
        {
          id: '2',
          name: 'Стандарт',
          description: 'Комплексная обработка с профилактикой',
          price: 3500,
          oldPrice: 4500,
          features: ['Обработка 2-3 комнат', 'Двойная обработка', 'Гарантия 1 год', 'Повторный выезд'],
          popular: true
        },
        {
          id: '3',
          name: 'Премиум',
          description: 'Максимальная защита и комфорт',
          price: 5000,
          oldPrice: 6500,
          features: ['Обработка 3+ комнат', 'Тройная обработка', 'Гарантия 2 года', 'Бесплатные консультации'],
          popular: false
        }
      ];
    }
    
    return prices;
  }, []);

  // Получение данных пользователя
  const fetchUserData = useCallback(async () => {
    if (!dezinsectorId) return;

    try {
      setIsLoading(true);
      
      // Сначала пытаемся получить данные по linkId
      logApiCall('GET', `/api/user/by-link-id/${dezinsectorId}`);
      
      const response = await fetch(`/api/user/by-link-id/${dezinsectorId}`);
      if (response.ok) {
        const userData = await response.json();
        
        // Обновляем профиль дезинсектора с реальными данными
        if (userData) {
          setDezinsectorProfile(prev => ({
            ...prev,
            id: userData.id || dezinsectorId,
            name: userData.name || prev.name,
            surname: userData.surname || prev.surname,
            phone: userData.phone || prev.phone,
            email: userData.email || prev.email,
            company: userData.company || prev.company,
            address: userData.address || prev.address
          }));
        }
      } else {
        console.warn('Не удалось получить информацию о дезинсекторе по linkId');
      }
      
      // Дополнительно пытаемся получить полную информацию через token-info
      try {
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.bugbot.ru'}/user/token-info`, {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpoa3Y1MzFAbWFpbC5ydSIsImlkIjoiOWVjNDEyNjktYzJlNS00YjBiLWI4NmUtMjQzODYwNDgyZGUxIiwibmFtZSI6IllVUklZIiwic3VybmFtZSI6IlpIVUtPViIsInBob25lIjoiNzk1Mjk3MTIxMTgiLCJoYXZlVGVsZWdyYW1Ub2tlbiI6ZmFsc2UsImhhdmVTZXJ2aWNlUHJpY2UiOnRydWUsImlhdCI6MTc1NjUzMDg4NSwiZXhwIjoxNzU5MTIyODg1fQ.6ew27hggudz3aXwb_SPMQzw71DCg52hPrMDRnxWxDtM'
          }
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          console.log('Получены данные из token-info:', tokenData);
          
          // Обновляем профиль с реальными данными из API
          setDezinsectorProfile(prev => ({
            ...prev,
            id: tokenData.id || prev.id,
            name: tokenData.name || prev.name,
            surname: tokenData.surname || prev.surname,
            phone: tokenData.phone ? `+7 (${tokenData.phone.slice(1, 4)}) ${tokenData.phone.slice(4, 7)}-${tokenData.phone.slice(7, 9)}-${tokenData.phone.slice(9, 11)}` : prev.phone,
            email: tokenData.email || prev.email,
            company: 'Дезинфектор Эксперт',
            address: 'Москва и Московская область',
            experience: 5,
            rating: 4.8,
            completedOrders: 850,
            specialties: ['Квартиры', 'Частные дома', 'Участки', 'Коммерческие объекты'],
            guarantees: ['Гарантия результата 6 месяцев', 'Сертифицированные препараты'],
            workingHours: 'Ежедневно с 8:00 до 22:00',
            responseTime: 'Выезд в течение 2 часов',
            linkId: tokenData.linkId || prev.id,
            // Дополнительные поля из API
            isAdmin: tokenData.isAdmin,
            isVerified: tokenData.isVerified,
            unlimitedAccount: tokenData.unlimitedAccount,
            status: tokenData.status,
            createdAt: tokenData.createdAt,
            updatedAt: tokenData.updatedAt
          }));
          

        }
              } catch (tokenError) {
          console.warn('Не удалось получить данные из token-info:', tokenError);
        }
        
        // Дополнительно получаем расширенную информацию через /user/profile
        try {
          const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.bugbot.ru'}/user/profile`, {
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inpoa3Y1MzFAbWFpbC5ydSIsImlkIjoiOWVjNDEyNjktYzJlNS00YjBiLWI4NmUtMjQzODYwNDgyZGUxIiwibmFtZSI6IllVUklZIiwic3VybmFtZSI6IlpIVUtPViIsInBob25lIjoiNzk1Mjk3MTIxMTgiLCJoYXZlVGVsZWdyYW1Ub2tlbiI6ZmFsc2UsImlhdCI6MTc1NjUzMDg4NSwiZXhwIjoxNzU5MTIyODg1fQ.6ew27hggudz3aXwb_SPMQzw71DCg52hPrMDRnxWxDtM'
            }
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('Получены данные из /user/profile:', profileData);
            
                      // Обновляем профиль с расширенными данными
          setDezinsectorProfile(prev => ({
            ...prev,
            botLink: profileData.botLink || prev.botLink,
            tariff: profileData.tariff || prev.tariff,
            service: profileData.service || prev.service
          }));
          
          // Если есть данные о сервисах, обновляем цены
          if (profileData.service) {
            const newPrices = generatePricesFromService(profileData.service);
            setDezinsectorProfile(prev => ({
              ...prev,
              prices: newPrices
            }));
          }
          
          // Генерируем динамические данные на основе API
          if (profileData.service) {
            const serviceData = profileData.service;
            
            // Генерируем специализации на основе доступных услуг
            const availableServices: string[] = [];
            if (serviceData.oneRoomLiquid > 0 || serviceData.oneRoomGel > 0) availableServices.push('Квартиры');
            if (serviceData.homeRoomLiquid > 0 || serviceData.homeRoomGel > 0) availableServices.push('Частные дома');
            if (serviceData.plotRoomLiquid > 0 || serviceData.plotRoomGel > 0) availableServices.push('Участки');
            if (serviceData.restaurantRoomLiquid > 0 || serviceData.restaurantRoomGel > 0) availableServices.push('Коммерческие объекты');
            
            // Генерируем гарантии на основе тарифа
            const tariffGuarantees: string[] = [];
            if (profileData.tariff) {
              if (profileData.tariff.price === '1990') {
                tariffGuarantees.push('Гарантия результата 1 год');
                tariffGuarantees.push('Бесплатный повторный выезд');
                tariffGuarantees.push('Сертифицированные препараты');
                tariffGuarantees.push('Приоритетная поддержка');
              } else {
                tariffGuarantees.push('Гарантия результата 6 месяцев');
                tariffGuarantees.push('Сертифицированные препараты');
              }
            }
            
            // Обновляем профиль с динамическими данными
            setDezinsectorProfile(prev => ({
              ...prev,
              specialties: availableServices.length > 0 ? availableServices : ['Квартиры', 'Частные дома', 'Участки', 'Коммерческие объекты'],
              guarantees: tariffGuarantees.length > 0 ? tariffGuarantees : ['Гарантия результата 6 месяцев', 'Сертифицированные препараты'],
              workingHours: 'Ежедневно с 8:00 до 22:00',
              responseTime: 'Выезд в течение 2 часов',
              experience: 5,
              rating: 4.8,
              completedOrders: 850
            }));
          }
          }
        } catch (profileError) {
          console.warn('Не удалось получить данные из /user/profile:', profileError);
        }
      
    } catch (error) {
      console.warn('Ошибка при получении информации о дезинсекторе');
    } finally {
      setIsLoading(false);
    }
  }, [dezinsectorId]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Обработка изменения полей
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    if (field === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    const nameError = validateRequired(formData.clientName, 'Имя');
    if (nameError) newErrors.clientName = nameError;
    else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'Имя должно содержать минимум 2 символа';
    }
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const addressError = validateRequired(formData.address, 'Адрес');
    if (addressError) newErrors.address = addressError;
    else if (formData.address.trim().length < 3) {
      newErrors.address = 'Адрес должен содержать минимум 3 символа';
    }
    
    if (!formData.service) newErrors.service = 'Выберите тип услуги';
    if (!formData.object) newErrors.object = 'Выберите тип объекта';
    if (!formData.count) newErrors.count = 'Выберите количество вредителей';
    if (!formData.experience) newErrors.experience = 'Выберите опыт обработки';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Создание заявки
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const orderData: CreateOrderRequest = {
        service: SERVICE_MAP[formData.service] || formData.service,
        object: OBJECT_MAP[formData.object] || formData.object,
        count: COUNT_MAP[formData.count] || 'sometimes',
        experience: EXPERIENCE_MAP[formData.experience] || 'no',
        address: formData.address.trim(),
        phoneNumber: cleanPhone(formData.phone),
        name: formData.clientName.trim(),
        clientComment: formData.comment.trim() || '',
        dezinsectorComment: '',
        dezinsectorId: dezinsectorId,
        expectDate: new Date(formData.visitDate).toISOString()
      };

      logApiCall('POST', '/order', orderData);

      const response = await fetch(getApiUrl('/order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка создания заявки');
      }

      const result = await response.json();
      logApiCall('POST', '/order', 'Success');
      
      if (result.success && result.orderCreated) {
        console.log('Заявка успешно создана!');
        
        try {
          dashboardEvents.emit(DASHBOARD_EVENTS.ORDER_CREATED, {
            id: result.orderId || 'temp-id',
            service: orderData.service,
            object: orderData.object,
            count: orderData.count,
            experience: orderData.experience,
            address: orderData.address,
            phoneNumber: orderData.phoneNumber,
            name: orderData.name,
            clientComment: orderData.clientComment,
            dezinsectorComment: orderData.dezinsectorComment,
            dezinsectorId: orderData.dezinsectorId,
            expectDate: orderData.expectDate,
            status: 'New',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.warn('Не удалось уведомить дашборд:', error);
        }
        
        setShowSuccess(true);
        setCurrentStep(3);
        setFormData(DEFAULT_FORM_DATA);
      } else {
        console.warn('Заявка создана, но есть проблемы с ценами');
        setShowSuccess(true);
        setCurrentStep(3);
      }
    } catch (error: unknown) {
      logApiError('POST', '/order', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания заявки';
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, dezinsectorId]);

  // Навигация по шагам
  const nextStep = useCallback(() => {
    if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  }, [currentStep, validateForm]);

  const prevStep = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setShowSuccess(false);
    setErrors({});
  }, []);

  // Страница успеха
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Заявка успешно отправлена!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Спасибо за обращение! Наш специалист свяжется с вами в течение 2 часов для уточнения деталей.
            </p>
            
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-green-900 mb-3">Детали заявки:</h3>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>Имя:</span>
                  <span className="font-medium">{formData.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Телефон:</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Адрес:</span>
                  <span className="font-medium">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Услуга:</span>
                  <span className="font-medium">{formData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span>Объект:</span>
                  <span className="font-medium">{formData.object}</span>
                </div>
                <div className="flex justify-between">
                  <span>Дата:</span>
                  <span className="font-medium">{format(new Date(formData.visitDate), 'dd.MM.yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Отправить еще заявку
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Загружаем данные...</h2>
          <p className="text-gray-600">Подготавливаем информацию о специалисте</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      {/* Hero-секция */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Левая колонка - текст */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium">
                <Shield className="w-5 h-5" />
                Лицензированная дезинсекция
              </div>
              

              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Профессиональная
                <span className="block text-green-300">дезинсекция</span>
                вашего дома
              </h1>
              
              <p className="text-xl text-green-100 leading-relaxed">
                Избавим от насекомых быстро, безопасно и с гарантией результата. 
                Заполните форму для получения консультации.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock3 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Быстрый выезд</div>
                    <div className="text-sm text-green-200">В течение 2 часов</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Гарантия 1 год</div>
                    <div className="text-sm text-green-200">На все виды работ</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Получить консультацию
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Заказать звонок
                </Button>
              </div>
            </div>
            

            
            {/* Правая колонка - статистика */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20">
                              {/* Картинка dez.png внутри блока */}
              <div className="mb-8">
                <img 
                  src="/dez.png" 
                  alt="DezExpert Logo" 
                  className="w-full h-auto object-contain rounded-2xl shadow-lg"
                />
              </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-300">{dezinsectorProfile.completedOrders}+</div>
                    <div className="text-sm text-green-200">Выполненных заказов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-300">{dezinsectorProfile.experience}+</div>
                    <div className="text-sm text-green-200">Лет опыта</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-5 h-5 ${star <= Math.floor(dezinsectorProfile.rating) ? 'text-yellow-400 fill-current' : 'text-white/30'}`} />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{dezinsectorProfile.rating}</span>
                  </div>
                  <div className="text-center text-sm text-green-200 mt-1">
                    Рейтинг клиентов
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Секция преимуществ */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы предлагаем комплексный подход к решению проблем с насекомыми, 
              используя современные технологии и проверенные методы
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Быстрое решение</h3>
              <p className="text-gray-600">Выезжаем в течение 2 часов и решаем проблему за один день</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Безопасность</h3>
              <p className="text-gray-600">Используем только сертифицированные препараты, безопасные для людей и животных</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Гарантия результата</h3>
              <p className="text-gray-600">Даем гарантию до 2 лет на все виды работ</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Опытные специалисты</h3>
              <p className="text-gray-600">Команда профессионалов с многолетним опытом работы</p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Форма заявки */}
      <div id="contact-form" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Оставить заявку
            </h2>
            <p className="text-xl text-gray-600">
              Заполните форму ниже, и наш специалист свяжется с вами для уточнения деталей
            </p>
          </div>

          {/* Форма заявки */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-green-100 p-8 backdrop-blur-sm bg-white/95 overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Шаг 1: Основная информация */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    Основная информация
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Имя клиента */}
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.clientName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Введите ваше имя"
                        maxLength={50}
                      />
                      {errors.clientName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.clientName}
                        </p>
                      )}
                    </div>

                    {/* Телефон */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+7 (900) 555-33-21"
                        maxLength={18}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Адрес */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        Адрес *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Введите полный адрес"
                        maxLength={200}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Дата посещения */}
                    <div className="md:col-span-2">
                      <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Желаемая дата посещения *
                      </label>
                      <input
                        type="date"
                        id="visitDate"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={(e) => handleInputChange('visitDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Кнопка "Далее" */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      Далее
                    </Button>
                  </div>
                </div>
              )}

              {/* Шаг 2: Детали услуги */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Bug className="w-5 h-5 text-green-600" />
                    </div>
                    Детали услуги
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Тип услуги */}
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Bug className="w-4 h-4 text-green-600" />
                        От кого нужна обработка *
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={(e) => handleInputChange('service', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.service ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      >
                        {SERVICE_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.service}
                        </p>
                      )}
                    </div>

                    {/* Тип объекта */}
                    <div>
                      <label htmlFor="object" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4 text-green-600" />
                        Тип объекта *
                      </label>
                      <select
                        id="object"
                        name="object"
                        value={formData.object}
                        onChange={(e) => handleInputChange('object', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.object ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      >
                        {OBJECT_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.object && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.object}
                        </p>
                      )}
                    </div>

                    {/* Количество вредителей */}
                    <div>
                      <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Bug className="w-4 h-4 text-green-600" />
                        Количество вредителей *
                      </label>
                      <select
                        id="count"
                        name="count"
                        value={formData.count}
                        onChange={(e) => handleInputChange('count', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.count ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      >
                        {COUNT_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.count && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.count}
                        </p>
                      )}
                    </div>

                    {/* Опыт обработки */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        Опыт обработки *
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 ${
                          errors.experience ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                        }`}
                      >
                        {EXPERIENCE_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.experience && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    {/* Комментарий */}
                    <div className="md:col-span-2">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        Дополнительная информация
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={(e) => handleInputChange('comment', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-400 bg-gray-50/50 resize-none"
                        placeholder="Расскажите подробнее о проблеме (необязательно)"
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {formData.comment.length}/500 символов
                      </div>
                    </div>
                  </div>

                  {/* Кнопки навигации */}
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold"
                    >
                      Назад
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Отправляем заявку...
                        </span>
                      ) : (
                        'Отправить заявку'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{dezinsectorProfile.company}</h3>
              <p className="text-gray-400 mb-4">
                Профессиональная дезинсекция с гарантией результата
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-400">
                {dezinsectorProfile.specialties.slice(0, 4).map((specialty, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors">
                      {specialty}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>Заполните форму для связи</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>{dezinsectorProfile.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>{dezinsectorProfile.workingHours}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Гарантии</h4>
              <ul className="space-y-2 text-gray-400">
                {dezinsectorProfile.guarantees.slice(0, 3).map((guarantee, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {guarantee}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {dezinsectorProfile.company}. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}