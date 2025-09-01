'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLoader, LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { X, Save, RussianRuble } from 'lucide-react';
import { toast } from 'sonner';

import { getUserPrices, getDefaultPrices, validatePrices, type ServicePrices } from '@/lib/pricingApi';

interface PriceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onSave: (prices: ServicePrices) => Promise<void>;
  initialPrices?: ServicePrices | null;
  isLoading?: boolean;
}

export default function PriceEditModal({ 
  isOpen, 
  onClose, 
  onOpen,
  onSave, 
  initialPrices, 
  isLoading = false 
}: PriceEditModalProps) {
  const [prices, setPrices] = useState<ServicePrices>({
    oneRoomLiquid: 0,
    oneRoomGel: 0,
    twoRoomLiquid: 0,
    twoRoomGel: 0,
    threeRoomLiquid: 0,
    threeRoomGel: 0,
    fourRoomLiquid: 0,
    fourRoomGel: 0,
    homeRoomLiquid: 0,
    homeRoomGel: 0,
    plotRoomLiquid: 0,
    plotRoomGel: 0,
    restaurantRoomLiquid: 0,
    restaurantRoomGel: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  // Загружаем цены из API при открытии модала
  useEffect(() => {
    if (isOpen) {
      loadPricesFromAPI();
      // Вызываем onOpen если он передан
      if (typeof onOpen === 'function') {
        onOpen();
      }
    }
  }, [isOpen]); // Убираем onOpen из зависимостей, так как он может быть undefined

  const loadPricesFromAPI = async () => {
    try {
      setIsLoadingPrices(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Необходима авторизация');
        return;
      }

      // Очищаем кэш при открытии модала, чтобы загрузить свежие цены
      localStorage.removeItem('user_prices');
      console.log('🗑️ Кэш цен очищен при открытии модала');

      // Пробуем загрузить цены через новый API
      const userPrices = await getUserPrices(token);
      
      if (userPrices) {
        setPrices(userPrices);
        console.log('✅ Цены загружены в модал:', userPrices);
      } else if (initialPrices) {
        // Если цены не загрузились, используем initialPrices
        setPrices(initialPrices);
        console.log('⚠️ Используем initialPrices:', initialPrices);
      } else {
        // Если нет initialPrices, используем значения по умолчанию
        const defaultPrices = getDefaultPrices();
        setPrices(defaultPrices);
        console.log('⚠️ Используем значения по умолчанию:', defaultPrices);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки цен:', error);
      toast.warning('Ошибка загрузки цен, используем значения по умолчанию');
      
      if (initialPrices) {
        setPrices(initialPrices);
      } else {
        setPrices(getDefaultPrices());
      }
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handlePriceChange = (key: keyof ServicePrices, value: string) => {
    const numValue = parseInt(value) || 0;
    setPrices(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (onSave) {
        await onSave(prices);
        onClose();
      } else {
        toast.error('Ошибка: функция сохранения не передана');
      }
    } catch (error) {
      toast.error('Ошибка при сохранении цен. Попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    loadPricesFromAPI();
    toast.info('Цены загружены с сервера');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] min-h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <RussianRuble className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Настройка цен на услуги</h2>
              <p className="text-gray-600">Установите стоимость для каждого типа объекта и метода обработки</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {isLoadingPrices ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
              <span className="ml-3 text-gray-600">Загружаем цены...</span>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 pb-8">
              {/* Квартиры */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Квартиры
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1 комната */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">1 комната</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.oneRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('oneRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.oneRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('oneRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2 комнаты */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">2 комнаты</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.twoRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('twoRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.twoRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('twoRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 комнаты */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">3 комнаты</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.threeRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('threeRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.threeRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('threeRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4+ комнаты */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">4+ комнаты</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.fourRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('fourRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.fourRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('fourRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Частные дома и участки */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Частные дома и участки
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Частный дом */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Частный дом</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.homeRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('homeRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.homeRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('homeRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Участок */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Участок</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Жидкость</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.plotRoomLiquid || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('plotRoomLiquid', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Гель</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={prices.plotRoomGel || ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handlePriceChange('plotRoomGel', value);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="h-9 text-center font-medium text-lg"
                          placeholder="0"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Коммерческие объекты */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Коммерческие объекты
                </h3>
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Рестораны, офисы, склады</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Жидкость</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={prices.restaurantRoomLiquid || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          handlePriceChange('restaurantRoomLiquid', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        className="h-9 text-center font-medium text-lg"
                        placeholder="0"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Гель</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={prices.restaurantRoomGel || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          handlePriceChange('restaurantRoomGel', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        className="h-9 text-center font-medium text-lg"
                        placeholder="0"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Информация */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Как устанавливать цены:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• <strong>Жидкость</strong> - для обработки клопов, мух, ос и других летающих насекомых</li>
                      <li>• <strong>Гель</strong> - для обработки тараканов, муравьев и ползающих насекомых</li>
                      <li>• Цены указывайте в рублях без копеек</li>
                      <li>• Учитывайте сложность объекта и площадь обработки</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoadingPrices || isSaving}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2"
            >
              {isLoadingPrices ? (
                <ButtonLoader />
              ) : (
                'Сбросить'
              )}
            </Button>
            <span className="text-sm text-gray-500">
              {isLoadingPrices ? 'Загружаем цены...' : 'Цены загружены с сервера'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
            >
              {isSaving ? (
                <ButtonLoader />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить цены
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
