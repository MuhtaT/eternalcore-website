import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isUserAdmin } from '@/lib/db/database';

// API маршрут для перевалидации страницы по указанному пути
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    const userId = Number(session.user.id);
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Получение пути из запроса
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Путь для обновления не указан' }, { status: 400 });
    }

    // Перевалидация указанного пути
    revalidatePath(path);
    
    // Логирование успешной перевалидации
    console.log(`[Revalidation] Путь ${path} успешно перевалидирован администратором ${session.user.name || session.user.email}`);

    return NextResponse.json({ 
      success: true, 
      message: `Путь ${path} успешно обновлен` 
    });
  } catch (error: any) {
    console.error('Ошибка при перевалидации пути:', error);
    return NextResponse.json({ 
      error: error.message || 'Произошла ошибка при обновлении страницы' 
    }, { status: 500 });
  }
} 