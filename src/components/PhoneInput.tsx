'use client';

import { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "+7 (___) ___-__-__", className = "", disabled = false, id }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    // Форматируем номер телефона
    const formatPhoneNumber = (input: string): string => {
      // Убираем все кроме цифр
      const numbers = input.replace(/\D/g, '');
      
      // Ограничиваем до 11 цифр (7 + 10 цифр номера)
      const limitedNumbers = numbers.slice(0, 11);
      
      if (limitedNumbers.length === 0) return '';
      
      let result = '';
      
      if (limitedNumbers.length >= 1) {
        result += '+7';
      }
      
      if (limitedNumbers.length >= 2) {
        result += ` (${limitedNumbers.slice(1, 4)}`;
      }
      
      if (limitedNumbers.length >= 5) {
        result += `) ${limitedNumbers.slice(4, 7)}`;
      }
      
      if (limitedNumbers.length >= 8) {
        result += `-${limitedNumbers.slice(7, 9)}`;
      }
      
      if (limitedNumbers.length >= 10) {
        result += `-${limitedNumbers.slice(9, 11)}`;
      }
      
      return result;
    };

    // Обрабатываем изменения в поле ввода
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      
      // Если пользователь удаляет символы, обрабатываем это
      if (input.length < displayValue.length) {
        // Убираем последний символ из значения
        const currentNumbers = value.replace(/\D/g, '');
        const newNumbers = currentNumbers.slice(0, -1);
        const newValue = newNumbers.length > 0 ? newNumbers : '';
        onChange(newValue);
        setDisplayValue(formatPhoneNumber(newValue));
        return;
      }
      
      // Форматируем новое значение
      const formatted = formatPhoneNumber(input);
      setDisplayValue(formatted);
      
      // Сохраняем только цифры в value
      const numbers = input.replace(/\D/g, '');
      onChange(numbers);
    };

    // Обрабатываем вставку
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const numbers = pastedText.replace(/\D/g, '');
      const formatted = formatPhoneNumber(numbers);
      setDisplayValue(formatted);
      onChange(numbers);
    };

    // Обрабатываем клавиши
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Разрешаем: backspace, delete, tab, escape, enter, стрелки
      if ([8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode)) {
        return;
      }
      
      // Разрешаем только цифры
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        return;
      }
      
      // Разрешаем numpad цифры
      if (e.keyCode >= 96 && e.keyCode <= 105) {
        return;
      }
      
      // Блокируем все остальное
      e.preventDefault();
    };

    // Обновляем displayValue при изменении value извне
    useEffect(() => {
      setDisplayValue(formatPhoneNumber(value));
    }, [value]);

    return (
      <Input
        ref={ref}
        id={id}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        autoComplete="tel"
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;


