'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AvitoDashboard from '@/components/AvitoDashboard';

export default function AvitoDemoPage() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  if (showDemo) {
    return <AvitoDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>На главную</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Демо контент */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Демо дашборда Avito
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Интерактивная демонстрация возможностей дашборда для управления объявлениями Avito. 
            Создайте тестовые данные и изучите все функции.
          </p>

          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Что вы увидите:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Статистические карточки</h3>
                    <p className="text-sm text-gray-600">Общие показатели по объявлениям</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Управление данными</h3>
                    <p className="text-sm text-gray-600">Создание тестовых и загрузка реальных данных</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Таблица объявлений</h3>
                    <p className="text-sm text-gray-600">Полная информация с фильтрами и поиском</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">OAuth подключение</h3>
                    <p className="text-sm text-gray-600">Авторизация через Avito</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Фильтры и сортировка</h3>
                    <p className="text-sm text-gray-600">Поиск, фильтрация и сортировка данных</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 font-semibold text-sm">6</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Пагинация</h3>
                    <p className="text-sm text-gray-600">Удобная навигация по страницам</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 Начните с тестовых данных
            </h3>
            <p className="text-blue-800 mb-4">
              Для демонстрации функционала создайте тестовые объявления. 
              Это безопасно и не повлияет на ваши реальные данные.
            </p>
            <div className="text-sm text-blue-700">
              <p>• Нажмите "Создать тестовые данные" в дашборде</p>
              <p>• Изучите все функции с демо-данными</p>
              <p>• Подключите реальный аккаунт Avito для работы с настоящими объявлениями</p>
            </div>
          </div>

          <Button
            onClick={handleStartDemo}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Запустить демо
          </Button>
        </div>
      </div>
    </div>
  );
}
