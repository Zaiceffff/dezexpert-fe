import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiClient, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const skipPages = parseInt(searchParams.get('skipPages') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const linkId = searchParams.get('linkId');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    logApiCall('GET', '/api/order/list', { skipPages, pageSize, linkId, search, status });

    // Валидация параметров
    if (skipPages < 0) {
      return NextResponse.json(
        { error: 'skipPages должен быть неотрицательным числом' },
        { status: 400 }
      );
    }

    if (pageSize <= 0 || pageSize > 100) {
      return NextResponse.json(
        { error: 'pageSize должен быть от 1 до 100' },
        { status: 400 }
      );
    }

    // Формируем параметры для внешнего API
    const externalParams = new URLSearchParams();
    externalParams.append('skipPages', skipPages.toString());
    externalParams.append('pageSize', pageSize.toString());

    // Добавляем дополнительные параметры, если они есть
    if (linkId) {
      externalParams.append('linkId', linkId);
    }

    if (search) {
      externalParams.append('search', search);
    }

    if (status) {
      externalParams.append('status', status);
    }

    // Отправляем запрос на внешний сервер
    const externalApiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDER.LIST}?${externalParams.toString()}`;
    
    logApiCall('GET', externalApiUrl, 'Requesting orders from external API');
    
    const result = await apiClient.get(externalApiUrl);
    
    logApiCall('GET', externalApiUrl, 'Success');
    
    // Возвращаем результат
    return NextResponse.json(result);
    
  } catch (error: unknown) {
    logApiError('GET', '/api/order/list', error);
    
    // Обрабатываем ошибки API клиента
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message?: string };
      return NextResponse.json(
        { error: apiError.message || 'Ошибка получения списка заказов' },
        { status: apiError.status }
      );
    }
    
    // Общие ошибки
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
