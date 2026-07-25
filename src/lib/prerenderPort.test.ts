import { describe, expect, it } from "vitest";
import { resolveRequestedPort } from "../../scripts/prerender-port.mjs";

describe("prerender preview port selection", () => {
  it("requests an OS-assigned port by default", () => {
    expect(resolveRequestedPort({})).toBe(0);
  });

  it("honours an explicit valid port", () => {
    expect(resolveRequestedPort({ port: "4199" })).toBe(4199);
  });

  it("rejects invalid explicit ports", () => {
    expect(() => resolveRequestedPort({ port: "invalid" })).toThrow(/port/i);
    expect(() => resolveRequestedPort({ port: "70000" })).toThrow(/port/i);
  });
});
