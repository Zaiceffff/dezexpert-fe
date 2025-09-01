// scripts/test-mapping.ts — тестирование маппинга данных
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Интерфейс для совместимости с существующим кодом
interface Request {
  id: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  name: string;
  pest: string;
  contact: string;
  address: string;
  date: string;
  object: string;
  price?: number;
  notes?: string;
}

// Интерфейс для лида из API
interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  status: string;
  pestType: string;
  approxPrice: number;
}

// Функция для маппинга Lead в Request
const mapLeadToRequest = (lead: Lead): Request => {
  const statusMap: Record<string, 'new' | 'in_progress' | 'completed' | 'cancelled'> = {
    'new': 'new',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };

  const pestTypeMap: Record<string, string> = {
    'tarakany': 'Тараканы',
    'klopy': 'Клопы',
    'muravi': 'Муравьи',
    'gryzuny': 'Грызуны',
    'bleshi': 'Блохи',
    'kleshchi': 'Клещи',
    'plesen': 'Плесень'
  };

  return {
    id: lead.id,
    status: statusMap[lead.status] || 'new',
    name: lead.name,
    pest: pestTypeMap[lead.pestType] || lead.pestType,
    contact: lead.phone,
    address: 'Адрес не указан', // В API нет адреса
    date: new Date(lead.createdAt).toLocaleDateString('ru-RU'),
    object: 'Квартира', // По умолчанию
    price: lead.approxPrice,
    notes: ''
  };
};

async function main() {
  try {
    // Тестируем маппинг данных
    const leads = await prisma.lead.findMany({
      where: { partnerId: 'test-partner' }
    });

    // Преобразуем в формат API
    const apiFormatLeads = leads.map(lead => ({
      id: lead.id,
      name: lead.name,
      pestType: lead.pestType,
      status: lead.status,
      approxPrice: lead.approxPrice,
      address: lead.address,
      createdAt: lead.createdAt
    }));

    // Преобразуем в формат Request
    const requests = apiFormatLeads.map(lead => ({
      id: lead.id,
      name: lead.name,
      pest: lead.pestType,
      status: lead.status,
      price: lead.approxPrice,
      address: lead.address,
      createdAt: lead.createdAt
    }));

    // Группируем по статусам
    const newRequests = requests.filter(r => r.status === 'New');
    const inProgressRequests = requests.filter(r => r.status === 'In Progress');
    const completedRequests = requests.filter(r => r.status === 'Completed');
    const cancelledRequests = requests.filter(r => r.status === 'Cancelled');

    // Выводим статистику
    const totalRequests = requests.length;
  } catch (error) {
    // Игнорируем ошибки
  }
}

main();
