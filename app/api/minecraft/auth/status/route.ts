import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserMinecraftAccount } from '@/lib/db/database';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Проверяем, авторизован ли пользователь
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Получаем информацию о привязанном аккаунте
    const userId = parseInt(session.user.id);
    const minecraftAccount = await getUserMinecraftAccount(userId);
    
    // Возвращаем статус привязки
    return NextResponse.json({
      linked: !!minecraftAccount,
      account: minecraftAccount ? {
        minecraft_username: minecraftAccount.minecraft_username,
        last_online: minecraftAccount.last_online,
        playtime_minutes: minecraftAccount.playtime_minutes,
        achievements_count: minecraftAccount.achievements_count,
        balance: minecraftAccount.balance,
        privilege: minecraftAccount.privilege,
        total_donated: minecraftAccount.total_donated
      } : null
    });
    
  } catch (error: any) {
    console.error('Ошибка при получении статуса привязки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении статуса привязки. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 