import { NextRequest, NextResponse } from 'next/server';
import { getServerOnlineMetrics } from '@/lib/db/database';

// Публичный API endpoint для получения количества онлайн игроков
export async function GET(request: NextRequest) {
  try {
    // Получаем метрики онлайна за последние 24 часа
    const metrics = await getServerOnlineMetrics(24);
    
    // Если нет данных, возвращаем пустой результат
    if (!metrics || metrics.length === 0) {
      return NextResponse.json({ 
        online: 0,
        history: []
      });
    }
    
    // Получаем последнее значение онлайна
    const lastMetric = metrics[metrics.length - 1];
    const currentOnline = lastMetric.online_players;
    
    // Форматируем историю для графика (последние 24 точки с интервалом в 1 час)
    const history = metrics.map(metric => ({
      time: metric.timestamp,
      players: metric.online_players
    }));
    
    return NextResponse.json({
      online: currentOnline,
      history: history,
      last_update: lastMetric.timestamp
    });
  } catch (error: any) {
    console.error('Ошибка при получении данных онлайна:', error);
    return NextResponse.json({ 
      error: error.message || 'Внутренняя ошибка сервера',
      online: 0,
      history: []
    }, { status: 500 });
  }
} 