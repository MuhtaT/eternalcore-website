import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { saveServerLog } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    
    // Проверяем наличие всех необходимых параметров
    if (!params.type || !params.timestamp) {
      return NextResponse.json({ error: 'Отсутствуют обязательные параметры: type, timestamp' }, { status: 400 });
    }
    
    const logData = {
      log_type: params.type,
      timestamp: parseInt(params.timestamp)
    };
    
    // Если это лог авторизации, добавляем дополнительные данные
    if (params.type === 'auth') {
      if (!params.player || !params.auth_type) {
        return NextResponse.json({ 
          error: 'Для логов авторизации необходимы параметры: player, auth_type' 
        }, { status: 400 });
      }
      
      Object.assign(logData, {
        player_name: params.player,
        auth_type: params.auth_type
      });
    }
    // Если это лог консоли, добавляем сообщение
    else if (params.type === 'console') {
      if (!params.message) {
        return NextResponse.json({ 
          error: 'Для логов консоли необходим параметр: message' 
        }, { status: 400 });
      }
      
      Object.assign(logData, {
        message: params.message
      });
    }
    
    // Сохраняем данные в базу
    const success = await saveServerLog(logData);
    
    if (success) {
      // Логируем успешное сохранение
      console.log(`[Webhook] Сохранен лог сервера: ${params.type}`);
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Ошибка обработки вебхука логов сервера:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 