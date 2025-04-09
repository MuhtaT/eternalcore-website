import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { validateSession } from '@/lib/services/auth-diagnostics';

export async function GET(request: NextRequest) {
  try {
    // Проверяем наличие необходимых переменных окружения
    const envCheck = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'present' : 'missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'present' : 'missing',
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    };

    // Проверяем соответствие NEXTAUTH_URL и текущего хоста
    let urlMismatch = false;
    if (process.env.NEXTAUTH_URL) {
      try {
        const configuredUrl = new URL(process.env.NEXTAUTH_URL);
        const requestUrl = new URL(request.url);
        
        urlMismatch = configuredUrl.host !== requestUrl.host;
        
        if (urlMismatch) {
          console.warn(`Несоответствие хостов: NEXTAUTH_URL=${configuredUrl.host}, текущий запрос=${requestUrl.host}`);
        }
      } catch (e) {
        console.error("Ошибка при анализе URL:", e);
      }
    }

    // Получаем сессию
    const session = await getServerSession(authOptions);
    
    // Проверяем целостность сессии
    const validationResult = validateSession(session);
    
    // Формируем ответ с диагностической информацией
    return NextResponse.json({
      authenticated: session !== null,
      session: session ? {
        user: {
          email: session.user?.email,
          name: session.user?.name,
        },
        expires: session.expires
      } : null,
      validation: validationResult,
      env: envCheck,
      urlMismatch,
      timestamp: new Date().toISOString(),
      headers: {
        cookie: request.headers.get('cookie') ? 'present' : 'missing',
        host: request.headers.get('host'),
        origin: request.headers.get('origin')
      }
    });
  } catch (error) {
    console.error('Ошибка при проверке статуса авторизации:', error);
    
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 