import { describe, expect, it } from "vitest";

import { projectConfig } from "./projectConfig";

describe("projectConfig GHL capture", () => {
  it("uses the same-origin Netlify relay instead of a public Vite secret", () => {
    expect(projectConfig.ghl.inboundWebhookUrl).toBe("/api/ghl-capture");
  });
});
