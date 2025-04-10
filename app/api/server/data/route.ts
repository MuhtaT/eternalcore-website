import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookRequest, decodeRequestParams } from '@/lib/api-auth';
import { 
  getAllDonatePackages, 
  getAllPrivileges,
  getServerOnlineMetrics,
  getAnticheatDetections,
  getStaffActivity,
  getStaffConnections
} from '@/lib/db/database';

export async function GET(request: NextRequest) {
  // Проверяем подлинность запроса
  if (!verifyWebhookRequest(request)) {
    return NextResponse.json({ error: 'Неавторизованный запрос' }, { status: 401 });
  }
  
  try {
    // Получаем параметры запроса
    const params = decodeRequestParams(request);
    const dataType = params.type || 'all';
    
    let responseData: any = {};
    
    switch (dataType) {
      case 'donate_packages':
        responseData = { donate_packages: await getAllDonatePackages() };
        break;
        
      case 'privileges':
        responseData = { privileges: await getAllPrivileges() };
        break;
        
      case 'online_metrics':
        const hours = params.hours ? parseInt(params.hours) : 24;
        responseData = { online_metrics: await getServerOnlineMetrics(hours) };
        break;
        
      case 'anticheat':
        const acLimit = params.limit ? parseInt(params.limit) : 100;
        responseData = { anticheat_detections: await getAnticheatDetections(acLimit) };
        break;
        
      case 'staff_activity':
        const saLimit = params.limit ? parseInt(params.limit) : 100;
        responseData = { staff_activity: await getStaffActivity(saLimit) };
        break;
        
      case 'staff_connections':
        const scLimit = params.limit ? parseInt(params.limit) : 100;
        responseData = { staff_connections: await getStaffConnections(scLimit) };
        break;
        
      case 'all':
      default:
        // Получаем все доступные данные
        responseData = {
          donate_packages: await getAllDonatePackages(),
          privileges: await getAllPrivileges(),
          online_metrics: await getServerOnlineMetrics(12), // За последние 12 часов
          anticheat_detections: await getAnticheatDetections(20), // Последние 20 детектов
          staff_activity: await getStaffActivity(20), // Последняя активность персонала (20 записей)
          staff_connections: await getStaffConnections(20) // Последние подключения персонала (20 записей)
        };
        break;
    }
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Ошибка при обработке запроса данных от сервера:', error);
    return NextResponse.json({ error: error.message || 'Внутренняя ошибка сервера' }, { status: 500 });
  }
} 