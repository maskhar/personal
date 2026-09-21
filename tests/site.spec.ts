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
  for (const name of ['twitter:title', 'twitter:description', 'twitter:image']) {
    await expect(page.locator(`meta[name="${name}"]`)).toHaveAttribute('content', /.{10,}/);
  }
  const person = await page.locator('script[type="application/ld+json"]').first().textContent();
  const schema = JSON.parse(person ?? '{}');
  expect(schema['@type']).toBe('Person');
  expect(Array.isArray(schema.knowsAbout)).toBeTruthy();
  expect(schema.sameAs.length).toBeGreaterThanOrEqual(3);
});

test('command palette opens, filters, and navigates', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cmdk')).toBeHidden();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.locator('#cmdk')).toBeVisible();
  await page.locator('#cmdk-input').fill('marshal');
  await expect(page.locator('.cmdk-item:visible')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work\/marshal\/$/);
});

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
    expect(location.pathname).not.toBe('/thanks/');
  }
});

test('project filter updates visible cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Design' }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(1);
  await expect(page.locator('.project-card:visible')).toContainText('Brand & Visual Collection');
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
  await expect(page.locator('.skill-meter')).not.toHaveCount(0);
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

test('mobile menu opens without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only behavior');
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#site-nav')).toHaveClass(/is-open/);
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});
