import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Footer.tsx", import.meta.url), "utf8");

describe("footer newsletter subscription", () => {
  it("uses the Shopify subscription relay and records explicit email consent", () => {
    expect(source).toContain("subscribeToNewsletter");
    expect(source).toContain('source: "footer"');
    expect(source).toContain('name="email"');
    expect(source).toContain("You can unsubscribe any time");
    expect(source).toContain('to="/privacy"');
  });

  it("sets an accurate welcome-offer expectation", () => {
    expect(source).toContain("You're on the list. New here? Look out for your welcome email and first-order code.");
  });
});
