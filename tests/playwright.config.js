import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx --yes serve .. -l 4173 -s',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    cwd: __dirname,
  },
});
