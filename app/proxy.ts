import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Next 16 calls this request-bound routing boundary Proxy. It performs locale
// selection only; authentication and authorization stay in the product API or
// server-side data layer and are never delegated to this optimistic check.
export default createMiddleware(routing)

// Keep the matcher narrow so static assets and internal Next routes are not
// redirected by locale negotiation.
export const config = {
  matcher: ['/', '/(en|zh-CN)/:path*'],
}
