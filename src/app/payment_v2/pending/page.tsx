'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentPendingPage() {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [maxWaitTime] = useState(300); // 5 минут максимум

  useEffect(() => {
    // Имитируем проверку статуса платежа каждые 10 секунд
    const statusCheckInterval = setInterval(() => {
      // В реальном приложении здесь будет API запрос для проверки статуса
      if (timeElapsed >= 60) {
        // Через минуту "успешно" завершаем
        setStatus('success');
        clearInterval(statusCheckInterval);
      }
    }, 10000);

    // Таймер для отображения прошедшего времени
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= maxWaitTime) {
          setStatus('error');
          clearInterval(timer);
          clearInterval(statusCheckInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(statusCheckInterval);
      clearInterval(timer);
    };
  }, [timeElapsed, maxWaitTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (timeElapsed < 30) {
      return 'Обрабатываем ваш платеж...';
    } else if (timeElapsed < 60) {
      return 'Проверяем статус платежа...';
    } else {
      return 'Платеж обрабатывается дольше обычного...';
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Платеж подтвержден!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ваша подписка успешно активирована. Перенаправляем вас в личный кабинет...
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
            <Link href="/payment_v2/success">
              Перейти к подтверждению
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⏰ Превышено время ожидания
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Платеж обрабатывается дольше обычного. Проверьте статус в личном кабинете или обратитесь в поддержку.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
              <Link href="/app/dashboard">
                Проверить статус
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl">
              <Link href="/payment_v2">
                Попробовать снова
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            ⏳ Обрабатываем ваш платеж
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Пожалуйста, подождите. Мы обрабатываем ваш платеж и активируем подписку.
          </p>
        </div>
      </div>

      {/* Pending Card */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
            {/* Pending Header */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 sm:p-12 text-white text-center relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-12 right-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-12 h-12 bg-white rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Clock className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Платеж в обработке
                </h2>
                <p className="text-lg sm:text-xl text-blue-100">
                  {getStatusMessage()}
                </p>
              </div>
            </div>

            {/* Status Info */}
            <div className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Timer */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Время ожидания
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatTime(timeElapsed)}
                    </div>
                    <p className="text-gray-600">
                      Прошло времени с момента оплаты
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-purple-600" />
                    Прогресс обработки
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Статус:</span>
                      <span className="font-semibold text-blue-600">В обработке</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((timeElapsed / 60) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {Math.min(Math.round((timeElapsed / 60) * 100), 100)}% завершено
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Happening */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Что происходит сейчас?
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💳</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Проверка карты</h4>
                    <p className="text-sm text-gray-600">Банк проверяет данные карты</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Безопасность</h4>
                    <p className="text-sm text-gray-600">3D Secure проверка</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Подтверждение</h4>
                    <p className="text-sm text-gray-600">Активация подписки</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  Важная информация
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• <strong>Не закрывайте</strong> эту страницу до завершения обработки</p>
                  <p>• <strong>Не обновляйте</strong> страницу - это может прервать процесс</p>
                  <p>• <strong>Время обработки</strong> обычно составляет 1-3 минуты</p>
                  <p>• <strong>Деньги с карты</strong> не будут списаны, пока платеж не подтвердится</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.reload()} 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Обновить статус
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                  <Link href="/payment_v2">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Вернуться к тарифам
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Если ожидание затянулось, обратитесь в поддержку
            </p>
            <div className="flex justify-center gap-6">
              <Link href="mailto:support@dezexpert.pro" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                support@dezexpert.pro
              </Link>
              <Link href="tel:+78001234567" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                +7 (800) 123-45-67
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
