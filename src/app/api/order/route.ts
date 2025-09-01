import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiClient, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';

// Типы для заявки
interface CreateOrderRequest {
  service: string;
  object: string;
  count: string;
  experience: string;
  address: string;
  phoneNumber: string;
  name: string;
  clientComment: string;
  dezinsectorComment: string;
  dezinsectorId: string;
  expectDate: string;
}

interface OrderResponse {
  success: boolean;
  orderCreated: boolean;
  orderId?: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<OrderResponse>> {
  try {
    const body: CreateOrderRequest = await request.json();
    
    logApiCall('POST', '/api/order', body);
    
    // Валидация обязательных полей
    const requiredFields: (keyof CreateOrderRequest)[] = [
      'service', 'object', 'count', 'experience', 
      'address', 'phoneNumber', 'name', 'dezinsectorId', 'expectDate'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          orderCreated: false,
          message: `Отсутствуют обязательные поля: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }
    
    // Отправляем запрос на внешний сервер
    const externalApiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDER.CREATE}`;
    
    logApiCall('POST', externalApiUrl, body);
    
    const result = await apiClient.post(externalApiUrl, body);
    
    logApiCall('POST', externalApiUrl, 'Success');
    
    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      orderCreated: true,
      orderId: (result as any)?.id || (result as any)?.orderId,
      message: 'Заявка успешно создана'
    });
    
  } catch (error: unknown) {
    logApiError('POST', '/api/order', error);
    
    // Обрабатываем ошибки API клиента
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message?: string };
      return NextResponse.json(
        { 
          success: false,
          orderCreated: false,
          message: apiError.message || 'Ошибка создания заявки'
        },
        { status: apiError.status }
      );
    }
    
    // Общие ошибки
    return NextResponse.json(
      { 
        success: false,
        orderCreated: false,
        message: 'Внутренняя ошибка сервера'
      },
      { status: 500 }
    );
  }
}
