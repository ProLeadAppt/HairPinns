import { expect, test, type Page } from '@playwright/test';

const installLeadConnectorMock = async (page: Page) => {
  await page.route('https://beta.leadconnectorhq.com/loader.js', async route => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
        (() => {
          if (document.querySelector('chat-widget')) return;
          const widget = document.createElement('chat-widget');
          widget.id = 'leadconnector-widget';
          widget.setAttribute('data-active', 'false');
          widget.setAttribute('aria-label', 'Hair Pinns chat');
          widget.style.cssText = 'position:fixed;right:16px;bottom:16px;width:72px;height:72px;z-index:2147483000;display:block;';
          const shadow = widget.attachShadow({ mode: 'open' });
          shadow.innerHTML = '<button type="button" aria-label="Open chat" style="position:absolute;inset:0;width:72px;height:72px;border:0;border-radius:0;background:#531b3e;color:white">Chat</button>';
          shadow.querySelector('button').addEventListener('click', () => widget.setAttribute('data-clicked', 'true'));
          document.body.appendChild(widget);
        })();
      `,
    });
  });
};

const boxesOverlap = (
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) => !(
  first.x + first.width <= second.x
  || second.x + second.width <= first.x
  || first.y + first.height <= second.y
  || second.y + second.height <= first.y
);

test.describe('shared floating actions', () => {
  test.beforeEach(async ({ page }) => {
    await installLeadConnectorMock(page);
  });

  test('loads chat after intent before the deferred footer and keeps its launcher clickable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-home-footer]')).toHaveCount(0);

    await page.evaluate(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    });

    const widget = page.locator('chat-widget#leadconnector-widget');
    await expect(widget).toHaveCount(1);
    await expect(widget).toHaveCSS('pointer-events', 'auto');
    await widget.locator('button[aria-label="Open chat"]').click();
    await expect(widget).toHaveAttribute('data-clicked', 'true');
  });

  for (const viewport of [
    { label: '344px mobile', width: 344, height: 882 },
    { label: '390px mobile', width: 390, height: 844 },
    { label: 'tablet', width: 768, height: 1024 },
  ]) {
  test(`coordinates the dock, chat launcher, and scroll-to-top control at ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      const spacer = document.createElement('div');
      spacer.setAttribute('data-floating-test-spacer', '');
      spacer.style.height = '1800px';
      document.body.appendChild(spacer);
    });
    await page.evaluate(() => new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 900);
        resolve();
      });
    }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

    const dock = page.getByRole('region', { name: 'Quick shop bar' });
    const widget = page.locator('chat-widget#leadconnector-widget');
    const scrollTop = page.getByRole('button', { name: 'Scroll to top' });

    await expect(dock).toBeVisible();
    await expect(widget).toBeVisible();
    await expect(scrollTop).toBeVisible();

    const [dockBox, widgetBox, scrollTopBox] = await Promise.all([
      dock.boundingBox(),
      widget.boundingBox(),
      scrollTop.boundingBox(),
    ]);
    expect(dockBox).not.toBeNull();
    expect(widgetBox).not.toBeNull();
    expect(scrollTopBox).not.toBeNull();
    expect(boxesOverlap(widgetBox!, dockBox!)).toBe(false);
    expect(boxesOverlap(scrollTopBox!, dockBox!)).toBe(false);
    expect(widgetBox!.y + widgetBox!.height).toBeLessThanOrEqual(dockBox!.y - 8);
    expect(scrollTopBox!.y + scrollTopBox!.height).toBeLessThanOrEqual(dockBox!.y - 8);
    expect(dockBox!.y - (scrollTopBox!.y + scrollTopBox!.height)).toBeLessThanOrEqual(20);

    await expect(dock).toHaveAttribute('data-mobile-action-dock', '');
    await expect(dock.locator('a')).toHaveCount(2);
    for (const action of await dock.locator('a').all()) {
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    await expect(dock.locator('div').nth(0)).toHaveCSS('border-radius', '0px');

    const footer = page.locator('[data-floating-test-footer]');
    await page.evaluate(() => {
      const testFooter = document.createElement('footer');
      testFooter.setAttribute('data-home-footer', '');
      testFooter.setAttribute('data-floating-test-footer', '');
      testFooter.style.height = '320px';
      document.body.appendChild(testFooter);
      testFooter.scrollIntoView();
    });
    await expect(footer).toBeVisible({ timeout: 20_000 });
    await expect(dock).toHaveCount(0);
  });
  }

  test('keeps desktop floating controls clear without rendering the mobile dock', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      const spacer = document.createElement('div');
      spacer.style.height = '1800px';
      document.body.appendChild(spacer);
    });
    await page.evaluate(() => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.scrollTo(0, 700);
        resolve();
      }));
    }));

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    await expect(page.getByRole('region', { name: 'Quick shop bar' })).toBeHidden();
    await expect(page.locator('chat-widget#leadconnector-widget')).toBeVisible();
    const scrollTop = page.getByRole('button', { name: 'Scroll to top' });
    await expect(scrollTop).toBeVisible();
    const box = await scrollTop.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs((box!.y + box!.height) - (1000 - 32))).toBeLessThanOrEqual(2);
  });
});
