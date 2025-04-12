import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Mail } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function ContactsPage() {
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
              Контакты
            </Badge>
            <h1 className="max-w-[500px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Свяжитесь с нами
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Познакомьтесь с командой проекта и узнайте, как связаться с нами
            </p>
          </div>

          <div className="flex flex-col items-center space-y-12">
            <div className="w-full max-w-5xl">
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

            <div className="w-full max-w-5xl mt-8">
              <Card className="border-[#DF2456]/20">
                <CardHeader>
                  <CardTitle>Форма обратной связи</CardTitle>
                  <CardDescription>
                    Заполните форму ниже, и мы свяжемся с вами в ближайшее время
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Ваше имя
                        </label>
                        <input
                          id="name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Введите ваше имя"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Тема
                      </label>
                      <input
                        id="subject"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Тема вашего сообщения"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Сообщение
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Введите ваше сообщение..."
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white w-full sm:w-auto">
                      Отправить сообщение
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 