'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Логотип DEZEXPERT */}
      <div className="mb-8">
        <Image
          src="/dezexpertlogo.png"
          alt="DEZEXPERT Logo"
          width={200}
          height={80}
          className="w-auto h-16"
        />
      </div>
      
      {/* Текст "Загрузка DEZEXPERT" */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Загрузка DEZEXPERT
        </h1>
      </div>
    </div>
  );
}
