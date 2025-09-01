'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Save, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { LoadingSpinner, ButtonLoader } from '@/components/ui/loading-spinner';
import { API_BASE_URL } from '@/lib/config';

interface PricingData {
  oneRoomLiquid: number;
  oneRoomGel: number;
  twoRoomLiquid: number;
  twoRoomGel: number;
  threeRoomLiquid: number;
  threeRoomGel: number;
  fourRoomLiquid: number;
  fourRoomGel: number;
  homeRoomLiquid: number;
  homeRoomGel: number;
  plotRoomLiquid: number;
  plotRoomGel: number;
  restaurantRoomLiquid: number;
  restaurantRoomGel: number;
}

const defaultPricing: PricingData = {
  oneRoomLiquid: 3000,
  oneRoomGel: 3000,
  twoRoomLiquid: 3500,
  twoRoomGel: 3500,
  threeRoomLiquid: 4000,
  threeRoomGel: 4000,
  fourRoomLiquid: 4500,
  fourRoomGel: 4500,
  homeRoomLiquid: 5000,
  homeRoomGel: 5000,
  plotRoomLiquid: 3000,
  plotRoomGel: 3000,
  restaurantRoomLiquid: 8000,
  restaurantRoomGel: 8000,
};

const pricingLabels = {
  oneRoomLiquid: '1 комната - Жидкость (₽)',
  oneRoomGel: '1 комната - Гель (₽)',
  twoRoomLiquid: '2 комнаты - Жидкость (₽)',
  twoRoomGel: '2 комнаты - Гель (₽)',
  threeRoomLiquid: '3 комнаты - Жидкость (₽)',
  threeRoomGel: '3 комнаты - Гель (₽)',
  fourRoomLiquid: '4 комнаты - Жидкость (₽)',
  fourRoomGel: '4 комнаты - Гель (₽)',
  homeRoomLiquid: 'Частный дом - Жидкость (₽)',
  homeRoomGel: 'Частный дом - Гель (₽)',
  plotRoomLiquid: 'Участок - Жидкость (₽)',
  plotRoomGel: 'Участок - Гель (₽)',
  restaurantRoomLiquid: 'Ресторан/Коммерция - Жидкость (₽)',
  restaurantRoomGel: 'Ресторан/Коммерция - Гель (₽)',
};

export default function PricingManager() {
  const [pricing, setPricing] = useState<PricingData>(defaultPricing);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Загружаем сохраненные цены при монтировании
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      setIsLoading(true);
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }

      // Загружаем цены с API
      const response = await fetch(`${API_BASE_URL}/user/service`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Загруженные цены:', data);
        
        // Если есть данные о ценах, используем их
        if (data.oneRoomLiquid !== undefined) {
          setPricing(data);
        } else {
          console.log('Цены не найдены, используем значения по умолчанию');
        }
      } else {
        console.error('Ошибка загрузки цен:', response.status);
        toast.warning('Не удалось загрузить цены, используем значения по умолчанию');
      }
    } catch (error) {
      console.error('Ошибка загрузки цен:', error);
      toast.warning('Ошибка загрузки цен, используем значения по умолчанию');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (key: keyof PricingData, value: string) => {
    const numValue = parseInt(value) || 0;
    
    setPricing(prev => ({
      ...prev,
      [key]: numValue
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Получаем токен из localStorage
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }

      // Сохраняем цены на API
      const response = await fetch(`${API_BASE_URL}/user/service`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricing),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Цены сохранены:', result);
        toast.success('Цены успешно сохранены!');
        setHasChanges(false);
      } else {
        const errorData = await response.json().catch(() => ({ /* TODO: implement */ }));
        console.error('Ошибка сохранения цен:', response.status, errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка сохранения цен:', error);
      toast.error('Ошибка сохранения цен');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPricing(defaultPricing);
    setHasChanges(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Настройте свои параметры</h3>
          <p className="text-sm text-gray-500 mt-1">
            Установите цены на услуги дезинфекции для разных типов объектов. 
            Используйте стрелки или введите значение вручную.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
          {hasChanges && (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Отменить
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(pricingLabels).map(([key, label]) => (
          <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              {label}
            </Label>
            <Input
              type="number"
              value={pricing[key as keyof PricingData]}
              onChange={(e) => handlePriceChange(key as keyof PricingData, e.target.value)}
              className="border-green-600 focus:border-green-700 focus:ring-green-500"
              placeholder="0"
              min="0"
              step="100"
            />
          </div>
        ))}
      </div>

      {!hasChanges && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </div>
  );
}
