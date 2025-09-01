export interface Request {
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

export const mockRequests: Request[] = [
  {
    id: '1',
    status: 'new',
    name: 'Валерий',
    pest: 'Мухи и клопы',
    contact: '+79995556325',
    address: 'Москва, Улица Ленина 22',
    date: '28.03.2025',
    object: '4 комнатная квартира',
    price: 15000,
    notes: 'Срочно, клиент уезжает через неделю'
  },
  {
    id: '2',
    status: 'new',
    name: 'Диана',
    pest: 'Тараканы',
    contact: '+79528302414',
    address: 'Краснодар, Красная, д27, кв 5',
    date: '28.03.2025',
    object: '2 комнатная квартира',
    price: 12000
  },
  {
    id: '3',
    status: 'completed',
    name: 'Светлана',
    pest: 'Тараканы',
    contact: '+76525588226',
    address: 'Северная 251',
    date: '29.03.2025',
    object: '2 комнатная квартира',
    price: 12000
  },
  {
    id: '4',
    status: 'in_progress',
    name: 'Анатолий',
    pest: 'Клопы',
    contact: '+79996652333',
    address: 'Сочи, Береговая 1',
    date: '20.03.2025',
    object: '3 комнатная квартира',
    price: 18000
  },
  {
    id: '5',
    status: 'new',
    name: 'Раджип',
    pest: 'Мухи и клопы',
    contact: '+76464646464',
    address: 'Анталия, 72стрит. 263',
    date: '18.03.2025',
    object: '1 комнатная квартира',
    price: 8000
  },
  {
    id: '6',
    status: 'completed',
    name: 'Семён',
    pest: 'Мухи и клопы',
    contact: '+79528632525',
    address: 'Минск Мира 9',
    date: '18.03.2025',
    object: '2 комнатная квартира',
    price: 12000
  },
  {
    id: '7',
    status: 'new',
    name: 'Вася',
    pest: 'Мухи и клопы',
    contact: '+79528302414',
    address: 'Краснодар Красная 32',
    date: '27.03.2025',
    object: '2 комнатная квартира',
    price: 12000
  },
  {
    id: '8',
    status: 'cancelled',
    name: 'Валера',
    pest: 'Клопы',
    contact: '+79528302414',
    address: 'Красная 3',
    date: '21.03.2025',
    object: '4 комнатная квартира',
    price: 20000
  }
];

export const getStatusColor = (status: Request['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: Request['status']) => {
  switch (status) {
    case 'new':
      return 'Новый';
    case 'in_progress':
      return 'В работе';
    case 'completed':
      return 'Завершен';
    case 'cancelled':
      return 'Отменен';
    default:
      return 'Неизвестно';
  }
};

// Импортируем тип Order из api.ts
export type { Order } from './api';

export interface OrdersResponse {
  data: unknown[];
  count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  isVerified: boolean;
  unlimitedAccount: boolean;
  linkId: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  tariff?: {
    id: string;
    name: string;
    price: string;
    isActive: boolean;
  };
}

export interface CreateOrderRequest {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  phoneNumber: string;
  name: string;
  clientComment?: string;
  dezinsectorComment?: string;
  dezinsectorId: string;
  expectDate: string;
}
