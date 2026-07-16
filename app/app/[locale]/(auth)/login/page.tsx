import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { SessionRedirect } from '@/components/auth/session-redirect'
import { clientEnv } from '@/env/client'
import { cn } from '@/lib/utils'

const loginUrl = `${clientEnv.NEXT_PUBLIC_API_URL}/auth/login`
const signupUrl = `${clientEnv.NEXT_PUBLIC_API_URL}/auth/signup`
const continueUrl = `${clientEnv.NEXT_PUBLIC_API_URL}/auth/continue`

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta')

  return {
    title: t('loginTitle'),
    robots: {
      index: false,
      follow: false,
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    error?: string
    error_hint?: string
    error_description?: string
    /** 由 BFF /api/auth/after-signup 或 Casdoor 跳转带回 */
    registered?: string
  }>
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const t = await getTranslations('auth')
  const paramsQ = await searchParams

  let errorText: string | null = null
  if (paramsQ.error === 'auth_failed') {
    errorText = t('errorAuthFailed')
  } else if (paramsQ.error === 'no_code') {
    errorText = t('errorNoCode')
  } else if (paramsQ.error === 'oauth_error') {
    const parts = [paramsQ.error_hint, paramsQ.error_description].filter(Boolean)
    errorText = parts.length ? parts.join(' — ') : t('errorOAuthGeneric')
  }

  const signupOk = paramsQ.registered === '1' || paramsQ.registered === 'true'

  return (
    <main
      className="bg-background flex min-h-screen items-center justify-center"
      data-route-class="login"
    >
      <SessionRedirect locale={locale} />
      <div className="w-full max-w-sm space-y-6 rounded-xl border p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('loginTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('loginSubtitle')}</p>
          <p className="text-muted-foreground text-xs">{t('loginCasdoorHint')}</p>
        </div>
        {signupOk ? (
          <p
            role="status"
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-center text-sm text-emerald-800 dark:text-emerald-200"
          >
            {t('signupSuccessHint')}
          </p>
        ) : null}
        {errorText ? (
          <p
            role="alert"
            className="border-destructive/40 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-center text-sm"
          >
            {errorText}
          </p>
        ) : null}
        <a href={loginUrl} className={cn(buttonVariants({ className: 'w-full' }))}>
          {t('login')}
        </a>
        <p className="text-muted-foreground text-center text-sm">
          <a
            href={signupUrl}
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            {t('signup')}
          </a>
        </p>
        <p className="text-muted-foreground text-center text-xs">
          <a href={continueUrl} className="underline-offset-4 hover:underline">
            {t('continueToDashboard')}
          </a>
        </p>
      </div>
    </main>
  )
}
