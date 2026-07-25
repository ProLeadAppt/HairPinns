import { expect, test } from '@playwright/test';

const channel = (value: number) => {
  const ratio = value / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
};
const luminance = (rgb: string) => {
  const [red, green, blue] = rgb.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (foreground: string, background: string) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/areas/menai-2234');
});

test('every legacy suburb client route resolves to its postcode canonical page', async ({ page }) => {
  const redirects = {
    bangor: 'bangor-2234',
    menai: 'menai-2234',
    illawong: 'illawong-2234',
    'alfords-point': 'alfords-point-2234',
    sutherland: 'sutherland-2232',
    kirrawee: 'kirrawee-2232',
    kareela: 'kareela-2232',
    como: 'como-2226',
    gymea: 'gymea-2227',
    miranda: 'miranda-2228',
    cronulla: 'cronulla-2230',
    'barden-ridge': 'barden-ridge-2234',
    caringbah: 'caringbah-2229',
    jannali: 'jannali-2226',
    'oyster-bay': 'oyster-bay-2225',
    padstow: 'padstow-2211',
    sylvania: 'sylvania-2224',
  } as const;

  for (const [legacySlug, canonicalSlug] of Object.entries(redirects)) {
    await page.goto(`/suburbs/${legacySlug}`);
    await expect(page).toHaveURL(new RegExp(`/areas/${canonicalSlug}/?$`));
    await expect(page.locator('[data-location-page]')).toBeVisible();
  }
});

test('location page dark-section headings retain readable contrast', async ({ page }) => {
  for (const heading of [
    page.getByRole('heading', { level: 1, name: 'Hairdresser near Menai' }),
    page.getByRole('heading', { level: 2, name: 'From Menai to Bangor' }),
  ]) {
    await expect(heading).toBeVisible();
    const colors = await heading.evaluate((element) => ({
      foreground: getComputedStyle(element).color,
      background: getComputedStyle(element.closest('section')!).backgroundColor,
    }));
    expect(contrast(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
  }
});

test('location page links use the After-Hours plum token', async ({ page }) => {
  const afterHoursPlum = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'hsl(var(--after-hours-plum))';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  for (const link of [
    page.getByRole('link', { name: 'View menu' }).first(),
    page.getByRole('link', { name: 'Bangor', exact: true }),
  ]) {
    expect(await link.evaluate((element) => getComputedStyle(element).color)).toBe(afterHoursPlum);
  }
});

test('location page keeps 16px content gutters at Fold cover width', async ({ page }) => {
  const headingBox = await page.getByRole('heading', { level: 1, name: 'Hairdresser near Menai' }).boundingBox();
  const menuLinkBox = await page.getByRole('link', { name: 'View menu' }).first().boundingBox();
  expect(headingBox).not.toBeNull();
  expect(menuLinkBox).not.toBeNull();
  expect(headingBox!.x).toBeGreaterThanOrEqual(16);
  expect(menuLinkBox!.x + menuLinkBox!.width).toBeLessThanOrEqual(328);
});
