import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { id } = params;
    
    if (!token) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Отсутствует ID объявления' }, { status: 400 });
    }

    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Параметр enabled должен быть boolean' }, { status: 400 });
    }

    // Проверяем, запущен ли Avito бэкенд
    const avitoBackendUrl = process.env.AVITO_BACKEND_URL || 'https://api.bugbot.ru/api';
    
    try {
      // Пробуем подключиться к Avito бэкенду
      const response = await fetch(`${avitoBackendUrl}/api/avito/listings/${id}/ai-toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.error('Ошибка подключения к Avito backend:', backendError);
      return NextResponse.json(
        { error: 'Avito backend недоступен. Проверьте настройки и запустите сервис.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Ошибка переключения ИИ ассистента:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
