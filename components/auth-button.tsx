'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LogIn, 
  User, 
  Settings, 
  LogOut, 
  Crown, 
  UserPlus 
} from 'lucide-react';
import { useError } from '@/lib/contexts/error-context';
import { handleAuthError } from '@/lib/services/error-service';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const { showError, showSuccess } = useError();
  
  // Хук эффекта для избежания расхождения серверного и клиентского рендеринга
  useEffect(() => {
    setMounted(true);
  }, []);

  // Эффект для отслеживания статуса авторизации
  useEffect(() => {
    if (mounted) {
      console.log(`AuthButton: Статус авторизации: ${status}, пользователь:`, session?.user?.email || 'не авторизован');
    }
  }, [status, session, mounted]);
  
  // Если компонент не монтирован или статус загружается, показываем заглушку
  if (!mounted || status === 'loading') {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
        <User className="h-5 w-5" />
      </Button>
    );
  }
  
  // Если пользователь авторизован
  if (status === 'authenticated' && session?.user) {
    const userInitials = session.user.name 
      ? session.user.name.slice(0, 2).toUpperCase() 
      : 'UC';
      
    // Функция для выхода с обработкой ошибок
    const handleSignOut = async () => {
      try {
        console.log("Попытка выхода из системы...");
        await signOut({ callbackUrl: '/' });
        showSuccess({
          type: 'success',
          title: 'Выход из системы',
          message: 'Вы успешно вышли из аккаунта.',
          variant: 'default'
        });
      } catch (error) {
        console.error("Ошибка при выходе:", error);
        showError(handleAuthError({
          message: 'Произошла ошибка при выходе из системы. Пожалуйста, попробуйте еще раз.'
        }));
      }
    };
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full border border-[#EC39D9]/30 hover:bg-[#EC39D9]/10 overflow-hidden"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={session.user.image || ''} 
                alt={session.user.name || 'Профиль'} 
              />
              <AvatarFallback className="bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 border-[#EC39D9]/30"
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={session.user.image || ''} 
                alt={session.user.name || 'Профиль'} 
              />
              <AvatarFallback className="bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {session.user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-[#EC39D9]/20" />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-[#FB0D68]" />
              <span>Мой профиль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="#" className="cursor-pointer">
              <Crown className="mr-2 h-4 w-4 text-[#FB0D68]" />
              <span>Привилегии</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="#" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-[#FB0D68]" />
              <span>Настройки</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#EC39D9]/20" />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  // Если пользователь не авторизован
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-[#EC39D9]/30 hover:bg-[#EC39D9]/10"
      asChild
    >
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" /> Войти
      </Link>
    </Button>
  );
} 