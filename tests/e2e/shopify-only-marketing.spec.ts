import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(
    /googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net/,
    route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
});

test('site no longer loads the GoHighLevel chat or capture runtime', async ({ page }) => {
  const thirdPartyRequests: string[] = [];
  page.on('request', request => {
    if (/leadconnector|msgsndr|gohighlevel/i.test(request.url())) {
      thirdPartyRequests.push(request.url());
    }
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1_000);

  expect(thirdPartyRequests).toEqual([]);
  await expect(page.locator('[data-widget-id], leadconnector-chat-widget')).toHaveCount(0);
  expect(await page.evaluate(() => 'hpCapture' in window)).toBe(false);
});

test('footer signup sends explicit consent to the Shopify subscription endpoint', async ({ page }) => {
  let submittedPayload: unknown;
  await page.route('**/api/newsletter-subscribe', async route => {
    submittedPayload = route.request().postDataJSON();
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{"accepted":true}' });
  });

  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  const footer = page.locator('footer');
  for (let y = 0; y <= 5_000 && (await footer.count()) === 0; y += 500) {
    await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await expect(footer).toBeAttached();
  await footer.scrollIntoViewIfNeeded();
  await footer.getByLabel('Email address for Hair Pinns newsletter signup').fill('reader@example.com');
  await footer.getByRole('button', { name: 'Join the list' }).click();

  await expect(page.getByText("You're on the list. New here? Look out for your welcome email and first-order code.")).toBeVisible();
  expect(submittedPayload).toMatchObject({
    contact: { email: 'reader@example.com' },
    context: {
      form_name: 'newsletter_footer',
      event_name: 'newsletter_subscription',
    },
    consent: {
      marketing: true,
      opt_in_level: 'single',
    },
  });
  await expect(footer).toContainText('You can unsubscribe any time');
  await expect(footer.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy');
});
