import { expect, test } from '@playwright/test';

test('homepage exposes core SEO and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bimo Kharismantoro/);
  await expect(page.locator('h1')).toContainText('digital experience');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maskhar.com/');
  await expect(page.locator('a[href="/work/marshal/"]')).toBeVisible();
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
  await expect(page.getByText('Web Development')).toBeVisible();
  await expect(page.getByRole('link', { name: /Simpan PDF/ })).toBeVisible();
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
