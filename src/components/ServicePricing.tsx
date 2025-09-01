'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { LoadingSpinner, ButtonLoader } from '@/components/ui/loading-spinner';
import { API_BASE_URL } from '@/lib/config';

interface ServicePricing {
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

const defaultPricing: ServicePricing = {
  oneRoomLiquid: 1000,
  oneRoomGel: 1000,
  twoRoomLiquid: 1000,
  twoRoomGel: 1000,
  threeRoomLiquid: 1000,
  threeRoomGel: 1000,
  fourRoomLiquid: 1000,
  fourRoomGel: 1000,
  homeRoomLiquid: 1000,
  homeRoomGel: 1000,
  plotRoomLiquid: 1000,
  plotRoomGel: 1000,
  restaurantRoomLiquid: 1000,
  restaurantRoomGel: 1000,
};

export default function ServicePricing() {
  const [pricing, setPricing] = useState<ServicePricing>(defaultPricing);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getUserService();
      setPricing(data);
    } catch (error) {
      toast.error('Ошибка загрузки цен');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ServicePricing, value: string) => {
    const numValue = parseInt(value) || 0;
    setPricing(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSave = async () => {
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
        body: JSON.stringify(pricing),
      });

      if (response.ok) {
        toast.success('Цены успешно сохранены!');
      } else {
        toast.error('Ошибка сохранения цен');
      }
    } catch (error) {
      toast.error('Ошибка сохранения цен');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPricing(defaultPricing);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Цены на услуги</h2>
          <p className="text-gray-600">Установите цены для различных типов помещений и методов обработки</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <ButtonLoader /> : 'Сохранить'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Однокомнатные квартиры */}
        <Card>
          <CardHeader>
            <CardTitle>Однокомнатные квартиры</CardTitle>
            <CardDescription>Цены для однокомнатных квартир</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oneRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="oneRoomLiquid"
                type="number"
                value={pricing.oneRoomLiquid}
                onChange={(e) => handleInputChange('oneRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oneRoomGel">Гель (₽)</Label>
              <Input
                id="oneRoomGel"
                type="number"
                value={pricing.oneRoomGel}
                onChange={(e) => handleInputChange('oneRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Двухкомнатные квартиры */}
        <Card>
          <CardHeader>
            <CardTitle>Двухкомнатные квартиры</CardTitle>
            <CardDescription>Цены для двухкомнатных квартир</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twoRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="twoRoomLiquid"
                type="number"
                value={pricing.twoRoomLiquid}
                onChange={(e) => handleInputChange('twoRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twoRoomGel">Гель (₽)</Label>
              <Input
                id="twoRoomGel"
                type="number"
                value={pricing.twoRoomGel}
                onChange={(e) => handleInputChange('twoRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Трехкомнатные квартиры */}
        <Card>
          <CardHeader>
            <CardTitle>Трехкомнатные квартиры</CardTitle>
            <CardDescription>Цены для трехкомнатных квартир</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threeRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="threeRoomLiquid"
                type="number"
                value={pricing.threeRoomLiquid}
                onChange={(e) => handleInputChange('threeRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threeRoomGel">Гель (₽)</Label>
              <Input
                id="threeRoomGel"
                type="number"
                value={pricing.threeRoomGel}
                onChange={(e) => handleInputChange('threeRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Четырехкомнатные квартиры */}
        <Card>
          <CardHeader>
            <CardTitle>Четырехкомнатные квартиры</CardTitle>
            <CardDescription>Цены для четырехкомнатных квартир</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fourRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="fourRoomLiquid"
                type="number"
                value={pricing.fourRoomLiquid}
                onChange={(e) => handleInputChange('fourRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fourRoomGel">Гель (₽)</Label>
              <Input
                id="fourRoomGel"
                type="number"
                value={pricing.fourRoomGel}
                onChange={(e) => handleInputChange('fourRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Частные дома */}
        <Card>
          <CardHeader>
            <CardTitle>Частные дома</CardTitle>
            <CardDescription>Цены для частных домов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="homeRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="homeRoomLiquid"
                type="number"
                value={pricing.homeRoomLiquid}
                onChange={(e) => handleInputChange('homeRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homeRoomGel">Гель (₽)</Label>
              <Input
                id="homeRoomGel"
                type="number"
                value={pricing.homeRoomGel}
                onChange={(e) => handleInputChange('homeRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Участки */}
        <Card>
          <CardHeader>
            <CardTitle>Участки</CardTitle>
            <CardDescription>Цены для участков</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plotRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="plotRoomLiquid"
                type="number"
                value={pricing.plotRoomLiquid}
                onChange={(e) => handleInputChange('plotRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotRoomGel">Гель (₽)</Label>
              <Input
                id="plotRoomGel"
                type="number"
                value={pricing.plotRoomGel}
                onChange={(e) => handleInputChange('plotRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Рестораны */}
        <Card>
          <CardHeader>
            <CardTitle>Рестораны</CardTitle>
            <CardDescription>Цены для ресторанов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantRoomLiquid">Жидкость (₽)</Label>
              <Input
                id="restaurantRoomLiquid"
                type="number"
                value={pricing.restaurantRoomLiquid}
                onChange={(e) => handleInputChange('restaurantRoomLiquid', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantRoomGel">Гель (₽)</Label>
              <Input
                id="restaurantRoomGel"
                type="number"
                value={pricing.restaurantRoomGel}
                onChange={(e) => handleInputChange('restaurantRoomGel', e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
