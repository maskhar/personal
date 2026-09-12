import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((_context, next) => {
  // Allow both maskhar.com and maskhar.site
  // CORS is handled via public/_headers for static builds
  return next();
});
