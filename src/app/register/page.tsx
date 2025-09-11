'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonLoader } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  surname: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Телефон должен содержать минимум 10 цифр'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string().min(1, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { register, login } = useAuth();

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

  // Получаем UTM параметры
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      
      // Добавляем UTM параметры к данным регистрации
      // Регистрируем пользователя
      await register(registerData);
      
      // Автоматически авторизуем пользователя
      await login(data.email, data.password);
      
      // Трекинг успешной регистрации
      console.log('Регистрация успешна:', { 
        placement: 'register_form', 
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });
      
      router.push('/app');
    } catch (error) {
      console.error('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Начать за 15 минут</h1>
          <p className="text-gray-600">Создайте аккаунт и получите первые заявки</p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-6">
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Имя *
                </Label>
                <Input
                  id="name"
                  type="text"
                  {...registerForm.register('name')}
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
                  Фамилия *
                </Label>
                <Input
                  id="surname"
                  type="text"
                  {...registerForm.register('surname')}
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
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...registerForm.register('email')}
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
                Телефон *
              </Label>
              <Input
                id="phone"
                type="tel"
                {...registerForm.register('phone')}
                className="h-11 px-4 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="79991234567"
              />
              {registerForm.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Пароль *
              </Label>
              <Input
                id="password"
                type="password"
                {...registerForm.register('password')}
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
                Подтвердите пароль *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerForm.register('confirmPassword')}
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
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <ButtonLoader />
              ) : (
                'Начать бесплатно'
              )}
            </Button>
          </form>
        </div>

        {/* Ссылка на вход */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?{' '}
            <Link href="/app/auth" className="text-green-600 hover:text-green-700 font-medium">
              Войти
            </Link>
          </p>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Нажимая, вы соглашаетесь с{' '}
            <Link href="/policy" className="text-green-600 hover:text-green-700 underline">
              Политикой
            </Link>{' '}
            и{' '}
            <Link href="/offer" className="text-green-600 hover:text-green-700 underline">
              Офертой
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
