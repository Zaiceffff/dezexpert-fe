import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    // Проксируем запрос к Avito бэкенду
    const response = await fetch(`${getApiUrl('/api/avito/listings/ai-active')}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Ошибка получения активных объявлений' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка получения активных объявлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
