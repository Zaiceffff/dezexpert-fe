'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ArrowLeft, HelpCircle, Phone, Mail } from 'lucide-react';

export default function PaymentErrorPage() {
  const [errorDetails, setErrorDetails] = useState<{
    code: string;
    message: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    // Получаем параметры из URL для определения типа ошибки
    const urlParams = new URLSearchParams(window.location.search);
    const errorCode = urlParams.get('error') || 'payment_failed';
    const errorMessage = urlParams.get('message') || 'Произошла ошибка при обработке платежа';

    setErrorDetails({
      code: errorCode,
      message: errorMessage,
      timestamp: new Date().toLocaleString('ru-RU')
    });
  }, []);

  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'insufficient_funds':
        return '💳';
      case 'card_declined':
        return '❌';
      case 'network_error':
        return '🌐';
      case 'timeout':
        return '⏰';
      default:
        return '⚠️';
    }
  };

  const getErrorTitle = (code: string) => {
    switch (code) {
      case 'insufficient_funds':
        return 'Недостаточно средств';
      case 'card_declined':
        return 'Карта отклонена';
      case 'network_error':
        return 'Ошибка сети';
      case 'timeout':
        return 'Превышено время ожидания';
      default:
        return 'Ошибка оплаты';
    }
  };

  const getErrorDescription = (code: string) => {
    switch (code) {
      case 'insufficient_funds':
        return 'На вашей карте недостаточно средств для совершения платежа. Пополните карту и попробуйте снова.';
      case 'card_declined':
        return 'Ваша карта была отклонена банком. Проверьте данные карты или используйте другую карту.';
      case 'network_error':
        return 'Произошла ошибка связи с платежной системой. Проверьте интернет-соединение и попробуйте снова.';
      case 'timeout':
        return 'Время ожидания ответа от банка истекло. Попробуйте совершить платеж еще раз.';
      default:
        return 'Произошла непредвиденная ошибка при обработке платежа. Попробуйте еще раз или обратитесь в поддержку.';
    }
  };

  const getErrorSolution = (code: string) => {
    switch (code) {
      case 'insufficient_funds':
        return 'Пополните карту или используйте другую карту с достаточным балансом.';
      case 'card_declined':
        return 'Проверьте правильность данных карты, срок действия и CVV код.';
      case 'network_error':
        return 'Проверьте интернет-соединение и попробуйте снова через несколько минут.';
      case 'timeout':
        return 'Попробуйте совершить платеж еще раз. Обычно проблема решается при повторной попытке.';
      default:
        return 'Попробуйте повторить платеж или обратитесь в службу поддержки для получения помощи.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {getErrorIcon(errorDetails?.code || 'payment_failed')} {getErrorTitle(errorDetails?.code || 'payment_failed')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            К сожалению, не удалось завершить оплату. Не волнуйтесь, мы поможем решить проблему.
          </p>
        </div>
      </div>

      {/* Error Card */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-8 sm:p-12 text-white text-center relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-12 right-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-12 h-12 bg-white rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ошибка при оплате
                </h2>
                <p className="text-lg sm:text-xl text-red-100">
                  {errorDetails?.message}
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Error Info */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50/30 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    Детали ошибки
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Код ошибки:</span>
                      <span className="font-mono text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        {errorDetails?.code}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Время:</span>
                      <span className="font-semibold text-gray-900">{errorDetails?.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Статус:</span>
                      <span className="font-semibold text-red-600">Неудачно</span>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-green-600" />
                    Как решить
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {getErrorSolution(errorDetails?.code || 'payment_failed')}
                  </p>
                </div>
              </div>

              {/* What Happened */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  Что произошло?
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {getErrorDescription(errorDetails?.code || 'payment_failed')}
                </p>
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Важно:</strong> Деньги с вашей карты не были списаны. Если вы видите временную блокировку средств, 
                    она будет снята в течение 1-3 рабочих дней.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/payment_v2">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Попробовать снова
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                  <Link href="/payment_v2">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Выбрать другой тариф
                  </Link>
                </Button>
              </div>

              {/* Support Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Нужна помощь?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email поддержка</h4>
                    <p className="text-sm text-gray-600 mb-3">Получите ответ в течение 2 часов</p>
                    <Link href="mailto:support@dezexpert.pro" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                      support@dezexpert.pro
                    </Link>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Телефон поддержки</h4>
                    <p className="text-sm text-gray-600 mb-3">Горячая линия 24/7</p>
                    <Link href="tel:+78001234567" className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                      +7 (800) 123-45-67
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
