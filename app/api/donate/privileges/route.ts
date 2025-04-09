import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isUserAdmin, getAllPrivileges, createPrivilege, updatePrivilege, deletePrivilege } from '@/lib/db/database';

// Получить все привилегии
export async function GET(request: NextRequest) {
  try {
    const privileges = await getAllPrivileges();
    return NextResponse.json(privileges);
  } catch (error: any) {
    console.error('Ошибка при получении списка привилегий:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при получении данных' }, { status: 500 });
  }
}

// Создать новую привилегию
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
    if (!data.name || !data.type || !data.description || !data.permission || !data.command) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }

    // Создание новой привилегии
    const newPrivilege = await createPrivilege({
      name: data.name,
      type: data.type,
      description: data.description,
      permission: data.permission,
      command: data.command
    });

    return NextResponse.json(newPrivilege, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка при создании привилегии:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при создании привилегии' }, { status: 500 });
  }
}

// Обновить привилегию
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
      return NextResponse.json({ error: 'ID привилегии не указан' }, { status: 400 });
    }

    // Обновление привилегии
    const success = await updatePrivilege(data.id, {
      name: data.name,
      type: data.type,
      description: data.description,
      permission: data.permission,
      command: data.command
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Привилегия не найдена или не была изменена' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Ошибка при обновлении привилегии:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при обновлении привилегии' }, { status: 500 });
  }
}

// Удалить привилегию
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
      return NextResponse.json({ error: 'ID привилегии не указан' }, { status: 400 });
    }

    // Удаление привилегии
    const success = await deletePrivilege(Number(id));

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Привилегия не найдена' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Ошибка при удалении привилегии:', error);
    return NextResponse.json({ error: error.message || 'Ошибка при удалении привилегии' }, { status: 500 });
  }
} 