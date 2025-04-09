import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isUserAdmin, updateUserRole } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  try {
    // Проверяем сессию для авторизации
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    // Проверяем, является ли текущий пользователь администратором
    const currentUserId = Number(session.user.id);
    const isAdmin = await isUserAdmin(currentUserId);
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав для выполнения операции' }, { status: 403 });
    }
    
    // Получаем данные из запроса
    const body = await request.json();
    const { userId, role } = body;
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'Отсутствуют необходимые параметры' }, { status: 400 });
    }
    
    // Проверяем валидность роли
    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json({ error: 'Указана недопустимая роль' }, { status: 400 });
    }
    
    // Предотвращаем изменение роли самому себе
    if (userId === currentUserId) {
      return NextResponse.json({ error: 'Вы не можете изменить свою собственную роль' }, { status: 400 });
    }
    
    // Обновляем роль пользователя
    const success = await updateUserRole(userId, role);
    
    if (!success) {
      return NextResponse.json({ error: 'Не удалось обновить роль пользователя' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: `Роль пользователя успешно изменена на ${role}` });
    
  } catch (error: any) {
    console.error('Ошибка при обновлении роли пользователя:', error);
    return NextResponse.json(
      { error: error.message || 'Произошла ошибка при обновлении роли пользователя' }, 
      { status: 500 }
    );
  }
} 