// src/components/ui/toast-provider.tsx — провайдер тостов Sonner
'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return <SonnerToaster richColors position="top-right" duration={3000} />;
}


