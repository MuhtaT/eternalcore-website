import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { unlinkMinecraftAccount } from '@/lib/db/database';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Проверяем, авторизован ли пользователь
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Отвязываем аккаунт
    const userId = parseInt(session.user.id);
    const isUnlinked = await unlinkMinecraftAccount(userId);
    
    if (!isUnlinked) {
      return NextResponse.json({ 
        success: false, 
        message: 'У вас нет привязанного аккаунта Minecraft'
      });
    }
    
    // Возвращаем успешный результат
    return NextResponse.json({
      success: true,
      message: 'Аккаунт успешно отвязан'
    });
    
  } catch (error: any) {
    console.error('Ошибка при отвязке аккаунта:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отвязке аккаунта. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 