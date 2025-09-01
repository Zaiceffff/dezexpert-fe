import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partnerId = params.id;
    
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не предоставлен' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    // Запрашиваем цены партнера с внешнего API
    const response = await fetch(`${API_BASE_URL}/partners/${partnerId}/pricing`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      // Если внешний API недоступен, возвращаем цены по умолчанию
      console.log(`⚠️ Внешний API недоступен (${response.status}), используем цены по умолчанию`);
      
      const defaultPricing = {
        partner: {
          id: partnerId,
          name: 'Партнер',
        },
        rules: [
          // Базовые цены для квартир
          { pestType: 'cockroaches', objectType: 'apartment', variant: '1', basePrice: 1500 },
          { pestType: 'cockroaches', objectType: 'apartment', variant: '2', basePrice: 2000 },
          { pestType: 'cockroaches', objectType: 'apartment', variant: '3', basePrice: 2500 },
          { pestType: 'cockroaches', objectType: 'apartment', variant: '4', basePrice: 3000 },
          { pestType: 'cockroaches', objectType: 'apartment', variant: 'default', basePrice: 2000 },
          
          // Базовые цены для домов
          { pestType: 'cockroaches', objectType: 'house', variant: 'default', basePrice: 3500 },
          
          // Базовые цены для участков
          { pestType: 'cockroaches', objectType: 'plot', variant: 'default', basePrice: 4000 },
          
          // Базовые цены для ресторанов
          { pestType: 'cockroaches', objectType: 'restaurant', variant: 'default', basePrice: 5000 },
          
          // Аналогично для других типов вредителей
          { pestType: 'bedbugs', objectType: 'apartment', variant: '1', basePrice: 1800 },
          { pestType: 'bedbugs', objectType: 'apartment', variant: '2', basePrice: 2300 },
          { pestType: 'bedbugs', objectType: 'apartment', variant: '3', basePrice: 2800 },
          { pestType: 'bedbugs', objectType: 'apartment', variant: '4', basePrice: 3300 },
          { pestType: 'bedbugs', objectType: 'apartment', variant: 'default', basePrice: 2300 },
          { pestType: 'bedbugs', objectType: 'house', variant: 'default', basePrice: 3800 },
          { pestType: 'bedbugs', objectType: 'plot', variant: 'default', basePrice: 4300 },
          { pestType: 'bedbugs', objectType: 'restaurant', variant: 'default', basePrice: 5300 },
          
          { pestType: 'mice', objectType: 'apartment', variant: '1', basePrice: 1600 },
          { pestType: 'mice', objectType: 'apartment', variant: '2', basePrice: 2100 },
          { pestType: 'mice', objectType: 'apartment', variant: '3', basePrice: 2600 },
          { pestType: 'mice', objectType: 'apartment', variant: '4', basePrice: 3100 },
          { pestType: 'mice', objectType: 'apartment', variant: 'default', basePrice: 2100 },
          { pestType: 'mice', objectType: 'house', variant: 'default', basePrice: 3600 },
          { pestType: 'mice', objectType: 'plot', variant: 'default', basePrice: 4100 },
          { pestType: 'mice', objectType: 'restaurant', variant: 'default', basePrice: 5100 },
        ],
        availablePests: ['cockroaches', 'bedbugs', 'mice'],
      };
      
      return NextResponse.json(defaultPricing);
    }
    
    // Если внешний API доступен, возвращаем его данные
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка в GET /api/partners/[id]/pricing:', error);
    
    // В случае ошибки возвращаем цены по умолчанию
    const fallbackPricing = {
      partner: {
        id: params.id,
        name: 'Партнер',
      },
      rules: [
        { pestType: 'cockroaches', objectType: 'apartment', variant: 'default', basePrice: 2000 },
        { pestType: 'bedbugs', objectType: 'apartment', variant: 'default', basePrice: 2300 },
        { pestType: 'mice', objectType: 'apartment', variant: 'default', basePrice: 2100 },
      ],
      availablePests: ['cockroaches', 'bedbugs', 'mice'],
    };
    
    return NextResponse.json(fallbackPricing);
  }
}
