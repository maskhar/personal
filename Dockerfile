# syntax=docker/dockerfile:1

# =========================================================
#  maskhar.id — static Astro site served by nginx
#  Stage 1: build  → menghasilkan dist/
#  Stage 2: runtime → nginx:alpine, tanpa Node sama sekali
# =========================================================

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Astro inline-kan semua variabel PUBLIC_* ke HTML saat BUILD,
# jadi GA4/Umami harus masuk lewat build arg — bukan runtime env.
ARG PUBLIC_GA4_ID=""
ARG PUBLIC_UMAMI_SCRIPT_URL=""
ARG PUBLIC_UMAMI_WEBSITE_ID=""
ENV PUBLIC_GA4_ID=$PUBLIC_GA4_ID \
    PUBLIC_UMAMI_SCRIPT_URL=$PUBLIC_UMAMI_SCRIPT_URL \
    PUBLIC_UMAMI_WEBSITE_ID=$PUBLIC_UMAMI_WEBSITE_ID

# Dependency dulu supaya layer-nya ke-cache selama lockfile gak berubah
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# npm run build = astro check && astro build && validate-build.mjs
# Build gagal kalau SEO dasar / internal link ada yang rusak.
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM nginx:alpine AS runtime

LABEL org.opencontainers.image.title="maskhar-web" \
      org.opencontainers.image.description="Portfolio & CV Bimo Kharismantoro (Astro static)" \
      org.opencontainers.image.url="https://maskhar.id"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
