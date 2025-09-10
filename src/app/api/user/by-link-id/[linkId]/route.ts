import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { linkId: string } }
) {
  try {
    const { linkId } = params;
    
    if (!linkId) {
      return NextResponse.json(
        { error: 'LinkId is required' },
        { status: 400 }
      );
    }

    console.log('API: Получаем пользователя по linkId:', linkId);

    // Делаем запрос к внешнему API для получения пользователя по linkId
    try {
      // Сначала попробуем получить пользователя через /user/profile с токеном
      const profileResponse = await fetch('https://195.200.17.116:3000/api/user/profile', {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpZCI6IjExM2VlMDg5LThhNTctNGEyOS05YmUzLTliMTg4ZWQwODVmZSIsIm5hbWUiOiLQmNCy0LDQvSIsInN1cm5hbWUiOiLQmNCy0LDQvdC-0LIiLCJwaG9uZSI6Ijc3Nzc3Nzc3Nzc3IiwiaGF2ZVRlbGVncmFtVG9rZW4iOmZhbHNlLCJoYXZlU2VydmljZVByaWNlIjp0cnVlLCJpYXQiOjE3NTY1NTAxNDYsImV4cCI6MTc1OTE0MjE0Nn0.9k1zOsw3PyDXh8A2JtsFFVu3j_YrKy-Szwmgo4r5RTE'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('API: Получены данные профиля:', profileData);
        
        // Проверяем, соответствует ли linkId
        if (profileData.linkId === linkId) {
          console.log('API: Найден пользователь по linkId:', profileData);
          return NextResponse.json({
            id: profileData.id,
            name: profileData.name,
            surname: profileData.surname,
            phone: profileData.phone,
            email: profileData.email,
            linkId: profileData.linkId,
            isAdmin: profileData.isAdmin,
            isVerified: profileData.isVerified,
            status: profileData.status,
            createdAt: profileData.createdAt,
            updatedAt: profileData.updatedAt
          });
        } else {
          console.log('API: linkId не совпадает:', profileData.linkId, '!==', linkId);
        }
      } else {
        console.error('API: Ошибка при получении профиля:', profileResponse.status);
      }
    } catch (apiError) {
      console.error('API: Ошибка при запросе к внешнему API:', apiError);
    }
    
    // Если не удалось получить данные или linkId не совпадает, возвращаем заглушку
    console.log('API: Возвращаем заглушку для linkId:', linkId);
    const fallbackData = {
      name: 'Специалист',
      surname: 'Дезинсектор',
      phone: '+7 (___) ___-__-__',
      linkId: linkId
    };
    
    return NextResponse.json(fallbackData);
    
  } catch (error) {
    console.error('API: Внутренняя ошибка:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
