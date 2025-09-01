'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Shield, Clock, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo.jpeg"
                alt="DEZEXPERT"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold">DEZEXPERT</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Автоматизируйте обработку заявок для компаний по дезинсекции и дератизации. 
              Увеличьте конверсию и сократите время обработки заявок.
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/DezExpert_pro" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="mailto:support@dezexpert.pro" className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/payment_v2" className="text-gray-300 hover:text-white">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link href="/app/dashboard" className="text-gray-300 hover:text-white">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@dezexpert.pro" className="text-gray-300 hover:text-white">
                  support@dezexpert.pro
                </a>
              </li>
              <li>
                <a href="https://t.me/DezExpert_pro" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  Чат поддержки
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Доверие и безопасность */}
        <div className="mt-8 py-6 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-400" />
              <div>
                <h4 className="font-medium text-white">SSL-шифрование</h4>
                <p className="text-sm text-gray-400">Защищенное соединение</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <h4 className="font-medium text-white">GDPR-совместимость</h4>
                <p className="text-sm text-gray-400">Защита данных</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-400" />
              <div>
                <h4 className="font-medium text-white">Поддержка 24/7</h4>
                <p className="text-sm text-gray-400">Всегда на связи</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span>© 2025 DEZEXPERT</span>
              <span>•</span>
              <span>Все права защищены</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="/policy" className="text-gray-400 hover:text-white">
                Политика конфиденциальности
              </Link>
              <Link href="/offer" className="text-gray-400 hover:text-white">
                Пользовательское соглашение
              </Link>
              <a href="#" className="text-gray-400 hover:text-white">
                Договор
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Статус-страница
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
