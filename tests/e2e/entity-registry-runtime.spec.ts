import { expect, test, type Page } from "@playwright/test";
import { BUSINESS_WEEK_DISPLAY } from "../../src/config/businessConfig";
import { ENTITY_REGISTRY } from "../../src/config/entityRegistry";

type JsonLdNode = Record<string, unknown>;

const readJsonLd = async (page: Page): Promise<JsonLdNode[]> =>
  page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.flatMap((script) => {
      try {
        const value = JSON.parse(script.textContent || "null");
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (Array.isArray(value["@graph"])) return value["@graph"];
        return [value];
      } catch {
        return [];
      }
    }),
  );

const findType = (nodes: JsonLdNode[], type: string) =>
  nodes.find((node) => node["@type"] === type);

const isNetlifyPreviewToolbarCspError = (message: string) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "";
  return /^https:\/\/deploy-preview-\d+--hairpinns\.netlify\.app/.test(baseUrl)
    && /app\.netlify\.com(?:\/|')/i.test(message)
    && /frame-src|content-security-policy|framing/i.test(message);
};

const attachRuntimeGuards = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !isNetlifyPreviewToolbarCspError(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
};

test("homepage emits the canonical first-party graph", async ({ page }) => {
  const runtimeErrors = attachRuntimeGuards(page);
  await page.goto("/");

  const nodes = await readJsonLd(page);
  expect(findType(nodes, "WebSite")?.["@id"]).toBe(ENTITY_REGISTRY.ids.webSite);
  expect(findType(nodes, "Organization")?.["@id"]).toBe(ENTITY_REGISTRY.ids.organization);
  expect(findType(nodes, "HairSalon")?.["@id"]).toBe(ENTITY_REGISTRY.ids.hairSalon);
  expect(findType(nodes, "Store")?.["@id"]).toBe(ENTITY_REGISTRY.ids.store);
  expect(findType(nodes, "Place")?.["@id"]).toBe(ENTITY_REGISTRY.ids.place);
  expect(findType(nodes, "Person")?.["@id"]).toBe(ENTITY_REGISTRY.ids.jena);

  const salon = findType(nodes, "HairSalon") as JsonLdNode;
  expect((salon.geo as JsonLdNode).latitude).toBe(ENTITY_REGISTRY.place.geo.latitude);
  expect((salon.geo as JsonLdNode).longitude).toBe(ENTITY_REGISTRY.place.geo.longitude);
  expect(salon.telephone).toBe(ENTITY_REGISTRY.contact.phone.raw);
  expect(salon.sameAs).toEqual(expect.arrayContaining([
    ENTITY_REGISTRY.profiles.fresha.venueUrl,
    ENTITY_REGISTRY.profiles.instagram,
    ENTITY_REGISTRY.profiles.facebook,
  ]));
  expect(runtimeErrors).toEqual([]);
});

test("About Person and Trio seller reference canonical identities", async ({ page }) => {
  await page.goto("/about");
  const aboutNodes = await readJsonLd(page);
  const person = findType(aboutNodes, "Person") as JsonLdNode;
  expect(person["@id"]).toBe(ENTITY_REGISTRY.ids.jena);
  expect((person.worksFor as JsonLdNode)["@id"]).toBe(ENTITY_REGISTRY.ids.hairSalon);

  await page.goto("/collections/jenas-daily-trio");
  await expect.poll(async () =>
    (await readJsonLd(page)).some(
      (node) => node["@type"] === "Offer" && Boolean(node.seller),
    ),
  ).toBe(true);
  const trioNodes = await readJsonLd(page);
  const offer = trioNodes.find(
    (node) => node["@type"] === "Offer" && node.seller,
  ) as JsonLdNode;
  expect((offer.seller as JsonLdNode)["@id"]).toBe(ENTITY_REGISTRY.ids.organization);
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "fold-cover", width: 344, height: 882 },
  { name: "fold-open", width: 717, height: 512 },
] as const) {
  test(`${viewport.name} renders canonical contact facts without overflow`, async ({ page }) => {
    const runtimeErrors = attachRuntimeGuards(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/contact");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(ENTITY_REGISTRY.contact.address.full, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(ENTITY_REGISTRY.contact.phone.display) }).first())
      .toHaveAttribute("href", ENTITY_REGISTRY.contact.phone.tel);

    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    for (const [day, hours] of BUSINESS_WEEK_DISPLAY) {
      await expect(footer).toContainText(day);
      await expect(footer).toContainText(hours);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
    )).toEqual([]);
    expect(runtimeErrors).toEqual([]);
  });
}
