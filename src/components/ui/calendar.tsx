// src/components/ui/calendar.tsx — выбор даты на react-day-picker (без прошлых дат)
'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DayPicker as DP } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useId } from 'react';

export function DayPicker({
  value,
  onChange
}: {
  value?: string;
  onChange: (iso: string) => void;
}) {
  const selected = value ? new Date(value) : undefined;
  const id = useId();

  return (
    <div id={id} className="rounded-md border bg-white p-2">
      <DP
        mode="single"
        selected={selected}
        onSelect={(d) => {
          if (d) onChange(new Date(d.setHours(12)).toISOString());
        }}
        locale={ru}
        weekStartsOn={1}
        disabled={(d) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return d < today;
        }}
        footer={selected ? <p className="text-xs">Выбрано: {format(selected, 'dd.MM.yyyy')}</p> : null}
      />
    </div>
  );
}

// Дополнительный компонент для совместимости
export function Calendar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`calendar ${className || ''}`}>
      {children}
    </div>
  );
}


