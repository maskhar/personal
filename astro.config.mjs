import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maskhar.id',
  integrations: [
    sitemap({
      // Halaman ber-`noindex` tidak boleh ikut sitemap: dua sinyal yang
      // bertentangan membuat crawler menebak mana yang dimaksud.
      filter: (page) => !['/thanks/', '/404/'].some((path) => new URL(page).pathname.startsWith(path))
    })
  ],
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      allowedHosts: [
        'maskhar.id',
        '.maskhar.id',
        'maskhar.com',
        'maskhar.site',
        '.maskhar.com',
        '.maskhar.site',
        'localhost'
      ]
    }
  }
});
