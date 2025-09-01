// playwright.config.ts — конфиг E2E
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:3000'
  },
  testDir: 'src/tests/e2e'
});


