import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ENTITY_REGISTRY } from "./entityRegistry";

const html = readFileSync(new URL("../../public/connect/index.html", import.meta.url), "utf8");

describe("salon QR connection hub", () => {
  it("links all four choices directly to the governed business destinations", () => {
    const destinations = [...html.matchAll(/<a class="choice" href="([^"]+)"/g)].map((match) => match[1]);
    expect(destinations).toEqual([
      ENTITY_REGISTRY.profiles.facebook,
      ENTITY_REGISTRY.profiles.instagram,
      `${ENTITY_REGISTRY.site.url}/`,
      ENTITY_REGISTRY.profiles.google.reviewUrl,
    ]);
  });

  it("offers the same Google review action to everyone without a script, form or rating filter", () => {
    expect(html).toContain("Share your honest experience");
    expect(html).toContain("All feedback is welcome.");
    expect(html).not.toMatch(/<script|<form|<input|localStorage|sessionStorage|utm_|googletagmanager/i);
    expect(html).not.toMatch(/five.star|5.star|positive review|happy with|discount|reward/i);
  });

  it("is a self-contained mobile-friendly document with clear semantics and keyboard focus", () => {
    expect(html).toContain('<html lang="en-AU">');
    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1"');
    expect(html).toContain('aria-label="Connect with Hair Pinns"');
    expect(html).toContain(":focus-visible");
    expect(html).toContain('href="https://hairpinns.com/connect/"');
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toContain("prefers-reduced-motion");
    expect(html).not.toContain('target="_blank"');
  });

  it("keeps approved local brand assets with no remote font dependency", () => {
    for (const name of ["inter-latin.woff2", "playfair-display-latin.woff2", "hair-pinns-logo.webp"]) {
      expect(readFileSync(new URL(`../../public/connect/${name}`, import.meta.url)).byteLength).toBeGreaterThan(0);
      expect(html).toContain(`/connect/${name}`);
    }
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.bunny/);
  });
});
