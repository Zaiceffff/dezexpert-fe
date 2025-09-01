'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeaderAuth from './HeaderAuth';

export default function Header() {
  const utm = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const search = window.location.search;
    return search && search.length > 0 ? search : '';
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/dezexpertlogo.png"
                alt="DEZEXPERT"
                width={80}
                height={24}
                className="h-6 sm:h-7 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-6 sm:space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Главная
            </Link>

            <Link 
              href="/payment_v2" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Тарифы
            </Link>

            <Link 
              href="/policy" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Политика
            </Link>
            <Link 
              href="/offer" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              Оферта
            </Link>

          </nav>

          {/* Правая часть с авторизацией */}
          <div className="flex items-center space-x-3">
            <HeaderAuth utm={utm} />
          </div>
        </div>
      </div>
    </header>
  );
}
