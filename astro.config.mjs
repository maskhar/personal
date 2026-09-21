import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maskhar.id',
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/thanks/')
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
