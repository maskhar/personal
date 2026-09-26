import { expect, test } from '@playwright/test';

test('homepage exposes core SEO and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bimo Kharismantoro/);
  await expect(page.locator('h1')).toContainText('digital experience');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maskhar.id/');
  await expect(page.locator('.project-grid a[href="/work/marshal/"]')).toBeVisible();
  await expect(page.getByRole('link', { name: /Hubungi saya/ })).toHaveAttribute('href', '/contact/');
});

test('head exposes social and indexing metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /index, follow/);
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Bimo Kharismantoro');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'id_ID');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://maskhar.id/og-image.png');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  for (const name of ['twitter:title', 'twitter:description', 'twitter:image']) {
    await expect(page.locator(`meta[name="${name}"]`)).toHaveAttribute('content', /.{10,}/);
  }
  const person = await page.locator('script[type="application/ld+json"]').first().textContent();
  const schema = JSON.parse(person ?? '{}');
  expect(schema['@type']).toBe('Person');
  expect(Array.isArray(schema.knowsAbout)).toBeTruthy();
  expect(schema.sameAs.length).toBeGreaterThanOrEqual(3);
  // Kepemilikan produk harus terbaca mesin, bukan hanya dari prosa halaman.
  expect(schema.owns).toMatchObject({ '@type': 'SoftwareApplication', name: 'CARUBRA AI Studio' });
});

test('homepage carries its own title and description', async ({ page }) => {
  await page.goto('/');
  const [title, description] = await Promise.all([
    page.title(),
    page.locator('meta[name="description"]').getAttribute('content')
  ]);
  expect(title).toContain('Tulungagung');
  expect(title.length).toBeLessThanOrEqual(65);
  expect(description).toContain('CARUBRA AI Studio');
  expect(description?.length).toBeGreaterThanOrEqual(80);
  // Description generik dipakai halaman lain; homepage harus punya miliknya sendiri.
  await page.goto('/contact/');
  const other = await page.locator('meta[name="description"]').getAttribute('content');
  expect(other).not.toBe(description);
});

for (const slug of ['marshal', 'soundpub']) {
  test(`command palette opens, filters, and navigates to ${slug}`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#cmdk')).toBeHidden();
    await page.keyboard.press('ControlOrMeta+k');
    await expect(page.locator('#cmdk')).toBeVisible();
    await page.locator('#cmdk-input').fill(slug);
    await expect(page.locator('.cmdk-item:visible')).toHaveCount(1);
    await expect(page.locator('.cmdk-item:visible a')).toHaveAttribute('href', `/work/${slug}/`);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/work/${slug}/$`));
  });
}

test('analytics is gated behind its env var', async ({ page }) => {
  // GA4 di-inline saat build, jadi yang diuji adalah hasil build ini:
  // tanpa PUBLIC_GA4_ID tidak boleh ada script sama sekali; dengan
  // PUBLIC_GA4_ID script harus memakai ID itu, bukan ID lain.
  const ga4Id = process.env.PUBLIC_GA4_ID?.trim();
  await page.goto('/');
  const gtag = page.locator('script[src*="googletagmanager.com"]');
  if (ga4Id) {
    await expect(gtag).toHaveCount(1);
    await expect(gtag).toHaveAttribute('src', new RegExp(`[?&]id=${ga4Id}(&|$)`));
  } else {
    await expect(gtag).toHaveCount(0);
  }
});

test('thank-you page stays out of search results and sitemap', async ({ page, request }) => {
  await page.goto('/thanks/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  const response = await request.get('/sitemap-0.xml');
  expect(response.ok()).toBeTruthy();
  const sitemap = await response.text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));
  expect(locations.length).toBeGreaterThan(0);
  for (const location of locations) {
    expect(location.origin).toBe('https://maskhar.id');
    // Route ber-noindex tidak boleh ikut sitemap.
    expect(['/thanks/', '/404/']).not.toContain(location.pathname);
  }
  expect(locations.map((location) => location.pathname)).toContain('/work/soundpub/');
});

test('project filter updates visible cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Design' }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await expect(page.locator('.project-card:visible')).toContainText('Brand & Visual Collection');
});

test('SoundPub appears on homepage and work listing', async ({ page }) => {
  for (const route of ['/', '/work/']) {
    await page.goto(route);
    const card = page.locator(`.project-card[href="/work/soundpub/"]`);
    await expect(card).toBeVisible();
    await expect(card).toContainText('SoundPub');
    await expect(card).toContainText('Web Development · 2026');
  }
});

test('SoundPub detail renders safe links and CreativeWork metadata', async ({ page }) => {
  await page.goto('/work/soundpub/');
  await expect(page.locator('h1')).toHaveText('SoundPub');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maskhar.id/work/soundpub/');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');

  const actions = page.locator('.project-actions');
  await expect(actions.getByRole('link', { name: /Website Publik/ })).toHaveAttribute('href', 'https://soundpub.xyz/');
  await expect(actions.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', 'https://dashboard.soundpub.xyz/');
  const externalLinks = actions.locator('a[target="_blank"]');
  await expect(externalLinks).toHaveCount(2);
  for (const link of await externalLinks.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('rel', /noreferrer/);
  }

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => JSON.parse(node.textContent ?? '{}'))
  );
  const creativeWork = schemas.find((schema) => schema['@type'] === 'CreativeWork');
  expect(creativeWork).toMatchObject({
    name: 'SoundPub',
    url: 'https://maskhar.id/work/soundpub/',
    genre: 'Web Development'
  });
});

test('SoundPub gallery navigates all loaded slides with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/soundpub/');

  const gallery = page.locator('[data-gallery]');
  await expect(gallery.locator('.slide')).toHaveCount(4);
  const count = gallery.locator('[data-count]');
  const next = gallery.locator('[data-next]');

  for (let index = 1; index <= 4; index += 1) {
    await expect(count).toHaveText(`${index} / 4`);
    const image = gallery.locator('.slide[aria-hidden="false"] img');
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    await next.click();
  }
  await expect(count).toHaveText('1 / 4');
});

test('legacy project link remains a Kunjungi Website action', async ({ page }) => {
  await page.goto('/work/carubra/');
  const legacyLink = page.locator('.project-actions').getByRole('link', { name: /Kunjungi Website/ });
  await expect(legacyLink).toHaveAttribute('href', 'https://carubra.com');
  // Gambar CARUBRA berorientasi potret; OG harus melaporkan dimensi aslinya.
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1024');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '1536');
  await expect(legacyLink).toHaveAttribute('target', '_blank');
  await expect(legacyLink).toHaveAttribute('rel', /noopener/);
});

test('project detail renders content and structured data', async ({ page }) => {
  await page.goto('/work/marshal/');
  await expect(page.locator('h1')).toHaveText('Marshal');
  await expect(page.locator('.breadcrumbs')).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(4);
});

test('contact form exposes labelled required fields', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('form')).toHaveAttribute('method', 'POST');
  for (const id of ['name', 'email', 'service', 'message']) {
    await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
    await expect(page.locator(`#${id}`)).toHaveAttribute('required', '');
  }
});

test('resume route is printable and complete', async ({ page }) => {
  await page.goto('/resume/');
  await expect(page.locator('h1')).toHaveText('Bimo Kharismantoro');
  await expect(page.locator('.timeline-org', { hasText: 'UTERO Creative Indonesia' })).toBeVisible();
  await expect(page.locator('.timeline-org', { hasText: 'Universitas Muhammadiyah Malang' })).toBeVisible();
  const profile = page.locator('.resume-section').filter({ hasText: 'Profile' }).first();
  await expect(profile).toContainText('pendiri & kreator CARUBRA AI Studio');
  await expect(profile.getByRole('link', { name: 'CARUBRA AI Studio' })).toHaveAttribute('href', '/work/carubra/');
  await expect(page.locator('.skill-meter')).not.toHaveCount(0);
  // Skills dikelompokkan; tiap grup harus punya judul dan minimal satu meter,
  // dan tiap meter harus terbaca screen reader sebagai progressbar bernilai.
  const groups = page.locator('.skill-group');
  await expect(groups).toHaveCount(5);
  for (const label of ['Frontend & UI', 'Backend & Data', 'Infrastruktur & DevOps', 'AI & Automation', 'Design & Visual']) {
    const group = page.getByRole('region', { name: label });
    await expect(group.locator('.skill-meter')).not.toHaveCount(0);
  }
  // Frontend dan backend harus berdiri di grup masing-masing, bukan tercampur.
  await expect(page.getByRole('region', { name: 'Frontend & UI' }).getByRole('progressbar', { name: 'Next.js' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Backend & Data' }).getByRole('progressbar', { name: 'Supabase' })).toBeVisible();
  const meters = page.getByRole('progressbar');
  await expect(meters).toHaveCount(28);
  for (const value of await meters.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-valuenow')))) {
    expect(Number(value)).toBeGreaterThan(0);
    expect(Number(value)).toBeLessThanOrEqual(100);
  }
  await expect(page.getByRole('button', { name: /Simpan PDF/ })).toBeVisible();
});

test('content images stay inside the viewport on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only behavior');
  await page.goto('/work/carubra/');
  const viewportWidth = page.viewportSize()?.width ?? 0;
  const images = page.locator('.project-body img');
  await expect(images).not.toHaveCount(0);
  for (const box of await images.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width))) {
    expect(box).toBeLessThanOrEqual(viewportWidth);
  }
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});

test('SoundPub actions stay inside mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only behavior');
  await page.goto('/work/soundpub/');
  const viewportWidth = page.viewportSize()?.width ?? 0;
  const actions = page.locator('.project-actions');
  await expect(actions.getByRole('link', { name: /Website Publik/ })).toBeVisible();
  await expect(actions.getByRole('link', { name: /Dashboard/ })).toBeVisible();
  const boxes = await actions.locator('a').evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    })
  );
  expect(boxes.length).toBeGreaterThan(0);
  for (const box of boxes) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(viewportWidth);
  }
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});

test('resume skill meters stay inside mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only behavior');
  await page.goto('/resume/');
  const viewportWidth = page.viewportSize()?.width ?? 0;
  const tracks = page.locator('.skill-meter-track');
  await expect(tracks).not.toHaveCount(0);
  // Grid dua kolom harus runtuh jadi satu kolom di layar sempit, bukan meluber.
  const columns = await page.locator('.skills-meter-list').first().evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length
  );
  expect(columns).toBe(1);
  for (const box of await tracks.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect()))) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(viewportWidth);
  }
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});

test('mobile menu opens without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only behavior');
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#site-nav')).toHaveClass(/is-open/);
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});
