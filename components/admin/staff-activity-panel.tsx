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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { useError } from '@/lib/contexts/error-context';

interface StaffActivityData {
  staff: Record<string, {
    name: string;
    actions: number;
    connections: { join: number; leave: number };
  }>;
  recent_activity: Array<{
    id: number;
    staff: string;
    action: string;
    target?: string;
    timestamp: number;
  }>;
  activity_count: number;
  connections_count: number;
}

export function StaffActivityPanel() {
  const [staffData, setStaffData] = useState<StaffActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'all'>('week');
  const { showError, showSuccess } = useError();

  // Функция для загрузки данных активности персонала
  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/server/stats/staff');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные активности персонала');
      }
      
      const data = await response.json();
      setStaffData(data);
      
      showSuccess({
        type: 'success',
        title: 'Статистика обновлена',
        message: `Загружена статистика за период: ${activeTab === 'week' ? 'неделя' : activeTab === 'month' ? 'месяц' : 'все время'}`,
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Ошибка при получении данных активности персонала:', error);
      showError({
        type: 'general',
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить данные активности персонала',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента и при изменении периода
  useEffect(() => {
    fetchStaffData();
  }, [activeTab]);

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

  return (
    <Card className="border-[#DF2456]/30 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Активность персонала</CardTitle>
          <div className="flex space-x-2">
            <Tabs 
              defaultValue="week" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'week' | 'month' | 'all')}
              className="w-auto"
            >
              <TabsList className="bg-background border border-[#DF2456]/20">
                <TabsTrigger value="week">Неделя</TabsTrigger>
                <TabsTrigger value="month">Месяц</TabsTrigger>
                <TabsTrigger value="all">Все время</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button 
              variant="outline" 
              className="border-[#DF2456]/30 hover:bg-[#DF2456]/10"
              onClick={fetchStaffData}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              Обновить
            </Button>
          </div>
        </div>
        <CardDescription>
          Статистика активности модераторов и администраторов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[#DF2456]/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Модератор/Админ</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Действий</TableHead>
                <TableHead>Входов</TableHead>
                <TableHead>Выходов</TableHead>
                <TableHead>Всего действий</TableHead>
                <TableHead>Последняя активность</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin mr-2" />
                      Загрузка...
                    </div>
                  </TableCell>
                </TableRow>
              ) : !staffData || Object.keys(staffData.staff).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Нет данных об активности персонала
                  </TableCell>
                </TableRow>
              ) : (
                Object.values(staffData.staff).map((staff) => {
                  const totalActions = staff.actions + staff.connections.join + staff.connections.leave;
                  // Получаем самую последнюю активность для этого сотрудника
                  const lastActivity = staffData.recent_activity.find(act => act.staff === staff.name);
                  
                  return (
                    <TableRow key={staff.name}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white text-xs">
                              {staff.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                          Администратор
                        </span>
                      </TableCell>
                      <TableCell>{staff.actions}</TableCell>
                      <TableCell>{staff.connections.join}</TableCell>
                      <TableCell>{staff.connections.leave}</TableCell>
                      <TableCell className="font-medium">{totalActions}</TableCell>
                      <TableCell>
                        {lastActivity 
                          ? formatTimestamp(lastActivity.timestamp)
                          : 'Нет данных'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Раздел с последними действиями персонала */}
        {staffData && staffData.recent_activity.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Последние действия персонала</h3>
            <div className="rounded-md border border-[#DF2456]/20">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Сотрудник</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Цель</TableHead>
                    <TableHead>Дата и время</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData.recent_activity.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.staff}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.target || '—'}</TableCell>
                      <TableCell>{formatTimestamp(activity.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 