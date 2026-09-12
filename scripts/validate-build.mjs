import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const dist = resolve('dist');
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function targetFor(htmlFile, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('#') || /^[a-z]+:/i.test(clean) || clean.startsWith('//')) return null;
  if (clean.startsWith('/')) return join(dist, clean.slice(1));
  return resolve(dirname(htmlFile), clean);
}

function targetExists(target) {
  if (!target) return true;
  if (existsSync(target) && statSync(target).isFile()) return true;
  if (existsSync(target) && statSync(target).isDirectory() && existsSync(join(target, 'index.html'))) return true;
  if (existsSync(target + '.html')) return true;
  return existsSync(join(target, 'index.html'));
}

for (const file of walk(dist).filter((path) => path.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const label = relative(dist, file);
  const redirect = /http-equiv=["']refresh["']/i.test(html);

  if (!redirect) {
    const checks = [
      ['bahasa dokumen', /<html[^>]+lang=["']id["']/i],
      ['title', /<title>[^<]{3,}<\/title>/i],
      ['meta description', /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i],
      ['canonical', /<link[^>]+rel=["']canonical["']/i],
      ['Open Graph title', /<meta[^>]+property=["']og:title["']/i],
      ['Open Graph image', /<meta[^>]+property=["']og:image["']/i],
      ['heading h1', /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i]
    ];
    for (const [name, pattern] of checks) if (!pattern.test(html)) errors.push(`${label}: ${name} tidak ditemukan`);
  }

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = targetFor(file, match[1]);
    if (!targetExists(target)) errors.push(`${label}: referensi rusak ${match[1]}`);
  }
}

for (const required of ['index.html', '404.html', 'robots.txt', 'sitemap-index.xml', 'og-image.png', 'site.webmanifest']) {
  if (!existsSync(join(dist, required))) errors.push(`output wajib tidak ditemukan: ${required}`);
}

if (errors.length) {
  console.error(`Validasi build gagal (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Validasi build lulus: SEO dasar, route, dan referensi internal aman.');
