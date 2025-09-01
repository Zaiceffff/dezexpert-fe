'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';
import PriceEditModal from './PriceEditModal';

import { LoadingSpinner, ButtonLoader } from '@/components/ui/loading-spinner';
import { API_BASE_URL } from '@/lib/config';

interface ServicePrices {
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

export default function PriceManager() {
  const [prices, setPrices] = useState<ServicePrices | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем текущие цены
  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/service`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Добавить токен авторизации
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.service) {
          setPrices(data.service);
        }
      }
    } catch (error) {
      toast.error('Ошибка загрузки цен');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrices = async (newPrices: ServicePrices) => {
    try {
      setIsSaving(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/service`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrices),
      });

      if (response.ok) {
        setPrices(newPrices);
        toast.success('Цены успешно сохранены!');
        return Promise.resolve();
      } else {
        toast.error('Ошибка сохранения цен');
        throw new Error('Ошибка при обновлении цен');
      }
    } catch (error) {
      toast.error('Ошибка сохранения цен');
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Управление ценами на услуги</h1>
        <p className="text-lg text-gray-600">
          Настройте стоимость для различных типов помещений и методов обработки
        </p>
      </div>

      {/* Кнопки управления */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={handleOpenModal}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          disabled={isLoading}
        >
          <Settings className="w-5 h-5 mr-2" />
          {prices ? 'Изменить цены' : 'Настроить цены'}
        </Button>
        
        <Button
          onClick={loadPrices}
          variant="outline"
          className="px-6 py-3"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Сообщения */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Информация о ценах */}
      {prices && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Текущие цены</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Квартиры */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Квартиры</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">1 комната (жидкость):</span>
                  <span className="font-medium">{prices.oneRoomLiquid} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">1 комната (гель):</span>
                  <span className="font-medium">{prices.oneRoomGel} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2 комнаты (жидкость):</span>
                  <span className="font-medium">{prices.twoRoomLiquid} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2 комнаты (гель):</span>
                  <span className="font-medium">{prices.twoRoomGel} ₽</span>
                </div>
              </div>
            </div>

            {/* Частные дома */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Частные дома</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Частный дом (жидкость):</span>
                  <span className="font-medium">{prices.homeRoomLiquid} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Частный дом (гель):</span>
                  <span className="font-medium">{prices.homeRoomGel} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Участок (жидкость):</span>
                  <span className="font-medium">{prices.plotRoomLiquid} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Участок (гель):</span>
                  <span className="font-medium">{prices.plotRoomGel} ₽</span>
                </div>
              </div>
            </div>

            {/* Коммерческие объекты */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm">Коммерческие объекты</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ресторан (жидкость):</span>
                  <span className="font-medium">{prices.restaurantRoomLiquid} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ресторан (гель):</span>
                  <span className="font-medium">{prices.restaurantRoomGel} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования цен */}
      <PriceEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePrices}
        initialPrices={prices}
        isLoading={isLoading}
      />
    </div>
  );
}
