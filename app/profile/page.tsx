import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Edit, GamepadIcon, LogOut, Server, Shield, User } from "lucide-react";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Профиль | EternalCore",
  description: "Личный кабинет пользователя на сервере EternalCore",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!session?.user) {
    redirect("/login");
  }
  
  // Получаем данные пользователя из сессии
  const user = session.user;
  const userInitials = user.name ? user.name.slice(0, 2).toUpperCase() : "UC";
  
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      
      {/* Градиентный фон в шапке профиля */}
      <div className="h-48 bg-gradient-to-r from-[#EC39D9]/80 to-[#FB0D68]/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.03]" />
      </div>
      
      <main className="container px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Карточка профиля пользователя */}
          <Card className="w-full md:w-80 border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
            <CardHeader className="flex flex-col items-center space-y-2 pb-2">
              <Avatar className="h-28 w-28 border-4 border-background">
                <AvatarImage src={user.image || ""} alt={user.name || "Пользователь"} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription className="text-sm">{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-2">
              <p className="text-sm text-muted-foreground">
                Статус игрока: <span className="font-medium text-[#FB0D68]">Игрок</span>
              </p>
            </CardContent>
            <Separator className="bg-[#EC39D9]/20" />
            <CardContent className="pt-4 pb-2">
              <div className="space-y-3">
                <Link 
                  href="#" 
                  className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Редактировать профиль</span>
                </Link>
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
                <Link 
                  href="#" 
                  className="flex items-center text-sm text-muted-foreground hover:text-[#FB0D68] transition"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Безопасность</span>
                </Link>
              </div>
            </CardContent>
            <Separator className="bg-[#EC39D9]/20" />
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
                <TabsTrigger value="donations">Донат</TabsTrigger>
                <TabsTrigger value="activity">Активность</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>
              
              {/* Вкладка Обзор */}
              <TabsContent value="overview">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                  <CardHeader>
                    <CardTitle>Добро пожаловать, {user.name}!</CardTitle>
                    <CardDescription>
                      Это ваш личный кабинет на сервере EternalCore. Здесь вы можете управлять своим аккаунтом и отслеживать информацию.
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-[#EC39D9]/20" />
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
                              <span className="text-sm text-muted-foreground">Посещено локаций</span>
                              <span className="font-medium">0</span>
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
                </Card>
              </TabsContent>
              
              {/* Заглушки для остальных вкладок */}
              <TabsContent value="donations">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                  <CardHeader>
                    <CardTitle>История донатов</CardTitle>
                    <CardDescription>
                      Здесь будет отображаться ваша история донатов и доступные привилегии.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">У вас пока нет истории донатов.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                  <CardHeader>
                    <CardTitle>Активность на сервере</CardTitle>
                    <CardDescription>
                      Здесь будет отображаться ваша активность и достижения на сервере.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">У вас пока нет активности на сервере.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="border-[#EC39D9]/30 shadow-lg shadow-[#FB0D68]/5">
                  <CardHeader>
                    <CardTitle>Настройки аккаунта</CardTitle>
                    <CardDescription>
                      Здесь вы можете изменить настройки своего аккаунта.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Функция настройки аккаунта находится в разработке.</p>
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