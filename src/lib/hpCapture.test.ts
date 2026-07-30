import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/projectConfig", () => ({
  projectConfig: {
    double_opt_in: true,
    gdpr_region: "AU",
    ghl: { inboundWebhookUrl: "" },
  },
}));

import { hpCapture } from "./hpCapture";

describe("hpCapture configuration", () => {
  it("rejects loudly when VITE_GHL_INBOUND_WEBHOOK_URL is missing", async () => {
    await expect(
      hpCapture.trackEvent("add_to_cart", { product_id: "product-1" }),
    ).rejects.toThrow("VITE_GHL_INBOUND_WEBHOOK_URL");
  });
});
