# Migrasi Portfolio Modern

## Selesai

- [x] Buat branch migrasi `codex/astro-modern-seo`.
- [x] Tambah fondasi Astro + TypeScript.
- [x] Buat layout SEO global dan metadata canonical.
- [x] Buat homepage responsive dengan navigasi, hero, layanan, karya, dan kontak.
- [x] Pindahkan data profil, layanan, dan project ke modul terstruktur.
- [x] Tambah `robots.txt` dan sitemap dasar.
- [x] Tambah `prefers-reduced-motion`, focus state, skip link, dan alt text.
- [x] Ganti seluruh placeholder project dengan data dan link final.
- [x] Kompres aset terpakai ke WebP dan pindahkan ke `public/`.
- [x] Audit dan hapus Bootstrap, PHP form, HTML, dan aset legacy yang sudah diganti.
- [x] Tambah halaman daftar karya dan detail statis `/work/[slug]/`.
- [x] Sambungkan contact form statis ke FormSubmit dengan honeypot dan success page.
- [x] Tambah JSON-LD `Person`.
- [x] Tambah JSON-LD `WebSite` dan `BreadcrumbList`.
- [x] Tambah JSON-LD `CreativeWork` lengkap per project.
- [x] Tambah Open Graph image final, web manifest, dan favicon modern.
- [x] Tambah validasi otomatis SEO dasar, route, aset, dan broken internal references.
- [x] Tambah Lighthouse CI untuk performance, accessibility, best practices, dan SEO.
- [x] Tambah Playwright browser smoke tests untuk route, SEO, form, dan mobile layout.
- [x] Tambah analytics privacy-friendly opt-in via Umami environment variables.
- [x] Tambah redirect URL portfolio lama ke URL baru.
- [x] Ganti homepage lama dengan output Astro melalui workflow deployment.

## Tambahan (Multi-Domain & Project Management)

- [x] Tambah dukungan multi-domain (maskhar.com & maskhar.site)
- [x] Tambah CORS configuration via `_headers`
- [x] Tambah Vite allowedHosts untuk tunneling support
- [x] Tambah field `link` opsional untuk project dengan live URL
- [x] Buat template dan dokumentasi untuk menambahkan project baru
- [x] Tambah project real: CARUBRA AI Agent dan Buzzerhood
- [x] Update project existing dengan format lengkap dan konsisten
- [x] Rapikan dokumentasi ke folder `docs/`

## Catatan

Portfolio sekarang memiliki:
- 5 project (CARUBRA, Buzzerhood, Marshal, Chill, Brand & Visual Collection)
- Dukungan link eksternal untuk project dengan live demo
- Template copy-paste untuk menambahkan project baru
- Dokumentasi lengkap di folder `docs/`

Tinggal tambahkan gambar real untuk CARUBRA dan Buzzerhood di:
- `public/assets/img/portfolio/web/carubra.webp`
- `public/assets/img/portfolio/web/buzzerhood.webp`
