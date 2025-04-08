import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Users, Server, Gift, ChevronRight, Gamepad2, Download, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CopyButton } from "@/components/copy-button"
import { AuthButton } from "@/components/auth-button"

export default function Home() {
  const serverIP = "play.eternalcore.ru"

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://i.imgur.com/n1TNSBq.png"
                  alt="EternalCore Logo"
                  width={65}
                  height={65}
                  className="mr-2"
                />
              </Link>
              <nav className="hidden gap-6 md:flex">
                <Link
                  href="#"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Главная
                </Link>
                <Link
                  href="#"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  О сервере
                </Link>
                <Link
                  href="#"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Донат
                </Link>
                <Link
                  href="#"
                  className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Правила
                </Link>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-2">
                <div className="hidden md:flex items-center mr-2 rounded-full bg-background border border-border px-3 py-1.5">
                  <span className="text-sm font-medium">{serverIP}</span>
                  <CopyButton value={serverIP} iconOnly className="ml-1 h-6 w-6 p-0" />
                </div>
                <ModeToggle />
                <AuthButton />
                <Button variant="default" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                  <Gamepad2 className="mr-2 h-4 w-4" /> Играть сейчас
                </Button>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
              <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#EC39D9]/20 to-[#FB0D68]/20 blur-3xl" />
            </div>
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">
                      Добро пожаловать на EternalCore
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Уникальный Minecraft сервер на версии 1.16.5. Присоединяйтесь к нашему сообществу и начните свое
                      приключение прямо сейчас.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                      <Download className="mr-2 h-4 w-4" /> Начать играть
                    </Button>
                    <Button variant="outline" className="border-[#EC39D9]/50 hover:bg-[#EC39D9]/10">
                      Узнать больше
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white">
                    <div className="flex items-center rounded-full bg-black border border-[#1e1e1e] px-3 py-1.5">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></div>
                      Онлайн: 128
                    </div>
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
                <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border border-[#EC39D9]/20 shadow-lg shadow-[#EC39D9]/5">
                  <img
                    alt="Minecraft сервер EternalCore"
                    className="aspect-video object-cover"
                    height="310"
                    src="/placeholder.svg?height=310&width=550"
                    width="550"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <span className="mr-2 rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-1">
                    <Award className="h-3 w-3 text-white" />
                  </span>
                  Наши преимущества
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">
                    Особенности сервера
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Наш сервер предлагает уникальный игровой опыт с множеством функций и возможностей
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#EC39D9]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-2">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Стабильная работа</h3>
                  <p className="text-center text-muted-foreground">
                    Сервер работает на Paper 1.16.5, обеспечивая высокую производительность и стабильность
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#EC39D9]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-2">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Дружное сообщество</h3>
                  <p className="text-center text-muted-foreground">
                    Присоединяйтесь к активному сообществу игроков и находите новых друзей
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-all hover:border-[#EC39D9]/50">
                  <div className="rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-2">
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
              <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-r from-[#EC39D9]/20 to-[#FB0D68]/20 blur-3xl" />
            </div>
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm w-fit">
                    <span className="mr-2 rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-1">
                      <Gift className="h-3 w-3 text-white" />
                    </span>
                    Поддержка
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">
                      Поддержите сервер
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Получите доступ к эксклюзивным возможностям и помогите серверу развиваться
                    </p>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <div className="mr-2 h-1 w-1 rounded-full bg-[#EC39D9]"></div>
                      Уникальные предметы и возможности
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 h-1 w-1 rounded-full bg-[#EC39D9]"></div>
                      Доступ к закрытым территориям
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 h-1 w-1 rounded-full bg-[#EC39D9]"></div>
                      Специальные команды и привилегии
                    </li>
                  </ul>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row pt-2">
                    <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                      Донат <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last border border-[#EC39D9]/20 shadow-lg shadow-[#EC39D9]/5">
                  <img
                    alt="Донат на сервере EternalCore"
                    className="aspect-video object-cover"
                    height="310"
                    src="/placeholder.svg?height=310&width=550"
                    width="550"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <span className="mr-2 rounded-full bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] p-1">
                    <Users className="h-3 w-3 text-white" />
                  </span>
                  Присоединяйтесь к нам
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-[#EC39D9] to-[#FB0D68] text-transparent bg-clip-text">
                    Начните играть прямо сейчас
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl">
                    Присоединяйтесь к тысячам игроков на нашем сервере и станьте частью нашего сообщества
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium px-8 py-6 text-lg">
                    <Download className="mr-2 h-5 w-5" /> Скачать лаунчер
                  </Button>
                  <Button variant="outline" className="border-[#EC39D9]/50 hover:bg-[#EC39D9]/10 px-8 py-6 text-lg">
                    Узнать больше
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full border-t py-6 bg-background">
          <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 EternalCore. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm font-medium hover:underline">
                Правила
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline">
                Контакты
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
