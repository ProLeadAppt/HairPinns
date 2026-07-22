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

test('lower-homepage Shopify images wait for viewport intent before loading', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  const lowerHomepageImageRequests: string[] = [];

  page.on('request', request => {
    if (
      request.resourceType() === 'image' &&
      request.url().startsWith('https://cdn.shopify.com/')
    ) {
      lowerHomepageImageRequests.push(request.url());
    }
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1_000);
  expect(lowerHomepageImageRequests).toEqual([]);

  for (let y = 0; y <= 5000; y += 250) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.getByRole('heading', { name: /popular picks from the shelf/i }).isVisible().catch(() => false)) break;
  }

  const heading = page.getByRole('heading', { name: /popular picks from the shelf/i });
  await expect(heading).toBeVisible({ timeout: 20_000 });
  const shelf = heading.locator('xpath=ancestor::section[1]');
  await expect(shelf.locator('article')).toHaveCount(6, { timeout: 30_000 });

  const images = shelf.locator('article img');
  await expect(images).toHaveCount(6);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(
      () => image.evaluate(node => node.complete && node.naturalWidth > 0),
      { timeout: 15_000 },
    ).toBe(true);
  }
  expect(lowerHomepageImageRequests.length).toBeGreaterThan(0);
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

test('editorial guide desk restores advice content and routes at Fold width', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let y = 0; y <= 12_000; y += 350) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.getByRole('heading', { name: /notes from behind the chair/i }).count()) break;
  }

  const heading = page.getByRole('heading', { name: /notes from behind the chair/i });
  await expect(heading).toBeVisible({ timeout: 20_000 });
  const guides = heading.locator('xpath=ancestor::section[1]');
  const articles = guides.locator('article');
  await expect(articles).toHaveCount(3);

  const expectedHrefs = [
    '/blog/best-hair-products-australia-2025',
    '/blog/where-to-buy-salon-hair-products-australia',
    '/blog/hair-products-melbourne-brisbane-perth-australia',
  ];
  await expect(guides.locator('a:has(article)')).toHaveCount(3);
  expect(await guides.locator('a:has(article)').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expectedHrefs);

  const excerpts = await articles.locator('p:not(:first-child)').evaluateAll(nodes => nodes.map(node => node.textContent?.trim() ?? ''));
  expect(excerpts).toHaveLength(3);
  expect(excerpts.every(excerpt => excerpt.length > 20)).toBe(true);

  for (const image of await guides.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(
      () => image.evaluate(node => node.complete && node.naturalWidth > 0),
      { timeout: 10_000 },
    ).toBe(true);
  }

  const catalogue = guides.getByRole('link', { name: 'View all guides' });
  await expect(catalogue).toHaveAttribute('href', '/blog');
  expect((await catalogue.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

  const sectionBox = await guides.boundingBox();
  expect(sectionBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThan(1600);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);
});

test('contained salon close preserves Fresha booking at mobile and landscape widths', async ({ page }) => {
  const openSalonClose = async () => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    for (let y = 0; y <= 15_000; y += 350) {
      await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(80);
      if (await page.getByRole('heading', { name: /come in and see me/i }).count()) break;
    }
    const heading = page.getByRole('heading', { name: /come in and see me/i });
    await expect(heading).toBeVisible({ timeout: 20_000 });
    return heading.locator('xpath=ancestor::section[1]');
  };

  await page.setViewportSize({ width: 344, height: 882 });
  let salonClose = await openSalonClose();
  await expect(salonClose).toHaveAttribute('data-home-booking-close', '');
  await expect(salonClose).toContainText('05 / Visit the salon');
  await expect(salonClose).toContainText('60 Goorgool Rd, Bangor NSW');
  await expect(salonClose.getByRole('link', { name: '0416 037 663' })).toHaveAttribute('href', 'tel:+61416037663');

  const booking = salonClose.getByRole('link', { name: 'Book now', exact: true });
  await expect(booking).toHaveAttribute('href', 'https://www.fresha.com/a/hair-pinns-bangor-studio-bangor-60-goorgool-road-eb7ff3lb');
  await expect(booking).toHaveAttribute('target', '_blank');
  await expect(booking).toHaveAttribute('rel', 'noopener noreferrer');
  expect((await booking.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

  const workingImage = salonClose.getByRole('img', { name: /Jena styling a client’s hair/i });
  await workingImage.scrollIntoViewIfNeeded();
  await expect.poll(
    () => workingImage.evaluate(node => node.complete && node.naturalWidth > 0),
    { timeout: 10_000 },
  ).toBe(true);

  const mobileBounds = await salonClose.evaluate(section => {
    const panes = [section.querySelector('figure'), section.querySelector('h2')?.parentElement];
    return panes.map(pane => pane?.getBoundingClientRect()).map(rect => ({ left: rect?.left ?? -1, right: rect?.right ?? 9999 }));
  });
  expect(mobileBounds.every(bound => bound.left >= 0 && bound.right <= 344)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);

  await page.setViewportSize({ width: 844, height: 390 });
  salonClose = await openSalonClose();
  const landscape = await salonClose.evaluate(section => {
    const imagePane = section.querySelector('figure')?.getBoundingClientRect();
    const copyPane = section.querySelector('h2')?.parentElement?.getBoundingClientRect();
    return {
      height: section.getBoundingClientRect().height,
      sideBySide: Boolean(imagePane && copyPane && copyPane.left >= imagePane.right - 1),
    };
  });
  expect(landscape.sideBySide).toBe(true);
  expect(landscape.height).toBeLessThan(1000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(844);
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

test('sticky commerce bar yields to the contained salon close and restores above it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const bar = page.getByRole('region', { name: 'Quick shop bar' });
  const scrollTop = page.getByRole('button', { name: 'Scroll to top' });
  await page.evaluate(async () => {
    for (let y = 100; y <= 900; y += 100) {
      window.scrollTo(0, y);
      await new Promise(resolve => window.setTimeout(resolve, 80));
    }
  });
  await expect(bar).toBeVisible();
  await expect(scrollTop).toBeVisible();

  for (let y = 900; y <= 15_000; y += 350) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.getByRole('heading', { name: /come in and see me/i }).count()) break;
  }

  const salonHeading = page.getByRole('heading', { name: /come in and see me/i });
  await salonHeading.scrollIntoViewIfNeeded();
  await expect(salonHeading).toBeVisible();
  await expect(bar).toHaveCount(0);
  await expect(scrollTop).toHaveCount(0);

  const salonClose = salonHeading.locator('xpath=ancestor::section[1]');
  const booking = salonClose.getByRole('link', { name: 'Book now', exact: true });
  await booking.scrollIntoViewIfNeeded();
  await expect(booking).toBeVisible();
  const bookingBox = await booking.boundingBox();
  expect(bookingBox ? bookingBox.y + bookingBox.height : Number.POSITIVE_INFINITY).toBeLessThanOrEqual(844);
  await expect(bar).toHaveCount(0);
  await expect(scrollTop).toHaveCount(0);

  const guideHeading = page.getByRole('heading', { name: /notes from behind the chair/i });
  await guideHeading.scrollIntoViewIfNeeded();
  await expect(guideHeading).toBeVisible();
  await expect(bar).toBeVisible();
  await expect(scrollTop).toBeVisible();
  await expect(bar.getByRole('link', { name: 'Shop all products' })).toHaveAttribute('href', '/collections');

  await salonHeading.scrollIntoViewIfNeeded();
  await expect(bar).toHaveCount(0);
  await expect(scrollTop).toHaveCount(0);
});

test('after-hours footer closes with complete commerce, salon, and legal paths', async ({ page }) => {
  await page.setViewportSize({ width: 344, height: 882 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  for (let y = 0; y <= 18_000; y += 400) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
    if (await page.locator('footer[data-home-footer]').count()) break;
  }

  const footer = page.locator('footer[data-home-footer]');
  await expect(footer).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(100);

  await expect(footer.getByRole('heading', { name: 'Take 10% off your first order.' })).toBeVisible();
  const newsletter = footer.getByRole('textbox', { name: 'Email address for 10% off newsletter signup' });
  const subscribe = footer.getByRole('button', { name: 'Send my code' });
  await expect(newsletter).toHaveAttribute('aria-describedby', 'footer-newsletter-note');
  expect((await newsletter.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect((await subscribe.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);

  const footerNav = footer.getByRole('navigation', { name: 'Footer navigation' });
  const expectedFooterRoutes = [
    '/collections', '/blog', '/policies/shipping', '/policies/returns', '/faq', '/glossary',
    '/services', '/booking', '/about', '/areas', '/contact',
  ];
  const footerHrefs = await footerNav.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(footerHrefs).toEqual(expectedFooterRoutes);

  const legal = footer.getByRole('navigation', { name: 'Legal links' });
  const legalHrefs = await legal.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(legalHrefs).toEqual(['/policies/shipping', '/policies/returns', '/privacy', '/terms']);

  await expect(footer.getByRole('link', { name: '0416 037 663' })).toHaveAttribute('href', 'tel:+61416037663');
  await expect(footer.getByRole('link', { name: 'Text us' })).toHaveAttribute('href', /^sms:\+61416037663/);
  await expect(footer.getByRole('link', { name: /WhatsApp/i })).toHaveAttribute('href', /^https:\/\/wa\.me\/61416037663/);
  await expect(footer.getByRole('link', { name: /Instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/hair.pinns/');
  await expect(footer.getByRole('link', { name: /Facebook/i })).toHaveAttribute('href', 'https://www.facebook.com/Hair.Pinns');
  await expect(footer).toContainText('60 Goorgool Rd');
  await expect(footer).toContainText('Bangor NSW 2234');
  await expect(footer).toContainText('Visa');
  await expect(footer.getByRole('link', { name: 'Munyal' })).toHaveAttribute('href', 'https://munyal.com.au');

  const metrics = await footer.evaluate(element => {
    const targets = Array.from(element.querySelectorAll<HTMLElement>('a, button, input'));
    return {
      height: element.getBoundingClientRect().height,
      background: getComputedStyle(element).backgroundColor,
      minTarget: Math.min(...targets.map(target => target.getBoundingClientRect().height)),
      linkCount: element.querySelectorAll('a').length,
    };
  });
  expect(metrics.height).toBeLessThan(1750);
  expect(metrics.background).toBe('rgb(24, 0, 31)');
  expect(metrics.minTarget).toBeGreaterThanOrEqual(44);
  expect(metrics.linkCount).toBe(22);
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Quick shop bar' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(344);
});
