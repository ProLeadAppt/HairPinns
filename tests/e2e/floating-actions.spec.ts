import { expect, test } from '@playwright/test';

const boxesOverlap = (
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) => !(
  first.x + first.width <= second.x
  || second.x + second.width <= first.x
  || first.y + first.height <= second.y
  || second.y + second.height <= first.y
);

test.describe('website floating actions without third-party chat', () => {
  for (const viewport of [
    { label: '344px mobile', width: 344, height: 882 },
    { label: '390px mobile', width: 390, height: 844 },
    { label: 'tablet', width: 768, height: 1024 },
  ]) {
    test(`keeps the sticky dock and scroll-to-top control clear at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const spacer = document.createElement('div');
        spacer.setAttribute('data-floating-test-spacer', '');
        spacer.style.height = '1800px';
        document.body.appendChild(spacer);
        window.scrollTo(0, 900);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

      const dock = page.getByRole('region', { name: 'Quick shop bar' });
      const scrollTop = page.getByRole('button', { name: 'Scroll to top' });
      await expect(dock).toBeVisible();
      await expect(scrollTop).toBeVisible();
      await expect(page.locator('chat-widget, leadconnector-chat-widget')).toHaveCount(0);

      const [dockBox, scrollTopBox] = await Promise.all([
        dock.boundingBox(),
        scrollTop.boundingBox(),
      ]);
      expect(dockBox).not.toBeNull();
      expect(scrollTopBox).not.toBeNull();
      expect(boxesOverlap(scrollTopBox!, dockBox!)).toBe(false);
      expect(scrollTopBox!.y + scrollTopBox!.height).toBeLessThanOrEqual(dockBox!.y - 8);
      expect(dockBox!.y - (scrollTopBox!.y + scrollTopBox!.height)).toBeLessThanOrEqual(20);

      await expect(dock).toHaveAttribute('data-mobile-action-dock', '');
      await expect(dock.locator('a')).toHaveCount(2);
      for (const action of await dock.locator('a').all()) {
        const box = await action.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }

      await page.evaluate(() => {
        const testFooter = document.createElement('footer');
        testFooter.setAttribute('data-home-footer', '');
        testFooter.setAttribute('data-floating-test-footer', '');
        testFooter.style.height = '320px';
        document.body.appendChild(testFooter);
        testFooter.scrollIntoView();
      });
      await expect(page.locator('[data-floating-test-footer]')).toBeVisible();
      await expect(dock).toHaveCount(0);
    });
  }

  test('keeps the desktop scroll-to-top control at the lower edge without a mobile dock', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '1800px';
      document.body.appendChild(spacer);
      window.scrollTo(0, 700);
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    await expect(page.getByRole('region', { name: 'Quick shop bar' })).toBeHidden();
    await expect(page.locator('chat-widget, leadconnector-chat-widget')).toHaveCount(0);

    const scrollTop = page.getByRole('button', { name: 'Scroll to top' });
    await expect(scrollTop).toBeVisible();
    const box = await scrollTop.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs((box!.y + box!.height) - (1000 - 32))).toBeLessThanOrEqual(2);
  });
});

