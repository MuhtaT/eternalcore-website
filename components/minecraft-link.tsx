'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Check, X, GamepadIcon } from 'lucide-react';
import { useError } from '@/lib/contexts/error-context';

// Тип для данных аккаунта Minecraft
interface MinecraftAccountData {
  minecraft_username: string;
  last_online?: number;
  playtime_minutes: number;
  achievements_count: number;
  balance: number;
  privilege?: string;
  total_donated: number;
}

// Тип для props компонента
interface MinecraftLinkProps {
  onStatusChange?: (linked: boolean) => void;
}

export function MinecraftLink({ onStatusChange }: MinecraftLinkProps) {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [linked, setLinked] = useState(false);
  const [account, setAccount] = useState<MinecraftAccountData | null>(null);
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [authCode, setAuthCode] = useState<string | null>(null);
  const { showError, showSuccess } = useError();

  // Загружаем статус привязки при монтировании компонента
  useEffect(() => {
    fetchLinkStatus();
  }, []);

  // Функция для получения статуса привязки
  const fetchLinkStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/minecraft/auth/status');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить статус привязки');
      }
      
      const data = await response.json();
      setLinked(data.linked);
      setAccount(data.account);
      
      // Вызываем callback, если он предоставлен
      if (onStatusChange) {
        onStatusChange(data.linked);
      }
    } catch (error) {
      console.error('Ошибка при получении статуса привязки:', error);
      showError({
        type: 'auth',
        title: 'Ошибка загрузки',
        message: 'Не удалось загрузить статус привязки аккаунта',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для генерации кода авторизации
  const generateAuthCode = async () => {
    if (!minecraftUsername.trim()) {
      showError({
        type: 'validation',
        title: 'Ошибка',
        message: 'Введите никнейм в Minecraft',
        variant: 'destructive'
      });
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/minecraft/auth/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ minecraft_username: minecraftUsername })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось сгенерировать код авторизации');
      }
      
      const data = await response.json();
      setAuthCode(data.code);
      
      showSuccess({
        type: 'success',
        title: 'Код сгенерирован',
        message: `Введите команду "/webauth ${data.code}" в игре для завершения привязки`,
        variant: 'default'
      });
    } catch (error: any) {
      console.error('Ошибка при генерации кода:', error);
      showError({
        type: 'auth',
        title: 'Ошибка',
        message: error.message || 'Не удалось сгенерировать код авторизации',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  // Функция для отвязки аккаунта
  const unlinkAccount = async () => {
    if (!confirm('Вы уверены, что хотите отвязать аккаунт Minecraft?')) {
      return;
    }

    try {
      setUnlinking(true);
      const response = await fetch('/api/minecraft/auth/unlink', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось отвязать аккаунт');
      }
      
      showSuccess({
        type: 'success',
        title: 'Аккаунт отвязан',
        message: 'Ваш аккаунт Minecraft успешно отвязан',
        variant: 'default'
      });
      
      setLinked(false);
      setAccount(null);
      
      // Вызываем callback, если он предоставлен
      if (onStatusChange) {
        onStatusChange(false);
      }
    } catch (error: any) {
      console.error('Ошибка при отвязке аккаунта:', error);
      showError({
        type: 'auth',
        title: 'Ошибка',
        message: error.message || 'Не удалось отвязать аккаунт',
        variant: 'destructive'
      });
    } finally {
      setUnlinking(false);
    }
  };

  // Отображаем состояние загрузки
  if (loading) {
    return (
      <Card className="border-[#EC39D9]/30">
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#FB0D68]" />
          <span className="ml-2">Загрузка информации...</span>
        </CardContent>
      </Card>
    );
  }

  // Если аккаунт привязан, отображаем информацию о нем
  if (linked && account) {
    return (
      <Card className="border-[#EC39D9]/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GamepadIcon className="h-5 w-5 mr-2 text-[#FB0D68]" />
            Minecraft аккаунт
          </CardTitle>
          <CardDescription>
            Ваш аккаунт на сайте привязан к игровому аккаунту Minecraft
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Badge className="bg-gradient-to-r from-[#EC39D9] to-[#FB0D68]">Привязан</Badge>
            <span className="ml-2 font-medium">{account.minecraft_username}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Последний вход</p>
              <p className="font-medium">
                {account.last_online 
                  ? new Date(account.last_online * 1000).toLocaleString()
                  : 'Не в сети'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Наиграно времени</p>
              <p className="font-medium">{Math.floor(account.playtime_minutes / 60)} часов</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Достижений</p>
              <p className="font-medium">{account.achievements_count}/50</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Баланс</p>
              <p className="font-medium">{account.balance} EC</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Всего пополнено</p>
              <p className="font-medium">{account.total_donated} EC</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Привилегия</p>
              <p className="font-medium">{account.privilege || 'Нет'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-destructive/30 hover:bg-destructive/10 text-destructive"
            onClick={unlinkAccount}
            disabled={unlinking}
          >
            {unlinking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отвязка...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" /> Отвязать аккаунт
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Если аккаунт не привязан, отображаем форму для привязки
  return (
    <Card className="border-[#EC39D9]/30">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GamepadIcon className="h-5 w-5 mr-2 text-[#FB0D68]" />
          Привязать Minecraft аккаунт
        </CardTitle>
        <CardDescription>
          Привяжите ваш игровой аккаунт, чтобы получить доступ к дополнительным возможностям
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!authCode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minecraft_username">Никнейм в Minecraft</Label>
              <Input
                id="minecraft_username"
                placeholder="Введите ваш никнейм"
                value={minecraftUsername}
                onChange={(e) => setMinecraftUsername(e.target.value)}
                className="border-[#EC39D9]/30 focus-visible:ring-[#FB0D68]"
              />
            </div>
            <Button 
              className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90"
              onClick={generateAuthCode}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Генерация кода...
                </>
              ) : (
                <>
                  <GamepadIcon className="mr-2 h-4 w-4" /> Привязать аккаунт
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-[#EC39D9]/10 border-[#FB0D68]/30">
              <AlertTitle className="text-[#FB0D68] font-bold">Код авторизации: {authCode}</AlertTitle>
              <AlertDescription>
                Войдите на сервер и введите команду <span className="font-mono font-medium">/webauth {authCode}</span> для привязки аккаунта.
                Код действителен в течение 15 минут.
              </AlertDescription>
            </Alert>
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setAuthCode(null)}
              >
                Отмена
              </Button>
              <Button 
                className="flex-1 bg-[#FB0D68] hover:bg-[#FB0D68]/90"
                onClick={fetchLinkStatus}
              >
                <Check className="mr-2 h-4 w-4" /> Проверить статус
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 