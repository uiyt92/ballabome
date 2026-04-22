import { defineConfig, devices } from '@playwright/test'

/**
 * 프로덕션 스모크 전용 config (webServer 없음)
 * 실행: npx playwright test --config=playwright.prod.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: /prod-smoke\.spec\.ts/,
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
