import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { saveStaffActivity } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    
    // Проверяем наличие всех необходимых параметров
    const requiredFields = ['type', 'staff', 'target', 'timestamp'];
    for (const field of requiredFields) {
      if (!params[field]) {
        return NextResponse.json({ error: `Отсутствует обязательный параметр: ${field}` }, { status: 400 });
      }
    }
    
    // Сохраняем данные в базу
    const success = await saveStaffActivity({
      staff_name: params.staff,
      action_type: params.type,
      target_player: params.target,
      duration: params.duration,
      reason: params.reason,
      timestamp: parseInt(params.timestamp)
    });
    
    if (success) {
      // Логируем успешное сохранение
      console.log(`[Webhook] Сохранена активность персонала: ${params.staff} ${params.type} ${params.target}`);
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Ошибка обработки вебхука активности персонала:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 