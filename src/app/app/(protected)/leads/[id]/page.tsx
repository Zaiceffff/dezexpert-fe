// src/app/app/(protected)/leads/[id]/page.tsx — карточка лида, смена статуса и напоминания
import { cookies } from 'next/headers';

// Функция для перевода типа вредителя
function getPestText(pestType: string) {
  switch (pestType) {
    case 'tarakany': return 'Тараканы';
    case 'klopy': return 'Клопы';
    case 'muravi': return 'Муравьи';
    case 'gryzuny': return 'Грызуны';
    case 'bleshi': return 'Блохи';
    case 'kleshchi': return 'Клещи';
    case 'plesen': return 'Плесень';
    default: return pestType;
  }
}

async function getLead(id: string) {
  const base = process.env.APP_BASE_URL || 'https://api.bugbot.ru/api';
  const r = await fetch(`${base}/api/leads/${id}`, { cache: 'no-store' });
  if (!r.ok) return null;
  return (await r.json()) as any;
}

async function changeStatus(id: string, status: string) {
  const base = process.env.APP_BASE_URL || 'https://api.bugbot.ru/api';
  await fetch(`${base}/api/leads/${id}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status })
  });
}

async function triggerReminder(leadId: string) {
  const base = process.env.APP_BASE_URL || 'https://api.bugbot.ru/api';
  await fetch(`${base}/api/reminders/schedule`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ leadId, scheduledAt: new Date().toISOString(), channel: 'sms' })
  });
}

export default async function LeadCardPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const partnerId = cookieStore.get('x-partner-id')?.value ?? '';
  if (!partnerId) {
    return <div className="text-sm text-gray-600">Нет доступа (установите x-partner-id)</div>;
  }

  const lead = await getLead(params.id);
  if (!lead) {
    return <div className="text-sm text-gray-600">Лид не найден</div>;
  }

  async function onChangeStatus(formData: FormData) {
    'use server';
    const status = String(formData.get('status') || 'new');
    await changeStatus(lead.id, status);
  }

  async function onReminder() {
    'use server';
    await triggerReminder(lead.id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Лид #{lead.id.slice(-6)}</h1>
        <span className="px-2 py-0.5 rounded-full text-xs border bg-white">{lead.status}</span>
      </div>
      <div className="rounded-2xl border bg-white p-6 grid gap-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-600">Клиент</div>
            <div className="font-medium">{lead.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Телефон</div>
            <div className="font-medium">{lead.phone}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Адрес</div>
            <div className="font-medium">{lead.address}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Дата</div>
            <div className="font-medium">{new Date(lead.expectedDate).toLocaleString('ru-RU')}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Тип</div>
            <div className="font-medium">{getPestText(lead.pestType)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Ориентировочно</div>
            <div className="font-medium">{lead.approxPrice} ₽</div>
          </div>
        </div>
        <div className="h-px bg-gray-100 my-2" />
        <form action={onChangeStatus} className="flex flex-wrap items-center gap-2">
          <select name="status" className="border rounded px-2 py-1" defaultValue={lead.status}>
            {['new', 'in_progress', 'done', 'cancelled'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1 text-sm hover:from-sky-600 hover:to-blue-700">
            Изменить статус
          </button>
        </form>
        <form action={onReminder} className="mt-2">
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Отправить напоминание (SMS)</button>
        </form>
      </div>
    </div>
  );
}

