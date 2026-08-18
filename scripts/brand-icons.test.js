import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sharp from "sharp";

const root = process.cwd();

describe("Hair Pinns browser and app icons", () => {
  it("publishes correctly sized standalone and maskable PWA icons", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(root, "public/manifest.json"), "utf8"),
    );

    expect(manifest.theme_color).toBe("#2D162B");
    expect(manifest.background_color).toBe("#F5EEE6");

    for (const icon of manifest.icons) {
      const [expectedWidth, expectedHeight] = icon.sizes.split("x").map(Number);
      const metadata = await sharp(path.join(root, "public", icon.src)).metadata();

      expect(metadata.format).toBe("png");
      expect(metadata.width).toBe(expectedWidth);
      expect(metadata.height).toBe(expectedHeight);
    }

    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ]),
    );
  });

  it("links dedicated favicon and Apple touch assets from the document head", async () => {
    const html = await readFile(path.join(root, "index.html"), "utf8");

    expect(html).toContain('href="/favicon.ico" sizes="any"');
    expect(html).toContain('sizes="32x32" href="/icons/hair-pinns-32.png"');
    expect(html).toContain('sizes="16x16" href="/icons/hair-pinns-16.png"');
    expect(html).toContain('rel="apple-touch-icon" sizes="180x180"');
  });
});
