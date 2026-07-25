import { expect, test } from "@playwright/test";
import { ENTITY_REGISTRY } from "../../src/config/entityRegistry";

const ratings = [1, 5] as const;

for (const rating of ratings) {
  test(`${rating}-star feedback receives the same public and private choices`, async ({ page }) => {
    await page.goto("/reviews");
    await page.getByRole("button", { name: `Rate ${rating} star${rating === 1 ? "" : "s"}` }).click();

    const choices = page.getByRole("region", { name: "Choose how to share your feedback" });
    await expect(choices).toBeVisible();
    await expect(choices.locator('[data-review-choice="public"]')).toBeVisible();
    await expect(choices.locator('[data-review-choice="private"]')).toBeVisible();
    await expect(choices.getByRole("link", { name: /Google review/i })).toHaveAttribute(
      "href",
      ENTITY_REGISTRY.profiles.google.reviewUrl,
    );
    await expect(choices.getByRole("link", { name: /Private feedback/i })).toHaveAttribute(
      "href",
      `/reviews/feedback?rating=${rating}`,
    );
  });
}

test("legacy Google-review route remains neutral and exposes both choices", async ({ page }) => {
  await page.goto("/reviews/google");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/share your experience/i);
  await expect(page.locator('[data-review-choice="public"]')).toBeVisible();
  await expect(page.locator('[data-review-choice="private"]')).toBeVisible();
  await expect(page.getByText(/glad you loved it/i)).toHaveCount(0);
  await expect(page.getByText(/happy clients/i)).toHaveCount(0);
});

test("private feedback is offered without assuming dissatisfaction", async ({ page }) => {
  await page.goto("/reviews/feedback");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/private feedback/i);
  await expect(page.getByText(/sorry we didn't meet your expectations/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Google review/i })).toBeVisible();
});

test("private draft recovery excludes contact PII", async ({ page }) => {
  await page.goto("/reviews/feedback");
  await page.getByLabel("Your name").fill("Privacy Test");
  await page.getByLabel("Email address").fill("privacy@example.com");
  await page.getByLabel("Your feedback").fill("Keep only this message in the active tab.");

  await page.reload();

  await expect(page.getByLabel("Your name")).toHaveValue("");
  await expect(page.getByLabel("Email address")).toHaveValue("");
  await expect(page.getByLabel("Your feedback")).toHaveValue("Keep only this message in the active tab.");
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "fold", width: 717, height: 512 },
] as const) {
  test(`${viewport.name} review journey stays usable without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/reviews");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rate 1 star" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole("button", { name: "Rate 1 star" }).click();
    await expect(page.locator('[data-review-choice="public"]')).toBeVisible();
    await expect(page.locator('[data-review-choice="private"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
