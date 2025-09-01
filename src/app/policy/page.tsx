'use client';

// src/app/policy/page.tsx — красивая страница политики конфиденциальности
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Footer from '@/components/Footer';
import { 
  Shield, 
  Eye, 
  Database, 
  UserCheck, 
  Phone, 
  Mail, 
  FileText,
  Users,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Server,
  Heart
} from 'lucide-react';

export default function PolicyPage() {
  const sections = [
    { id: 'intro', title: 'Общие положения', icon: Shield },
    { id: 'data', title: 'Сбор данных', icon: Database },
    { id: 'use', title: 'Использование данных', icon: Eye },
    { id: 'storage', title: 'Хранение и защита', icon: Shield },
    { id: 'rights', title: 'Права пользователей', icon: UserCheck },
    { id: 'cookies', title: 'Cookies и технологии', icon: Server },
    { id: 'third-party', title: 'Третьи стороны', icon: Users },
    { id: 'children', title: 'Защита детей', icon: Heart },
    { id: 'international', title: 'Международная передача', icon: Globe },
    { id: 'updates', title: 'Обновления политики', icon: Zap },
    { id: 'contacts', title: 'Контакты', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Политика конфиденциальности
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
                Мы защищаем ваши персональные данные и обеспечиваем безопасность информации
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Содержание
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <a 
                          key={section.id} 
                          href={`#${section.id}`} 
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                          <IconComponent className="w-4 h-4" />
                          {section.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Info */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-xl p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Ваша безопасность
                  </h3>
                  <div className="space-y-3 text-green-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Шифрование данных</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Соответствие 152-ФЗ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Контроль доступа</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-3 space-y-8">
              
              {/* Header Info */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                    <Clock className="w-4 h-4" />
                    Обновлено: <time dateTime="2025-01-01">01.01.2025</time>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                    <CheckCircle className="w-4 h-4" />
                    Актуально
                  </div>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Настоящая политика конфиденциальности описывает, как CRM-система Dezexpert собирает, 
                    использует и защищает ваши персональные данные. Мы стремимся обеспечить прозрачность 
                    и безопасность обработки информации в соответствии с законодательством РФ.
                  </p>
                </div>
              </div>

              {/* General Provisions */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="intro" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  Общие положения
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    Данная политика применяется ко всем сервисам и функциям CRM-системы Dezexpert, 
                    включая веб-сайт, мобильные приложения и API. Используя наши сервисы, 
                    вы соглашаетесь с условиями данной политики.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">Применение</h3>
                      <ul className="space-y-2 text-green-800">
                        <li>• Веб-сайт и CRM-система</li>
                        <li>• Мобильные приложения</li>
                        <li>• API и интеграции</li>
                        <li>• Техническая поддержка</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-900 mb-3">Законодательство</h3>
                      <ul className="space-y-2 text-blue-800">
                        <li>• Федеральный закон 152-ФЗ</li>
                        <li>• GDPR (для ЕС)</li>
                        <li>• Отраслевые стандарты</li>
                        <li>• Внутренние регламенты</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Collection */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="data" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Database className="w-8 h-8 text-blue-600" />
                  Какие данные мы собираем
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-900 mb-3">Персональные данные</h3>
                      <ul className="space-y-2 text-blue-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Имя, фамилия, отчество
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Контактные телефоны
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Email адреса
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Адреса объектов
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">Данные заявок</h3>
                      <ul className="space-y-2 text-green-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Тип объекта недвижимости
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Виды вредителей
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Желаемые даты обработки
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Комментарии и пожелания
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">Технические данные</h3>
                    <ul className="space-y-2 text-purple-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        IP-адреса и геолокация
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Информация о браузере и устройстве
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Cookies и локальное хранилище
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Логи доступа и ошибок
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="use" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Eye className="w-8 h-8 text-purple-600" />
                  Как мы используем данные
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg">
                    Собранные данные используются исключительно для следующих целей:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Основные цели</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Обработка заявок и оказание услуг</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Связь с клиентами и уведомления</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Улучшение качества сервиса</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Техническая поддержка</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Дополнительные цели</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Аналитика и статистика</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Безопасность и мониторинг</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Соответствие законодательству</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Развитие новых функций</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Storage and Protection */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="storage" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-yellow-600" />
                  Хранение и защита данных
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 rounded-xl p-6">
                      <h3 className="font-semibold text-yellow-900 mb-3">Технические меры</h3>
                      <ul className="space-y-3 text-yellow-800">
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Шифрование данных при передаче (TLS 1.3)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Шифрование данных в состоянии покоя</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Многофакторная аутентификация</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>Регулярное резервное копирование</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">Организационные меры</h3>
                      <ul className="space-y-3 text-green-800">
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Контроль доступа к данным</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Обучение персонала</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Регулярные аудиты безопасности</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Политика чистого стола</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Сроки хранения</h3>
                    <p className="text-blue-800">
                      Персональные данные хранятся в течение срока действия договора и 3 лет после его прекращения, 
                      если иное не предусмотрено законодательством. Технические данные хранятся до 1 года.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Rights */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="rights" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-emerald-600" />
                  Права пользователей
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg">
                    В соответствии с законодательством РФ, вы имеете следующие права:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Основные права</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Право на доступ к своим данным</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Право на уточнение данных</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Право на блокирование</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>Право на удаление</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Дополнительные права</h3>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Право на отзыв согласия</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Право на обжалование</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Право на портабельность</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Право на ограничение обработки</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <h3 className="font-semibold text-emerald-900 mb-3">Как реализовать права</h3>
                    <p className="text-emerald-800">
                      Для реализации своих прав вы можете обратиться к нам по email, телефону или через личный кабинет. 
                      Мы рассмотрим ваш запрос в течение 30 дней и предоставим обоснованный ответ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies and Technologies */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="cookies" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Server className="w-8 h-8 text-purple-600" />
                  Cookies и технологии
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="font-semibold text-purple-900 mb-3">Типы cookies</h3>
                      <ul className="space-y-2 text-purple-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          Необходимые (функциональные)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          Аналитические (статистика)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          Маркетинговые (реклама)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          Сторонние (интеграции)
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-900 mb-3">Управление cookies</h3>
                      <ul className="space-y-2 text-blue-800">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Настройки браузера
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Панель управления
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Отказ от отслеживания
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          Очистка данных
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Parties */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="third-party" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="w-8 h-8 text-orange-600" />
                  Третьи стороны
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg">
                    Мы можем передавать данные третьим лицам только в следующих случаях:
                  </p>
                  
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="font-semibold text-orange-900 mb-3">Законные основания</h3>
                    <ul className="space-y-3 text-orange-800">
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>С вашего явного согласия</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Для исполнения договора</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>По требованию закона</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Для защиты наших прав</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Наши партнеры</h3>
                    <p className="text-blue-800">
                      Мы сотрудничаем только с проверенными партнерами, которые обеспечивают 
                      соответствующий уровень защиты данных и соблюдают требования законодательства.
                    </p>
                  </div>
                </div>
              </div>

              {/* Children Protection */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="children" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-600" />
                  Защита детей
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="bg-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold text-pink-900 mb-3">Возрастные ограничения</h3>
                    <p className="text-pink-800">
                      Наши сервисы не предназначены для лиц младше 18 лет. Мы не собираем 
                      намеренно персональные данные от детей. Если вы являетесь родителем 
                      и считаете, что ваш ребенок предоставил нам данные, свяжитесь с нами.
                    </p>
                  </div>
                </div>
              </div>

              {/* International Transfer */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="international" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-indigo-600" />
                  Международная передача данных
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-900 mb-3">Географическое расположение</h3>
                    <p className="text-indigo-800">
                      Данные хранятся на серверах в России. В случае международной передачи 
                      данных мы обеспечиваем соответствующий уровень защиты и соблюдаем 
                      требования законодательства стран-получателей.
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="updates" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-600" />
                  Обновления политики
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3">Процедура обновления</h3>
                    <ul className="space-y-3 text-yellow-800">
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Уведомление за 30 дней до изменений</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Публикация новой версии на сайте</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Email уведомления пользователям</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>Возможность отзыва согласия</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 id="contacts" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Phone className="w-8 h-8 text-green-600" />
                  Контакты и поддержка
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-3">По вопросам конфиденциальности</h3>
                      <div className="space-y-3 text-green-800">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-green-600" />
                          <span>privacy@dezexpert.pro</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-600" />
                          <span>+7 (999) 123-45-67</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-900 mb-3">Техническая поддержка</h3>
                      <div className="space-y-3 text-blue-800">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span>support@dezexpert.ru</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span>Пн-Пт 9:00-18:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">Дополнительные документы</h3>
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        href="/offer" 
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Публичная оферта
                      </Link>
                      <button 
                        onClick={() => {
                          // Создаем PDF контент на основе страницы
                          const content = `
                            Политика конфиденциальности Dezexpert
            
                            Общие положения
                            Мы защищаем ваши персональные данные и обеспечиваем безопасность информации.
                            
                            Сбор данных
                            Мы собираем только необходимую информацию для предоставления услуг.
                            
                            Использование данных
                            Ваши данные используются исключительно для улучшения качества услуг.
                            
                            Хранение и защита
                            Все данные хранятся в зашифрованном виде на защищенных серверах.
                            
                            Права пользователей
                            Вы имеете право на доступ, исправление и удаление ваших данных.
                            
                            Cookies и технологии
                            Мы используем cookies для улучшения пользовательского опыта.
                            
                            Третьи стороны
                            Мы не передаем ваши данные третьим лицам без вашего согласия.
                            
                            Защита детей
                            Наши услуги не предназначены для лиц младше 18 лет.
                            
                            Международная передача
                            Данные обрабатываются на территории Российской Федерации.
                            
                            Обновления политики
                            Политика может обновляться с предварительным уведомлением.
                            
                            Контакты
                            По вопросам конфиденциальности: privacy@dezexpert.pro
                            Техническая поддержка: support@dezexpert.ru
                            
                            Версия: 1.0
                            Дата: ${new Date().toLocaleDateString('ru-RU')}
                          `;
                          
                          // Создаем blob и скачиваем
                          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'Политика_конфиденциальности_Dezexpert.txt';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        }}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Скачать политику
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

