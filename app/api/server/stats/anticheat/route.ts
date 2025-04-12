import { NextRequest, NextResponse } from 'next/server';
import { getAnticheatDetections } from '@/lib/db/database';

// Публичный API endpoint для получения статистики детектов античита
export async function GET(request: NextRequest) {
  try {
    // Получаем детекты за последнее время (ограничиваем количество)
    const detections = await getAnticheatDetections(50);
    
    // Если нет данных, возвращаем пустой результат
    if (!detections || detections.length === 0) {
      return NextResponse.json({ 
        count: 0,
        detections: [],
        types: {}
      });
    }
    
    // Подсчитываем количество детектов по типам
    const typeCount: Record<string, number> = {};
    detections.forEach(detection => {
      const type = detection.detection_type;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    // Форматируем данные для отображения
    // Убираем лишнюю информацию для публичного API
    const formattedDetections = detections.map(detection => ({
      id: detection.id,
      type: detection.detection_type,
      level: detection.level,
      timestamp: detection.timestamp,
      action: detection.action
    }));
    
    return NextResponse.json({
      count: detections.length,
      detections: formattedDetections,
      types: typeCount
    });
  } catch (error: any) {
    console.error('Ошибка при получении данных античита:', error);
    return NextResponse.json({ 
      error: error.message || 'Внутренняя ошибка сервера',
      count: 0,
      detections: [],
      types: {}
    }, { status: 500 });
  }
} 