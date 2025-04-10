import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Diamond, Crown, Zap, Shield, Gift, Star, ChevronRight, Server, Users } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getAllDonatePackages, getAllPrivileges } from "@/lib/db/database"
import { DonatePackageCard, PrivilegeCard } from "@/components/client-donate-components"

export const revalidate = 3600; // Revalidate every hour

// Добавляем типы для правильной обработки данных
interface DonatePackage {
  id: number;
  name: string;
  price: number;
  description: string;
  status: string;
  group: string;
  features: string; // JSON строка для массива возможностей
  command: string;
  created_at?: string;
  updated_at?: string;
}

interface Privilege {
  id: number;
  name: string;
  type: string;
  description: string;
  permission: string;
  command: string;
  created_at?: string;
  updated_at?: string;
}

export default async function DonatPage() {
  // Получаем данные о донат-пакетах и привилегиях из базы данных
  const donatePackages = await getAllDonatePackages() as DonatePackage[];
  const privileges = await getAllPrivileges() as Privilege[];

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
              Поддержка сервера
            </Badge>
            <h1 className="max-w-[500px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Донат на EternalCore
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Поддержите развитие сервера и получите доступ к эксклюзивным возможностям и привилегиям
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <Tabs defaultValue="packages" className="w-full max-w-4xl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="packages">Донат-пакеты</TabsTrigger>
                <TabsTrigger value="privileges">Привилегии</TabsTrigger>
              </TabsList>
              
              <TabsContent value="packages" className="mt-6">
                {donatePackages.length === 0 ? (
                  <div className="text-center p-12 border border-dashed rounded-lg">
                    <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Донат-пакеты скоро появятся</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      В настоящее время мы работаем над созданием донат-пакетов. Пожалуйста, загляните позже.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {donatePackages.map((pkg) => (
                      <DonatePackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="privileges" className="mt-6">
                {privileges.length === 0 ? (
                  <div className="text-center p-12 border border-dashed rounded-lg">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Привилегии скоро будут доступны</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      В настоящее время мы работаем над созданием отдельных привилегий. Пожалуйста, загляните позже.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {privileges.map((priv) => (
                      <PrivilegeCard key={priv.id} priv={priv} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <Card className="w-full max-w-4xl border-[#DF2456]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-[#FB0D68] mr-2" />
                  Как поддержка помогает серверу
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Ваша поддержка помогает нам развивать сервер, улучшать игровой опыт и поддерживать стабильную работу.
                  Средства идут на оплату хостинга, разработку плагинов и новых функций, а также на развитие сообщества.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <Server className="h-5 w-5 text-[#FB0D68] mb-2" />
                    <h4 className="font-medium mb-1">Развитие инфраструктуры</h4>
                    <p className="text-sm text-muted-foreground">Улучшение серверного оборудования и услуг хостинга для стабильной игры без лагов.</p>
                  </div>
                  
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <Crown className="h-5 w-5 text-[#FB0D68] mb-2" />
                    <h4 className="font-medium mb-1">Разработка функций</h4>
                    <p className="text-sm text-muted-foreground">Создание новых плагинов, ивентов и функций для разнообразия игрового процесса.</p>
                  </div>
                  
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <Users className="h-5 w-5 text-[#FB0D68] mb-2" />
                    <h4 className="font-medium mb-1">Сообщество</h4>
                    <p className="text-sm text-muted-foreground">Организация турниров, конкурсов и мероприятий для игроков сервера.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full max-w-4xl border-[#DF2456]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 text-[#FB0D68] mr-2" />
                  Способы оплаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <h4 className="font-medium mb-2">Банковские карты</h4>
                    <p className="text-sm text-muted-foreground">Visa, MasterCard, МИР</p>
                  </div>
                  
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <h4 className="font-medium mb-2">Электронные кошельки</h4>
                    <p className="text-sm text-muted-foreground">ЮMoney, QIWI, WebMoney</p>
                  </div>
                  
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <h4 className="font-medium mb-2">Мобильные платежи</h4>
                    <p className="text-sm text-muted-foreground">МТС, Билайн, МегаФон, Tele2</p>
                  </div>
                  
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg">
                    <h4 className="font-medium mb-2">Криптовалюты</h4>
                    <p className="text-sm text-muted-foreground">Bitcoin, Ethereum, USDT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}