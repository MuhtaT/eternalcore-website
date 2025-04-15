import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Пустая функция middleware, так как бекэнд удален
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Очищаем список путей, для которых запускается middleware
export const config = {
  matcher: [],
}; 