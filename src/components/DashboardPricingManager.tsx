'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

import PriceEditModal from './PriceEditModal';

import type { ServicePrices } from '@/lib/api';

interface DashboardPricingManagerProps {
  onPricesUpdated?: () => void;
}

export default function DashboardPricingManager({ onPricesUpdated }: DashboardPricingManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrices, setHasPrices] = useState(false);
  const [prices, setPrices] = useState<ServicePrices | null>(null);

  // Проверяем, есть ли уже цены у пользователя
  useEffect(() => {
    const checkExistingPrices = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Временно используем заглушку
        setHasPrices(false);
      } catch (error) {
        console.log('Цены не найдены');
        setHasPrices(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingPrices();
  }, []);

  const handleSavePrices = async (newPrices: ServicePrices) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('Необходима авторизация');
        return;
      }

      // Временно просто обновляем локально
      setPrices(newPrices);
      setHasPrices(true);
      console.log('Цены успешно обновлены!');
      
      if (onPricesUpdated) {
        onPricesUpdated();
      }
    } catch (error) {
      console.error('Ошибка сохранения цен');
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
      <Button 
        variant="outline" 
        disabled 
        className="border-green-600 text-green-600 hover:bg-green-50"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
        Проверяем цены...
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpenModal}
        className={`border-green-600 text-green-600 hover:bg-green-50 ${
          hasPrices ? 'bg-green-50' : ''
        }`}
      >
        <Settings className="w-4 h-4 mr-2" />
        {hasPrices ? 'Изменить цены' : 'Настроить цены'}
        {hasPrices && (
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
            ✓
          </span>
        )}
      </Button>

      <PriceEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePrices}
        initialPrices={prices}
        isLoading={isLoading}
      />
    </>
  );
}
