import { NextRequest, NextResponse } from 'next/server';
import { verifyAndLinkMinecraftAccount } from '@/lib/db/database';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    // Проверяем, что запрос от авторизованного сервера Minecraft
    const isValidRequest = verifyWebhookRequest(request);
    
    if (!isValidRequest) {
      return NextResponse.json({ error: 'Недействительный запрос' }, { status: 401 });
    }
    
    // Получаем параметры из запроса
    const params = decodeRequestParams(request);
    const { code, username } = params;
    
    if (!code || !username) {
      return NextResponse.json({ error: 'Отсутствуют обязательные параметры' }, { status: 400 });
    }
    
    // Проверяем код и привязываем аккаунт
    const isLinked = await verifyAndLinkMinecraftAccount(code, username);
    
    if (!isLinked) {
      return NextResponse.json({ 
        success: false, 
        message: 'Недействительный код авторизации или время его действия истекло'
      });
    }
    
    // Возвращаем успешный результат
    return NextResponse.json({
      success: true,
      message: 'Аккаунт успешно привязан'
    });
    
  } catch (error: any) {
    console.error('Ошибка при верификации кода авторизации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при верификации кода. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 