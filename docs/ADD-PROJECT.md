# Panduan Menambahkan Project Baru

## Struktur File Project

Semua project disimpan di folder src/content/projects/ dalam format Markdown (.md).

## Cara Menambahkan Project Baru

### 1. Copy Template
Copy file _TEMPLATE.md dan rename sesuai slug project (contoh: 
ama-project.md)

### 2. Isi Frontmatter (bagian antara --- dan ---)

```yaml
---
title: Nama Project Lengkap
slug: nama-project-url
category: Web Development / Graphic Design / Brand & Web / UI/UX Design
year: '2025'
width: 1200
height: 630
image: /assets/img/portfolio/web/nama-file.webp
link: https://link-project.com
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
- 	itle: Nama project
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
- link: URL live project (kosongkan atau hapus jika tidak ada)

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
- Naming: lowercase, dash-separated (contoh: 
ama-project.webp)

### Cara Menambah Gambar
1. Simpan gambar ke folder yang sesuai
2. Convert ke WebP jika belum (bisa pakai online tools)
3. Update field image, width, dan height di frontmatter

## Contoh Project Lengkap

Lihat file-file ini sebagai referensi:
- carubra.md - Web project dengan link live
- uzzerhood.md - Web project dengan fitur lengkap
- marshal.md - Web project eksplorasi tanpa link
- chill.md - Brand & web project
- rand-visual-collection.md - Graphic design project

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
- Rebuild: 
pm run build

### Gambar tidak muncul
- Cek path image benar (mulai dari /assets/...)
- Pastikan file gambar exist di folder public/
- Cek capitalization nama file (case-sensitive)

### Build error
- Jalankan 
pm run check untuk lihat error detail
- Pastikan semua field wajib terisi
- Cek tidak ada typo di field names
