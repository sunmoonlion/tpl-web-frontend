import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PORT ?? 3008)
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL
const baseURL = externalBaseURL ?? `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'pnpm prepare:standalone && node .next/standalone/server.js',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        env: {
          APP_ORIGIN: baseURL,
          WEB_BACKEND_INTERNAL_URL: 'http://127.0.0.1:8000',
          DEPLOYMENT_ID: 'p0-008b-b1-e2e',
          HOSTNAME: '127.0.0.1',
          PORT: String(port),
        },
      },
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
})
