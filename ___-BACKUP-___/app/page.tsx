import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Users, Server, Gift, ChevronRight, Gamepad2, Download, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CopyButton } from "@/components/copy-button"
import { PlayDialog } from "@/components/play-dialog"
import { OnlineStatus } from "@/components/online-status"

export default function Home() {
  const serverIP = "play.eternalcore.ru"

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
              <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#DF2456]/20 to-[#FB0D68]/20 blur-3xl" />
            </div>
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
                      Добро пожаловать на EternalCore
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Уникальный Minecraft сервер на версии 1.16.5. Присоединяйтесь к нашему сообществу и начните свое
                      приключение прямо сейчас.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <PlayDialog variant="play">
                      <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                        Начать играть
                      </Button>
                    </PlayDialog>
                    <Link href="/about">
                      <Button variant="outline" className="border-[#DF2456]/50 hover:bg-[#DF2456]/10">
                        Узнать больше
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white">
                    <OnlineStatus />
                    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
                      Слотов: 1000
                    </div>
                    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
                      {serverIP}
                    </div>
                    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
                      <span className="flex items-center">
                        <span className="mr-1.5 h-4 w-4 rounded-full bg-[#FB0D68]"></span>
                        Minecraft 1.16.5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-[#DF2456]/10 to-[#FB0D68]/10 blur-2xl -z-10" />
                    <div className="border-8 border-[#DF2456]/50 rounded-lg overflow-hidden">
                      <Image
                        src="https://i.imgur.com/BfDs9Z8.png"
                        alt="EternalCore Server"
                        width={600}
                        height={400}
                        className="aspect-[3/2] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <span className="mr-2 rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-1">
                    <Award className="h-3 w-3 text-white" />
                  </span>
                  Наши преимущества
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
                    Особенности сервера
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Наш сервер предлагает уникальный игровой опыт с множеством функций и возможностей
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#DF2456]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-2">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Стабильная работа</h3>
                  <p className="text-center text-muted-foreground">
                    Сервер работает на Paper 1.16.5, обеспечивая высокую производительность и стабильность
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#DF2456]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Дружное сообщество</h3>
                  <p className="text-center text-muted-foreground">
                    Присоединяйтесь к активному сообществу игроков и находите новых друзей
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#DF2456]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-2">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Уникальные возможности</h3>
                  <p className="text-center text-muted-foreground">
                    Получите доступ к эксклюзивным функциям и возможностям на нашем сервере
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute right-0 bottom-0 -z-10 opacity-20">
              <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-r from-[#DF2456]/20 to-[#FB0D68]/20 blur-3xl" />
            </div>
            <div className="container px-4 md:px-6">
              <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm w-fit">
                    <span className="mr-2 rounded-full bg-gradient-to-r from-[#DF2456] to-[#FB0D68] p-1">
                      <Download className="h-3 w-3 text-white" />
                    </span>
                    Как начать играть
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
                      Присоединяйтесь к нам прямо сейчас
                    </h2>
                    <p className="text-muted-foreground md:text-xl">
                      Всего 3 простых шага отделяют вас от игры на нашем сервере
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DF2456]/10 text-[#FB0D68]">
                        1
                      </div>
                      <h3 className="text-xl font-bold">Скачайте Minecraft</h3>
                      <p className="text-muted-foreground">
                        Требуется Minecraft Java Edition версии 1.16.5 или выше
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DF2456]/10 text-[#FB0D68]">
                        2
                      </div>
                      <h3 className="text-xl font-bold">Добавьте наш сервер</h3>
                      <p className="text-muted-foreground">
                        Скопируйте IP-адрес <code className="text-[#FB0D68]">{serverIP}</code> и добавьте его в список серверов
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DF2456]/10 text-[#FB0D68]">
                        3
                      </div>
                      <h3 className="text-xl font-bold">Присоединяйтесь и играйте</h3>
                      <p className="text-muted-foreground">
                        Подключитесь к серверу и начните свое приключение в мире EternalCore
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <PlayDialog variant="play">
                      <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                        Подробная инструкция
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </PlayDialog>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -z-10 h-full w-full rounded-xl bg-gradient-to-r from-[#DF2456]/10 to-[#FB0D68]/10 blur-xl" />
                    <div className="border-8 border-[#DF2456]/50 rounded-lg overflow-hidden">
                      <Image
                        src="https://i.imgur.com/HYtN3kw.png"
                        alt="Minecraft Java Edition"
                        width={600}
                        height={400}
                        className="aspect-[3/2] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  )
}
