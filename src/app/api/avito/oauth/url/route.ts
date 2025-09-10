import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Временно возвращаем заглушку, пока Avito backend не настроен
    return NextResponse.json({
      error: 'Avito интеграция временно недоступна',
      message: 'Функция находится в разработке'
    }, { status: 503 });
    
  } catch (error) {
    console.error('Ошибка получения OAuth URL:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
