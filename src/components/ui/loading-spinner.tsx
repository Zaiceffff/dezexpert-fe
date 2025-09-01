'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text = 'Загрузка...',
  showText = true 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {/* Анимированный логотип */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Основной логотип с пульсацией */}
        <div className="absolute inset-0 animate-pulse">
          <Image
            src="/logo.jpeg"
            alt="DEZEXPERT Logo"
            width={96}
            height={96}
            className={cn('w-full h-full object-contain rounded-full', sizeClasses[size])}
          />
        </div>
        
        {/* Вращающийся ободок */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-600 border-r-green-500 border-b-green-400 border-l-green-300 animate-spin" />
        
        {/* Дополнительный эффект свечения */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-pulse" />
      </div>
      
      {/* Текст загрузки */}
      {showText && (
        <div className={cn('mt-4 text-center', textSizes[size])}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-600 font-medium">{text}</span>
            {/* Анимированные точки */}
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент для полноэкранной загрузки
export function FullScreenLoader({ 
  text = 'Загрузка приложения...',
  className 
}: { 
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
        
        {/* Дополнительная анимация фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
          <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{ animationDelay: '4s' }} />
        </div>
      </div>
    </div>
  );
}

// Компонент для загрузки страницы
export function PageLoader({ 
  text = 'Загрузка страницы...',
  className 
}: { 
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      'min-h-[400px] flex items-center justify-center bg-gray-50/50',
      className
    )}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Компонент для загрузки кнопки
export function ButtonLoader({ 
  size = 'sm',
  className 
}: { 
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'relative',
        size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
      )}>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current border-r-current border-b-current border-l-current animate-spin opacity-60" />
      </div>
    </div>
  );
}
