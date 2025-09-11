import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('OAuth Callback received:', { code, state, error });

    // Check for OAuth errors
    if (error) {
      return new NextResponse(`
        <html>
          <head><title>Ошибка подключения</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">❌ Ошибка подключения</h1>
            <p>Произошла ошибка при подключении аккаунта Avito: ${error}</p>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
          </body>
        </html>
      `, {
        status: 400,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    if (!code) {
      return new NextResponse(`
        <html>
          <head><title>Ошибка подключения</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">❌ Ошибка подключения</h1>
            <p>Отсутствует код авторизации</p>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
          </body>
        </html>
      `, {
        status: 400,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Call backend to exchange code for tokens
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://v467850.hosted-by-vdsina.com';
    const params = new URLSearchParams({ code });
    if (state) params.append('state', state);

    const response = await fetch(`${backendUrl}/api/avito/oauth/callback/public?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('Backend response:', responseText);

    if (!response.ok) {
      return new NextResponse(`
        <html>
          <head><title>Ошибка подключения</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">❌ Ошибка подключения</h1>
            <p>Ошибка при обмене кода на токен: ${response.status}</p>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
          </body>
        </html>
      `, {
        status: response.status,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Return success HTML page
    return new NextResponse(`
      <html>
        <head><title>Подключение успешно</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #4caf50;">✅ Подключение успешно</h1>
          <p>Аккаунт Avito успешно подключен!</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return new NextResponse(`
      <html>
        <head><title>Ошибка подключения</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #f44336;">❌ Ошибка подключения</h1>
          <p>Произошла ошибка при подключении аккаунта Avito: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
        </body>
      </html>
    `, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
