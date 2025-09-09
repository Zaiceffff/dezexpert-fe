import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!token) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    if (!code) {
      return NextResponse.json({ error: 'Отсутствует код авторизации' }, { status: 400 });
    }

    // Проверяем, запущен ли Avito бэкенд
    const avitoBackendUrl = process.env.AVITO_BACKEND_URL || 'http://localhost:3005';
    
    try {
      // Пробуем подключиться к Avito бэкенду
      const response = await fetch(`${avitoBackendUrl}/api/avito/oauth/callback?code=${code}&state=${state || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    console.error('Ошибка обработки OAuth callback:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
