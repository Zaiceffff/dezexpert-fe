'use client';

// src/app/offer/page.tsx — публичная оферта для CRM-системы
import Footer from '@/components/Footer';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Phone, 
  Mail, 
  FileText,
  Users,
  Zap,
  Star,
  Database,
  Zap as Lightning,
  Award
} from 'lucide-react';

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Database className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Публичная оферта
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
                Условия использования CRM-системы для управления заявками на дезинфекцию
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="prose prose-slate max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    Общие положения
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <p className="text-lg leading-relaxed">
                      Настоящая публичная оферта (далее — «Оферта») определяет условия предоставления 
                      доступа к CRM-системе Dezexpert для управления заявками на дезинфекцию, 
                      дезинсекцию и дератизацию физическим и юридическим лицам (далее — «Пользователь»).
                    </p>
                    
                    <p className="text-lg leading-relaxed">
                      Акцептом настоящей Оферты является регистрация в системе, создание аккаунта 
                      и начало использования CRM-функционала для управления заявками клиентов.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  Функционал CRM-системы
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">Управление заявками</h3>
                      <ul className="space-y-2 text-green-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Создание и редактирование заявок
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Отслеживание статусов заявок
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          История изменений и комментарии
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-emerald-50 rounded-xl p-6">
                      <h3 className="font-semibold text-emerald-900 mb-3">Аналитика и отчеты</h3>
                      <ul className="space-y-2 text-emerald-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Статистика по заявкам
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Анализ эффективности
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Экспорт данных
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Дополнительные возможности</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Управление ценами и тарифами
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        SMS-уведомления и напоминания
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Интеграция с внешними сервисами
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  Порядок использования
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">1. Регистрация</h3>
                      <p className="text-gray-700">
                        Пользователь регистрируется в системе, указывая необходимые данные 
                        и подтверждая согласие с условиями использования.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">2. Выбор тарифа</h3>
                      <p className="text-gray-700">
                        Пользователь выбирает подходящий тариф: базовый (до 5 заявок) 
                        или премиум (безлимитный доступ).
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">3. Настройка системы</h3>
                      <p className="text-gray-700">
                        Настройка цен, услуг, объектов и других параметров 
                        для начала работы с заявками.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">4. Работа с заявками</h3>
                      <p className="text-gray-700">
                        Создание, обработка и управление заявками клиентов 
                        через удобный интерфейс CRM-системы.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-600" />
                  Тарифы и ограничения
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 rounded-xl p-6">
                      <h3 className="font-semibold text-yellow-900 mb-3">Базовый тариф</h3>
                      <ul className="space-y-3 text-yellow-800">
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>До 5 заявок в месяц</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Базовый функционал CRM</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Email поддержка</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Бесплатно</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">Премиум тариф</h3>
                      <ul className="space-y-3 text-green-800">
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Безлимитное количество заявок</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Расширенная аналитика</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Приоритетная поддержка</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>От 2999₽/месяц</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Техническая поддержка</h3>
                    <p className="text-blue-800">
                      Мы предоставляем техническую поддержку по работе с CRM-системой, 
                      включая обучение, настройку и решение возникающих вопросов. 
                      Время ответа зависит от выбранного тарифа.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                  Безопасность и конфиденциальность
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Защита данных</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Шифрование данных при передаче</li>
                        <li>• Регулярное резервное копирование</li>
                        <li>• Защита от несанкционированного доступа</li>
                        <li>• Соответствие требованиям 152-ФЗ</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Доступность системы</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Uptime 99.9%</li>
                        <li>• Мониторинг 24/7</li>
                        <li>• Автоматическое восстановление</li>
                        <li>• Уведомления об инцидентах</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">Обновления и развитие</h3>
                    <ul className="space-y-2 text-purple-800">
                      <li className="flex items-center gap-2">
                        <Lightning className="w-4 h-4 text-purple-600" />
                        Регулярные обновления функционала
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightning className="w-4 h-4 text-purple-600" />
                        Новые интеграции и возможности
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightning className="w-4 h-4 text-purple-600" />
                        Улучшение производительности
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-green-600" />
                  Поддержка
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Техподдержка</p>
                      <p className="text-gray-600">+7 (999) 123-45-67</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">support@dezexpert.ru</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Время работы</p>
                      <p className="text-gray-600">Пн-Пт 9:00-18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  О CRM-системе
                </h3>
                
                <div className="space-y-3 text-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Простой и понятный интерфейс</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Мобильная адаптация</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Быстрая настройка</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Техподдержка 24/7</span>
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-600" />
                  Документы
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Скачать оферту (PDF)
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Пользовательское соглашение
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Политика конфиденциальности
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

