import { expect, test } from '@playwright/test';

test('homepage exposes core SEO and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bimo Kharismantoro/);
  await expect(page.locator('h1')).toContainText('digital experience');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maskhar.com/');
  await expect(page.locator('a[href="/work/marshal/"]')).toBeVisible();
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

test('mobile layout stays within viewport', async ({ page }) => {
  await page.goto('/');
  const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});

