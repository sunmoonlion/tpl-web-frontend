import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { clientEnv } from '@/env/client'

const logoutUrl = `${clientEnv.NEXT_PUBLIC_API_URL}/auth/logout`

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta')

  return {
    title: t('workspaceTitle'),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function DashboardPage() {
  const t = await getTranslations('auth')
  const tNav = await getTranslations('nav')

  return (
    <div className="bg-background min-h-screen" data-route-class="authenticated-workspace">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="text-muted-foreground text-sm font-medium">{tNav('dashboard')}</span>
        <a
          href={logoutUrl}
          className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
        >
          {t('logout')}
        </a>
      </header>
      <main className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{tNav('dashboard')}</h1>
        <p className="text-muted-foreground mt-2">{t('dashboardWelcome')}</p>
      </main>
    </div>
  )
}
