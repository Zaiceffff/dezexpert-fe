'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, BarChart3, LogOut, Settings } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function HeaderAuth({ utm = '' }: { utm?: string }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Перенаправляем на главную страницу после выхода
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (user) {
    return (
      <div className="relative">
        {/* Десктопное меню */}
        <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Кнопка "Дашборд" */}
          <Link href="/app/dashboard" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Дашборд</span>
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-medium text-xs sm:text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
              {/* Кликабельное имя пользователя */}
              <Link 
                href="/app/dashboard" 
                className="text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer truncate flex-1 sm:flex-none"
              >
                {user.name}
              </Link>
            </div>
          </div>
          
          {/* Кнопка Настройки */}
          <Link href="/app/settings">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200 text-sm sm:text-base"
            >
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Настройки</span>
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Выход</span>
          </Button>
        </div>

        {/* Мобильное меню */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Выпадающее мобильное меню */}
          {isMobileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-3">
                {/* Логотип в мобильном меню */}
                <div className="flex justify-center pb-3 border-b border-gray-200">
                  <Image
                    src="/dezexpertlogo.png"
                    alt="DEZEXPERT"
                    width={70}
                    height={20}
                    className="h-5 w-auto object-contain"
                  />
                </div>
                
                {/* Основная навигация */}
                <div className="border-b border-gray-200 pb-3">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Навигация</div>
                  <div className="space-y-1">
                    <Link 
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Главная
                    </Link>
                    <Link 
                      href="/payment_v2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Тарифы
                    </Link>
                    <Link 
                      href="/policy"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Политика
                    </Link>
                    <Link 
                      href="/offer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Оферта
                    </Link>
                  </div>
                </div>

                {/* Профиль пользователя */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500">Пользователь</div>
                  </div>
                </div>
                
                <Link 
                  href="/app/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Дашборд
                </Link>
                
                {/* Кнопка Настройки в мобильном меню */}
                <Link 
                  href="/app/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  Настройки
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Выход
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Десктопное меню */}
      <div className="hidden sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div onClick={() => track('hero_cta_click', { placement: 'header' })}>
          <Link 
            href={`/register${utm}`}
            className="inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Начать бесплатно
          </Link>
        </div>
        <Link 
          href="/app/auth" 
          className="px-3 py-2 sm:py-1.5 text-sm sm:text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-center"
        >
          Вход
        </Link>
      </div>

      {/* Мобильное меню */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Выпадающее мобильное меню */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-3 space-y-2">
              {/* Логотип в мобильном меню */}
              <div className="flex justify-center pb-2 mb-2 border-b border-gray-200">
                <Image
                  src="/dezexpertlogo.png"
                  alt="DEZEXPERT"
                  width={60}
                  height={18}
                  className="h-4 w-auto object-contain"
                />
              </div>
              
              {/* Основная навигация */}
              <div className="border-b border-gray-200 pb-2 mb-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Навигация</div>
                <div className="space-y-1">
                  <Link 
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Главная
                  </Link>
                  <Link 
                    href="/payment_v2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Тарифы
                  </Link>
                  <Link 
                    href="/policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Политика
                  </Link>
                  <Link 
                    href="/offer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Оферта
                  </Link>
                </div>
              </div>

              {/* Авторизация */}
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Вход</div>
              <Link 
                href="/app/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Вход
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
