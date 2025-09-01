'use client';

/* eslint-disable bem-helper/case */
// Этот файл использует Tailwind CSS классы, которые могут содержать camelCase

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoader } from '@/components/ui/loading-spinner';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { CreateOrderRequest } from '@/lib/api';

import { API_BASE_URL } from '@/lib/config';

// Интерфейс для цен на услуги
interface ServicePrices {
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

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: CreateOrderRequest) => Promise<void>;
}

export const AddRequestModal: React.FC<AddRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    service: '',
    object: '',
    count: '',
    experience: '',
    address: '',
    phone: '',
    clientName: '',
    visitDate: format(new Date(), 'yyyy-MM-dd'),
    comment: '',
    dezinsectorId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicePrices, setServicePrices] = useState<ServicePrices | null>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  // Получаем ID пользователя и цены на услуги при открытии модала
  useEffect(() => {
    if (isOpen) {
      console.log('Модал открыт, получаем ID пользователя и цены...');
      
      // Функция для получения цен на услуги
      const fetchServicePrices = async () => {
        try {
          setIsLoadingPrices(true);
          const token = localStorage.getItem('auth_token');
          if (token) {
            const response = await fetch(`${API_BASE_URL}/user/service`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setServicePrices(data);
            } else {
              console.log('Не удалось получить цены, используем демо-цены');
              setServicePrices(getDemoPrices());
            }
          } else {
            setServicePrices(getDemoPrices());
          }
        } catch (error) {
          console.error('Ошибка получения цен:', error);
          setServicePrices(getDemoPrices());
        } finally {
          setIsLoadingPrices(false);
        }
      };
      
      // Демо-цены для случая, когда API недоступен
      const getDemoPrices = (): ServicePrices => ({
        oneRoomLiquid: 1500,
        oneRoomGel: 1200,
        twoRoomLiquid: 1800,
        twoRoomGel: 1500,
        threeRoomLiquid: 2200,
        threeRoomGel: 1900,
        fourRoomLiquid: 2600,
        fourRoomGel: 2300,
        homeRoomLiquid: 3000,
        homeRoomGel: 2700,
        plotRoomLiquid: 3500,
        plotRoomGel: 3200,
        restaurantRoomLiquid: 4000,
        restaurantRoomGel: 3700
      });
      
      const fetchUserId = async () => {
        try {
          // Получаем токен из localStorage
          console.log('Проверяем localStorage...');
          console.log('Все ключи в localStorage:', Object.keys(localStorage));
          console.log('auth_token:', localStorage.getItem('auth_token'));
          console.log('token:', localStorage.getItem('token'));
          
          const token = localStorage.getItem('auth_token');
          if (!token) {
            throw new Error('Токен не найден');
          }

          // Получаем информацию о пользователе напрямую из API
          const response = await fetch(`${API_BASE_URL}/user/token-info`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const tokenInfo = await response.json();
          console.log('Получен tokenInfo:', tokenInfo);
          console.log('ID пользователя:', tokenInfo.id);
          console.log('LinkId пользователя:', tokenInfo.linkId);
          
          setFormData(prev => {
            console.log('Обновляем formData, предыдущий dezinsectorId:', prev.dezinsectorId);
            const newData = {
              ...prev,
              dezinsectorId: tokenInfo.linkId // Используем linkId вместо id
            };
            console.log('Новый dezinsectorId:', newData.dezinsectorId);
            return newData;
          });
        } catch (error) {
          console.error('Ошибка получения ID пользователя:', error);
          // Используем fallback ID
          console.log('Используем fallback ID: VOL1X');
          setFormData(prev => ({
            ...prev,
            dezinsectorId: 'VOL1X'
          }));
        }
      };
      
      // Запускаем обе функции параллельно
      fetchServicePrices();
      fetchUserId();
    }
  }, [isOpen]);

  // Сброс формы при закрытии
  const handleClose = () => {
    setFormData({
      service: 'Тараканов',
      object: '1 комнатная квартира',
      count: 'Очень много',
      experience: 'Да, самостоятельно',
      address: '',
      phone: '',
      clientName: '',
      visitDate: format(new Date(), 'yyyy-MM-dd'),
      comment: '',
      dezinsectorId: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`handleInputChange: ${field} = "${value}"`);
    if (field === 'phone') {
      // Форматируем телефон при вводе
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 11) {
        let formatted = '';
        if (cleaned.length > 0) formatted += '+7';
        if (cleaned.length > 1) formatted += ` (${cleaned.slice(1, 4)}`;
        if (cleaned.length > 4) formatted += `) ${cleaned.slice(4, 7)}`;
        if (cleaned.length > 7) formatted += `-${cleaned.slice(7, 9)}`;
        if (cleaned.length > 9) formatted += `-${cleaned.slice(9, 11)}`;
        console.log(`Форматируем телефон: "${value}" -> "${formatted}"`);
        setFormData(prev => ({ ...prev, [field]: formatted }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Принудительно обновляем отображение цены при изменении сервиса или объекта
    if (field === 'service' || field === 'object') {
      // Используем setTimeout для асинхронного обновления
      setTimeout(() => {
        // Это заставит компонент перерендериться и пересчитать цену
      }, 0);
    }
  };

  const validateForm = (): boolean => {
    // Проверяем телефон
    if (!formData.phone.trim()) {
      toast.error('Введите телефон');
      return false;
    }

    // Проверяем адрес
    if (!formData.address.trim()) {
      toast.error('Введите адрес');
      return false;
    }

    // Проверяем имя клиента
    if (!formData.clientName.trim()) {
      toast.error('Введите имя клиента');
      return false;
    }

    if (formData.clientName.trim().length < 2) {
      toast.error('Имя должно содержать минимум 2 символа');
      return false;
    }

    // Проверяем тип услуги
    if (!formData.service.trim()) {
      toast.error('Выберите тип вредителя');
      return false;
    }

    // Проверяем тип объекта
    if (!formData.object.trim()) {
      toast.error('Выберите тип объекта');
      return false;
    }

    // Проверяем количество вредителей
    if (!formData.count.trim()) {
      toast.error('Выберите количество вредителей');
      return false;
    }

    // Проверяем опыт обработки
    if (!formData.experience.trim()) {
      toast.error('Выберите опыт обработки');
      return false;
    }

    // Проверяем на наличие потенциально опасных символов
    const dangerousChars = /[<>"'&]/;
    if (dangerousChars.test(formData.phone) || 
        dangerousChars.test(formData.address) || 
        dangerousChars.test(formData.clientName)) {
      toast.error('Поля содержат недопустимые символы');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleSubmit: начинаем отправку формы');
    console.log('Текущий formData:', formData);
    
    if (!validateForm()) {
      console.log('handleSubmit: валидация не пройдена');
      return;
    }
    
    console.log('handleSubmit: валидация пройдена, готовим данные');

    try {
      setIsSubmitting(true);
      
      // Рассчитываем цены на основе выбранных параметров
      const calculatedPrices = calculatePrice();
      let finalPrices;
      
      if (!calculatedPrices) {
        console.error('Не удалось рассчитать цену для параметров:', {
          service: formData.service,
          object: formData.object,
          servicePrices: servicePrices
        });
        
        // Показываем fallback цены
        toast.error('Не удалось рассчитать точную цену. Используются базовые тарифы.');
        
        // Используем fallback цены
        finalPrices = {
          liquidPrice: 2000,
          jelPrice: 1800,
          realPrice: 2000
        };
        
        // Продолжаем с fallback ценами
        console.log('Используем fallback цены:', finalPrices);
      } else {
        finalPrices = calculatedPrices;
        console.log('Используем рассчитанные цены:', finalPrices);
      }

      // Функция для маппинга русских значений в английские ключи API
      const mapServiceToApi = (service: string): string => {
        const serviceMap: Record<string, string> = {
          'Тараканов': 'cockroaches',
          'Клопов': 'bedbugs',
          'Мух и клопов': 'flies',
          'Клещей': 'ticks',
          'Других насекомых': 'other',
          // Поддержка старых вариантов
          'Тараканы': 'cockroaches',
          'Клопы': 'bedbugs',
          'Мухи': 'flies',
          'Муравьи': 'ants',
          'Грызуны': 'rodents',
          'Блохи': 'fleas',
          'Плесень': 'mold',
          'Осы': 'wasps',
          'Шершни': 'hornets'
        };
        return serviceMap[service] || service;
      };

      const mapObjectToApi = (object: string): string => {
        const objectMap: Record<string, string> = {
          '1 комнатная квартира': 'apartment1',
          '2 комнатная квартира': 'apartment2',
          '3 комнатная квартира': 'apartment3',
          '4 комнатная квартира': 'apartment4',
          '4+ комнатная квартира': 'apartment4',
          '5+ комнатная квартира': 'apartment4',
          'Дом': 'house',
          'Участок': 'plot',
          'Коммерческий объект': 'commercial',
          'Другое': 'other',
          // Поддержка старых вариантов
          'Частный дом': 'house',
          'Дача': 'dacha',
          'Офис': 'office',
          'Магазин': 'shop',
          'Ресторан': 'restaurant',
          'Склад': 'warehouse',
          'Производство': 'production'
        };
        return objectMap[object] || object;
      };

      const mapCountToApi = (count: string): string => {
        const countMap: Record<string, string> = {
          'Очень много': 'very_often',
          'Иногда встречаются': 'sometimes',
          'Нужна просто профилактика': 'rare',
          // Поддержка старых вариантов
          'Редко встречаются': 'rare',
          'Часто встречаются': 'often',
          'Очень часто встречаются': 'very_often',
          'Сильно заражены': 'infested',
          'Регулярно появляются': 'often'
        };
        return countMap[count] || 'sometimes';
      };

      const mapExperienceToApi = (experience: string): string => {
        const experienceMap: Record<string, string> = {
          'Да, самостоятельно': 'yes',
          'Да, вызывал специалиста': 'yes',
          'Нет, не травил': 'no',
          // Поддержка старых вариантов
          'Да, травил': 'yes',
          'Частично травил': 'partial',
          'Нет, первый раз': 'no'
        };
        return experienceMap[experience] || 'no';
      };

      // Подготавливаем данные для отправки в соответствии с API
      const orderData: CreateOrderRequest = {
        service: mapServiceToApi(formData.service),
        object: mapObjectToApi(formData.object),
        count: mapCountToApi(formData.count), // Используем значение из формы
        experience: mapExperienceToApi(formData.experience), // Используем значение из формы
        address: formData.address.trim(),
        phoneNumber: (() => {
          const cleanPhone = formData.phone.replace(/\D/g, '');
          if (cleanPhone.startsWith('8')) {
            return `+7${cleanPhone.slice(1)}`;
          } else if (cleanPhone.startsWith('7')) {
            return `+7${cleanPhone.slice(1)}`;
          } else {
            return `+7${cleanPhone}`;
          }
        })(),
        name: formData.clientName.trim(),
        clientComment: formData.comment.trim() || '',
        dezinsectorComment: '', // Пустое значение
        dezinsectorId: formData.dezinsectorId.trim(),
        expectDate: new Date(formData.visitDate).toISOString(), // Полный ISO формат
        liquidPrice: finalPrices.liquidPrice,
        jelPrice: finalPrices.jelPrice,
        realPrice: finalPrices.realPrice
      };

      console.log('formData.dezinsectorId:', formData.dezinsectorId);
      console.log('orderData.dezinsectorId:', orderData.dezinsectorId);

      // Дополнительная проверка обязательных полей
      console.log('Проверяем обязательные поля:');
      console.log('- service:', orderData.service, 'заполнено:', !!orderData.service);
      console.log('- object:', orderData.object, 'заполнено:', !!orderData.object);
      console.log('- count:', orderData.count, 'заполнено:', !!orderData.count);
      console.log('- experience:', orderData.experience, 'заполнено:', !!orderData.experience);
      console.log('- address:', orderData.address, 'заполнено:', !!orderData.address);
      console.log('- phoneNumber:', orderData.phoneNumber, 'заполнено:', !!orderData.phoneNumber);
      console.log('- name:', orderData.name, 'заполнено:', !!orderData.name);
      console.log('- expectDate:', orderData.expectDate, 'заполнено:', !!orderData.expectDate);
      console.log('- dezinsectorId:', orderData.dezinsectorId, 'заполнено:', !!orderData.dezinsectorId);
      
      if (!orderData.service || !orderData.object || !orderData.count || !orderData.experience || 
          !orderData.address || !orderData.phoneNumber || !orderData.name || !orderData.expectDate || !orderData.dezinsectorId) {
        toast.error('Все обязательные поля должны быть заполнены');
        return;
      }

      // Логируем данные перед отправкой
      console.log('Отправляем данные заявки:', JSON.stringify(orderData, null, 2));
      console.log('Детали данных:');
      console.log('- service:', orderData.service, 'тип:', typeof orderData.service);
      console.log('- object:', orderData.object, 'тип:', typeof orderData.object);
      console.log('- count:', orderData.count, 'тип:', typeof orderData.count);
      console.log('- experience:', orderData.experience, 'тип:', typeof orderData.experience);
      console.log('- address:', orderData.address, 'тип:', typeof orderData.address);
      console.log('- phoneNumber:', orderData.phoneNumber, 'тип:', typeof orderData.phoneNumber);
      console.log('- name:', orderData.name, 'тип:', typeof orderData.name);
      console.log('- clientComment:', orderData.clientComment, 'тип:', typeof orderData.clientComment);
      console.log('- dezinsectorComment:', orderData.dezinsectorComment, 'тип:', typeof orderData.dezinsectorComment);
      console.log('- dezinsectorId:', orderData.dezinsectorId, 'тип:', typeof orderData.dezinsectorId);
      console.log('- expectDate:', orderData.expectDate, 'тип:', typeof orderData.expectDate);
      
      await onSubmit(orderData);
      
      // Сбрасываем форму и закрываем модал
      setFormData({
        service: 'Тараканов',
        object: '1 комнатная квартира',
        count: 'Очень много',
        experience: 'Да, самостоятельно',
        address: '',
        phone: '',
        clientName: '',
        visitDate: format(new Date(), 'yyyy-MM-dd'),
        comment: '',
        dezinsectorId: ''
      });
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка создания заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для расчета цены на основе выбранных параметров
  const calculatePrice = (): { liquidPrice: number; jelPrice: number; realPrice: number } | null => {
    if (!servicePrices) {
      console.log('calculatePrice: servicePrices не загружены');
      return null;
    }
    
    console.log('calculatePrice: начинаем расчет цены');
    console.log('formData.object:', formData.object);
    console.log('formData.service:', formData.service);
    console.log('servicePrices:', servicePrices);
    
    // Маппинг типов объектов на ключи цен
    const objectPriceMap: Record<string, string> = {
      'apartment1': 'oneRoom',
      'apartment2': 'twoRoom',
      'apartment3': 'threeRoom',
      'apartment4': 'fourRoom',
      'house': 'homeRoom',
      'dacha': 'homeRoom',
      'plot': 'plotRoom',
      'office': 'restaurantRoom',
      'shop': 'restaurantRoom',
      'restaurant': 'restaurantRoom',
      'warehouse': 'plotRoom',
      'production': 'plotRoom',
      // Добавляем поддержку русских названий
      '1 комнатная квартира': 'oneRoom',
      '2 комнатная квартира': 'twoRoom',
      '3 комнатная квартира': 'threeRoom',
      '4+ комнатная квартира': 'fourRoom',
      '5+ комнатная квартира': 'fourRoom', // Добавляем поддержку 5+ комнат
      'Частный дом': 'homeRoom',
      'Дача': 'homeRoom',
      'Участок': 'plotRoom',
      'Офис': 'restaurantRoom',
      'Магазин': 'restaurantRoom',
      'Ресторан': 'restaurantRoom',
      'Склад': 'plotRoom',
      'Производство': 'plotRoom'
    };
    
    // Маппинг типов сервисов на тип обработки
    const serviceTypeMap: Record<string, string> = {
      'cockroaches': 'Gel',
      'bedbugs': 'Liquid',
      'flies': 'Liquid',
      'ticks': 'Liquid',
      'mice': 'Liquid',
      'rats': 'Liquid',
      'ants': 'Gel',
      'wasps': 'Liquid',
      'hornets': 'Liquid',
      'other': 'Liquid',
      // Добавляем поддержку русских названий (единственное число)
      'Тараканы': 'Gel',
      'Клопы': 'Liquid',
      'Мухи': 'Liquid',
      'Клещи': 'Liquid',
      'Муравьи': 'Gel',
      'Грызуны': 'Liquid',
      'Блохи': 'Liquid',
      'Плесень': 'Liquid',
      'Осы': 'Liquid',
      'Шершни': 'Liquid',
      // Добавляем поддержку русских названий (множественное число)
      'Тараканов': 'Gel',
      'Клопов': 'Liquid',
      'Мух': 'Liquid',
      'Клещей': 'Liquid',
      'Муравьев': 'Gel',
      'Грызунов': 'Liquid',
      'Блох': 'Liquid',
      'Плесени': 'Liquid',
      'Оси': 'Liquid',
      'Шершней': 'Liquid',
      // Добавляем поддержку других вариантов
      'Мух и клопов': 'Liquid',
      'Других насекомых': 'Liquid'
    };
    
    const objectKey = objectPriceMap[formData.object];
    const serviceType = serviceTypeMap[formData.service];
    
    console.log('objectKey:', objectKey);
    console.log('serviceType:', serviceType);
    
    if (!objectKey) {
      console.log('calculatePrice: не найден objectKey для:', formData.object);
      console.log('Доступные ключи:', Object.keys(objectPriceMap));
      return null;
    }
    
    if (!serviceType) {
      console.log('calculatePrice: не найден serviceType для:', formData.service);
      console.log('Доступные ключи:', Object.keys(serviceTypeMap));
      return null;
    }
    
    const priceKey = `${objectKey}${serviceType}` as keyof ServicePrices;
    console.log('priceKey:', priceKey);
    
    const basePrice = servicePrices[priceKey];
    console.log('basePrice:', basePrice);
    
    if (!basePrice) {
      console.log('calculatePrice: не найдена базовая цена для ключа:', priceKey);
      console.log('Доступные ключи в servicePrices:', Object.keys(servicePrices));
      return null;
    }
    
    // Рассчитываем финальную цену с учетом площади (базовая площадь 50м²)
    const areaMultiplier = Math.max(1, 50 / 50); // Пока используем базовую площадь
    const finalPrice = Math.round(basePrice * areaMultiplier);
    
    console.log('calculatePrice: успешно рассчитана цена:', finalPrice);
    
    return {
      liquidPrice: serviceType === 'Liquid' ? finalPrice : 0,
      jelPrice: serviceType === 'Gel' ? finalPrice : 0,
      realPrice: finalPrice
    };
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Создать новую заявку</h2>
                <p className="text-sm text-gray-600 mt-1">Заполните форму для создания заявки клиента</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          {isLoadingPrices && (
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
              <ButtonLoader />
              <span>Загрузка цен...</span>
            </div>
          )}
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Имя клиента */}
            <div className="space-y-2">
              <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700">
                Имя клиента *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Введите имя клиента"
                maxLength={50}
              />
            </div>

            {/* Телефон */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Телефон *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="+7 (900) 555-33-22"
                maxLength={18}
              />
            </div>

            {/* Адрес */}
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                Адрес *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Введите полный адрес"
                maxLength={200}
              />
            </div>

            {/* Дата посещения */}
            <div className="space-y-2">
              <label htmlFor="visitDate" className="block text-sm font-semibold text-gray-700">
                Желаемая дата посещения *
              </label>
              <input
                type="date"
                id="visitDate"
                name="visitDate"
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Тип услуги */}
            <div className="space-y-2">
              <label htmlFor="service" className="block text-sm font-semibold text-gray-700">
                От кого нужна обработка? *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Выберите тип вредителя</option>
                <option value="Тараканов">Тараканов</option>
                <option value="Клопов">Клопов</option>
                <option value="Мух и клопов">Мух и клопов</option>
                <option value="Клещей">Клещей</option>
                <option value="Других насекомых">Других насекомых</option>
              </select>
            </div>

            {/* Тип объекта */}
            <div className="space-y-2">
              <label htmlFor="object" className="block text-sm font-semibold text-gray-700">
                Тип объекта *
              </label>
              <select
                id="object"
                name="object"
                value={formData.object}
                onChange={(e) => handleInputChange('object', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Выберите тип объекта</option>
                <option value="1 комнатная квартира">1 комнатная квартира</option>
                <option value="2 комнатная квартира">2 комнатная квартира</option>
                <option value="3 комнатная квартира">3 комнатная квартира</option>
                <option value="4 комнатная квартира">4 комнатная квартира</option>
                <option value="Дом">Дом</option>
                <option value="Участок">Участок</option>
                <option value="Коммерческий объект">Коммерческий объект</option>
                <option value="Другое">Другое</option>
              </select>
            </div>

            {/* Количество вредителей */}
            <div className="space-y-2">
              <label htmlFor="count" className="block text-sm font-semibold text-gray-700">
                Выберите количество вредителей *
              </label>
              <select
                id="count"
                name="count"
                value={formData.count}
                onChange={(e) => handleInputChange('count', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="Очень много">Очень много</option>
                <option value="Иногда встречаются">Иногда встречаются</option>
                <option value="Нужна просто профилактика">Нужна просто профилактика</option>
              </select>
            </div>

            {/* Опыт обработки */}
            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-semibold text-gray-700">
                Ранее травили вредителей? *
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="Да, самостоятельно">Да, самостоятельно</option>
                <option value="Да, вызывал специалиста">Да, вызывал специалиста</option>
                <option value="Нет, не травил">Нет, не травил</option>
              </select>
            </div>

            {/* Комментарий */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="comment" className="block text-sm font-semibold text-gray-700">
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Дополнительная информация (необязательно)"
                maxLength={500}
              />
            </div>

            {/* Отображение рассчитанной цены */}
            {servicePrices && (
              <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Расчет стоимости</h3>
                </div>
                {(() => {
                  const prices = calculatePrice();
                  if (prices) {
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                          <span className="text-gray-700 font-medium">Базовая стоимость:</span>
                          <span className="text-2xl font-bold text-green-600">{prices.realPrice} ₽</span>
                        </div>
                        {prices.liquidPrice > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                            <span className="text-gray-700">Обработка жидкостью:</span>
                            <span className="font-semibold text-green-600">{prices.liquidPrice} ₽</span>
                          </div>
                        )}
                        {prices.jelPrice > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                            <span className="text-gray-700">Обработка гелем:</span>
                            <span className="font-semibold text-blue-600">{prices.jelPrice} ₽</span>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-4 text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Выберите тип услуги и объекта для расчета стоимости</p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}


          </div>

          {/* Кнопка отправки */}
          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <ButtonLoader />
                  <span>Создание заявки...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Создать заявку</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
