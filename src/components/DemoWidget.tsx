'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

type Pest = 'Тараканы' | 'Клопы' | 'Крысы' | 'Муравьи';
type ObjectType = 'Квартира' | 'Дом' | 'Офис';

const mockPrices: Record<Pest, Record<ObjectType, number>> = {
  'Тараканы': { 'Квартира': 1800, 'Дом': 2500, 'Офис': 3000 },
  'Клопы': { 'Квартира': 2800, 'Дом': 3800, 'Офис': 4200 },
  'Крысы': { 'Квартира': 2200, 'Дом': 3200, 'Офис': 3600 },
  'Муравьи': { 'Квартира': 1600, 'Дом': 2200, 'Офис': 2600 },
};

export default function DemoWidget({ onOpenSignup }: { onOpenSignup?: () => void }) {
  const [pest, setPest] = useState<Pest>('Тараканы');
  const [objectType, setObjectType] = useState<ObjectType>('Квартира');
  const [rooms, setRooms] = useState<number>(1);

  const approx = useMemo(() => {
    const base = mockPrices[pest][objectType];
    const multiplier = objectType === 'Дом' ? 1.3 : objectType === 'Офис' ? 1.2 : 1;
    const roomsFactor = Math.max(1, rooms * 0.85);
    return Math.round(base * multiplier * roomsFactor);
  }, [pest, objectType, rooms]);

  const handleOpenSignup = () => {
    track('demo_open', { placement: 'hero_widget', pest, objectType, rooms, approx });
    if (onOpenSignup) onOpenSignup();
  };

  const handleStartFree = () => {
    track('hero_cta_click', { placement: 'demo_widget' });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Демо‑виджет</h3>
        <p className="text-sm text-gray-600">3 шага до цены</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Вредитель</label>
          <select value={pest} onChange={(e) => setPest(e.target.value as Pest)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            {Object.keys(mockPrices).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Объект</label>
          <select value={objectType} onChange={(e) => setObjectType(e.target.value as ObjectType)} className="w-full rounded-lg border border-gray-300 px-3 py-2">
            {(['Квартира','Дом','Офис'] as ObjectType[]).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Комнат</label>
          <input type="number" min={1} max={6} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 text-center">
        <p className="text-sm text-gray-600">Ориентировочная стоимость</p>
        <p className="text-2xl font-bold text-green-700">{approx.toLocaleString('ru-RU')} ₽</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={handleOpenSignup} className="bg-green-600 hover:bg-green-700 text-white flex-1">Оставить заявку</Button>
        <a href="/register" className="flex-1 inline-flex items-center justify-center rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors" onClick={handleStartFree}>Начать бесплатно</a>
      </div>
      <p className="mt-2 text-[12px] text-gray-500">Без карточки · Бесплатный старт · Поддержка 24/7</p>
    </div>
  );
}


