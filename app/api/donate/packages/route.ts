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
    
    // Валидация данных
    if (!data.name || !data.price || !data.description || !data.group || !data.command) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }

    // Создание нового пакета
    const newPackage = await createDonatePackage({
      name: data.name,
      price: Number(data.price),
      description: data.description,
      status: data.status || 'normal',
      group: data.group,
      features: data.features || [],
      command: data.command
    });

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
    
    if (!data.id) {
      return NextResponse.json({ error: 'ID пакета не указан' }, { status: 400 });
    }

    // Обновление пакета
    const success = await updateDonatePackage(data.id, {
      name: data.name,
      price: data.price !== undefined ? Number(data.price) : undefined,
      description: data.description,
      status: data.status,
      group: data.group,
      features: data.features,
      command: data.command
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
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