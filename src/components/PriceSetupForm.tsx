'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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

interface PriceSetupFormProps {
  onPricesSet: (prices: ServicePrices) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export default function PriceSetupForm({ onPricesSet, onSkip, isLoading = false }: PriceSetupFormProps) {
  const [prices, setPrices] = useState<ServicePrices>({
    oneRoomLiquid: 1500,
    oneRoomGel: 1200,
    twoRoomLiquid: 1800,
    twoRoomGel: 1500,
    threeRoomLiquid: 2100,
    threeRoomGel: 1800,
    fourRoomLiquid: 2400,
    fourRoomGel: 2100,
    homeRoomLiquid: 3000,
    homeRoomGel: 2700,
    plotRoomLiquid: 4000,
    plotRoomGel: 3700,
    restaurantRoomLiquid: 5000,
    restaurantRoomGel: 4700
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePriceChange = (field: keyof ServicePrices, value: string) => {
    const numValue = parseInt(value) || 0;
    setPrices(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что все цены заполнены
    const hasEmptyPrices = Object.values(prices).some(price => price <= 0);
    if (hasEmptyPrices) {
      toast.error('Пожалуйста, заполните все цены на услуги');
      return;
    }

    setIsSaving(true);
    try {
      // Имитируем задержку для UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onPricesSet(prices);
      toast.success('Цены на услуги настроены!');
    } catch (error) {
      toast.error('Ошибка при настройке цен');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    toast.info('Настройку цен можно будет выполнить позже в личном кабинете');
    onSkip();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Настройка цен на услуги</h2>
        <p className="text-gray-600">
          Укажите ваши расценки на дезинсекцию. Это поможет клиентам сразу видеть стоимость услуг.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Квартиры */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Квартиры</CardTitle>
            <CardDescription>Цены на обработку квартир</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oneRoomLiquid">1 комната (жидкость)</Label>
              <Input
                id="oneRoomLiquid"
                type="number"
                min="0"
                value={prices.oneRoomLiquid}
                onChange={(e) => handlePriceChange('oneRoomLiquid', e.target.value)}
                placeholder="1500"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oneRoomGel">1 комната (гель)</Label>
              <Input
                id="oneRoomGel"
                type="number"
                min="0"
                value={prices.oneRoomGel}
                onChange={(e) => handlePriceChange('oneRoomGel', e.target.value)}
                placeholder="1200"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twoRoomLiquid">2 комнаты (жидкость)</Label>
              <Input
                id="twoRoomLiquid"
                type="number"
                min="0"
                value={prices.twoRoomLiquid}
                onChange={(e) => handlePriceChange('twoRoomLiquid', e.target.value)}
                placeholder="1800"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twoRoomGel">2 комнаты (гель)</Label>
              <Input
                id="twoRoomGel"
                type="number"
                min="0"
                value={prices.twoRoomGel}
                onChange={(e) => handlePriceChange('twoRoomGel', e.target.value)}
                placeholder="1500"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threeRoomLiquid">3 комнаты (жидкость)</Label>
              <Input
                id="threeRoomLiquid"
                type="number"
                min="0"
                value={prices.threeRoomLiquid}
                onChange={(e) => handlePriceChange('threeRoomLiquid', e.target.value)}
                placeholder="2100"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threeRoomGel">3 комнаты (гель)</Label>
              <Input
                id="threeRoomGel"
                type="number"
                min="0"
                value={prices.threeRoomGel}
                onChange={(e) => handlePriceChange('threeRoomGel', e.target.value)}
                placeholder="1800"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fourRoomLiquid">4+ комнаты (жидкость)</Label>
              <Input
                id="fourRoomLiquid"
                type="number"
                min="0"
                value={prices.fourRoomLiquid}
                onChange={(e) => handlePriceChange('fourRoomLiquid', e.target.value)}
                placeholder="2400"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fourRoomGel">4+ комнаты (гель)</Label>
              <Input
                id="fourRoomGel"
                type="number"
                min="0"
                value={prices.fourRoomGel}
                onChange={(e) => handlePriceChange('fourRoomGel', e.target.value)}
                placeholder="2100"
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>

        {/* Дома и участки */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Дома и участки</CardTitle>
            <CardDescription>Цены на обработку частных домов и участков</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeRoomLiquid">Частный дом (жидкость)</Label>
              <Input
                id="homeRoomLiquid"
                type="number"
                min="0"
                value={prices.homeRoomLiquid}
                onChange={(e) => handlePriceChange('homeRoomLiquid', e.target.value)}
                placeholder="3000"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeRoomGel">Частный дом (гель)</Label>
              <Input
                id="homeRoomGel"
                type="number"
                min="0"
                value={prices.homeRoomGel}
                onChange={(e) => handlePriceChange('homeRoomGel', e.target.value)}
                placeholder="2700"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotRoomLiquid">Участок (жидкость)</Label>
              <Input
                id="plotRoomLiquid"
                type="number"
                min="0"
                value={prices.plotRoomLiquid}
                onChange={(e) => handlePriceChange('plotRoomLiquid', e.target.value)}
                placeholder="4000"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotRoomGel">Участок (гель)</Label>
              <Input
                id="plotRoomGel"
                type="number"
                min="0"
                value={prices.plotRoomGel}
                onChange={(e) => handlePriceChange('plotRoomGel', e.target.value)}
                placeholder="3700"
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>

        {/* Коммерческие объекты */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Коммерческие объекты</CardTitle>
            <CardDescription>Цены на обработку ресторанов и других коммерческих помещений</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantRoomLiquid">Ресторан/кафе (жидкость)</Label>
              <Input
                id="restaurantRoomLiquid"
                type="number"
                min="0"
                value={prices.restaurantRoomLiquid}
                onChange={(e) => handlePriceChange('restaurantRoomLiquid', e.target.value)}
                placeholder="5000"
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantRoomGel">Ресторан/кафе (гель)</Label>
              <Input
                id="restaurantRoomGel"
                type="number"
                min="0"
                value={prices.restaurantRoomGel}
                onChange={(e) => handlePriceChange('restaurantRoomGel', e.target.value)}
                placeholder="4700"
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            type="submit"
            disabled={isLoading || isSaving}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            {isSaving ? 'Настраиваем...' : 'Сохранить цены и завершить регистрацию'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading || isSaving}
            className="px-8 py-3"
          >
            Пропустить (настроить позже)
          </Button>
        </div>
      </form>
    </div>
  );
}
