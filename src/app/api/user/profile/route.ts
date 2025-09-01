import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiClient, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не предоставлен' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    logApiCall('GET', '/api/user/profile');
    
    // Отправляем запрос на внешний API для получения профиля
    const externalApiUrl = `${API_CONFIG.BASE_URL}/user/profile`;
    const result = await apiClient.get(externalApiUrl, token);
    
    logApiCall('GET', externalApiUrl, 'Success');
    
    return NextResponse.json(result);
  } catch (error: unknown) {
    logApiError('GET', '/api/user/profile', error);
    
    // Обрабатываем ошибки API клиента
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string };
      
      return NextResponse.json(
        { 
          error: 'Ошибка получения профиля', 
          details: apiError.message || 'Неизвестная ошибка' 
        },
        { status: apiError.status }
      );
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
