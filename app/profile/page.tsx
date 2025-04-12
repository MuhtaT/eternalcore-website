'use client';

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Edit, GamepadIcon, LogOut, Server, Shield, User, LinkIcon } from "lucide-react";
import Link from "next/link";
import { MinecraftLink } from "@/components/minecraft-link";
import { useError } from '@/lib/contexts/error-context';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [minecraftLinked, setMinecraftLinked] = useState(false);
  const { showError } = useError();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log("Пользователь не авторизован, перенаправление на /login");
      router.push('/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#FB0D68] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }
  
  if (!session?.user) {
    return null; // useEffect перенаправит на страницу входа
  }
  
  // Получаем данные пользователя из сессии
  const user = session.user;
  const userInitials = user.name ? user.name.slice(0, 2).toUpperCase() : "UC";
  
  // Обработчик изменения статуса привязки Minecraft аккаунта
  const handleMinecraftStatusChange = (linked: boolean) => {
    setMinecraftLinked(linked);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      
      {/* Улучшенный градиентный баннер в шапке профиля */}
      <div className="h-64 bg-gradient-to-r from-[#EC39D9]/80 to-[#FB0D68]/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#EC39D9]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -right-16 w-64 h-64 bg-[#FB0D68]/30 rounded-full blur-3xl" />
      </div>
      
      <main className="container px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Карточка профиля пользователя */}
          <Card className="w-full md:w-80 border-[#EC39D9]/30 shadow-xl shadow-[#FB0D68]/10 backdrop-blur-sm bg-background/95">
            <CardHeader className="flex flex-col items-center space-y-2 pb-2">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg ring-2 ring-[#FB0D68]/50">
                <AvatarImage src={user.image || ""} alt={user.name || "Пользователь"} />
                <AvatarFallback className="text-3xl bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1 mt-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">{user.name}</CardTitle>
                <CardDescription className="text-sm">{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <p className="text-sm text-muted-foreground">
                Статус игрока: <span className={`font-medium ${user.role === 'admin' ? 'text-red-500' : 'text-[#FB0D68]'}`}>
                  {user.role === 'admin' ? 'Администратор' : 'Игрок'}
                </span>
                {user.role === 'admin' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    <Shield className="mr-1 h-3 w-3" />
                    Админ
                  </span>
                )}
              </p>
              
              {!minecraftLinked && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    <GamepadIcon className="mr-1 h-3 w-3" />
                    Аккаунт Minecraft не привязан
                  </span>
                </div>
              )}
            </CardContent>
            <Separator className="bg-gradient-to-r from-[#EC39D9]/40 to-[#FB0D68]/40" />
            <CardContent className="pt-4 pb-2">
              <div className="space-y-3">
                <Link 
                  href="#" 
                  className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Редактировать профиль</span>
                </Link>
                
                {minecraftLinked && (
                  <>
                    <Link 
                      href="#" 
                      className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                    >
                      <GamepadIcon className="mr-2 h-4 w-4" />
                      <span>Игровая статистика</span>
                    </Link>
                    <Link 
                      href="#" 
                      className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Привилегии</span>
                    </Link>
                  </>
                )}
                
                <Link 
                  href="#" 
                  className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Безопасность</span>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="flex items-center text-sm text-[#DF2456] hover:text-[#FB0D68] transition"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Панель администратора</span>
                  </Link>
                )}
              </div>
            </CardContent>
            <Separator className="bg-gradient-to-r from-[#EC39D9]/40 to-[#FB0D68]/40" />
            <CardFooter className="pt-4">
              <Button 
                variant="outline" 
                className="w-full border-[#EC39D9]/30 hover:bg-[#EC39D9]/10 text-destructive hover:text-destructive"
                asChild
              >
                <Link href="/api/auth/signout">
                  <LogOut className="mr-2 h-4 w-4" /> Выйти
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Основной контент профиля */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-background border border-[#EC39D9]/30 mb-6">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                {minecraftLinked && <TabsTrigger value="donations">Донат</TabsTrigger>}
                {minecraftLinked && <TabsTrigger value="activity">Активность</TabsTrigger>}
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>
              
              {/* Вкладка Обзор */}
              <TabsContent value="overview">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/10 backdrop-blur-sm bg-background/95">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">Добро пожаловать, {user.name}!</CardTitle>
                    <CardDescription className="text-base">
                      Это ваш личный кабинет на сервере EternalCore. Здесь вы можете управлять своим аккаунтом и отслеживать информацию.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-gradient-to-r from-[#EC39D9]/40 to-[#FB0D68]/40" />
                  
                  {!minecraftLinked ? (
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <Card className="border-[#EC39D9]/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center">
                                <GamepadIcon className="h-5 w-5 mr-2 text-[#FB0D68]" />
                                Привязка игрового аккаунта
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              Для доступа к полному функционалу личного кабинета необходимо привязать ваш аккаунт Minecraft.
                              После привязки вы сможете видеть игровую статистику, историю донатов и другую информацию.
                            </p>
                            <MinecraftLink onStatusChange={handleMinecraftStatusChange} />
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-[#EC39D9]/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">Статистика</CardTitle>
                              <Server className="h-5 w-5 text-[#FB0D68]" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Наиграно времени</span>
                                <span className="font-medium">0 часов</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Получено достижений</span>
                                <span className="font-medium">0/50</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Последний вход</span>
                                <span className="font-medium">Не в сети</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-[#EC39D9]/20">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">Донат</CardTitle>
                              <Crown className="h-5 w-5 text-[#FB0D68]" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Баланс</span>
                                <span className="font-medium">0 EC</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Всего пополнено</span>
                                <span className="font-medium">0 EC</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Привилегия</span>
                                <span className="font-medium">Нет</span>
                              </div>
                              <Button 
                                size="sm" 
                                className="w-full bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white mt-2"
                              >
                                Пополнить баланс
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="border-[#EC39D9]/20 mt-4">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Последняя активность</CardTitle>
                            <Button variant="ghost" size="icon" className="text-[#FB0D68]">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            У вас пока нет активности на сервере. Подключайтесь к серверу и начните играть!
                          </p>
                        </CardContent>
                      </Card>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
              
              {/* Вкладка Донаты (отображается только при привязанном аккаунте) */}
              {minecraftLinked && (
                <TabsContent value="donations">
                  <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                    <CardHeader>
                      <CardTitle>История донатов</CardTitle>
                      <CardDescription>
                        Здесь отображается ваша история донатов и доступные привилегии.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">У вас пока нет истории донатов.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {/* Вкладка Активность (отображается только при привязанном аккаунте) */}
              {minecraftLinked && (
                <TabsContent value="activity">
                  <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                    <CardHeader>
                      <CardTitle>Активность на сервере</CardTitle>
                      <CardDescription>
                        Здесь отображается ваша активность и достижения на сервере.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">У вас пока нет активности на сервере.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {/* Вкладка Настройки */}
              <TabsContent value="settings">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                  <CardHeader>
                    <CardTitle>Настройки аккаунта</CardTitle>
                    <CardDescription>
                      Здесь вы можете изменить настройки своего аккаунта.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Привязка аккаунта Minecraft</h3>
                        <p className="text-muted-foreground mb-4">
                          {minecraftLinked 
                            ? "Ваш аккаунт привязан к игровому профилю Minecraft." 
                            : "Привяжите ваш аккаунт к игровому профилю Minecraft для получения доступа к полному функционалу."}
                        </p>
                        <MinecraftLink onStatusChange={handleMinecraftStatusChange} />
                      </div>
                      
                      <Separator className="bg-gradient-to-r from-[#EC39D9]/20 to-[#FB0D68]/20" />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Изменение данных профиля</h3>
                        <p className="text-muted-foreground mb-4">
                          Функция изменения данных профиля находится в разработке.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}