import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((_context, next) => {
  // Allow maskhar.id (primary) plus maskhar.com / maskhar.site
  // CORS is handled via public/_headers for static builds
  return next();
});
