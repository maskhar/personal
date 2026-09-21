import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'maskhar.id',
      '.maskhar.id',
      'maskhar.com',
      'maskhar.site',
      '.maskhar.com',
      '.maskhar.site'
    ]
  }
});
