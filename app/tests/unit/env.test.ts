import { describe, expect, it } from 'vitest'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { parseClientEnv } from '@/env/client'
import { parseServerEnv } from '@/env/server-schema'

describe('client environment', () => {
  it('accepts the same-origin API contract', () => {
    expect(
      parseClientEnv({
        NEXT_PUBLIC_APP_NAME: 'tpl',
        NEXT_PUBLIC_API_URL: '/api',
      }),
    ).toEqual({
      NEXT_PUBLIC_APP_NAME: 'tpl',
      NEXT_PUBLIC_API_URL: '/api',
    })
  })

  it.each(['https://api.example.com', '//api.example.com', 'api', String.raw`\api`])(
    'rejects a non same-origin API URL: %s',
    (value) => {
      expect(() =>
        parseClientEnv({
          NEXT_PUBLIC_APP_NAME: 'tpl',
          NEXT_PUBLIC_API_URL: value,
        }),
      ).toThrow()
    },
  )
})

describe('server environment', () => {
  it('fails closed when production runtime values are missing', () => {
    expect(() =>
      parseServerEnv({
        NODE_ENV: 'production',
      }),
    ).toThrow(/required at production runtime/)
  })

  it('allows reproducible local defaults during a production build', () => {
    expect(
      parseServerEnv(
        {
          NODE_ENV: 'production',
        },
        {
          phase: PHASE_PRODUCTION_BUILD,
        },
      ),
    ).toMatchObject({
      APP_ORIGIN: 'http://localhost:3000',
      WEB_BACKEND_INTERNAL_URL: 'http://127.0.0.1:8000',
      DEPLOYMENT_ID: 'local',
    })
  })

  it('accepts an explicit production runtime contract', () => {
    expect(
      parseServerEnv({
        NODE_ENV: 'production',
        APP_ORIGIN: 'https://tpl.sunmoonai.com',
        WEB_BACKEND_INTERNAL_URL: 'http://tpl-web-backend:8000',
        DEPLOYMENT_ID: 'release-42',
      }),
    ).toMatchObject({
      APP_ORIGIN: 'https://tpl.sunmoonai.com',
      WEB_BACKEND_INTERNAL_URL: 'http://tpl-web-backend:8000',
      DEPLOYMENT_ID: 'release-42',
    })
  })
})
