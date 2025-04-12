'use client';

import { useState, useEffect } from 'react';
import { Users, Server } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ServerStatusProps {
  className?: string;
}

export function ServerStatus({ className }: ServerStatusProps) {
  const [online, setOnline] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServerStatus() {
      try {
        setLoading(true);
        const response = await fetch('/api/server/stats/online');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить статус сервера');
        }
        
        const data = await response.json();
        setOnline(data.online);
        setError(null);
      } catch (err) {
        console.error('Ошибка при получении статуса сервера:', err);
        setError('Не удалось загрузить статус сервера');
      } finally {
        setLoading(false);
      }
    }

    fetchServerStatus();
    
    // Обновляем данные каждую минуту
    const interval = setInterval(fetchServerStatus, 60000);
    
    return () => clearInterval(interval);
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
          {loading ? (
            <Badge className="bg-muted text-muted-foreground animate-pulse">
              Загрузка...
            </Badge>
          ) : error ? (
            <Badge variant="destructive">
              Ошибка
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] hover:from-[#DF2456]/90 hover:to-[#FB0D68]/90">
              <Users className="h-3 w-3 mr-1" />
              {online} игроков
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 