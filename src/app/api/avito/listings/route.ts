import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || 'active'; // По умолчанию только активные
    
    if (!token) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    // Проверяем, запущен ли Avito бэкенд
    const avitoBackendUrl = process.env.AVITO_BACKEND_URL || 'https://v467850.hosted-by-vdsina.com/api/docs';
    
    try {
      // Пробуем подключиться к Avito бэкенду
      const response = await fetch(`${avitoBackendUrl}/api/avito/listings?page=${page}&limit=${limit}&status=${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Если API не поддерживает фильтрацию по статусу, фильтруем на стороне клиента
        if (data.data && data.data.items && Array.isArray(data.data.items)) {
          if (status === 'active') {
            data.data.items = data.data.items.filter((item: { status: string }) => item.status === 'active');
            data.data.pagination.total = data.data.items.length;
          }
        }
        
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
    console.error('Ошибка получения объявлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const body = await request.json();

    // Проверяем, запущен ли Avito бэкенд
    const avitoBackendUrl = process.env.AVITO_BACKEND_URL || 'https://v467850.hosted-by-vdsina.com/api/docs';
    
    try {
      // Пробуем подключиться к Avito бэкенду
      const response = await fetch(`${avitoBackendUrl}/api/avito/sync/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
    console.error('Ошибка синхронизации объявлений:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
