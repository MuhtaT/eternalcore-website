import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isUserAdmin, getAllDonatePackages, createDonatePackage, updateDonatePackage, deleteDonatePackage } from '@/lib/db/database';

// Получить все донат-пакеты
export async function GET(request: NextRequest) {
  try {
    const packages = await getAllDonatePackages();
    return NextResponse.json(packages);
  } catch (error: any) {
    console.error('Ошибка при получении списка донат-пакетов:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при получении данных' }, { status: 500 });
  }
}

// Создать новый донат-пакет
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    const userId = Number(session.user.id);
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Получение данных из запроса
    const data = await request.json();
    
    // Логирование полученных данных
    console.log('[DEBUG API] POST /api/donate/packages данные:', JSON.stringify(data));
    
    // Валидация данных
    if (!data.name || !data.price || !data.description || !data.group || !data.command) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }

    // Обработка features - проверяем, что это строка JSON или массив
    let features = data.features;
    if (!features) {
      features = JSON.stringify(["Базовая привилегия"]);
    } else if (Array.isArray(features)) {
      features = JSON.stringify(features);
    } else if (typeof features === 'string') {
      try {
        // Проверяем, что строка - валидный JSON
        JSON.parse(features);
      } catch (e) {
        console.error('[DEBUG API] Ошибка парсинга JSON в features:', e);
        features = JSON.stringify(["Базовая привилегия"]);
      }
    }

    // Создание нового пакета
    const newPackage = await createDonatePackage({
      name: data.name,
      price: Number(data.price),
      description: data.description,
      status: data.status || 'normal',
      group: data.group,
      features: features,
      command: data.command
    });

    console.log('[DEBUG API] Создан новый донат-пакет:', JSON.stringify(newPackage));

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании донат-пакета:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при создании донат-пакета' }, { status: 500 });
  }
}

// Обновить донат-пакет
export async function PUT(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    const userId = Number(session.user.id);
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Получение данных из запроса
    const data = await request.json();
    
    // Логирование полученных данных
    console.log('[DEBUG API] PUT /api/donate/packages данные:', JSON.stringify(data));
    
    if (!data.id) {
      return NextResponse.json({ error: 'ID пакета не указан' }, { status: 400 });
    }

    // Обработка features - проверяем, что это строка JSON или массив
    let features = data.features;
    if (features !== undefined) {
      if (Array.isArray(features)) {
        features = JSON.stringify(features);
      } else if (typeof features === 'string') {
        try {
          // Проверяем, что строка - валидный JSON
          JSON.parse(features);
        } catch (e) {
          console.error('[DEBUG API] Ошибка парсинга JSON в features при обновлении:', e);
          // Если недействительный JSON, возвращаем ошибку
          return NextResponse.json({ 
            error: 'Поле features должно быть валидным JSON массивом' 
          }, { status: 400 });
        }
      }
    }

    // Обновление пакета
    const success = await updateDonatePackage(data.id, {
      name: data.name,
      price: data.price !== undefined ? Number(data.price) : undefined,
      description: data.description,
      status: data.status,
      group: data.group,
      features: features,
      command: data.command
    });

    if (success) {
      console.log(`[DEBUG API] Донат-пакет с ID ${data.id} успешно обновлен`);
      return NextResponse.json({ success: true });
    } else {
      console.log(`[DEBUG API] Донат-пакет с ID ${data.id} не найден или не был изменен`);
      return NextResponse.json({ error: 'Пакет не найден или не был изменен' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Ошибка при обновлении донат-пакета:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при обновлении донат-пакета' }, { status: 500 });
  }
}

// Удалить донат-пакет
export async function DELETE(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    const userId = Number(session.user.id);
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Получение ID из запроса
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID пакета не указан' }, { status: 400 });
    }

    // Удаление пакета
    const success = await deleteDonatePackage(Number(id));

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Пакет не найден' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Ошибка при удалении донат-пакета:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при удалении донат-пакета' }, { status: 500 });
  }
} 