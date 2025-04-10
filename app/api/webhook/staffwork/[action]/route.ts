import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { saveStaffConnection } from '@/lib/db/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  // Проверяем, что действие валидное (join или leave)
  const action = params.action;
  if (action !== 'join' && action !== 'leave') {
    return NextResponse.json({ error: 'Невалидное действие. Допустимые значения: join, leave' }, { status: 400 });
  }
  
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    
    // Проверяем наличие всех необходимых параметров
    if (!params.name || !params.timestamp) {
      return NextResponse.json({ error: 'Отсутствуют обязательные параметры: name, timestamp' }, { status: 400 });
    }
    
    // Сохраняем данные в базу
    const success = await saveStaffConnection({
      staff_name: params.name,
      action: action as 'join' | 'leave',
      timestamp: parseInt(params.timestamp)
    });
    
    if (success) {
      // Логируем успешное сохранение
      console.log(`[Webhook] Сохранено ${action === 'join' ? 'подключение' : 'отключение'} персонала: ${params.name}`);
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Ошибка при сохранении данных' }, { status: 500 });
    }
  } catch (error: any) {
    console.error(`Ошибка обработки вебхука ${action} персонала:`, error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 