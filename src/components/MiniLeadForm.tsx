'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { track } from '@/lib/analytics';

export default function MiniLeadForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '+7 (900) 555-33-21',
    address: '',
    date: '30.08.2025'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    track('mini_lead_form_submit', { 
      placement: 'hero_widget', 
      step, 
      hasName: !!formData.name,
      hasPhone: !!formData.phone,
      hasAddress: !!formData.address
    });
    
    // Здесь можно добавить логику отправки заявки
    console.log('Мини-заявка отправлена:', formData);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xl max-w-md mx-auto">
      {/* Заголовок */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Заявка на дезинсекцию</h3>
        <p className="text-sm text-gray-600 leading-relaxed">Заполните форму ниже, и наш специалист свяжется с вами для уточнения деталей</p>
      </div>

      {/* Прогресс-бар */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
            step >= 1 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
            step >= 2 ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Шаг 1: Основная информация */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Ваше имя *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Введите ваше имя"
              className="w-full h-11 px-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Телефон *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full h-11 px-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <Label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Адрес *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Введите полный адрес"
              className="w-full h-11 px-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div>
            <Label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Желаемая дата посещения *
            </Label>
            <Input
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full h-11 px-4 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <Button 
            onClick={handleNext}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Далее
          </Button>
        </div>
      )}

      {/* Шаг 2: Детали услуги */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Детали услуги</h4>
            <p className="text-sm text-gray-600">Выберите тип обработки и объект</p>
          </div>
          
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1.5">Тип вредителя</Label>
            <select className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
              <option>Тараканы</option>
              <option>Клопы</option>
              <option>Крысы</option>
              <option>Муравьи</option>
              <option>Другие</option>
            </select>
          </div>
          
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1.5">Тип объекта</Label>
            <select className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 bg-white">
              <option>Квартира</option>
              <option>Частный дом</option>
              <option>Офис</option>
              <option>Ресторан</option>
              <option>Другое</option>
            </select>
          </div>
          
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-1.5">Количество комнат</Label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              defaultValue="1"
              className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500" 
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 h-12 font-semibold border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Назад
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Отправить заявку
            </Button>
          </div>
        </div>
      )}

      {/* Футер */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 leading-relaxed">Бесплатный старт · Поддержка 24/7</p>
      </div>
    </div>
  );
}
