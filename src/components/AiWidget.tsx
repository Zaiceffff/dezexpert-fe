// src/components/AiWidget.tsx — виджет AI ассистента (иконка/панель, мок)
'use client';

import { useState } from 'react';

export default function AiWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4">
      {open && (
        <div className="mb-2 w-80 rounded-lg border bg-white p-3 shadow">
          <div className="text-sm font-medium mb-2">AI-ассистент</div>
          <div className="text-xs text-gray-600">Задайте вопрос. В демо-версии ответ формируется локально.</div>
        </div>
      )}
      <button
        aria-label="AI"
        className="h-12 w-12 rounded-full bg-brand text-white shadow-lg"
        onClick={() => setOpen((v) => !v)}
      >
        AI
      </button>
    </div>
  );
}


