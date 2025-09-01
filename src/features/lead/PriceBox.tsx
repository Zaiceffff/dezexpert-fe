// src/features/lead/PriceBox.tsx — отображение ориентировочной цены
'use client';

export default function PriceBox({ approx }: { approx: number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-gray-500">Ориентировочная стоимость</div>
      <div className="text-3xl font-semibold">{approx > 0 ? `${approx} ₽` : '—'}</div>
      <div className="text-xs text-gray-500">
        Итоговая цена уточняется оператором (повторная обработка не включена).
      </div>
    </div>
  );
}


