import { describe, expect, it } from "vitest";
import { buildMetaDescription, buildMetaTitle } from "./metadata";

describe("metadata generation", () => {
  it("normalizes whitespace and strengthens genuinely short descriptions", () => {
    expect(
      buildMetaDescription("  Smooth, healthy hair.  ", {
        suffix: "Salon-picked hair care from Jena at Hair Pinns, shipped Australia-wide.",
      }),
    ).toBe(
      "Smooth, healthy hair. Salon-picked hair care from Jena at Hair Pinns, shipped Australia-wide.",
    );
  });

  it("clips long descriptions at a word boundary", () => {
    const result = buildMetaDescription(
      "Professional salon hair products selected by Jena for colour care, smoothing, hydration and everyday styling across Australia with practical advice for every routine.",
      { maxLength: 120 },
    );

    expect(result.length).toBeLessThanOrEqual(120);
    expect(result).toMatch(/…$/);
    expect(result).not.toMatch(/\s…$/);
    expect(result).not.toContain("routin…");
  });

  it("does not repeat a suffix already present", () => {
    const source = "Hair care shipped Australia-wide.";
    expect(buildMetaDescription(source, { suffix: "Shipped Australia-wide." })).toBe(source);
  });

  it("does not append a suffix to already substantial source copy", () => {
    const source = "Jena explains how to protect coloured hair from heat, humidity and daily styling while keeping the routine practical at home.";
    expect(buildMetaDescription(source, { suffix: "Shipped Australia-wide." })).toBe(source);
  });

  it("keeps titles within the configured limit without cutting a word", () => {
    const title = buildMetaTitle(
      ["Hairdresser Menai", "Hair Salon near Menai", "Hair Pinns"],
      { maxLength: 60 },
    );

    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toBe("Hairdresser Menai | Hair Salon near Menai | Hair Pinns");
  });
});
