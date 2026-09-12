import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maskhar.com',
  integrations: [
    sitemap({
      // Include both domains in sitemap generation
      customPages: [
        'https://maskhar.site/',
        'https://maskhar.site/work/',
        'https://maskhar.site/contact/',
        'https://maskhar.site/resume/',
      ]
    })
  ],
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      allowedHosts: [
        'maskhar.com',
        'maskhar.site',
        '.maskhar.com',
        '.maskhar.site',
        'localhost'
      ]
    }
  }
});
