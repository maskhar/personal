# Dokumentasi Portfolio Maskhar

## Setup Multi-Domain

Portfolio ini mendukung dua domain:
- **https://maskhar.com** (primary)
- **https://maskhar.site** (secondary)

## Dokumentasi Tersedia

### [SETUP-COMPLETE.md](./SETUP-COMPLETE.md)
Panduan lengkap implementasi multi-domain, termasuk:
- File yang dibuat/dimodifikasi
- Status build dan validasi
- Langkah deployment
- Catatan penting tentang hosting

### [DOMAINS.md](./DOMAINS.md)
Konfigurasi DNS untuk kedua domain:
- Setup DNS untuk maskhar.com dan maskhar.site
- Opsi hosting (GitHub Pages, Cloudflare, Vercel, Netlify)
- A Records dan CNAME configuration

### [TUNNELING.md](./TUNNELING.md)
Panduan tunneling untuk development:
- Setup tunnel dengan Cloudflare/ngrok/LocalTunnel
- Troubleshooting "Blocked request" error
- Konfigurasi Vite allowedHosts

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Run tests
npm test

# Lighthouse CI
npm run lighthouse
```

## Tech Stack

- Astro 7 + TypeScript
- Static Site Generation
- Playwright (browser tests)
- Lighthouse CI (performance)
- GitHub Pages (deployment)

## File Structure

```
├── src/
│   ├── content/projects/    # Project markdown files
│   ├── data/               # Site config & services
│   ├── layouts/            # Base layout
│   ├── pages/              # Routes
│   └── styles/             # Global CSS
├── public/                 # Static assets
├── docs/                   # Documentation
└── scripts/                # Build validation
```

## Deployment

Push ke branch main untuk trigger GitHub Pages deployment otomatis via GitHub Actions.
