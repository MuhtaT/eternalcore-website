import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { saveAnticheatDetection } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    
    // Проверяем наличие всех необходимых параметров
    const requiredFields = ['player', 'type', 'description', 'level', 'timestamp', 'action'];
    for (const field of requiredFields) {
      if (!params[field]) {
        return NextResponse.json({ error: `Отсутствует обязательный параметр: ${field}` }, { status: 400 });
      }
    }
    
    // Сохраняем данные в базу
    const success = await saveAnticheatDetection({
      player: params.player,
      detection_type: params.type,
      description: params.description,
      level: parseInt(params.level),
      timestamp: parseInt(params.timestamp),
      action: params.action
    });
    
    if (success) {
      // Логируем успешное сохранение
      console.log(`[Webhook] Сохранен детект античита для игрока ${params.player}: ${params.type}`);
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Ошибка обработки вебхука античита:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 