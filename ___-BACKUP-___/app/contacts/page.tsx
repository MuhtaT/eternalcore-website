import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  MessageSquare, 
  Users, 
  HeartHandshake, 
  HelpCircle, 
  AlertTriangle,
  Facebook,
  Twitter,
  Instagram,
  Twitch,
  Youtube,
  Github,
  Send
} from 'lucide-react'
import Link from "next/link"

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
              Наши контакты
            </Badge>
            <h1 className="max-w-[700px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Связаться с нами
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Мы всегда рады помочь вам и ответить на любые вопросы о нашем проекте
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-start max-w-6xl mx-auto">
            {/* Контактная информация */}
            <div className="flex flex-col space-y-8">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Электронная почта</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <HelpCircle className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Техническая поддержка</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="mailto:support@eternalcore.ru" className="text-[#FB0D68] hover:underline">
                            support@eternalcore.ru
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Вопросы о работе сервера, решение технических проблем, помощь с донатом
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <AlertTriangle className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Жалобы на игроков</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="mailto:report@eternalcore.ru" className="text-[#FB0D68] hover:underline">
                            report@eternalcore.ru
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Сообщения о нарушениях, жалобы на действия игроков или модераторов
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <HeartHandshake className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Сотрудничество</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="mailto:partners@eternalcore.ru" className="text-[#FB0D68] hover:underline">
                            partners@eternalcore.ru
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Предложения по сотрудничеству, партнерству, реклама и PR
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Сообщества</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Users className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Discord</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">
                            https://discord.gg/eternalcore
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Наше основное сообщество, где вы можете общаться с другими игроками и нашей командой
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <MessageSquare className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Telegram</h3>
                        <p className="text-sm text-muted-foreground">
                          <a href="https://t.me/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">
                            https://t.me/eternalcore
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Канал с объявлениями и обновлениями сервера
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Социальные сети</h3>
                    <div className="flex flex-wrap gap-4">
                      {/* <a href="https://vk.com/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <svg className="h-5 w-5 text-[#DF2456]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z" />
                        </svg>
                      </a> */}
                      <a href="https://youtube.com/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <Youtube className="h-5 w-5 text-[#DF2456]" />
                      </a>
                      <a href="https://twitch.tv/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <Twitch className="h-5 w-5 text-[#DF2456]" />
                      </a>
                      <a href="https://twitter.com/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <Twitter className="h-5 w-5 text-[#DF2456]" />
                      </a>
                      <a href="https://instagram.com/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <Instagram className="h-5 w-5 text-[#DF2456]" />
                      </a>
                      <a href="https://github.com/eternalcore" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#DF2456]/10 p-3 hover:bg-[#DF2456]/20 transition-colors">
                        <Github className="h-5 w-5 text-[#DF2456]" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Часто задаваемые вопросы</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Прежде чем связаться с нами, возможно, вы найдете ответ на свой вопрос в разделе FAQ:
                  </p>
                  <div className="flex justify-center">
                    <Link href="/faq" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium rounded-md px-4 py-2 inline-flex items-center">
                      Перейти к FAQ
                      <HelpCircle className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Форма обратной связи */}
            <div>
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Форма обратной связи</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Заполните форму ниже, и мы свяжемся с вами в ближайшее время
                  </p>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Ваше имя или никнейм *
                      </label>
                      <Input
                        id="name"
                        placeholder="Введите ваше имя"
                        required
                        className="border-[#DF2456]/20 focus-visible:ring-[#DF2456]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Введите ваш email"
                        required
                        className="border-[#DF2456]/20 focus-visible:ring-[#DF2456]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Тема
                      </label>
                      <Input
                        id="subject"
                        placeholder="Введите тему сообщения"
                        className="border-[#DF2456]/20 focus-visible:ring-[#DF2456]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Сообщение *
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Введите ваше сообщение"
                        required
                        className="min-h-[120px] border-[#DF2456]/20 focus-visible:ring-[#DF2456]"
                      />
                    </div>

                    <Button type="submit" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white w-full">
                      Отправить сообщение
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Отправляя форму, вы соглашаетесь с нашей <Link href="/legal/privacy-policy" className="text-[#FB0D68] hover:underline">Политикой конфиденциальности</Link></p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <Card className="border-[#DF2456]/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="h-6 w-6 text-[#DF2456]" />
                      <h2 className="text-xl font-bold">Присоединяйтесь к команде</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Мы всегда рады новым талантливым участникам нашей команды! Если у вас есть опыт в разработке плагинов, моделировании, дизайне или работе с сообществом, и вы хотите стать частью проекта EternalCore, напишите нам.
                    </p>
                    <div className="flex justify-center">
                      <a href="mailto:jobs@eternalcore.ru" className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] hover:from-[#DF2456]/90 hover:to-[#FB0D68]/90 text-white font-medium rounded-md px-4 py-2 inline-flex items-center">
                        Стать частью команды
                        <HeartHandshake className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 