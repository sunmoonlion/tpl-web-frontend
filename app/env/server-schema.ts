import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { z } from 'zod'

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ORIGIN: z.url().optional(),
  WEB_BACKEND_INTERNAL_URL: z.url().optional(),
  DEPLOYMENT_ID: z.string().trim().min(1).optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema> & {
  APP_ORIGIN: string
  WEB_BACKEND_INTERNAL_URL: string
  DEPLOYMENT_ID: string
}

type ParseServerEnvOptions = {
  phase?: string
}

export function parseServerEnv(
  input: Record<string, string | undefined>,
  options: ParseServerEnvOptions = {},
): ServerEnv {
  const parsed = serverEnvSchema.parse(input)
  const isProductionBuild = options.phase === PHASE_PRODUCTION_BUILD
  const allowLocalDefaults = parsed.NODE_ENV !== 'production' || isProductionBuild

  const appOrigin = parsed.APP_ORIGIN ?? (allowLocalDefaults ? 'http://localhost:3000' : undefined)
  const webBackendInternalUrl =
    parsed.WEB_BACKEND_INTERNAL_URL ?? (allowLocalDefaults ? 'http://127.0.0.1:8000' : undefined)
  const deploymentId = parsed.DEPLOYMENT_ID ?? (allowLocalDefaults ? 'local' : undefined)

  if (!appOrigin || !webBackendInternalUrl || !deploymentId) {
    throw new Error(
      'Invalid server environment: APP_ORIGIN, WEB_BACKEND_INTERNAL_URL and DEPLOYMENT_ID are required at production runtime',
    )
  }

  return {
    ...parsed,
    APP_ORIGIN: appOrigin,
    WEB_BACKEND_INTERNAL_URL: webBackendInternalUrl,
    DEPLOYMENT_ID: deploymentId,
  }
}
