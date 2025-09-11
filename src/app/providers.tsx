// src/app/providers.tsx — клиентский провайдер TanStack Query и Auth
'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { FullScreenLoader } from '@/components/ui/loading-spinner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}


