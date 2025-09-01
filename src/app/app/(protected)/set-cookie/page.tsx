'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetCookiePage() {
  const router = useRouter();

  useEffect(() => {
    // Устанавливаем cookie для test-partner
    document.cookie = 'x-partner-id=test-partner; path=/';
    
    // Перенаправляем на дашборд
    router.push('/app/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">Устанавливаем cookie...</div>
    </div>
  );
}
