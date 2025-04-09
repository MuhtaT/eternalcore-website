import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Diamond, Crown, Zap, Shield, Gift, Star, ChevronRight, Server, Users } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getAllDonatePackages, getAllPrivileges } from "@/lib/db/database"

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

  // Функция для получения иконки статуса пакета
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recommended':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'popular':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'maximum':
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return <Diamond className="h-5 w-5 text-[#DF2456]" />;
    }
  };

  // Функция для получения названия статуса
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'active': return 'Активен';
      case 'sale': return 'Скидка';
      case 'new': return 'Новый';
      case 'vip': return 'VIP';
      default: return 'Активен';
    }
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'sale': return 'bg-orange-500/20 text-orange-400';
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'vip': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  // Функция для получения иконки типа привилегии
  const getPrivilegeIcon = (type: string) => {
    switch (type) {
      case 'permission':
        return <Shield className="h-5 w-5 text-[#DF2456]" />;
      case 'command':
        return <Server className="h-5 w-5 text-[#DF2456]" />;
      case 'feature':
        return <Gift className="h-5 w-5 text-[#DF2456]" />;
      default:
        return <Shield className="h-5 w-5 text-[#DF2456]" />;
    }
  };

  // Вспомогательные функции для отображения статусов пакетов
  const getPackageBackgroundColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-gradient-to-tr from-green-950/50 to-green-900/20';
      case 'sale': return 'bg-gradient-to-tr from-orange-950/50 to-orange-900/20';
      case 'new': return 'bg-gradient-to-tr from-blue-950/50 to-blue-900/20';
      case 'vip': return 'bg-gradient-to-tr from-purple-950/50 to-purple-900/20';
      default: return 'bg-gradient-to-tr from-green-950/50 to-green-900/20';
    }
  };

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {donatePackages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-6 rounded-lg border border-white/10 transition-all hover:border-primary/50 ${getPackageBackgroundColor(
                        pkg.status
                      )}`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {getStatusIcon(pkg.status)}
                        <h3 className="text-xl font-bold">{pkg.name}</h3>
                        <div
                          className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            pkg.status
                          )}`}
                        >
                          {getStatusName(pkg.status)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-4">${pkg.price}</div>
                      <p className="text-gray-300 mb-6">{pkg.description}</p>
                      <div className="mb-6">
                        <div className="text-lg font-semibold mb-2">Включает:</div>
                        <ul className="space-y-2">
                          {JSON.parse(pkg.features).map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary-foreground py-2 rounded-lg font-medium transition-colors"
                        onClick={() => {
                          // Действие при клике на кнопку покупки
                        }}
                      >
                        Купить
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="privileges" className="mt-6">
                <Card className="border-[#DF2456]/20">
                  <CardHeader>
                    <CardTitle>Дополнительные возможности</CardTitle>
                    <CardDescription>
                      Отдельные возможности, которые вы можете приобрести для своего персонажа
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {privileges.length === 0 ? (
                      <div className="text-center p-6 border border-[#DF2456]/20 rounded-lg">
                        <p className="text-muted-foreground">Информация о привилегиях загружается...</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {privileges.map((priv) => (
                          <div key={priv.id} className="flex items-center justify-between p-4 border border-[#DF2456]/20 rounded-lg hover:bg-[#DF2456]/5 transition-colors">
                            <div className="flex items-center">
                              {getPrivilegeIcon(priv.type)}
                              <div className="ml-3">
                                <h4 className="font-medium">{priv.name}</h4>
                                <p className="text-sm text-muted-foreground">{priv.description}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-[#DF2456]/30 hover:bg-[#DF2456]/10">
                              Приобрести
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                    <h4 className="font-medium mb-1">Развитие сообщества</h4>
                    <p className="text-sm text-muted-foreground">Организация конкурсов, турниров и других мероприятий для игроков сервера.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full max-w-4xl border-[#DF2456]/20">
              <CardHeader>
                <CardTitle>Способы оплаты</CardTitle>
                <CardDescription>
                  Мы поддерживаем различные способы оплаты для вашего удобства
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg flex items-center justify-center">
                    <Image src="/images/payment/card.png" alt="Банковская карта" width={60} height={40} />
                  </div>
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg flex items-center justify-center">
                    <Image src="/images/payment/qiwi.png" alt="QIWI" width={60} height={40} />
                  </div>
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg flex items-center justify-center">
                    <Image src="/images/payment/webmoney.png" alt="WebMoney" width={60} height={40} />
                  </div>
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg flex items-center justify-center">
                    <Image src="/images/payment/yoomoney.png" alt="ЮMoney" width={60} height={40} />
                  </div>
                  <div className="p-4 border border-[#DF2456]/20 rounded-lg flex items-center justify-center">
                    <Image src="/images/payment/crypto.png" alt="Криптовалюта" width={60} height={40} />
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