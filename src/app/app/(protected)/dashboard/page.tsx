'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { 
  Plus, 
  Copy,
  Search,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { AddRequestModal } from '@/components/AddRequestModal';
import { OrderDetails } from '@/components/OrderDetails';
import { Calendar } from '@/components/Calendar';
import { Analytics } from '@/components/Analytics';
import { AvitoConnection } from '@/components/AvitoConnection';
import { AvitoListings } from '@/components/AvitoListings';
import { TokenInfo } from '@/components/TokenInfo';
// import DashboardPricingManager from '@/components/DashboardPricingManager';
import PriceEditModal from '@/components/PriceEditModal';
import type { Order, CreateOrderRequest, UserProfile, OrdersResponse } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Pagination } from '@/components/ui/pagination';
import { updateUserPrices, getDefaultPrices, forceRefreshPrices } from '@/lib/pricingApi';
import { useOrdersState } from '@/hooks/useOrders';

import { getApiUrl } from '@/lib/config';
import { getServiceText } from '@/lib/translations';

// API конфигурация

export default function DashboardPage() {
  // Используем хук useAuth для синхронизации состояния авторизации
  const { refreshUser } = useAuth();
  
  // Используем хук useOrders для правильной пагинации
  const { 
    orders: ordersFromHook, 
    totalOrders: totalOrdersFromHook, 
    currentPage: currentPageFromHook, 
    itemsPerPage: itemsPerPageFromHook,
    fetchOrders: fetchOrdersFromHook,
    setPage: setPageFromHook,
    setPageSize: setPageSizeFromHook,
    isLoading: isLoadingFromHook
  } = useOrdersState();

  const [activeTab, setActiveTab] = useState('leads');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOrders: 0,
    newLeadsToday: 0,
    newOrders: 0,
    inProgressOrders: 0,
    doneOrders: 0,
    deniedOrders: 0,
    isUnlimited: false,
    hasTrialTariff: false,
    isPaidTariff: false
  });
  const [currentTariffInfo, setCurrentTariffInfo] = useState<{
    id: string;
    name: string;
    price: string;
    isPromo: boolean;
    isActive: boolean;
    advantages: string[];
  } | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [userPrices, setUserPrices] = useState(getDefaultPrices());
  const [hasNoTariff, setHasNoTariff] = useState(false);
  const [avitoConnected, setAvitoConnected] = useState(false);

  // Используем данные из хука
  const orders = ordersFromHook;
  const totalOrders = totalOrdersFromHook;
  const currentPage = currentPageFromHook;
  const itemsPerPage = itemsPerPageFromHook;

  // Загружаем профиль пользователя и заявки
  const fetchUserProfileAndOrders = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }

      setIsLoading(true);
      setHasLoadError(false); // Сбрасываем ошибку загрузки
      
      // Загружаем профиль пользователя
      const profileResponse = await fetch(getApiUrl('/user/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

              if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
          
          // Синхронизируем состояние авторизации в header
          try {
            await refreshUser();
          } catch (error) {
            console.error('Ошибка синхронизации авторизации:', error);
          }
        
        // Используем тариф из профиля пользователя
        let tariffInfo = profileData.tariff || null;
        let isUnlimited = false;
        let hasTrialTariff = false;
        let isPaidTariff = false;
        
        if (tariffInfo) {
          const tariffName = tariffInfo.name.toLowerCase();
          const tariffPrice = tariffInfo.price;
          
          // Определяем безлимитность по названию тарифа
          isUnlimited = tariffName.includes('unlimited') || 
                       tariffName.includes('безлимит') ||
                       tariffName.includes('бесконечный') ||
                       tariffName.includes('корпоративный') || // Корпоративный тариф всегда безлимитный
                       tariffName.includes('всегда вместе') || // Тарифы "Всегда вместе" имеют безлимитные заявки
                       tariffName.includes('всегда вместе+') ||
                       tariffName.includes('всегда вместе'); // Учитываем разные варианты написания
          
          // Определяем пробный тариф
          hasTrialTariff = tariffName.includes('trial') || 
                          tariffName.includes('пробный') ||
                          tariffName.includes('тестовый') ||
                          tariffName.includes('промо') ||
                          tariffPrice === '1' || // Промо тариф за 1₽
                          tariffPrice === '1.00' ||
                          tariffPrice === '0' || // Бесплатный тариф
                          tariffPrice === '0.00';
          
          // Определяем платный тариф
          isPaidTariff = !hasTrialTariff && tariffPrice !== '0' && tariffPrice !== '0.00' && tariffPrice !== '1' && tariffPrice !== '1.00';
          
                  console.log('Информация о тарифе из профиля:', {
          name: tariffInfo.name,
          price: tariffInfo.price,
          isUnlimited,
          hasTrialTariff,
          isPaidTariff
        });
        
        // Дополнительное логирование для отладки
        console.log('Профиль пользователя:', {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          hasTariff: !!profileData.tariff,
          tariffName: profileData.tariff?.name,
          tariffPrice: profileData.tariff?.price
        });
        }
        
        // Определяем, есть ли у пользователя тариф
        const userHasTariff = !!tariffInfo;
        setHasNoTariff(!userHasTariff);
        
        // Если у пользователя нет тарифа в профиле, попробуем загрузить из /tariff/list
        if (!tariffInfo) {
          try {
            const tariffsResponse = await fetch(getApiUrl('/tariff/list'), {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (tariffsResponse.ok) {
              const tariffsData = await tariffsResponse.json();
              
              // Ищем активный тариф пользователя
              tariffInfo = tariffsData.find((tariff: any) => 
                tariff.isActive && tariff.user && tariff.user.some((user: any) => user.id === profileData.id)
              );
              
              // Если не нашли тариф пользователя, ищем активный тариф
              if (!tariffInfo) {
                tariffInfo = tariffsData.find((tariff: any) => tariff.isActive);
              }
              
              if (tariffInfo) {
                console.log('Найден тариф из /tariff/list:', tariffInfo.name);
              }
            }
          } catch (error) {
            console.warn('Не удалось загрузить информацию о тарифе из /tariff/list:', error);
          }
        }

        setCurrentTariffInfo(tariffInfo);
        setStats(prev => ({
          ...prev,
          isUnlimited,
          hasTrialTariff,
          isPaidTariff
        }));

        // Загружаем заявки через хук (API /order/list поддерживает только page и pageSize)
        await fetchOrdersFromHook({
          page: 1,
          pageSize: 10
          // linkId, search, status не поддерживаются API /order/list
        });
        
        // Статистика будет обновлена через useEffect при изменении хука
      } else {
        // Если профиль не загружен, создаем временный профиль для демо
        const tempProfile: UserProfile = {
          id: 'temp',
          linkId: 'demo',
          name: 'Демо пользователь',
          surname: 'Демо',
          email: 'demo@example.com',
          phone: '+7 (999) 999-99-99',
          isAdmin: false,
          isVerified: true,
          unlimitedAccount: false,
          status: 'Active'
        };
        
        setUserProfile(tempProfile);
        setStats(prev => ({ ...prev, isUnlimited: false, hasTrialTariff: false, isPaidTariff: false }));
        
        // Загружаем демо заявки через хук (API /order/list поддерживает только page и pageSize)
        await fetchOrdersFromHook({
          page: 1,
          pageSize: 10
          // linkId, search, status не поддерживаются API /order/list
        });
        
        // Статистика будет обновлена через useEffect при изменении хука
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      toast.error('Ошибка загрузки профиля пользователя');
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для загрузки заявок с пагинацией
  const fetchOrdersWithPagination = async (
    linkId: string, 
    token: string, 
    isUnlimited: boolean, 
    hasTrialTariff: boolean, 
    isFreeTariff: boolean
  ) => {
    try {
      // Определяем размер страницы в зависимости от тарифа
      let pageSize = itemsPerPage;
      
      // Ограничиваем только бесплатные тарифы
      if (isFreeTariff && !isUnlimited) {
        pageSize = 5; // Максимум 5 заявок для бесплатных тарифов
      }
      
      // Используем хук для загрузки заявок
      await fetchOrdersFromHook({
        page: currentPage,
        pageSize,
        linkId,
        search: searchTerm.trim(),
        status: ''
      });
      
      // Статистика будет обновлена через useEffect при изменении хука
      
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      toast.error('Ошибка сети при загрузке заявок');
    }
  };

  // Обработчик поиска
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    
    // Сбрасываем на первую страницу при поиске
    setPageFromHook(1);
    
          // Загружаем данные с новым поисковым запросом через хук (API /order/list поддерживает только page и pageSize)
      if (userProfile) {
        fetchOrdersFromHook({
          page: 1,
          pageSize: itemsPerPage
          // linkId, search, status не поддерживаются API /order/list
        });
      }
  };

  // Обработчик смены страницы
  const handlePageChange = async (newPage: number) => {
    if (newPage === currentPage) return;
    
    setIsLoadingPage(true);
    
    // Используем хук для смены страницы
    setPageFromHook(newPage);
    
          // Загружаем заявки для новой страницы через хук (API /order/list поддерживает только page и pageSize)
      if (userProfile) {
        await fetchOrdersFromHook({
          page: newPage,
          pageSize: itemsPerPage
          // linkId, search, status не поддерживаются API /order/list
        });
      }
    
    setIsLoadingPage(false);
  };

  // Обработчик изменения размера страницы
  const handlePageSizeChange = async (newPageSize: number) => {
    // Используем хук для изменения размера страницы
    setPageSizeFromHook(newPageSize);
    
          // Загружаем заявки с новым размером страницы через хук (API /order/list поддерживает только page и pageSize)
      if (userProfile) {
        await fetchOrdersFromHook({
          page: 1,
          pageSize: newPageSize
          // linkId, search, status не поддерживаются API /order/list
        });
      }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchUserProfileAndOrders();
    
    // Синхронизируем состояние авторизации при загрузке страницы
    const syncAuth = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Ошибка синхронизации авторизации при загрузке:', error);
      }
    };
    
    syncAuth();
  }, [refreshUser]);

  // Сбрасываем пагинацию при изменении поиска
  useEffect(() => {
    if (searchTerm) {
      setPageFromHook(1);
    }
  }, [searchTerm, setPageFromHook]);

  // Загружаем данные при изменении страницы (API /order/list поддерживает только page и pageSize)
  useEffect(() => {
    if (userProfile && !isLoading && currentPage > 1) {
      fetchOrdersFromHook({
        page: currentPage,
        pageSize: itemsPerPage
        // linkId, search, status не поддерживаются API /order/list
      });
    }
  }, [currentPage, userProfile, isLoading, itemsPerPage]);

  // Автоматически обновляем статистику при изменении данных в хуке
  useEffect(() => {
    if (userProfile && totalOrdersFromHook > 0) {
      console.log('Дашборд: Автоматически обновляем статистику с данными из хука:', {
        totalOrdersFromHook,
        ordersFromHookLength: ordersFromHook.length
      });
      
      setStats(prev => ({
        ...prev,
        totalLeads: totalOrdersFromHook,
        totalOrders: totalOrdersFromHook,
        newLeadsToday: ordersFromHook.filter(order => {
          const today = new Date();
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          const orderDate = new Date(order.createdAt);
          return orderDate >= todayStart && orderDate < todayEnd;
        }).length
      }));
    }
  }, [totalOrdersFromHook, ordersFromHook, userProfile]);

  // Загружаем данные при изменении размера страницы
  useEffect(() => {
    if (userProfile && !isLoading && itemsPerPage !== 10) {
      fetchOrdersFromHook({
        page: 1,
        pageSize: itemsPerPage,
        linkId: userProfile.linkId,
        search: searchTerm.trim(),
        status: ''
      });
    }
  }, [itemsPerPage, userProfile, isLoading, searchTerm]);

  // Загружаем данные при изменении поиска
  useEffect(() => {
    if (userProfile && !isLoading && searchTerm.trim()) {
      // Сбрасываем на первую страницу при изменении поиска
      setPageFromHook(1);
      
      fetchOrdersFromHook({
        page: 1,
        pageSize: itemsPerPage,
        linkId: userProfile.linkId,
        search: searchTerm.trim(),
        status: ''
      });
    }
  }, [searchTerm, userProfile, isLoading, itemsPerPage]);

  // Отдельно загружаем цены пользователя при монтировании
  useEffect(() => {
    const loadUserPrices = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const prices = await forceRefreshPrices(token);
          if (prices) {
            setUserPrices(prices);
          }
        } catch (error) {
          console.warn('Не удалось загрузить цены пользователя:', error);
        }
      }
    };

    loadUserPrices();
  }, []);

  // Загружаем все заявки для подсчета статистики по статусам
  useEffect(() => {
    const fetchAllOrdersForStats = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token || !userProfile) return;

      try {
        // Загружаем все заявки через API /order/list
        const response = await fetch(getApiUrl('/order/list?skipPages=0&pageSize=1000'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const allOrders = data.data || [];
          const totalCount = data.count || 0;

          // Подсчитываем статистику по статусам
          const newOrders = allOrders.filter((order: Order) => order.status === 'New').length;
          const inProgressOrders = allOrders.filter((order: Order) => order.status === 'Inprogress').length;
          const doneOrders = allOrders.filter((order: Order) => order.status === 'Done').length;
          const deniedOrders = allOrders.filter((order: Order) => order.status === 'Denied').length;

          // Подсчитываем новые заявки за сегодня
          const today = new Date();
          const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          
          const newToday = allOrders.filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return order.status === 'New' && orderDate >= todayStart && orderDate < todayEnd;
          }).length;

          // Обновляем статистику
          setStats(prev => ({
            ...prev,
            totalLeads: totalCount,
            totalOrders: totalCount,
            newLeadsToday: newToday,
            newOrders: newOrders,
            inProgressOrders: inProgressOrders,
            doneOrders: doneOrders,
            deniedOrders: deniedOrders
          }));

          console.log('Статистика заявок обновлена:', {
            totalCount,
            newOrders,
            inProgressOrders,
            doneOrders,
            deniedOrders,
            newToday
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики заявок:', error);
      }
    };

    if (userProfile) {
      fetchAllOrdersForStats();
    }
  }, [userProfile]);

  // Функция для перевода английских ключей в русские названия
  const translateService = (serviceKey: string): string => {
    const serviceMap: { [key: string]: string } = {
      'cockroaches': 'Тараканы',
      'rats': 'Крысы',
      'bedbugs': 'Клопы',
      'fleas': 'Блохи',
      'ants': 'Муравьи',
      'spiders': 'Пауки',
      'wasps': 'Осы',
      'bees': 'Пчелы',
      'other_insects': 'Другие насекомые'
    };
    return serviceMap[serviceKey] || serviceKey;
  };

  const translateObject = (objectKey: string): string => {
    const objectMap: { [key: string]: string } = {
      'apartment1': '1 комнатная квартира',
      'apartment2': '2 комнатная квартира',
      'apartment3': '3 комнатная квартира',
      'apartment4': '4 комнатная квартира',
      'apartment5': '5+ комнатная квартира',
      'house': 'Частный дом',
      'restaurant': 'Ресторан',
      'office': 'Офис',
      'warehouse': 'Склад',
      'plot': 'Участок'
    };
    return objectMap[objectKey] || objectKey;
  };

  // Показываем заявки с пагинацией, учитывая ограничения тарифа
  // Ограничиваем только бесплатные пробные тарифы, но не безлимитные
  const effectivePageSize = (stats.hasTrialTariff && !stats.isUnlimited && stats.totalLeads <= 5) ? 5 : itemsPerPage;
  
  // Для отображения используем загруженные заявки (поиск уже применен на сервере)
  const displayOrders = orders;
  
  // Вычисляем общее количество страниц на основе общего количества заявок
  const totalPages = Math.ceil(totalOrders / effectivePageSize);

  // Используем состояние загрузки из хука
  const isOrdersLoading = isLoadingFromHook || isLoadingPage;

  const handleCopyLink = () => {
    if (!userProfile?.linkId) {
      toast.error('Ссылка еще не готова');
      return;
    }
    // Ссылка на страницу рефералки, где клиент заполняет заявку
    const clientLink = `${window.location.origin}/${userProfile.linkId}`;
    navigator.clipboard.writeText(clientLink);
    toast.success(`Персональная ссылка скопирована: ${clientLink}`);
    
    // Трекинг копирования ссылки
    if (typeof window !== 'undefined' && (window as any).track) {
      (window as any).track('copy_ref_link', { linkId: userProfile.linkId });
    }
  };

  const handleAddRequest = () => {
    setShowAddModal(true);
  };

  const handleCreateOrder = async (orderData: CreateOrderRequest) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }
      
      setIsLoading(true);
      
      // Отправляем запрос на создание заявки
              const response = await fetch(getApiUrl('/order'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.orderCreated) {
        toast.success('Заявка успешно создана!');
        setShowAddModal(false);
        
        // Обновляем статистику немедленно
        setStats(prev => ({
          ...prev,
          totalLeads: prev.totalLeads + 1,
          totalOrders: prev.totalOrders + 1,
          newLeadsToday: prev.newLeadsToday + 1
        }));
        
        // Обновляем список заявок через хук
        await fetchOrdersFromHook({
          page: 1,
          pageSize: itemsPerPage,
          linkId: userProfile?.linkId,
          search: searchTerm.trim(),
          status: ''
        });
        
        // Обновляем статистику из хука
        setStats(prev => ({
          ...prev,
          totalLeads: totalOrdersFromHook,
          totalOrders: totalOrdersFromHook
        }));
        
      } else {
        toast.warning('Заявка создана, но есть проблемы с ценами');
        setShowAddModal(false);
        
        // Даже при проблемах с ценами перезагружаем список
        await fetchOrdersFromHook({
          page: 1,
          pageSize: itemsPerPage,
          linkId: userProfile?.linkId,
          search: searchTerm.trim(),
          status: ''
        });
        
        // Обновляем статистику из хука
        setStats(prev => ({
          ...prev,
          totalLeads: totalOrdersFromHook,
          totalOrders: totalOrdersFromHook
        }));
      }
    } catch (error) {
      let errorMessage = 'Ошибка создания заявки';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Необходима авторизация';
        } else if (error.message.includes('400')) {
          errorMessage = 'Неверные данные заявки';
        } else if (error.message.includes('422')) {
          errorMessage = 'Ошибка валидации данных';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    
    // Обновляем заявку в списке
    // setOrders(prevOrders => { // This line was removed as per the new_code, as 'orders' is no longer defined here.
    //   const newOrders = prevOrders.map(order => 
    //     order.id === updatedOrder.id ? updatedOrder : order
    //   );
    //   return newOrders;
    // });
    
    // Обновляем выбранную заявку, если она открыта
    if (selectedOrder && selectedOrder.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder);
    }
    
  };



  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleAvitoConnected = () => {
    setAvitoConnected(true);
  };

  const handleAvitoListingUpdate = (listing: any) => {
    // Обновляем статистику или выполняем другие действия
    console.log('Avito listing updated:', listing);
  };

  const getStatusDot = (status: string) => {
    if (status === 'New') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-blue-700">Новый</span>
        </div>
      );
    } else if (status === 'Inprogress') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-yellow-700">В работе</span>
        </div>
      );
    } else if (status === 'Done') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-green-700">Завершен</span>
        </div>
      );
    } else if (status === 'Denied') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs font-medium text-red-700">Отменен</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Неизвестно</span>
        </div>
      );
    }
  };







  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-2">
        {/* Навигационное меню */}


        {/* Заголовок */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 mt-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Заявки на дезинфекцию</h1>
            {userProfile ? (
              <div className="text-sm text-gray-600 mt-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div>
                    {currentTariffInfo ? (
                      <div>
                        <p className="font-medium text-gray-700">
                          {currentTariffInfo.name} - {currentTariffInfo.price === '0' || currentTariffInfo.price === '0.00' ? 'Бесплатно' : currentTariffInfo.price === 'ОБСУДИМ' ? 'По запросу' : `${currentTariffInfo.price} ₽`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stats.isUnlimited ? 'Безлимитный доступ' : (stats.hasTrialTariff ? 'Пробный доступ - максимум 5 заявок' : 'Безлимитный доступ')}
                        </p>
                      </div>
                    ) : (
                      <p>
                        {hasNoTariff 
                          ? 'Тариф не выбран - заявки заблокированы' 
                          : stats.isUnlimited 
                            ? 'Безлимитный доступ' 
                            : (stats.hasTrialTariff ? 'Пробный доступ - максимум 5 заявок' : 'Безлимитный доступ')
                        }
                      </p>
                    )}
                    {!stats.isUnlimited && (stats.hasTrialTariff || userProfile.tariff?.price === '0') && stats.totalLeads > 5 && (
                      <span className="text-orange-600 ml-2">
                        (показано 5 из {stats.totalLeads})
                      </span>
                    )}
                  </div>
                  <TokenInfo className="self-start" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Загрузка профиля...</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddRequest} className="bg-green-600 hover:bg-green-700 text-white" disabled={!userProfile || isLoadingPage}>
              <Plus className="w-4 h-4 mr-2" />
              {userProfile ? 'Добавить заявку' : 'Загрузка...'}
            </Button>
            <Button variant="outline" onClick={handleCopyLink} disabled={!userProfile?.linkId || isLoadingPage}>
              <Copy className="w-4 h-4 mr-2" />
              Копировать персональную ссылку
            </Button>
            {/* DashboardPricingManager закомментирован - используется карточка "Управление ценами" */}
            {/* <DashboardPricingManager 
              onPricesUpdated={() => {
                // Обновляем статистику после изменения цен
                fetchUserProfileAndOrders();
              }}
            /> */}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-8">
          {/* Всего заявок */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center h-full">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Всего заявок</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {userProfile ? (
                    hasNoTariff 
                      ? '3 (демо)'
                      : stats.hasTrialTariff && !stats.isUnlimited && stats.totalLeads <= 5
                        ? Math.min(stats.totalLeads, 5)
                        : stats.totalLeads
                  ) : '...'}
                </p>
              </div>
            </div>
          </div>

          {/* Заказов */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center h-full">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:w-5 text-green-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Новых заявок</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {userProfile ? (stats.newOrders || 0) : '...'}
                </p>
              </div>
            </div>
          </div>

          {/* В работе */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center h-full">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">В работе</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {userProfile ? (stats.inProgressOrders || 0) : '...'}
                </p>
              </div>
            </div>
          </div>

          {/* Завершено */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center h-full">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Завершено</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {userProfile ? (stats.doneOrders || 0) : '...'}
                </p>
              </div>
            </div>
          </div>

          {/* Новых сегодня */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center h-full">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Новых сегодня</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {userProfile ? stats.newLeadsToday : '...'}
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* Легенда цветов статусов */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex-shrink-0">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Цвета статусов:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-700">Новый</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 rounded-md border border-yellow-100">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-700">В работе</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-700">Завершен</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-md border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-700">Отменен</span>
              </div>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-white border border-gray-200 mb-6 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'leads'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!userProfile}
              >
                {userProfile ? 'Все заявки' : 'Все заявки (загрузка...)'}
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'calendar'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!userProfile}
              >
                Календарь
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!userProfile}
              >
                {userProfile ? 'Аналитика' : 'Аналитика (загрузка...)'}
              </button>
              <button
                onClick={() => setActiveTab('avito')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'avito'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={!userProfile}
              >
                {userProfile ? 'Авито' : 'Авито (загрузка...)'}
              </button>
            </nav>
          </div>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'leads' && (
          !userProfile ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Загружаем профиль...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Баннер для пользователей без тарифа */}
              {hasNoTariff && !stats.isPaidTariff && (
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Оформите пробную подписку на сервис
                    </h3>
                    <p className="text-blue-700 mb-4 max-w-2xl mx-auto">
                      Для доступа к заявкам необходимо выбрать тарифный план. Начните с бесплатного пробного периода и оцените все возможности системы.
                    </p>
                    <Button 
                      onClick={() => window.open('/payment_v2', '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Выбрать тариф
                    </Button>
                  </div>
                </div>
              )}

              {/* Фильтры */}
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={userProfile ? "Поиск по имени, телефону или адресу..." : "Загрузка..."}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      disabled={!userProfile || isLoadingPage}
                      className="pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isLoadingPage && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Загрузка */}
              {isLoading && (
                <div className="p-16 text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600">
                    Загружаем заявки...
                  </p>
                </div>
              )}

              {/* Загрузка страницы */}
              {isLoadingPage && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}

              {/* Ошибка загрузки */}
              {!isLoading && !userProfile && (
                <div className="p-16 text-center">
                  <div className="text-red-500 mb-4">
                    <AlertTriangle className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки профиля</p>
                  <p className="text-gray-600 mb-4">Не удалось загрузить данные профиля. Попробуйте еще раз.</p>
                  <Button onClick={fetchUserProfileAndOrders} className="bg-blue-600 hover:bg-blue-700" disabled={isOrdersLoading}>
                    {isOrdersLoading ? <LoadingSpinner size="sm" /> : 'Попробовать снова'}
                  </Button>
                </div>
              )}

              {/* Таблица */}
              {!isLoading && !isOrdersLoading && displayOrders.length > 0 && (
                <div className="relative">
                  {/* Загрузка страницы */}
                  {isOrdersLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <LoadingSpinner />
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Имя
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Услуга
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Контакт
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Адрес
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ожидаемая дата
                        </th>
                        <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Объект
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-gray-50 transition-colors ${
                            hasNoTariff ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                          onClick={hasNoTariff ? undefined : () => handleViewOrder(order)}
                        >
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap">
                            {getStatusDot(order.status)}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.name}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getServiceText(order.service)}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.phoneNumber}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs lg:max-w-md truncate">
                            {order.address}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.expectDate).toLocaleDateString('ru-RU')}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs lg:max-w-md truncate">
                            {translateObject(order.object)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}

              {/* Пустое состояние */}
              {!isLoading && !isOrdersLoading && displayOrders.length === 0 && userProfile && (
                <div className="text-center py-16">
                  <p className="text-gray-500">
                    {searchTerm ? 'По вашему запросу ничего не найдено' : 'Заявок пока нет'}
                  </p>
                  {!stats.isUnlimited && stats.hasTrialTariff && stats.totalLeads <= 5 && (
                    <p className="text-sm text-orange-600 mt-2">
                      У вас пробный тариф. Обновите подписку для расширенных возможностей.
                    </p>
                  )}
                </div>
              )}

              {/* Состояние загрузки страницы */}
              {!isLoading && isOrdersLoading && (
                <div className="text-center py-16">
                  <LoadingSpinner size="lg" />
                  <p className="mt-2 text-gray-600">Загружаем страницу...</p>
                </div>
              )}

              {/* Ошибка загрузки заявок */}
              {!isLoading && userProfile && orders.length === 0 && totalOrders === 0 && hasLoadError && (
                <div className="p-16 text-center">
                  <div className="text-orange-500 mb-4">
                    <AlertTriangle className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки заявок</p>
                  <p className="text-gray-600 mb-4">Не удалось загрузить заявки. Попробуйте еще раз.</p>
                  <Button onClick={fetchUserProfileAndOrders} className="bg-blue-600 hover:bg-blue-700" disabled={isOrdersLoading}>
                    {isOrdersLoading ? <LoadingSpinner size="sm" /> : 'Попробовать снова'}
                  </Button>
                </div>
              )}

              {/* Пагинация */}
              {userProfile && totalPages > 1 && (
                <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    itemsPerPage={effectivePageSize}
                    totalItems={totalOrders}
                    showPageSizeSelector={stats.isUnlimited || (!stats.hasTrialTariff && !hasNoTariff)}
                    isLoading={isOrdersLoading}
                  />
                </div>
              )}

              {/* Информация о лимитах для обычных пользователей */}
              {userProfile && !stats.isUnlimited && stats.hasTrialTariff && stats.totalLeads <= 5 && (
                <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-700">
                        У вас пробный тариф. Показывается максимум 5 заявок.
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Новые заявки не будут отображаться, пока не обновите подписку
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        window.open('/payment_v2', '_blank');
                        // Трекинг клика по апгрейду
                        if (typeof window !== 'undefined' && (window as any).track) {
                          (window as any).track('dashboard_upgrade_click', { placement: 'no_tariff_banner' });
                        }
                      }}
                      disabled={isOrdersLoading}
                      className="mt-2 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isOrdersLoading ? <LoadingSpinner size="sm" /> : 'Обновить подписку'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        )}

















        {/* Календарь */}
        {activeTab === 'calendar' && (
          !userProfile ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Загружаем профиль...</p>
            </div>
          ) : (
            <Calendar 
              orders={orders}
              onOrderClick={handleViewOrder}
              currentDate={new Date()}
            />
          )
        )}

        {/* Аналитика */}
        {activeTab === 'analytics' && (
          !userProfile ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Загружаем профиль...</p>
            </div>
          ) : (
            <Analytics 
              orders={orders}
              userProfile={userProfile}
            />
          )
        )}

        {/* Авито */}
        {activeTab === 'avito' && (
          !userProfile ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Загружаем профиль...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AvitoConnection onConnected={handleAvitoConnected} />
              <AvitoListings onListingUpdate={handleAvitoListingUpdate} />
            </div>
          )
        )}

        {/* Модальные окна */}
        <AddRequestModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateOrder}
        />
        <OrderDetails 
          isOpen={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)} 
          order={selectedOrder} 
          authToken={localStorage.getItem('auth_token') || undefined}
          onOrderUpdate={handleOrderUpdate}
        />

        {/* Модальное окно для редактирования цен */}
        <PriceEditModal 
          isOpen={showPriceModal}
          onClose={() => setShowPriceModal(false)}
          onOpen={() => {
            // Загружаем актуальные цены при открытии модала
            if (userProfile?.id) {
              const token = localStorage.getItem('auth_token');
              if (token) {
                forceRefreshPrices(token).then(prices => {
                  if (prices) {
                    setUserPrices(prices);
                  }
                });
              }
            }
          }}
          onSave={async (prices) => {
            try {
              const token = localStorage.getItem('auth_token');
              if (!token) {
                toast.error('Необходима авторизация');
                return;
              }

              if (!userProfile?.id) {
                toast.error('Профиль пользователя не загружены');
                return;
              }

              // Обновляем цены через новый API
              const result = await updateUserPrices(token, userProfile.id, prices);

              if (result.success) {
                // Обновляем состояние цен
                setUserPrices(prices);
                // Очищаем кэш, чтобы при следующей загрузке использовались новые цены
                localStorage.removeItem('user_prices');
                toast.success('Цены успешно обновлены!');
                setShowPriceModal(false);
              } else {
                toast.error(result.error || 'Ошибка обновления цен');
              }
            } catch (error) {
              console.error('Ошибка при обновлении цен:', error);
              toast.error('Ошибка подключения к серверу');
            }
          }}
          initialPrices={userPrices}
          isLoading={false}
        />
      </div>
    
    {/* Новый красивый футер - вынесен на два уровня выше */}
    <footer className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 mt-12 w-full">
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Логотип и описание */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Dezexpert
                </h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Современная CRM-система для автоматизации обработки заявок и управления клиентами
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-green-600 hover:text-green-700 transition-colors" title="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-700 transition-colors" title="WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Быстрые ссылки */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Быстрые ссылки</h3>
              <div className="space-y-2">
                <a href="/app/dashboard" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Дашборд
                </a>
                <a href="/app/settings" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Настройки
                </a>
                <a href="/payment_v2" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Тарифы
                </a>
                <a href="/app/auth" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Вход в систему
                </a>
              </div>
            </div>

            {/* Поддержка и контакты */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Поддержка</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Связаться с нами
                </a>
                <a href="/policy" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Политика конфиденциальности
                </a>
                <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Условия использования
                </a>
                <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Центр помощи
                </a>
              </div>
            </div>
          </div>

          {/* Нижняя часть футера */}
          <div className="pt-6 border-t border-green-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>© 2025</span>
                <span className="text-green-600 font-medium">NoCodeZilla</span>
                <span>Все права защищены</span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <span className="text-gray-500">Версия 2.0</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">Система активна</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}
