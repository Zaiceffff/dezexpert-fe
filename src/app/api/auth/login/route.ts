import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiClient, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: unknown;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    
    logApiCall('POST', '/api/auth/login', { email: body.email });
    
    // Валидация обязательных полей
    if (!body.email || !body.password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email и пароль обязательны для заполнения'
        },
        { status: 400 }
      );
    }
    
    // Отправляем запрос на внешний сервер
    const externalApiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
    
    console.log('🔍 DEBUG: API_CONFIG.BASE_URL =', API_CONFIG.BASE_URL);
    console.log('🔍 DEBUG: API_CONFIG.ENDPOINTS.AUTH.LOGIN =', API_CONFIG.ENDPOINTS.AUTH.LOGIN);
    console.log('🔍 DEBUG: externalApiUrl =', externalApiUrl);
    
    logApiCall('POST', externalApiUrl, { email: body.email });
    
    const result = await apiClient.post(externalApiUrl, body);
    
    logApiCall('POST', externalApiUrl, 'Success');
    
    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      token: (result as any)?.token || (result as any)?.accessToken,
      user: (result as any)?.user,
      message: 'Успешная авторизация'
    });
    
  } catch (error: unknown) {
    logApiError('POST', '/api/auth/login', error);
    
    // Обрабатываем ошибки API клиента
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string };
      
      let message = 'Ошибка авторизации';
      if (apiError.status === 401) {
        message = 'Неверный email или пароль';
      } else if (apiError.status === 404) {
        message = 'Пользователь не найден';
      }
      
      return NextResponse.json(
        { 
          success: false,
          message
        },
        { status: apiError.status }
      );
    }
    
    // Общие ошибки
    return NextResponse.json(
      { 
        success: false,
        message: 'Внутренняя ошибка сервера'
      },
      { status: 500 }
    );
  }
}
