import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'maskhar.com',
      'maskhar.site',
      '.maskhar.com',
      '.maskhar.site'
    ]
  }
});
