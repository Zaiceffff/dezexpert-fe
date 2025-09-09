import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiClient, logApiCall, logApiError } from '@/lib/apiUtils';
import { API_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  surname: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Телефон должен содержать минимум 10 цифр'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    logApiCall('POST', '/api/auth/register', { email: body.email });
    
    // Валидация входных данных
    const validatedData = registerSchema.parse(body);
    
    // Отправляем запрос на внешний API
    const externalApiUrl = `${API_CONFIG.BASE_URL}/auth/register`;
    const result = await apiClient.post(externalApiUrl, validatedData);
    
    logApiCall('POST', externalApiUrl, 'Success');
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      );
    }
    
    logApiError('POST', '/api/auth/register', error);
    
    // Обрабатываем ошибки API клиента
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message: string };
      
      return NextResponse.json(
        { 
          error: 'Ошибка регистрации',
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
