'use client';

// src/app/(marketing)/page.tsx — продающий лендинг для Dezexpert
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import MiniLeadForm from '@/components/MiniLeadForm';

import { Check, Calculator, Smartphone, Users, Zap, Shield } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex flex-col">
      <div className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="space-y-6 sm:space-y-8 lg:pr-8">
              <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-green-200 bg-green-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-green-700">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" />
                <span className="hidden sm:inline">Сервис для компаний по дезинсекции и дератизации</span>
                <span className="sm:hidden">Для дезинфекторов</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Автоматизируйте заявки и увеличьте продажи на 25–40%
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Умный калькулятор, мгновенные заявки, SMS‑напоминания и мини‑CRM. Запуск за 15 минут без программиста.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Link href="/register">Начать бесплатно</Link>
                  </Button>
                </div>
                <div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg" 
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Link href="/demo">Посмотреть демо</Link>
                  </Button>
                </div>
              </div>

            </div>

            {/* Мини-форма заявки справа */}
            <div className="relative order-first lg:order-last hidden lg:block">
              <MiniLeadForm />
              
              {/* Декоративные элементы */}
              <div className="absolute -right-4 sm:-right-8 -top-4 sm:-top-8 h-16 w-16 sm:h-32 sm:w-32 rounded-full bg-green-100 blur-2xl sm:blur-3xl opacity-60" />
              <div className="absolute -left-4 sm:-left-8 -bottom-4 sm:-bottom-8 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-emerald-100 blur-2xl sm:blur-3xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Блок выгоды в цифрах */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { number: '+25–40%', label: 'конверсии сайта', source: 'клиенты сервиса' },
              { number: '–70%', label: 'времени на обработку', source: 'за счёт формы и SMS' },
              { number: '15 минут', label: '— и первые заявки', source: 'быстрый запуск' }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-lg font-medium text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.source}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Данные по 300+ компаниям</p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { number: '500+', label: 'Компаний подключено' },
              { number: '15 000+', label: 'Заявок обработано' },
              { number: '70%', label: 'Сокращение времени' },
              { number: '24/7', label: 'Поддержка клиентов' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Все необходимое для бизнеса
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Комплексное решение, которое автоматизирует все этапы работы с клиентами 
              от первого обращения до завершения работ
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Calculator,
                title: 'Умный калькулятор',
                description: 'Считает цену сам, учитывает тип вредителя/объект/сложность',
                features: ['Мгновенный расчет', 'Гибкие настройки цен', 'Интеграция с сайтом']
              },
              {
                icon: Smartphone,
                title: 'Мгновенные заявки',
                description: 'Клиент оставляет телефон без звонков туда‑сюда',
                features: ['Автоотправка', 'Все данные клиента под рукой', 'Статистика заказов']
              },
              {
                icon: Smartphone,
                title: 'SMS‑напоминания',
                description: 'Меньше отмен на 30–40%',
                features: ['Автоотправка', 'Настраиваемые шаблоны', 'Стабильность и надежность']
              },
              {
                icon: Users,
                title: 'Мини‑CRM',
                description: 'История заявок, статусы, напоминания',
                features: ['База клиентов', 'История заявок', 'Напоминания']
              },
              {
                icon: Zap,
                title: 'Персональный сайт для дезинфектора',
                description: 'Ведёт трафик напрямую в ваши заявки',
                features: ['Готовый код', 'Техническая поддержка', 'Адаптивный дизайн']
              },
              {
                icon: Shield,
                title: 'Безопасность данных',
                description: 'Шифрование, резервные копии',
                features: ['SSL-шифрование', 'GDPR-совместимость', 'Резервное копирование']
              }
            ].map((feature, index) => (
              <div key={index} className="group rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-green-300 flex flex-col min-h-[280px]">
                <div className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed flex-grow">{feature.description}</p>
                <ul className="space-y-1.5 sm:space-y-2 mt-auto">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Как это работает
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Простой процесс настройки, который займет не более 15 минут вашего времени
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Настройте цены',
                description: 'Укажите ваши цены',
                details: ['Базовые тарифы', 'Коэффициенты сложности', 'Скидки и акции']
              },
              {
                step: '02',
                title: 'Получите ссылку на персональный сайт',
                description: 'Разместите в блоге, в рекламе, QR',
                details: ['Готовый код виджета', 'Персональная ссылка', 'QR-код для печати']
              },
              {
                step: '03',
                title: 'Получайте заявки',
                description: 'Автоуведомления, автоприсвоение статусов, SMS',
                details: ['Уведомления', 'Автоназначение', 'SMS-напоминания']
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                                 <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg sm:text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{step.description}</p>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 sm:top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-emerald-200 transform translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div>
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <Link href="/demo">Посмотреть демо</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
                                  Что говорят компании, которые уже используют Dezexpert
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                quote: 'За первый месяц +28% заявок с досок объявлений. Манагер не звонит — форма всё собирает сама.',
                author: 'Александр Петров',
                company: '',
                rating: 5
              },
              {
                quote: 'SMS‑напоминания увеличили повторные обработки на 37%. Клиенты готовы к приезду.',
                author: 'Мария Сидорова',
                company: '',
                rating: 5
              },
              {
                quote: 'Подключили вечером — на следующий день пошли заявки.',
                author: 'Дмитрий Козлов',
                company: '',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow flex flex-col min-h-[200px]">
                <div className="mb-3 sm:mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400">★</div>
                  ))}
                </div>
                <blockquote className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed flex-grow">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm sm:text-base">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{testimonial.author}</div>
                    {testimonial.company && (
                      <div className="text-xs sm:text-sm text-gray-600">{testimonial.company}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* CTA SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Готовы увеличить конверсию сайта?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 mb-6 sm:mb-8 leading-relaxed">
            Начните бесплатно уже сегодня. Подключение за 15 минут, первые заявки — завтра.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <div>
              <Button 
                asChild 
                size="lg" 
                variant="secondary" 
                className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg bg-white border-2 border-white/20 text-green-800 hover:bg-gray-50 hover:border-white/30 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/register">Начать бесплатно</Link>
              </Button>
            </div>
            <div>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg border-white/30 text-white hover:bg-white hover:text-green-600 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/payment_v2">Посмотреть тарифы</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Частые вопросы
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Ответы на самые популярные вопросы о нашем сервисе
            </p>
          </div>
          
          <div className="grid gap-4 sm:gap-6">
            {[
              {
                question: 'Сколько времени занимает запуск?',
                answer: 'Вы добавляете цены и делитесь персональной ссылкой на ваш персональный сайт в соц сетях, мессенджерах и т.д. И заявки собираются в системе.'
              },
              {
                question: 'Как считаются сложные объекты?',
                answer: 'Если объект не попадает под какую-то из стандартных категорий, вы можете уточнить детали, созвонившись с клиентом.'
              },
              {
                question: 'Есть интеграции?',
                answer: 'У нас есть супер интеграция с авито, где ваш виртуальный персональный помощник может общаться с вашими клиентами за вас, и собирать для вас заявки, пока вы спите, или отдыхаете.'
              },
              {
                question: 'Что с данными при отключении?',
                answer: 'Данные хранятся согласно законодательству РФ, и могут быть удалены по запросу.'
              }
            ].map((item, index) => (
              <details 
                key={index} 
                className="group rounded-lg sm:rounded-xl border border-gray-200 bg-white"
                onToggle={() => {
                  // Трекинг отключен
                }}
              >
                <summary className="cursor-pointer list-none p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                    <div className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </div>
                  </div>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

