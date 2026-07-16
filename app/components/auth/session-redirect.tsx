'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clientEnv } from '@/env/client'

export function SessionRedirect({ locale }: { locale: string }) {
  const router = useRouter()

  useEffect(() => {
    fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((r) => {
        if (!r.ok) return null
        return r.json() as Promise<{ user: unknown }>
      })
      .then((data) => {
        if (data?.user) router.replace(`/${locale}/dashboard`)
      })
      .catch(() => {})
  }, [locale, router])

  return null
}
