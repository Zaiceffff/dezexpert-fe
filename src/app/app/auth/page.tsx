'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonLoader } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import PhoneInput from '@/components/PhoneInput';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import PriceSetupForm from '@/components/PriceSetupForm';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  surname: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(11, 'Введите корректный номер телефона (+7XXXXXXXXXX)'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  confirmPassword: z.string().min(8, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function AuthPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<'form' | 'prices'>('form');
  const [registrationData, setRegistrationData] = useState<unknown>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register } = useAuth();

  // Определяем режим из URL параметров
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'register') {
      setMode('register');
    } else {
      setMode('login');
    }
    // Очищаем ошибки при смене режима
    setServerError(null);
  }, [searchParams]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await login(data.email, data.password);
      console.log('Вход выполнен успешно!');
      setServerError(null); // Очищаем ошибку при успешном входе
      router.push('/app');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка входа. Проверьте данные.';
      console.error(errorMessage);
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPricesSet = async (prices: unknown) => {
    try {
      // TODO: Здесь будет API вызов для сохранения цен
      // await api.updateUserService(prices);
      
      // Убираем дублирующее уведомление - регистрация уже показала успех
      router.push('/app');
    } catch (error) {
      console.error('Ошибка при сохранении цен. Попробуйте позже.');
    }
  };

  const onPricesSkip = () => {
    console.log('Настройку цен можно будет выполнить позже в личном кабинете');
    router.push('/app');
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // API ожидает номер в формате "87515000000" (без +7)
      // Наш PhoneInput возвращает только цифры, поэтому добавляем 7 в начало если его нет
      let formattedPhone = data.phone;
      if (!formattedPhone.startsWith('7')) {
        formattedPhone = '7' + formattedPhone;
      }
      
      console.log('Отправляем данные регистрации:', {
        name: data.name,
        surname: data.name,
        email: data.email,
        phone: formattedPhone,
        password: '***'
      });
      
      await register({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: formattedPhone,
        password: data.password
      });
      
      // Сохраняем данные регистрации и переходим к настройке цен
      setRegistrationData({
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: formattedPhone
      });
      setServerError(null); // Очищаем ошибку при успешной регистрации
      setRegistrationStep('prices');
      // Убираем дублирующее уведомление - регистрация уже показала успех в useAuth
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации. Попробуйте еще раз.';
      console.error(errorMessage);
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Если это шаг настройки цен, показываем форму цен
  if (registrationStep === 'prices') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <PriceSetupForm
          onPricesSet={onPricesSet}
          onSkip={onPricesSkip}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Войдите в свой личный кабинет' : 'Заполните форму для регистрации'}
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          {/* Отображение ошибок сервера */}
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Ошибка сервера</p>
                  <p className="text-sm text-red-700 mt-1">{serverError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setServerError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Закрыть ошибку"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {mode === 'login' ? (
            // Форма входа
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register('email', {
                    onChange: () => setServerError(null)
                  })}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password', {
                    onChange: () => setServerError(null)
                  })}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Вход...
                  </div>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>
          ) : (
            // Форма регистрации
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Имя
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    {...registerForm.register('name', {
                      onChange: () => setServerError(null)
                    })}
                    className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Иван"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                    Фамилия
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    {...registerForm.register('surname', {
                      onChange: () => setServerError(null)
                    })}
                    className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Иванов"
                  />
                  {registerForm.formState.errors.surname && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.surname.message}
                  </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register('email', {
                    onChange: () => setServerError(null)
                  })}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Телефон
                </Label>
                <PhoneInput
                  id="phone"
                  value={registerForm.watch('phone')}
                  onChange={(value) => {
                    registerForm.setValue('phone', value, { shouldValidate: true });
                    setServerError(null);
                  }}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="+7 (___) ___-__-__"
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm.register('password', {
                    onChange: () => setServerError(null)
                  })}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerForm.register('confirmPassword', {
                    onChange: () => setServerError(null)
                  })}
                  className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Регистрация...
                  </div>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Ссылка на переключение режимов */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {mode === 'login' ? (
              <>
                Нет аккаунта?{' '}
                            <Link href="/app/auth?mode=register" className="text-green-600 hover:text-green-700 font-medium">
              Зарегистрироваться
            </Link>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                            <Link href="/app/auth" className="text-green-600 hover:text-green-700 font-medium">
              Войти
            </Link>
              </>
            )}
          </p>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Используя сервис, вы соглашаетесь с{' '}
            <a href="/policy" className="text-green-600 hover:text-green-700 underline">
              политикой конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <ButtonLoader />
          <p className="text-gray-600 mt-4">Загрузка...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
