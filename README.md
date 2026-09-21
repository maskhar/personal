# Maskhar Portfolio

Modern personal portfolio for Bimo Kharismantoro.

## Stack

- Astro 7 + TypeScript
- Astro Content Collections for project content
- Static output for GitHub Pages
- Playwright browser tests
- Lighthouse CI

## Commands

```bash
npm install
npm run dev
npm run build
npm test
npm run lighthouse
```

`npm test` builds the site and serves `dist` on loopback port 4322, separate from the development server. Keep that port free. Local tests currently use Chrome installed at `C:/Program Files/Google/Chrome/Application/chrome.exe`; CI installs Playwright Chromium.

The sitemap lists only the canonical `maskhar.id` domain. The thank-you page is excluded and marked `noindex`.

## Add project

Create Markdown file under `src/content/projects/`. Frontmatter schema lives in `src/content.config.ts`.

Required fields: `title`, `slug`, `category`, `year`, `image`, `width`, `height`, `description`, `challenge`, `solution`, `services`.

## Optional analytics

Copy `.env.example` to `.env` and fill in whichever provider you use — no analytics script loads when its variables are absent.

**Google Analytics 4**

```env
PUBLIC_GA4_ID=G-XXXXXXXXXX
```

Get the measurement ID from analytics.google.com → Admin → Data Streams → Web. `gtag.js` (with `anonymize_ip: true`) is only injected when this is set — nothing to change in code.

**Umami** (alternative/additional)

```env
PUBLIC_UMAMI_SCRIPT_URL=https://analytics.example.com/script.js
PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

Both can be set at the same time; each renders independently.

## Deployment

Push to `main` to trigger GitHub Pages deployment. GitHub Pages must use Actions as source. Custom domain is stored in `public/CNAME`.
