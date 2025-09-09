import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { API_BASE_URL } from '@/lib/config';

export const dynamic = 'force-dynamic';

const serviceUpdateSchema = z.object({
  oneRoomLiquid: z.number().min(0),
  oneRoomGel: z.number().min(0),
  twoRoomLiquid: z.number().min(0),
  twoRoomGel: z.number().min(0),
  threeRoomLiquid: z.number().min(0),
  threeRoomGel: z.number().min(0),
  fourRoomLiquid: z.number().min(0),
  fourRoomGel: z.number().min(0),
  homeRoomLiquid: z.number().min(0),
  homeRoomGel: z.number().min(0),
  plotRoomLiquid: z.number().min(0),
  plotRoomGel: z.number().min(0),
  restaurantRoomLiquid: z.number().min(0),
  restaurantRoomGel: z.number().min(0),
});

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
    
    // Отправляем запрос на внешний API
    const response = await fetch(`${API_BASE_URL}/user/service`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Ошибка получения сервисов', 
          details: errorData.message || 'Неизвестная ошибка' 
        },
        { status: response.status }
      );
    }
    
    // Проверяем, что ответ не пустой
    const responseText = await response.text();
    if (!responseText.trim()) {
      return NextResponse.json(
        { error: 'Пустой ответ от сервера' },
        { status: 500 }
      );
    }
    
    // Парсим JSON только если есть содержимое
    const result = JSON.parse(responseText);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка в GET /api/user/service:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Токен авторизации не предоставлен' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const body = await request.json();
    
    // Валидация входных данных
    const validatedData = serviceUpdateSchema.parse(body);
    
    // Отправляем запрос на внешний API
    const response = await fetch(`${API_BASE_URL}/user/service`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Ошибка обновления сервисов', 
          details: errorData.message || 'Неизвестная ошибка' 
        },
        { status: response.status }
      );
    }
    
    // Проверяем, что ответ не пустой
    const responseText = await response.text();
    if (!responseText.trim()) {
      return NextResponse.json(
        { error: 'Пустой ответ от сервера' },
        { status: 500 }
      );
    }
    
    // Парсим JSON только если есть содержимое
    const result = JSON.parse(responseText);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка в PATCH /api/user/service:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
