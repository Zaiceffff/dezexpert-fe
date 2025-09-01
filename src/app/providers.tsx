// src/app/providers.tsx — клиентский провайдер TanStack Query и Auth
'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { FullScreenLoader } from '@/components/ui/loading-spinner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку приложения
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullScreenLoader text="Загрузка DEZEXPERT" />;
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}


