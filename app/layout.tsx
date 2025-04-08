import type { Metadata } from 'next'
import './globals.css'
import { NextAuthProvider } from '@/components/next-auth-provider'
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorProvider } from '@/lib/contexts/error-context'
import { ErrorDisplay } from '@/components/error-display'

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
              {children}
              <ErrorDisplay />
            </ErrorProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
