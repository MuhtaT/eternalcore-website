import { NextRequest, NextResponse } from 'next/server';
import { updateMinecraftAccountData } from '@/lib/db/database';
import { verifyWebhookRequest } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    // Проверяем, что запрос от авторизованного сервера Minecraft
    const isValidRequest = verifyWebhookRequest(request);
    
    if (!isValidRequest) {
      return NextResponse.json({ error: 'Недействительный запрос' }, { status: 401 });
    }
    
    // Получаем данные из запроса
    const data = await request.json();
    const { minecraft_username, ...accountData } = data;
    
    if (!minecraft_username) {
      return NextResponse.json({ error: 'Отсутствует имя пользователя Minecraft' }, { status: 400 });
    }
    
    // Обновляем данные аккаунта
    const isUpdated = await updateMinecraftAccountData(minecraft_username, accountData);
    
    if (!isUpdated) {
      return NextResponse.json({ 
        success: false, 
        message: 'Не удалось обновить данные аккаунта или аккаунт не найден'
      });
    }
    
    // Возвращаем успешный результат
    return NextResponse.json({
      success: true,
      message: 'Данные аккаунта успешно обновлены'
    });
    
  } catch (error: any) {
    console.error('Ошибка при обновлении данных аккаунта:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении данных. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 