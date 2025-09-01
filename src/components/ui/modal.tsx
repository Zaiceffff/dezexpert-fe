'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  mobileFullscreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  mobileFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Закрытие по клику на оверлей
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Размеры модального окна
  const sizeClasses = {
    sm: 'w-[95vw] max-w-sm sm:max-w-sm',
    md: 'w-[95vw] max-w-md sm:max-w-md md:max-w-lg',
    lg: 'w-[95vw] max-w-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl',
    xl: 'w-[95vw] max-w-xl sm:max-w-xl md:max-w-2xl lg:max-w-4xl',
    full: 'w-[95vw] h-[95vh] max-w-none'
  };

  // Мобильные стили
  const mobileClasses = mobileFullscreen 
    ? 'sm:rounded-lg sm:h-auto sm:max-h-[90vh]' 
    : 'rounded-lg max-h-[90vh]';

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Оверлей */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* Модальное окно */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white shadow-xl',
          sizeClasses[size],
          mobileClasses,
          'overflow-hidden',
          className
        )}
      >
        {/* Заголовок */}
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Содержимое */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>

        {/* Кнопка закрытия для мобильных устройств без заголовка */}
        {!title && showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>
    </div>
  );

  // Рендерим в портал для правильного позиционирования
  return createPortal(modalContent, document.body);
};

// Адаптивное модальное окно для мобильных устройств
const ResponsiveModal: React.FC<ModalProps & {
  mobileBehavior?: 'fullscreen' | 'overlay' | 'bottom-sheet';
}> = ({
  mobileBehavior = 'overlay',
  ...props
}) => {
  const behaviorClasses = {
    fullscreen: 'sm:rounded-none sm:max-w-none sm:h-screen',
    overlay: '',
    'bottom-sheet': 'sm:rounded-t-xl sm:rounded-b-none sm:max-h-[90vh] sm:bottom-0 sm:top-auto'
  };

  return (
    <Modal
      {...props}
      mobileFullscreen={mobileBehavior === 'fullscreen'}
      className={cn(props.className, behaviorClasses[mobileBehavior])}
    />
  );
};

// Мобильное модальное окно с автоматическим поведением
const MobileModal: React.FC<ModalProps & {
  autoSize?: boolean;
  mobileOptimized?: boolean;
}> = ({
  autoSize = true,
  mobileOptimized = true,
  size = 'md',
  ...props
}) => {
  // Автоматический размер для мобильных устройств
  const getMobileSize = () => {
    if (!autoSize) return size;
    
    // На мобильных устройствах используем больший размер
    if (size === 'sm') return 'md';
    if (size === 'md') return 'lg';
    return size;
  };

  return (
    <ResponsiveModal
      {...props}
      size={getMobileSize()}
      mobileBehavior={mobileOptimized ? 'overlay' : 'fullscreen'}
      className={cn(
        props.className,
        mobileOptimized && 'sm:max-w-[95vw] sm:mx-4'
      )}
    />
  );
};

export { Modal, ResponsiveModal, MobileModal };
export default Modal;
