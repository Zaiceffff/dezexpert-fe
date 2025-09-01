'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeadDetails } from '@/components/LeadDetails';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Lead } from '@/lib/api';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем partnerId из cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const partnerId = getCookie('x-partner-id') || 'test-partner';
    
    // Загружаем лиды
    const fetchLeads = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
        const q = new URLSearchParams({ 
          partnerId, 
          limit: '50', 
          search: '', 
          status: '' 
        }).toString();
        
        const response = await fetch(`${base}/api/leads?${q}`);
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        } else {
          console.error('Ошибка загрузки лидов');
        }
      } catch (error) {
        console.error('Ошибка загрузки лидов');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Лиды</h1>
        <div className="text-sm text-gray-600">Партнёр: <code>test-partner</code></div>
      </div>
      <div className="rounded-2xl border bg-white">
        <div className="flex items-center justify-between p-3 border-b bg-gray-50/70">
          <div className="flex gap-2 text-sm">
            {[
              { label: 'Все', value: '' },
              { label: 'Новые', value: 'new' },
              { label: 'В работе', value: 'in_progress' }
            ].map((f) => (
              <button
                key={f.label}
                className={`px-2 py-1 rounded-md ${
                  '' === f.value ? 'bg-white border' : 'hover:bg-white/70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              className="px-3 py-1.5 text-sm rounded-md border focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              placeholder="Поиск по имени/телефону"
            />
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">Искать</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="text-gray-600">
                <th className="p-3 text-left">Дата</th>
                <th className="p-3 text-left">Клиент</th>
                <th className="p-3 text-left">Телефон</th>
                <th className="p-3 text-left">Статус</th>
                <th className="p-3 text-left">Тип</th>
                <th className="p-3 text-left">Цена</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr 
                  key={l.id} 
                  className="border-t hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(l)}
                >
                  <td className="p-3">{new Date(l.createdAt).toLocaleString('ru-RU')}</td>
                  <td className="p-3">{l.name}</td>
                  <td className="p-3">{l.phone}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs border bg-white">{l.status}</span>
                  </td>
                  <td className="p-3">{l.pestType}</td>
                  <td className="p-3">{l.approxPrice} ₽</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={6}>
                    Пока нет заявок. Поделитесь реферальной ссылкой: <code>/test-partner</code>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно с деталями заявки */}
      <LeadDetails 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        lead={selectedLead} 
      />
    </div>
  );
}

