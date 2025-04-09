import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Server, Cpu, HardDrive, Zap, Shield, Users, Map, Sword, Pickaxe, Compass, MessageCircle, Mail } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function AboutServerPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
          <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#DF2456]/20 to-[#FB0D68]/20 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <Badge className="px-3.5 py-1.5 text-base bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white">
              Информация
            </Badge>
            <h1 className="max-w-[500px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              О сервере EternalCore
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Уникальный Minecraft сервер с упором на анархию и выживание в мире без строгих ограничений
            </p>
          </div>

          <div className="flex flex-col items-center space-y-12">
            <div className="grid gap-8 md:grid-cols-2 w-full max-w-5xl">
              <div className="aspect-video overflow-hidden rounded-xl border border-[#DF2456]/20 shadow-lg shadow-[#DF2456]/5">
                <img
                  alt="Скриншот сервера EternalCore"
                  className="aspect-video object-cover"
                  height="310"
                  src="/placeholder.svg?height=310&width=550"
                  width="550"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-2xl font-bold">Добро пожаловать на EternalCore</h2>
                <p className="text-muted-foreground">
                  EternalCore - это сервер Minecraft, где каждый игрок может найти что-то для себя. Мы предлагаем уникальный игровой опыт с минимальными ограничениями и максимальной свободой действий.
                </p>
                <p className="text-muted-foreground">
                  Наш сервер работает на версии Paper 1.16.5, что обеспечивает стабильную работу и поддержку большинства популярных модификаций.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="bg-[#DF2456]/10 text-[#DF2456] border-[#DF2456]/20">
                    Анархия
                  </Badge>
                  <Badge variant="outline" className="bg-[#DF2456]/10 text-[#DF2456] border-[#DF2456]/20">
                    PvP
                  </Badge>
                  <Badge variant="outline" className="bg-[#DF2456]/10 text-[#DF2456] border-[#DF2456]/20">
                    Выживание
                  </Badge>
                  <Badge variant="outline" className="bg-[#DF2456]/10 text-[#DF2456] border-[#DF2456]/20">
                    Гриф
                  </Badge>
                </div>
              </div>
            </div>

            <div className="w-full max-w-5xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Технические характеристики</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Хостинг</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Выделенный сервер с защитой от DDoS-атак и высокой доступностью
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Процессор</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Intel Xeon E5-2690 v4 @ 3.5GHz (16 ядер / 32 потока)
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Память и хранилище</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      64 ГБ DDR4 RAM, NVMe SSD хранилище 1 ТБ
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Соединение</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Выделенный канал 1 Гбит/с с низкой задержкой
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Ядро сервера</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Paper 1.16.5 с оптимизированными настройками и плагинами
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[#DF2456]/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle className="text-lg">Вместимость</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      До 1000 игроков одновременно с сохранением стабильной производительности
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="w-full max-w-5xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Особенности сервера</h2>
              <Tabs defaultValue="gameplay" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="gameplay">Геймплей</TabsTrigger>
                  <TabsTrigger value="world">Мир</TabsTrigger>
                  <TabsTrigger value="community">Сообщество</TabsTrigger>
                </TabsList>
                
                <TabsContent value="gameplay" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Sword className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">PvP без ограничений</h3>
                        <p className="text-sm text-muted-foreground">
                          Сражайтесь с другими игроками в любом месте мира. Создавайте альянсы или станьте одиночкой, выбор за вами.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Pickaxe className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Гриферство разрешено</h3>
                        <p className="text-sm text-muted-foreground">
                          Полная свобода действий - стройте, разрушайте, исследуйте. Защищайте свои постройки или уничтожайте чужие.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Shield className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Защита территорий</h3>
                        <p className="text-sm text-muted-foreground">
                          Возможность защитить свою территорию с помощью донат-привилегий для тех, кто хочет безопасности.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Zap className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Уникальные плагины</h3>
                        <p className="text-sm text-muted-foreground">
                          Кастомные плагины, разработанные специально для нашего сервера, добавляющие новые возможности.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="world" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Map className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Огромный мир</h3>
                        <p className="text-sm text-muted-foreground">
                          Карта размером 100,000 x 100,000 блоков с разнообразными биомами и ландшафтами для исследования.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Compass className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Все измерения</h3>
                        <p className="text-sm text-muted-foreground">
                          Доступ ко всем измерениям Minecraft: Обычный мир, Нижний мир и Край с полной свободой перемещения.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <HardDrive className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Редкий сброс карты</h3>
                        <p className="text-sm text-muted-foreground">
                          Мы редко сбрасываем карту, что позволяет игрокам создавать масштабные проекты и историю сервера.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Server className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Оптимизированная генерация</h3>
                        <p className="text-sm text-muted-foreground">
                          Специально настроенная генерация мира для баланса между производительностью и красотой ландшафтов.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="community" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Users className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Активное сообщество</h3>
                        <p className="text-sm text-muted-foreground">
                          Тысячи активных игроков, создающих альянсы, кланы и строящих города в мире EternalCore.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <MessageCircle className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Discord сервер</h3>
                        <p className="text-sm text-muted-foreground">
                          Активный Discord сервер для общения, поиска союзников и обсуждения игровых событий.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Shield className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Опытная администрация</h3>
                        <p className="text-sm text-muted-foreground">
                          Команда опытных администраторов и модераторов, следящих за техническим состоянием сервера.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Zap className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">События и конкурсы</h3>
                        <p className="text-sm text-muted-foreground">
                          Регулярные игровые события, PvP-турниры и конкурсы с ценными призами для участников.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-full max-w-5xl mt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Команда сервера</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-[#DF2456]/20 text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto rounded-full overflow-hidden w-20 h-20 mb-2">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Администратор"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">DarkLord</CardTitle>
                    <CardDescription>Главный администратор</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-[#DF2456]/20 text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto rounded-full overflow-hidden w-20 h-20 mb-2">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Разработчик"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">CodeMaster</CardTitle>
                    <CardDescription>Разработчик плагинов</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-[#DF2456]/20 text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto rounded-full overflow-hidden w-20 h-20 mb-2">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Модератор"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">Guardian</CardTitle>
                    <CardDescription>Старший модератор</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-[#DF2456]/20 text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto rounded-full overflow-hidden w-20 h-20 mb-2">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Поддержка"
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">HelpfulOne</CardTitle>
                    <CardDescription>Техническая поддержка</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div className="w-full max-w-5xl mt-8 bg-muted/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Связаться с нами</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="rounded-full bg-[#DF2456]/10 p-3 mb-3">
                    <MessageCircle className="h-6 w-6 text-[#DF2456]" />
                  </div>
                  <h3 className="font-medium mb-1">Discord</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Присоединяйтесь к нашему Discord серверу для общения с игроками и администрацией
                  </p>
                  <Button className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white">
                    Присоединиться к Discord
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="rounded-full bg-[#DF2456]/10 p-3 mb-3">
                    <Mail className="h-6 w-6 text-[#DF2456]" />
                  </div>
                  <h3 className="font-medium mb-1">Электронная почта</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    По вопросам сотрудничества или для обращения в техническую поддержку
                  </p>
                  <Button variant="outline" className="border-[#DF2456]/50 hover:bg-[#DF2456]/10">
                    support@eternalcore.ru
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
