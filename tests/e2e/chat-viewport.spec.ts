import { expect, test } from '@playwright/test';

// Mirrors the inspected LeadConnector layout: middle-right launcher, 340px
// panel, right:80px and 70px launcher padding. No conversations are sent.
test.beforeEach(async ({ page }) => {
  await page.route('https://beta.leadconnectorhq.com/loader.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `(() => {
      const host = document.createElement('chat-widget');
      host.id = 'leadconnector-widget-loader'; host.dataset.active = 'false';
      const root = host.attachShadow({mode:'open'});
      root.innerHTML = '<style>#lc_text-widget{position:fixed;bottom:50%;right:80px;transform:translateY(50%);padding-bottom:70px;z-index:2147483000} #lc_text-widget--box{display:none;width:340px;height:660px;background:white;border:1px solid purple;box-sizing:border-box} :host([data-active="true"]) #lc_text-widget--box{display:block} #lc_text-widget--btn{position:fixed;bottom:50%;right:-60px;transform:translateY(50%);height:58px;width:58px}</style><div id="lc_text-widget"><div id="lc_text-widget--box"><button aria-label="Close chat panel">Close</button><p>Choose a chat option</p></div><button id="lc_text-widget--btn" aria-label="Open chat">Chat</button></div>';
      root.querySelector('#lc_text-widget--btn').onclick = () => { host.dataset.active = 'true'; };
      root.querySelector('[aria-label="Close chat panel"]').onclick = () => { host.dataset.active = 'false'; };
      document.body.append(host);
    })();`,
  }));
});

for (const width of [344, 390, 768]) {
  test(`chat opens, fits and reopens at ${width}px without moving the whole host`, async ({ page }) => {
    await page.setViewportSize({width, height:844});
    await page.goto('/');
    await page.evaluate(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true}));
      const spacer = document.createElement('div');
      spacer.style.height = '1800px';
      document.body.appendChild(spacer);
    });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => {
      window.scrollTo(0, 650); resolve();
    })));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
    const dock = page.getByRole('region', {name:'Quick shop bar'});
    await expect(dock).toBeVisible();
    const host = page.locator('chat-widget');
    await expect(host).toHaveCSS('translate', 'none');
    await page.getByRole('button', {name:'Open chat',exact:true}).click();
    await expect(dock).toBeHidden();
    const panel = page.locator('#lc_text-widget--box');
    const assertFits = async (height: number) => {
      const box = await panel.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(8);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8);
      expect(box!.y).toBeGreaterThanOrEqual(8);
      expect(box!.y + box!.height).toBeLessThanOrEqual(height - 8);
      await expect(page.getByRole('button', {name:'Close chat panel'})).toBeInViewport();
    };
    await expect(panel).toBeVisible();
    await assertFits(844);
    await page.setViewportSize({width,height:430});
    await expect.poll(async () => (await panel.boundingBox())!.height).toBeLessThanOrEqual(406);
    await assertFits(430);
    await page.getByRole('button',{name:'Close chat panel'}).click();
    await expect(panel).toBeHidden();
    await page.getByRole('button',{name:'Open chat',exact:true}).click();
    await expect(panel).toBeVisible();
    await assertFits(430);
  });
}

test('collapsed chat transparent padding does not intercept shopping controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await expect(page.getByRole('button', { name: 'Open chat', exact: true })).toBeVisible();
  await page.evaluate(() => {
    const root = document.querySelector('chat-widget')!.shadowRoot!;
    // The real collapsed vendor wrapper retains its prompt width plus 70px
    // empty padding. That invisible rectangle must not consume page clicks.
    (root.querySelector('#lc_text-widget') as HTMLElement).style.width = '301px';
    const target = document.createElement('button');
    target.textContent = 'Shopping click-through probe';
    target.style.cssText = 'position:fixed;right:200px;top:50%;width:130px;height:30px;z-index:1000';
    target.onclick = () => { target.textContent = 'Shopping action reached'; };
    document.body.append(target);
  });
  await page.getByRole('button', { name: 'Shopping click-through probe' }).click({ timeout: 3000 });
  await expect(page.getByRole('button', { name: 'Shopping action reached' })).toBeVisible();
  await page.getByRole('button', { name: 'Open chat', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Close chat panel' })).toBeVisible();
});
