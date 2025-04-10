import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { saveServerOnline } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    
    // Проверяем наличие всех необходимых параметров
    if (!params.online) {
      return NextResponse.json({ error: 'Отсутствует обязательный параметр: online' }, { status: 400 });
    }
    
    // Используем текущее время, если timestamp не указан
    const timestamp = params.timestamp ? parseInt(params.timestamp) : Math.floor(Date.now() / 1000);
    
    // Сохраняем данные в базу
    const success = await saveServerOnline({
      online_players: parseInt(params.online),
      timestamp: timestamp
    });
    
    if (success) {
      // Логируем успешное сохранение
      console.log(`[Webhook] Сохранена метрика онлайна: ${params.online} игроков`);
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Ошибка обработки вебхука метрик онлайна:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 