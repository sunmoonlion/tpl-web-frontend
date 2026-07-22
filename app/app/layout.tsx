import type { Metadata } from 'next'
import { defaultLocale } from '@/i18n'
import { PlatformProviders } from '@/components/platform/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'tpl App',
  description: 'tpl web application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={defaultLocale} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <PlatformProviders>{children}</PlatformProviders>
      </body>
    </html>
  )
}
