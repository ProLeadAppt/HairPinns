import { describe, expect, it } from "vitest";
import { normalizeExternalWebhookUrl } from "./externalUrl";

describe("normalizeExternalWebhookUrl", () => {
  it("preserves a valid HTTPS webhook URL", () => {
    const url = "https://services.leadconnectorhq.com/hooks/example?id=123";
    expect(normalizeExternalWebhookUrl(url)).toBe(url);
  });

  it("accepts valid reserved characters and returns the serialized URL", () => {
    const url = "https://example.com/hook?name=O'Reilly";
    expect(normalizeExternalWebhookUrl(url)).toBe("https://example.com/hook?name=O%27Reilly");
  });

  it("rejects an embedded script tag instead of turning it into a same-site request", () => {
    const malformed = '<script src="https://beta.leadconnectorhq.com/loader.js"></script>';
    expect(normalizeExternalWebhookUrl(malformed)).toBe("");
  });

  it("rejects relative and executable URLs", () => {
    expect(normalizeExternalWebhookUrl("/api/capture")).toBe("");
    expect(normalizeExternalWebhookUrl("javascript:alert(1)")).toBe("");
  });
});
