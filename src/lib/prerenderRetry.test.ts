import { describe, expect, it } from "vitest";
import {
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
});
