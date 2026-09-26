# Panduan Menambahkan Project Baru

## Struktur File Project

Semua project disimpan di folder src/content/projects/ dalam format Markdown (.md).

## Cara Menambahkan Project Baru

### 1. Copy Template
Copy file docs/PROJECT-TEMPLATE.md ke src/content/projects/ dan rename sesuai
slug project (contoh: nama-project.md)

### 2. Isi Frontmatter (bagian antara --- dan ---)

```yaml
---
title: Nama Project Lengkap
slug: nama-project-url
category: Web Development
year: '2025'
width: 1200
height: 630
image: /assets/img/portfolio/web/nama-file.webp
gallery:
  - src: /assets/img/portfolio/web/nama-file.webp
    alt: Tampilan utama project
  - src: /assets/img/portfolio/web/nama-file-fitur.webp
    alt: Rincian fitur project
links:
  - label: Website Publik
    href: https://link-project.com/
  - label: Dashboard
    href: https://dashboard.link-project.com/
description: Deskripsi singkat 1-2 kalimat
challenge: Masalah atau tantangan project
solution: Solusi yang diimplementasikan
services:
  - Service 1
  - Service 2
  - Service 3
---
```

### 3. Isi Konten (setelah ---)

Tulis deskripsi lengkap project menggunakan Markdown. Bisa include:
- Paragraf pembuka
- Detail implementasi
- Fitur utama (opsional)
- Tech stack (untuk web project)
- Hasil/impact (opsional)

## Field Wajib vs Opsional

### Wajib
- title: Nama project
- slug: URL-friendly name (huruf kecil, tanpa spasi, pakai dash)
- category: Pilih salah satu category yang tersedia
- year: Tahun project (dalam tanda petik)
- width: Lebar gambar dalam pixel
- height: Tinggi gambar dalam pixel
- image: Path ke gambar di folder public/
- description: Deskripsi singkat untuk meta & listing
- challenge: Tantangan yang dihadapi
- solution: Solusi yang diimplementasikan
- services: Array/list services yang dikerjakan

### Opsional
- links: Daftar tautan eksternal non-kosong, tiap item berisi label dan href.
  Dipakai untuk project dengan lebih dari satu tautan (mis. website publik +
  dashboard).
- link: URL live project tunggal (format lama). Hapus field jika tidak ada;
  string kosong tidak valid.
- gallery: Daftar gambar carousel, tiap item berisi src dan alt.

#### Precedence links vs link

Halaman detail memakai `links` jika field itu ada, dan merender satu tombol per
item di blok `.project-actions`. Field `link` hanya dipakai sebagai fallback
ketika `links` tidak ada, dan dirender sebagai satu tombol berlabel
"Kunjungi Website". Jangan andalkan `link` untuk muncul berdampingan dengan
`links`: kalau `links` diisi, `link` diabaikan.

- Punya satu tautan saja: pakai `link` (tetap valid) atau `links` dengan satu item.
- Punya beberapa tautan: pakai `links`, jangan gabung dengan `link`.
- Tidak ada tautan sama sekali: hapus kedua field. `links: []` ditolak karena
  `links` wajib berisi minimal satu item.

#### Validasi URL

Setiap `href` di `links` dan nilai `link` harus URL absolut dengan skema
`http://` atau `https://`. Skema lain (`mailto:`, `ftp:`), path relatif
(`/work/...`), dan string kosong ditolak saat build karena tombol dirender
dengan `target="_blank"`. Gunakan `https://` bila situs tujuan mendukungnya.
Field yang tidak dipakai dihapus, bukan diisi string kosong.

#### Gallery opsional

Field `gallery` boleh dihapus. Perilaku render:

- Tanpa `gallery`, atau `gallery` hanya 1 item: hero image tunggal dari `image`.
- `gallery` berisi 2 item atau lebih: carousel dengan tombol prev/next dan
  penghitung slide.

Item pertama gallery biasanya sama dengan `image` supaya preview listing dan
slide pertama konsisten. Setiap item butuh `alt` deskriptif untuk aksesibilitas.

## Category yang Tersedia

1. **Web Development** - Untuk project website/web app
2. **Graphic Design** - Untuk design work, poster, social media, etc
3. **Brand & Web** - Kombinasi branding + web
4. **UI/UX Design** - Fokus pada interface dan experience design

## Gambar Project

### Lokasi
- Web projects: public/assets/img/portfolio/web/
- Design projects: public/assets/img/portfolio/design/

### Format
- Format: WebP (untuk performa optimal)
- Ukuran recommended: 1200x630px untuk hero image
- Naming: lowercase, dash-separated (contoh: nama-project.webp)

### Cara Menambah Gambar
1. Simpan gambar ke folder yang sesuai
2. Convert ke WebP jika belum (bisa pakai online tools)
3. Update field image, width, dan height di frontmatter
4. Jika gambar dipakai di carousel, tambahkan juga ke gallery beserta alt

## Contoh Project Lengkap

Lihat file-file ini di src/content/projects/ sebagai referensi:
- carubra.md - Web project dengan link live tunggal (format lama) + gallery
- soundpub.md - Web project dengan links ganda (website publik + dashboard)
- buzzerhood.md - Web project dengan fitur lengkap
- marshal.md - Web project eksplorasi tanpa link
- chill.md - Brand & web project
- brand-visual-collection.md - Graphic design project

## Testing

Setelah menambahkan project baru:

```bash
# Check TypeScript errors
npm run check

# Build dan validate
npm run build

# Preview locally
npm run preview
```

## Tips

1. **Slug harus unique** - Jangan ada 2 project dengan slug sama
2. **Konsisten dengan category** - Pilih category yang paling sesuai
3. **Services realistis** - List services yang benar-benar dikerjakan
4. **Description singkat** - Max 2 kalimat untuk meta description
5. **Challenge & Solution jelas** - Jelaskan value yang diberikan

## Troubleshooting

### Project tidak muncul di listing
- Cek apakah file ada di src/content/projects/
- Pastikan format frontmatter benar (YAML valid)
- Rebuild: npm run build

### Gambar tidak muncul
- Cek path image benar (mulai dari /assets/...)
- Pastikan file gambar exist di folder public/
- Cek capitalization nama file (case-sensitive)

### Build error
- Jalankan npm run check untuk lihat error detail
- Pastikan semua field wajib terisi
- Cek tidak ada typo di field names
- Cek setiap href di links dan nilai link memakai http:// atau https://
