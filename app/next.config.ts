import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { clientEnv } from './env/client'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  deploymentId: process.env.DEPLOYMENT_ID?.trim() || undefined,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: clientEnv.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: clientEnv.NEXT_PUBLIC_API_URL,
  },
}

export default withNextIntl(nextConfig)
