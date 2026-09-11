import { describe, expect, it } from "vitest";
import { JENAS_DAILY_TRIO, JENAS_DAILY_TRIO_REQUEST_FOR_JENA } from "./jenasDailyTrio";

describe("Jena's Daily Trio paused state", () => {
  it("does not advertise products, pricing or a saving before the Shopify bundle is verified", () => {
    const publishedCopy = JSON.stringify(JENAS_DAILY_TRIO);

    expect(JENAS_DAILY_TRIO.status).toBe("awaiting-update");
    expect(publishedCopy).not.toMatch(/10%|bundle saves|applied at checkout/i);
    expect(JENAS_DAILY_TRIO).not.toHaveProperty("products");
    expect(JENAS_DAILY_TRIO).not.toHaveProperty("bundlePromise");
  });

  it("provides a copy-ready request for the three authoritative product links", () => {
    expect(JENAS_DAILY_TRIO_REQUEST_FOR_JENA).toContain("exact Shopify links");
    expect(JENAS_DAILY_TRIO_REQUEST_FOR_JENA).toContain("shampoo, conditioner and leave-in");
    expect(JENAS_DAILY_TRIO_REQUEST_FOR_JENA).toContain("temporarily paused");
  });
});
