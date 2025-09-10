'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonLoader, LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { 
  User, 
  // Bell, // временно не используется
  Settings as SettingsIcon,
  Settings,
  Mail,
  Phone,
  Building,
  // MapPin убран, так как адрес больше не используется
  Shield,
  Save,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string(), // Убрана валидация, так как поле не редактируется
  company: z.string().optional(),
  // address убран, так как дезинфектору не нужен
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Введите текущий пароль'),
  newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'pricing'>('profile');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
  } | null>(null);

  const [prices, setPrices] = useState({
    oneRoomLiquid: 0,
    oneRoomGel: 0,
    twoRoomLiquid: 0,
    twoRoomGel: 0,
    threeRoomLiquid: 0,
    threeRoomGel: 0,
    fourRoomLiquid: 0,
    fourRoomGel: 0,
    homeRoomLiquid: 0,
    homeRoomGel: 0,
    plotRoomLiquid: 0,
    plotRoomGel: 0,
    restaurantRoomLiquid: 0,
    restaurantRoomGel: 0
  });

  // Загружаем профиль пользователя с кэшированием
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Токен не найден');
        }

        // Проверяем кэш профиля
        const cachedProfile = localStorage.getItem('user_profile_cache');
        const cacheTimestamp = localStorage.getItem('user_profile_timestamp');
        const now = Date.now();
        
        // Если кэш не старше 5 минут, используем его
        if (cachedProfile && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 5 * 60 * 1000) {
          try {
            const profile = JSON.parse(cachedProfile);
            setUserProfile(profile);
            profileForm.reset({
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              company: profile.company || '',
            });
            setIsLoadingProfile(false);
            return;
          } catch (e) {
            // Если кэш поврежден, удаляем его
            localStorage.removeItem('user_profile_cache');
            localStorage.removeItem('user_profile_timestamp');
          }
        }

        // Временно используем заглушку для профиля
        const profile = {
          id: 'temp-id',
          name: 'Тестовый пользователь',
          email: 'test@example.com',
          phone: '+7 (999) 123-45-67',
          company: 'Тестовая компания'
        };
        setUserProfile(profile);
        
        // Кэшируем профиль
        localStorage.setItem('user_profile_cache', JSON.stringify(profile));
        localStorage.setItem('user_profile_timestamp', now.toString());
        
        // Обновляем форму профиля с реальными данными
        profileForm.reset({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          company: profile.company || '',
        });
      } catch (error) {
        console.error('Ошибка загрузки профиля');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  // Загружаем цены на услуги
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setIsLoadingPrices(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          toast.warning('⚠️ Не удалось загрузить цены: требуется авторизация');
          return;
        }

        const response = await fetch('/user/service', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const pricesData = await response.json();
          setPrices(pricesData);
          toast.success('✅ Цены на услуги загружены');
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || 'Неизвестная ошибка сервера';
          toast.error(`❌ Ошибка загрузки цен: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Ошибка загрузки цен:', error);
        const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке цен';
        toast.error(`❌ ${errorMessage}`);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    if (userProfile) {
      loadPrices();
    }
  }, [userProfile]);

  // Проверяем URL параметры для автоматического переключения на вкладку
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['profile', 'password'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, []);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      // address убран, так как дезинфектору не нужен
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // Временно обновляем локально
      const updatedProfile = {
        id: userProfile?.id || 'temp-id',
        name: data.name,
        email: data.email,
        phone: userProfile?.phone || '',
        company: data.company,
      };
      
      // Обновляем локальное состояние
      setUserProfile(updatedProfile);
      
      // Обновляем кэш
      localStorage.setItem('user_profile_cache', JSON.stringify(updatedProfile));
      localStorage.setItem('user_profile_timestamp', Date.now().toString());
      
      console.log('Профиль обновлен успешно!');
    } catch (error) {
      console.error('Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      // Временно просто логируем
      console.log('Смена пароля:', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      
      console.log('Пароль изменен успешно!');
      passwordForm.reset();
    } catch (error) {
      console.error('Ошибка смены пароля');
    } finally {
      setIsLoading(false);
    }
  };

  const onPricesSubmit = async (newPrices: typeof prices) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
        return;
      }

      const response = await fetch('/api/user/service', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPrices)
      });

      if (response.ok) {
        setPrices(newPrices);
        setShowPriceModal(false);
        toast.success('✅ Цены на услуги успешно обновлены!');
        console.log('Цены обновлены успешно!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Неизвестная ошибка сервера';
        throw new Error(`Ошибка сервера: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Ошибка обновления цен:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при обновлении цен';
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="px-4 py-2 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </Button>
            <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
              {isLoadingProfile ? (
                <LoadingSpinner className="w-8 h-8 text-white" />
              ) : (
                <SettingsIcon className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
              <p className="text-lg text-gray-600">
                {isLoadingProfile ? 'Загружаем настройки...' : 'Управляйте настройками вашего аккаунта'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 mb-8">
          <nav className="flex space-x-1">
            {[
              { id: 'profile', label: 'Профиль', icon: User },
              { id: 'password', label: 'Безопасность', icon: Key },
              { id: 'pricing', label: 'Цены', icon: Settings },
              // { id: 'notifications', label: 'Уведомления', icon: Bell }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Информация профиля</h3>
            </div>
            
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600">Загружаем профиль...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Имя *
                    </Label>
                    <Input
                      id="name"
                      {...profileForm.register('name')}
                      className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Введите ваше имя"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      Телефон *
                    </Label>
                    <Input
                      id="phone"
                      {...profileForm.register('phone')}
                      disabled
                      className="h-12 px-4 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed transition-all duration-200"
                      placeholder="+7 (999) 123-45-67"
                    />
                    <p className="text-xs text-gray-500">
                      Номер телефона нельзя изменить
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-600" />
                      Компания
                    </Label>
                    <Input
                      id="company"
                      {...profileForm.register('company')}
                      className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Название компании"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    {isLoading ? <ButtonLoader /> : <Save className="w-4 h-4" />}
                    Сохранить изменения
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Смена пароля</h3>
            </div>
            
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-600" />
                  Текущий пароль *
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                  className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Введите текущий пароль"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-green-600" />
                    Новый пароль *
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Введите новый пароль"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-green-600" />
                    Подтвердите новый пароль *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    className="h-12 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Повторите новый пароль"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? <ButtonLoader /> : <Key className="w-4 h-4" />}
                  Сменить пароль
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Управление ценами</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-purple-900 mb-2">Настройка цен на услуги</h4>
                    <p className="text-purple-700 mb-4">
                      Управляйте ценами на ваши услуги дезинсекции. Устанавливайте индивидуальные тарифы для разных типов обработки.
                    </p>
                    <Button 
                      onClick={() => {
                        setShowPriceModal(true);
                        toast.info('📝 Открываем редактор цен...');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Настроить цены
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">Информация о тарифе</h4>
                    <p className="text-blue-700 mb-4">
                      Просматривайте информацию о вашем текущем тарифном плане и возможностях для обновления.
                    </p>
                    <Button 
                      onClick={() => {
                        window.open('/payment_v2', '_blank');
                      }}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium"
                    >
                      Управление тарифом
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab - временно скрыто */}
        {/* {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Настройки уведомлений</h3>
            </div>
            
            <div className="space-y-8">
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Email уведомления</h4>
                      <p className="text-gray-600">Получать уведомления на email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">SMS уведомления</h4>
                      <p className="text-gray-600">Получать уведомления по SMS</p>
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bell className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Уведомления о новых заявках</h4>
                      <p className="text-gray-600">Получать уведомления о новых заявках</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Сохранить настройки
                </Button>
              </div>
            </div>
          </div>
        )} */}

        {/* Модальное окно для редактирования цен */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Редактирование цен на услуги</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPriceModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-gray-600 mt-2">
                  Установите цены на ваши услуги дезинсекции для разных типов объектов
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  onPricesSubmit(prices);
                }} className="space-y-6">
                  
                  {/* 1-комнатная квартира */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">1-комнатная квартира</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="oneRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="oneRoomLiquid"
                          type="number"
                          value={prices.oneRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, oneRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="oneRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="oneRoomGel"
                          type="number"
                          value={prices.oneRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, oneRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-комнатная квартира */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">2-комнатная квартира</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twoRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="twoRoomLiquid"
                          type="number"
                          value={prices.twoRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, twoRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twoRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="twoRoomGel"
                          type="number"
                          value={prices.twoRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, twoRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3-комнатная квартира */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">3-комнатная квартира</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="threeRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="threeRoomLiquid"
                          type="number"
                          value={prices.threeRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, threeRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="threeRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="threeRoomGel"
                          type="number"
                          value={prices.threeRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, threeRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4+ комнатная квартира */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">4+ комнатная квартира</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fourRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="fourRoomLiquid"
                          type="number"
                          value={prices.fourRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, fourRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fourRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="fourRoomGel"
                          type="number"
                          value={prices.fourRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, fourRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Частный дом */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Частный дом</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="homeRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="homeRoomLiquid"
                          type="number"
                          value={prices.homeRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, homeRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="homeRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="homeRoomGel"
                          type="number"
                          value={prices.homeRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, homeRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Участок */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Участок</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plotRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="plotRoomLiquid"
                          type="number"
                          value={prices.plotRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, plotRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plotRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="plotRoomGel"
                          type="number"
                          value={prices.plotRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, plotRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ресторан */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Ресторан</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="restaurantRoomLiquid" className="text-sm font-medium text-gray-700">
                          Жидкая обработка (₽)
                        </Label>
                        <Input
                          id="restaurantRoomLiquid"
                          type="number"
                          value={prices.restaurantRoomLiquid}
                          onChange={(e) => setPrices(prev => ({ ...prev, restaurantRoomLiquid: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="restaurantRoomGel" className="text-sm font-medium text-gray-700">
                          Гель (₽)
                        </Label>
                        <Input
                          id="restaurantRoomGel"
                          type="number"
                          value={prices.restaurantRoomGel}
                          onChange={(e) => setPrices(prev => ({ ...prev, restaurantRoomGel: parseInt(e.target.value) || 0 }))}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPriceModal(false)}
                      className="px-6 py-3"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3"
                    >
                      {isLoading ? <ButtonLoader /> : 'Сохранить цены'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
