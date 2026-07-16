import { expect, test } from '@playwright/test';

const blockThirdParties = async (page: import('@playwright/test').Page) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
};

test.beforeEach(async ({ page }) => {
  await blockThirdParties(page);
});

test('homepage leads with shopping and keeps booking secondary', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hero = page.locator('main section').first();
  const heroLinks = hero.getByRole('link');
  await expect(heroLinks.first()).toHaveAccessibleName("Shop Jena's shelf");
  await expect(heroLinks.first()).toHaveAttribute('href', '/collections');
  await expect(hero.getByRole('link', { name: /book the bangor salon/i })).toBeVisible();
});

test('product discovery appears before founder and salon content', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.scrollTo(0, Math.max(900, window.innerHeight)));
  const concernHeading = page.getByRole('heading', { name: /start with what your hair needs/i });
  await expect(concernHeading).toBeVisible({ timeout: 15_000 });
  await concernHeading.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    for (let y = 900; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise(resolve => window.setTimeout(resolve, 80));
    }
  });

  const positions = await page.evaluate(() => {
    const textPosition = (text: string) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node = walker.nextNode() as HTMLElement | null;
      while (node) {
        if (node.matches('h1, h2') && node.textContent?.toLowerCase().includes(text)) {
          return node.getBoundingClientRect().top + window.scrollY;
        }
        node = walker.nextNode() as HTMLElement | null;
      }
      return -1;
    };
    return {
      concerns: textPosition('start with what your hair needs'),
      sellers: textPosition('popular picks from the shelf'),
      founder: textPosition('a short shelf'),
      salon: textPosition('come in and see me'),
    };
  });

  expect(positions.concerns).toBeGreaterThanOrEqual(0);
  expect(positions.sellers).toBeGreaterThan(positions.concerns);
  expect(positions.founder).toBeGreaterThan(positions.sellers);
  expect(positions.salon).toBeGreaterThan(positions.founder);
});

test('editorial product shelf remains shoppable at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let y = 0; y <= 5000; y += 400) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.getByRole('heading', { name: /popular picks from the shelf/i }).count()) break;
  }

  const heading = page.getByRole('heading', { name: /popular picks from the shelf/i });
  await expect(heading).toBeVisible({ timeout: 20_000 });
  const shelf = heading.locator('xpath=ancestor::section[1]');
  await expect(shelf.locator('article')).toHaveCount(6, { timeout: 30_000 });

  const quickAdds = shelf.getByRole('button', { name: /add to bag/i });
  expect(await quickAdds.count()).toBeGreaterThan(0);
  const firstQuickAddBox = await quickAdds.first().boundingBox();
  expect(firstQuickAddBox?.height ?? 0).toBeGreaterThanOrEqual(44);

  await expect(shelf.getByRole('link', { name: /shop all products/i })).toHaveAttribute('href', '/collections');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);
});

test('founder proof mounts visibly and stays concise at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let y = 0; y <= 9000; y += 350) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.getByRole('heading', { name: /a short shelf, chosen by a working hairdresser/i }).count()) break;
  }

  const heading = page.getByRole('heading', { name: /a short shelf, chosen by a working hairdresser/i });
  await expect(heading).toBeVisible({ timeout: 20_000 });
  const proof = heading.locator('xpath=ancestor::section[1]');
  await expect(proof.getByRole('img', { name: /Jena, owner and hairdresser/i })).toBeVisible();
  await expect(proof.locator('ol > li')).toHaveCount(3);

  const links = proof.getByRole('link');
  await expect(links.first()).toHaveAccessibleName('Shop the shelf');
  await expect(links.first()).toHaveAttribute('href', '/collections');
  await expect(proof.getByRole('link', { name: /read Jena’s story/i })).toHaveAttribute('href', '/about');

  const proofBox = await proof.boundingBox();
  expect(proofBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThan(1600);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);
});

test('mobile menu and sticky action remain commerce first', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Mobile menu' });
  const shopAllLink = menu.getByRole('link', { name: 'Shop all products' });
  await expect(shopAllLink).toHaveAttribute('href', '/collections');
  const frizzLink = menu.getByRole('link', { name: 'Shop frizz control' });
  await expect(frizzLink).toHaveAttribute('href', '/collections/frizz-free-must-haves');
  await expect(menu.getByRole('link', { name: 'Salon services' })).toHaveAttribute('href', '/services');

  await frizzLink.click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/collections\/frizz-free-must-haves\/?$/);

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const bar = page.getByRole('region', { name: 'Quick shop bar' });
  await expect(bar).toHaveCount(0);
  await page.evaluate(async () => {
    for (let y = 100; y <= 900; y += 100) {
      window.scrollTo(0, y);
      await new Promise(resolve => window.setTimeout(resolve, 100));
    }
  });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Shop all products' })).toHaveAttribute('href', '/collections');
  await expect(bar.getByRole('link', { name: /book salon/i })).toHaveAttribute('href', /fresha\.com/);

  await page.evaluate(async () => {
    for (let step = 0; step < 30; step += 1) {
      window.scrollBy(0, 400);
      await new Promise(resolve => window.setTimeout(resolve, 100));
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) break;
    }
  });
  await expect(bar).toHaveCount(0);
});
