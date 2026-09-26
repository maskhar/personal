// Ambil tangkapan layar situs publik SoundPub untuk studi kasus portofolio.
//
// Jalankan: node scripts/capture-soundpub.mjs
//
// Hanya menyentuh halaman publik di soundpub.xyz. Dashboard sengaja tidak
// dibuka: area itu butuh login dan bisa memuat data akun. Script berhenti
// dengan galat kalau heading yang dicari tidak ada, supaya halaman error
// atau maintenance tidak ikut tersimpan sebagai aset.
//
// Tangkapan diambil per-viewport setelah scroll, bukan per-elemen. Navbar
// situs ini `position: fixed` (tinggi 65px), jadi tangkapan elemen akan
// kemasukan navbar yang menimpa konten.

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

const ORIGIN = 'https://soundpub.xyz';
const OUT_DIR = 'public/assets/img/portfolio/web';

// Rasio viewport dijaga sama dengan rasio output supaya sharp hanya
// memperkecil, tidak memotong sisi gambar.
const CONTENT = { width: 1440, height: 900, scale: 1600 / 1440 };   // → 1600x1000
const THUMB = { width: 1440, height: 756, scale: 1200 / 1440 };     // → 1200x630

const NAV_HEIGHT = 65;
const HEADROOM = 24; // sisa ruang di atas heading supaya tidak mepet navbar

/** @type {{name:string,path:string,anchor:string,geometry:typeof CONTENT,top?:boolean}[]} */
const SHOTS = [
  { name: 'soundpub', path: '/', anchor: 'Wujudkan Karya', geometry: THUMB, top: true },
  { name: 'soundpub-hero', path: '/', anchor: 'Wujudkan Karya', geometry: CONTENT, top: true },
  { name: 'soundpub-features', path: '/', anchor: 'Mengapa Soundpub?', geometry: CONTENT },
  { name: 'soundpub-store-partners', path: '/store-partner', anchor: 'Platform Partner Kami', geometry: CONTENT },
  { name: 'soundpub-services-flow', path: '/services', anchor: 'Cara Menjual Musik Anda', geometry: CONTENT }
];

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  // Tunggu setiap <img> yang terlihat selesai dimuat.
  await page.evaluate(async () => {
    const pending = [...document.images].filter((img) => !img.complete);
    await Promise.all(pending.map((img) => new Promise((done) => {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    })));
  });
  // Matikan animasi/transisi supaya hasil deterministik. Ini hanya berlaku
  // di halaman yang dirender browser ini, bukan di situs aslinya.
  await page.addStyleTag({
    content: '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'
  });
  await page.waitForTimeout(700);
}

async function capture(browser, shot) {
  const { width, height, scale } = shot.geometry;
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    // Konteks bersih: tanpa cookie, tanpa sesi, tanpa akun.
    storageState: undefined
  });

  const url = ORIGIN + shot.path;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (!response || !response.ok()) {
    throw new Error(`${url} balas ${response?.status() ?? 'tanpa respons'}`);
  }

  await settle(page);

  // Heading penanda wajib ada. Kalau tidak, yang terbuka bukan halaman
  // yang dimaksud — jangan simpan apa pun.
  const anchor = page.getByText(shot.anchor, { exact: false }).first();
  await anchor.waitFor({ state: 'visible', timeout: 20000 });

  if (!shot.top) {
    // Beberapa bagian baru tampak setelah IntersectionObserver menerima
    // kunjungan viewport. Lewati halaman sekali dulu, lalu kembali ke target
    // agar semua kartu section sudah dalam keadaan selesai dirender.
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(800);

    const y = await anchor.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.max(0, y - NAV_HEIGHT - HEADROOM));
    await page.waitForTimeout(800);
  }

  const png = await page.screenshot({ type: 'png' });
  await page.close();

  const target = { width: Math.round(width * scale), height: Math.round(height * scale) };
  const file = `${OUT_DIR}/${shot.name}.webp`;
  await sharp(png).resize(target.width, target.height, { fit: 'fill' }).webp({ quality: 84 }).toFile(file);

  const { size } = await stat(file);
  const meta = await sharp(file).metadata();
  console.log(`${shot.name.padEnd(24)} ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB  ← ${url}`);
}

// Argumen opsional membatasi tangkapan ke nama tertentu, misalnya
// `node scripts/capture-soundpub.mjs soundpub-features`.
const only = new Set(process.argv.slice(2));
const queue = only.size ? SHOTS.filter((shot) => only.has(shot.name)) : SHOTS;
if (!queue.length) throw new Error(`Tidak ada shot bernama: ${[...only].join(', ')}`);

const browser = await chromium.launch({ channel: 'chrome' });
try {
  await mkdir(OUT_DIR, { recursive: true });
  for (const shot of queue) await capture(browser, shot);
} finally {
  await browser.close();
}
