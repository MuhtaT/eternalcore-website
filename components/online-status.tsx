'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export function OnlineStatus() {
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
    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
      <div className={`mr-1.5 h-2 w-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></div>
      {loading ? (
        <span className="animate-pulse">Загрузка...</span>
      ) : error ? (
        <span>Ошибка загрузки</span>
      ) : (
        <span className="flex items-center">
          <Users className="h-3 w-3 mr-1" />
          Онлайн: {online || 0}
        </span>
      )}
    </div>
  );
} 