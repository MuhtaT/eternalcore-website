import type { Metadata } from 'next'
import Link from "next/link"
import Image from "next/image"
import './globals.css'
import { NextAuthProvider } from '@/components/next-auth-provider'
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorProvider } from '@/lib/contexts/error-context'
import { ErrorDisplay } from '@/components/error-display'
import { AuthButton } from '@/components/auth-button'
import { PlayDialog } from '@/components/play-dialog'
import { ModeToggle } from '@/components/mode-toggle'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Gamepad2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EternalCore',
  description: 'Minecraft сервер на версии 1.16.5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ErrorProvider>
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
                          className="mr-2 sm:w-[65px] sm:h-[65px] min-w-[50px] min-h-[50px]"
                        />
                      </Link>
                      <nav className="hidden gap-6 md:flex">
                        <Link
                          href="/"
                          className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          Главная
                        </Link>
                        <Link
                          href="/about"
                          className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          О сервере
                        </Link>
                        <Link
                          href="/donate"
                          className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          Донат
                        </Link>
                        <Link
                          href="/rules"
                          className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          Правила
                        </Link>
                        <Link
                          href="/contacts"
                          className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                          Контакты
                        </Link>
                      </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                      <nav className="flex items-center space-x-2">
                        <div className="hidden md:flex items-center mr-2 rounded-full bg-background border border-border px-3 py-1.5">
                          <span className="text-sm font-medium">play.eternalcore.ru</span>
                          <CopyButton value="play.eternalcore.ru" iconOnly className="ml-1 h-6 w-6 p-0" />
                        </div>
                        <ModeToggle />
                        <AuthButton />
                        <PlayDialog variant="play">
                          <Button variant="default" className="bg-[#FB0D68] hover:bg-[#FB0D68]/90 text-white font-medium">
                            <Gamepad2 className="mr-2 h-4 w-4" /> Играть сейчас
                          </Button>
                        </PlayDialog>
                      </nav>
                    </div>
                  </div>
                </header>
                <main className="flex-1">
                  {children}
                </main>
                <footer className="w-full border-t py-6 bg-background">
                  <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      © 2025 EternalCore. Все права защищены.
                    </p>
                    <div className="flex gap-4">
                      <Link href="/rules" className="text-sm font-medium hover:underline">
                        Правила
                      </Link>
                      <Link href="/contacts" className="text-sm font-medium hover:underline">
                        Контакты
                      </Link>
                      <Link href="/legal/privacy-policy" className="text-sm font-medium hover:underline">
                        Политика конфиденциальности
                      </Link>
                      <Link href="/legal/terms-of-service" className="text-sm font-medium hover:underline">
                        Пользовательское соглашение
                      </Link>
                      <Link href="/legal/offer-agreement" className="text-sm font-medium hover:underline">
                        Договор оферты
                      </Link>
                    </div>
                  </div>
                  <div className="container mt-4">
                    <div className="border-t pt-4">
                      <p className="text-center text-xs text-muted-foreground">
                        EternalCore не связан и не поддерживается Mojang AB, Microsoft или любой другой компанией, связанной с Minecraft. "Minecraft" является товарным знаком Mojang AB.
                      </p>
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        Все продажи виртуальных товаров на данном сервере представляют собой лицензию на использование цифровой интеллектуальной собственности EternalCore. Покупая донат-пакеты или привилегии, вы приобретаете право на использование дополнительных игровых возможностей на условиях, описанных в договоре оферты.
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
              <ErrorDisplay />
            </ErrorProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
