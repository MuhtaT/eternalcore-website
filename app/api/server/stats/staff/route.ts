import { NextRequest, NextResponse } from 'next/server';
import { getStaffActivity, getStaffConnections } from '@/lib/db/database';

// Публичный API endpoint для получения статистики персонала
export async function GET(request: NextRequest) {
  try {
    // Получаем активность персонала (последние 100 действий)
    const activity = await getStaffActivity(100);
    // Получаем логи подключений персонала (последние 100 записей)
    const connections = await getStaffConnections(100);
    
    // Если нет данных, возвращаем пустой результат
    if ((!activity || activity.length === 0) && (!connections || connections.length === 0)) {
      return NextResponse.json({ 
        activity_count: 0,
        connections_count: 0,
        staff: {},
        recent_activity: []
      });
    }
    
    // Подсчитываем статистику по каждому сотруднику
    const staffStats: Record<string, {
      name: string,
      actions: number,
      connections: { join: number, leave: number }
    }> = {};
    
    // Обрабатываем активность
    activity.forEach(record => {
      const name = record.staff_name;
      if (!staffStats[name]) {
        staffStats[name] = {
          name,
          actions: 0,
          connections: { join: 0, leave: 0 }
        };
      }
      staffStats[name].actions++;
    });
    
    // Обрабатываем подключения
    connections.forEach(record => {
      const name = record.staff_name;
      if (!staffStats[name]) {
        staffStats[name] = {
          name,
          actions: 0,
          connections: { join: 0, leave: 0 }
        };
      }
      if (record.action === 'join') {
        staffStats[name].connections.join++;
      } else if (record.action === 'leave') {
        staffStats[name].connections.leave++;
      }
    });
    
    // Получаем последние 10 действий персонала для отображения
    const recentActivity = activity.slice(0, 10).map(record => ({
      id: record.id,
      staff: record.staff_name,
      action: record.action_type,
      target: record.target_player,
      timestamp: record.timestamp
    }));
    
    return NextResponse.json({
      activity_count: activity.length,
      connections_count: connections.length,
      staff: staffStats,
      recent_activity: recentActivity
    });
  } catch (error: any) {
    console.error('Ошибка при получении данных активности персонала:', error);
    return NextResponse.json({ 
      error: error.message || 'Внутренняя ошибка сервера',
      activity_count: 0,
      connections_count: 0,
      staff: {},
      recent_activity: []
    }, { status: 500 });
  }
} 