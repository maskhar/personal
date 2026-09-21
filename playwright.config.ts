import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Astro meng-inline PUBLIC_* saat build, tapi Playwright tidak membaca .env.
// Muat manual supaya test bisa menyesuaikan diri dengan build yang diuji
// (mis. GA4 aktif atau tidak). Variabel yang sudah ada di shell menang.
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const key = match[1];
    if (process.env[key] !== undefined) continue;
    process.env[key] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4322', trace: 'retain-on-failure', launchOptions: process.env.CI ? {} : { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } },
  webServer: { command: 'npm run build && node scripts/serve-dist.mjs', url: 'http://127.0.0.1:4322', reuseExistingServer: false, timeout: 120000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 5'] } }]
});


