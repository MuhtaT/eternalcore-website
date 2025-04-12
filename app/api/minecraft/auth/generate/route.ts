import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateAuthCode } from '@/lib/db/database';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

// Схема валидации для запроса генерации кода
const generateCodeSchema = z.object({
  minecraft_username: z.string()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(16, 'Никнейм не может быть длиннее 16 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Никнейм может содержать только латинские буквы, цифры и символ подчеркивания')
});

export async function POST(request: NextRequest) {
  try {
    // Проверяем, авторизован ли пользователь
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Получаем данные из запроса
    const data = await request.json();
    
    // Валидируем данные
    const validationResult = generateCodeSchema.safeParse(data);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      const errorMessage = formattedErrors.minecraft_username?._errors[0] || 'Ошибка валидации данных';
      
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    const { minecraft_username } = validationResult.data;
    
    // Генерируем код авторизации
    const userId = parseInt(session.user.id);
    const authCode = await generateAuthCode(userId, minecraft_username);
    
    // Возвращаем код пользователю
    return NextResponse.json({
      success: true,
      code: authCode,
      minecraft_username,
      expires_in: 15 * 60 // 15 минут в секундах
    });
    
  } catch (error: any) {
    console.error('Ошибка при генерации кода авторизации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при генерации кода. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 