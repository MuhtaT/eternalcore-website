'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  ChevronDown, 
  Ban, 
  AlertCircle, 
  XCircle 
} from 'lucide-react';
import { useError } from '@/lib/contexts/error-context';

interface AnticheatDetection {
  id: number;
  player?: string;
  detection_type?: string;
  type?: string;
  description: string;
  level: number;
  timestamp: number;
  action: string;
  created_at: string;
}

export function AnticheatPanel() {
  const [detections, setDetections] = useState<AnticheatDetection[]>([]);
  const [loading, setLoading] = useState(true);
  const [anticheatFilter, setAnticheatFilter] = useState('all');
  const { showError, showSuccess } = useError();

  // Функция для загрузки данных античита
  const fetchAnticheatData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/server/stats/anticheat');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные античита');
      }
      
      const data = await response.json();
      setDetections(data.detections || []);
    } catch (error: any) {
      console.error('Ошибка при получении данных античита:', error);
      showError({
        type: 'general',
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить данные античита',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchAnticheatData();
  }, []);

  // Обработчик действий с детектом античита
  const handleAnticheatAction = (id: number, action: 'ban' | 'warn' | 'ignore') => {
    let message = '';
    switch (action) {
      case 'ban':
        message = 'Игрок успешно забанен за использование читов';
        break;
      case 'warn':
        message = 'Игроку выдано предупреждение';
        break;
      case 'ignore':
        message = 'Срабатывание античита помечено как ложное';
        break;
    }
    
    showSuccess({
      type: 'success',
      title: 'Действие выполнено',
      message,
      variant: 'default'
    });
  };

  // Форматирование времени
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Фильтрация детектов по уровню
  const filteredDetections = detections.filter(detection => {
    if (anticheatFilter === 'all') return true;
    if (anticheatFilter === 'high' && detection.level >= 8) return true;
    if (anticheatFilter === 'medium' && detection.level >= 5 && detection.level < 8) return true;
    if (anticheatFilter === 'low' && detection.level < 5) return true;
    return false;
  });

  return (
    <Card className="border-[#DF2456]/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Детекты античита</CardTitle>
          <div className="flex space-x-2">
            <select 
              className="rounded-md border border-[#DF2456]/30 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB0D68]"
              value={anticheatFilter}
              onChange={(e) => setAnticheatFilter(e.target.value)}
            >
              <option value="all">Все уровни</option>
              <option value="high">Высокий уровень</option>
              <option value="medium">Средний уровень</option>
              <option value="low">Низкий уровень</option>
            </select>
            <Button 
              variant="outline" 
              className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
              onClick={fetchAnticheatData}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              Обновить
            </Button>
          </div>
        </div>
        <CardDescription>
          Последние срабатывания античита на сервере
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#DF2456]/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Игрок</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Уровень</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead className="text-right">Подробности</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin mr-2" />
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDetections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    {detections.length === 0 ? 
                      'Нет данных о детектах античита' : 
                      'Нет детектов, соответствующих выбранному фильтру'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDetections.map((detection) => (
                  <TableRow key={detection.id}>
                    <TableCell className="font-medium">{detection.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                            {(detection.player ? detection.player : detection.type || 'АЧ').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{detection.player || detection.type || 'Неизвестно'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{detection.detection_type || detection.type}</TableCell>
                    <TableCell>{detection.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        detection.level >= 8 
                          ? 'bg-red-500/10 text-red-500' 
                          : detection.level >= 5 
                            ? 'bg-yellow-500/10 text-yellow-500' 
                            : 'bg-green-500/10 text-green-500'
                      }`}>
                        {detection.level >= 8 
                          ? 'Высокий' 
                          : detection.level >= 5 
                            ? 'Средний' 
                            : 'Низкий'}
                      </span>
                    </TableCell>
                    <TableCell>{formatTimestamp(detection.timestamp)}</TableCell>
                    <TableCell>{detection.action}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-[#DF2456]/30">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAnticheatAction(detection.id, 'ban')}>
                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                            <span>Забанить игрока</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAnticheatAction(detection.id, 'warn')}>
                            <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>Выдать предупреждение</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAnticheatAction(detection.id, 'ignore')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            <span>Пометить как ложное</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 