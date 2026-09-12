import { describe, expect, it } from "vitest";
import {
  commercePrerenderIssue,
  isTransientBrowserError,
  isTransientPrerenderRouteError,
} from "../../scripts/prerender-retry.mjs";

describe("prerender retry classification", () => {
  it("retries transient navigation timeouts without treating them as browser disconnects", () => {
    const message = "Navigation timeout of 60000 ms exceeded";

    expect(isTransientPrerenderRouteError(message)).toBe(true);
    expect(isTransientBrowserError(message)).toBe(false);
  });

  it("still retries and restarts for browser protocol failures", () => {
    const message = "Protocol error (Page.navigate): Session closed";

    expect(isTransientPrerenderRouteError(message)).toBe(true);
    expect(isTransientBrowserError(message)).toBe(true);
  });

  it("does not retry deterministic prerender contract failures", () => {
    expect(isTransientPrerenderRouteError("Missing prerender-ready marker")).toBe(false);
  });

  it("rejects a published product captured in a transient noindex fallback", () => {
    const html = '<meta name="robots" content="noindex, follow"><h1>Product not found</h1>';
    const issue = commercePrerenderIssue('/products/live-product', html);

    expect(issue).toContain('published product rendered noindex');
    expect(isTransientPrerenderRouteError(issue)).toBe(true);
  });

  it("requires product schema on published product routes", () => {
    const html = '<script type="application/ld+json">{"@type":"WebPage"}</script>';
    expect(commercePrerenderIssue('/products/live-product', html)).toContain('missing Product schema');
  });

  it("does not apply the commerce gate to an intentional review noindex", () => {
    const html = '<meta name="robots" content="noindex, follow">';
    expect(commercePrerenderIssue('/reviews', html)).toBeNull();
  });

  it("allows the intentionally paused Daily Trio document to remain noindex", () => {
    const html = '<meta name="robots" content="noindex, follow">';
    expect(commercePrerenderIssue('/collections/jenas-daily-trio', html)).toBeNull();
  });
});
