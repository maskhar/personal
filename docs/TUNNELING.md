# Tunneling Setup untuk Multi-Domain

## Masalah yang Diselesaikan

Error: Blocked request. This host ("maskhar.site") is not allowed.

## Solusi

Vite dev server sekarang mengizinkan akses dari kedua domain melalui tunnel.

## Konfigurasi yang Diterapkan

**astro.config.mjs**
- Menambahkan ite.server.allowedHosts di dalam Astro config
- Mengizinkan: maskhar.com, maskhar.site, subdomain, dan localhost

**vite.config.js**
- Standalone Vite config (backup)
- Konfigurasi yang sama

## Cara Menggunakan dengan Tunnel

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Setup Tunnel (contoh dengan Cloudflare Tunnel, ngrok, atau lainnya)

**Cloudflare Tunnel:**
```bash
cloudflared tunnel --url http://localhost:4321 --hostname maskhar.site
```

**ngrok:**
```bash
ngrok http --domain=maskhar.site 4321
```

**LocalTunnel:**
```bash
lt --port 4321 --subdomain maskhar-site
```

### 3. Akses Domain
Setelah tunnel aktif, akses:
- https://maskhar.site (via tunnel)
- https://maskhar.com (via tunnel jika dikonfigurasi)
- http://localhost:4321 (lokal)

## Penting: Restart Dev Server

Setiap kali mengubah stro.config.mjs atau ite.config.js, **HARUS restart** dev server:

1. Stop dengan Ctrl+C
2. Jalankan ulang: 
pm run dev
3. Setup tunnel lagi
4. Test akses

## Domain yang Diizinkan

✓ maskhar.com
✓ maskhar.site
✓ *.maskhar.com (semua subdomain)
✓ *.maskhar.site (semua subdomain)
✓ localhost

## Troubleshooting

**Masih muncul "Blocked request"?**
1. Pastikan sudah restart dev server
2. Cek apakah tunnel mengarah ke port yang benar (default: 4321)
3. Cek console untuk error lain
4. Coba tambahkan domain spesifik ke llowedHosts jika menggunakan subdomain

**Tunnel tidak connect?**
1. Pastikan dev server berjalan di port 4321
2. Cek firewall/antivirus
3. Pastikan tunnel service terinstall dengan benar

**CORS error?**
- Sudah ditangani oleh public/_headers
- Middleware di src/middleware.ts juga siap
