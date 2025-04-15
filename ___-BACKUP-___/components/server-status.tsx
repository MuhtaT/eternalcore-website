'use client';

import { Users, Server } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';
import { getOnlinePlayerCount } from '@/lib/services/minecraft-api';

interface ServerStatusProps {
  className?: string;
}

export function ServerStatus({ className }: ServerStatusProps) {
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
    <Card className={`overflow-hidden border-[#DF2456]/20 ${className}`}>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-1.5">
            <Server className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Сейчас играют:</span>
        </div>
        
        <div>
          <Badge className={`${error ? 'bg-red-500' : loading ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#DF2456] to-[#FB0D68]'} hover:from-[#DF2456]/90 hover:to-[#FB0D68]/90`}>
            <Users className="h-3 w-3 mr-1" />
            {onlineCount === null ? '...' : `${onlineCount} игроков`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
} 