import { describe, expect, it } from "vitest";
import { formatPrice } from "./utils";

describe("formatPrice", () => {
  it("always displays both decimal places for customer-facing prices", () => {
    expect(formatPrice(9.9)).toBe("$9.90");
    expect(formatPrice("29.95")).toBe("$29.95");
    expect(formatPrice(29)).toBe("$29.00");
  });

  it("does not present missing prices as free products", () => {
    expect(formatPrice(0)).toBe("");
    expect(formatPrice(Number.NaN)).toBe("");
    expect(formatPrice(0, "AUD", { allowZero: true })).toBe("$0.00");
  });
});
