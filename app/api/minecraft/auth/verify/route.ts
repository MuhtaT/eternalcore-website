import { NextRequest, NextResponse } from 'next/server';
import { verifyAndLinkMinecraftAccount } from '@/lib/db/database';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    console.log('[Verify API] Received request'); // Log start
    // Проверяем, что запрос от авторизованного сервера Minecraft
    const isValidRequest = verifyWebhookRequest(request);
    console.log(`[Verify API] Request validity: ${isValidRequest}`); // Log validity
    
    if (!isValidRequest) {
      console.log('[Verify API] Invalid request signature/timestamp');
      return NextResponse.json({ error: 'Недействительный запрос' }, { status: 401 });
    }
    
    // Получаем параметры из запроса
    const params = decodeRequestParams(request);
    const { code, username } = params;
    console.log(`[Verify API] Decoded params: code=${code}, username=${username}`); // Log params
    
    if (!code || !username) {
      console.log('[Verify API] Missing required parameters');
      return NextResponse.json({ error: 'Отсутствуют обязательные параметры' }, { status: 400 });
    }
    
    // Проверяем код и привязываем аккаунт
    console.log('[Verify API] Calling verifyAndLinkMinecraftAccount...');
    const isLinked = await verifyAndLinkMinecraftAccount(code, username);
    console.log(`[Verify API] verifyAndLinkMinecraftAccount result: ${isLinked}`); // Log result
    
    if (!isLinked) {
      console.log('[Verify API] Linking failed (code invalid/expired/not found)');
      // Важно: Возвращаем 200 OK со статусом false, а не ошибку сервера
      return NextResponse.json({
        success: false,
        message: 'Недействительный код авторизации или время его действия истекло'
      });
    }
    
    // Возвращаем успешный результат
    console.log('[Verify API] Linking successful');
    return NextResponse.json({
      success: true,
      message: 'Аккаунт успешно привязан'
    });
    
  } catch (error: any) {
    // Log the specific error causing the 500
    console.error('!!! [Verify API] Critical error during verification:', error);
    // Добавляем больше деталей об ошибке
    if (error instanceof Error) {
      console.error('!!! Error Name:', error.name);
      console.error('!!! Error Message:', error.message);
      console.error('!!! Error Stack:', error.stack);
    } else {
      console.error('!!! Caught non-Error object:', error);
    }
    return NextResponse.json(
      { error: 'Произошла ошибка при верификации кода. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 