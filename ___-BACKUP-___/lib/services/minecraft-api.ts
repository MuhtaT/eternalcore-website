/**
 * Утилиты для работы с API Minecraft сервера
 */

/**
 * Получение количества игроков онлайн
 * @returns количество игроков онлайн или null в случае ошибки
 */
export async function getOnlinePlayerCount(): Promise<number | null> {
  try {
    const response = await fetch('/api/minecraft/online', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Не кэшируем запрос на стороне браузера, используем наш серверный кэш
      cache: 'no-store',
      next: { revalidate: 30 }, // Ревалидация каждые 30 секунд (если используется App Router)
    });

    if (!response.ok) {
      console.error('Ошибка при получении количества игроков онлайн:', response.status);
      return null;
    }

    const data = await response.json();
    return data.online;
  } catch (error) {
    console.error('Ошибка при получении количества игроков онлайн:', error);
    return null;
  }
}

/**
 * Хук для отправки команды на сервер Minecraft
 * Будет реализован позже при разработке функционала доната
 */
export async function sendMinecraftCommand(command: string, playerName: string): Promise<boolean> {
  // TODO: Реализовать в следующем этапе разработки
  console.log('Отправка команды на сервер:', command, 'для игрока:', playerName);
  return false;
} 