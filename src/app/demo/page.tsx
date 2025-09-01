'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function DemoPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-gray-900 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Вернуться на главную</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link href="/register">Начать бесплатно</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/payment_v2">Тарифы</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Посмотрите, как работает{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Dezexpert
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Узнайте, как наша система автоматизирует заявки и увеличивает продажи для компаний по дезинсекции
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Демо-видео продукта
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Посмотрите, как работает система Dezexpert в реальном времени
            </p>
          </div>
          
          <div className="aspect-video bg-black rounded-2xl overflow-hidden relative">
            <video
              className="w-full h-full object-cover"
              controls
              poster="/poster.png"
              preload="metadata"
            >
              <source src="/promo.mp4" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button 
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              <Link href="/register">Начать бесплатно</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl"
            >
              <Link href="/payment_v2">Посмотреть тарифы</Link>
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧮</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Умный калькулятор</h3>
            <p className="text-gray-600">
              Автоматический расчет стоимости услуг с учетом всех параметров
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Мгновенные заявки</h3>
            <p className="text-gray-600">
              Клиенты оставляют заявки без звонков, 24/7
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Аналитика и отчеты</h3>
            <p className="text-gray-600">
              Подробная статистика по всем заявкам и клиентам
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Готовы попробовать?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Запустите систему за 15 минут и получите первые заявки уже завтра
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/register">Начать бесплатно</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/payment_v2">Посмотреть тарифы</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
