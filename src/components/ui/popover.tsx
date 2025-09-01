// src/components/ui/popover.tsx — компонент всплывающего окна
'use client';

import React from 'react';

interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  return (
    <div className="popover">
      {children}
    </div>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  return (
    <div className="popover-trigger">
      {children}
    </div>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function PopoverContent({ children, className = '' }: PopoverContentProps) {
  return (
    <div className={`popover-content bg-white border border-gray-200 rounded-md shadow-lg p-2 ${className}`}>
      {children}
    </div>
  );
}
