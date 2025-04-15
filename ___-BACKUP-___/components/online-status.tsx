'use client';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOnlinePlayerCount } from '@/lib/services/minecraft-api';

export function OnlineStatus() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        setLoading(true);
        const count = await getOnlinePlayerCount();
        setOnlineCount(count);
        setError(false);
      } catch (err) {
        console.error('Ошибка при получении количества игроков онлайн:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Получаем данные при загрузке компонента
    fetchOnlineCount();

    // Обновляем данные каждые 60 секунд
    const intervalId = setInterval(fetchOnlineCount, 60 * 1000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
      <div className={`mr-1.5 h-2 w-2 rounded-full ${error ? 'bg-red-500' : loading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
      <span className="flex items-center">
        <Users className="h-3 w-3 mr-1" />
        Онлайн: {onlineCount === null ? '...' : onlineCount}
      </span>
    </div>
  );
} 