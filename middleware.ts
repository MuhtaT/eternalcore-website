import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Эта функция позволяет добавить необходимые заголовки для корректной работы NextAuth с cookie
export function middleware(request: NextRequest) {
  // Клонируем ответ, чтобы модифицировать его
  const response = NextResponse.next();

  // Добавляем заголовки для решения проблем с cookie
  response.headers.set('set-cookie-fix', 'middleware-applied');

  // Отладочная информация в консоли
  console.log('Middleware запущен для URL:', request.url);
  console.log('Cookie в запросе:', request.cookies.getAll());

  return response;
}

// Указываем, для каких путей запускать middleware
export const config = {
  matcher: [
    /*
     * Обрабатываем пути API для NextAuth и страницы, где нужна авторизация
     */
    '/api/auth/:path*',
    '/profile/:path*',
    '/login',
  ],
}; 