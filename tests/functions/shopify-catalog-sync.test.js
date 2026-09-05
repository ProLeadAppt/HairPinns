import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createCatalogueSyncHandler,
  recordCatalogueEvent,
  runPendingCatalogueSync,
  verifyShopifyWebhook,
} from "../../netlify/functions/shopify-catalog-sync-background.js";

const secret = "catalogue-webhook-secret";
const body = JSON.stringify({ id: 123, title: "Pure Christmas Packs" });

class MemoryStore {
  constructor() {
    this.entries = new Map();
    this.version = 0;
  }

  async getWithMetadata(key) {
    const entry = this.entries.get(key);
    return entry
      ? { data: structuredClone(entry.data), etag: entry.etag, metadata: {} }
      : null;
  }

  async setJSON(key, data, conditions = {}) {
    const current = this.entries.get(key);
    if (conditions.onlyIfNew && current) return { modified: false };
    if (conditions.onlyIfMatch && current?.etag !== conditions.onlyIfMatch) {
      return { modified: false };
    }

    const etag = `etag-${++this.version}`;
    this.entries.set(key, { data: structuredClone(data), etag });
    return { modified: true, etag };
  }
}

const eventFor = (overrides = {}) => ({
  httpMethod: "POST",
  body,
  headers: {
    "x-shopify-topic": "products/update",
    "x-shopify-shop-domain": "femtat-zu.myshopify.com",
    "x-shopify-webhook-id": "delivery-1",
    "x-shopify-hmac-sha256": createHmac("sha256", secret).update(body).digest("base64"),
  },
  ...overrides,
});

describe("Shopify catalogue rebuild webhook", () => {
  beforeEach(() => {
    process.env.SHOPIFY_CATALOG_WEBHOOK_SECRET = secret;
    process.env.NETLIFY_CATALOG_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/example";
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN = "femtat-zu.myshopify.com";
    process.env.SHOPIFY_CATALOG_BUILD_DELAY_MS = "0";
    process.env.SHOPIFY_CATALOG_BUILD_COOLDOWN_MS = "0";
    process.env.SHOPIFY_CATALOG_MAX_BUILDS_PER_RUN = "3";
  });

  afterEach(() => {
    delete process.env.SHOPIFY_CATALOG_WEBHOOK_SECRET;
    delete process.env.NETLIFY_CATALOG_BUILD_HOOK_URL;
    delete process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
    delete process.env.SHOPIFY_CATALOG_BUILD_DELAY_MS;
    delete process.env.SHOPIFY_CATALOG_BUILD_COOLDOWN_MS;
    delete process.env.SHOPIFY_CATALOG_MAX_BUILDS_PER_RUN;
    vi.restoreAllMocks();
  });

  it("verifies the raw Shopify body with a constant-time HMAC comparison", () => {
    const hmac = createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyShopifyWebhook(body, hmac, secret)).toBe(true);
    expect(verifyShopifyWebhook(`${body}x`, hmac, secret)).toBe(false);
  });

  it("queues one rebuild for a valid delivery and ignores an already-built duplicate", async () => {
    const store = new MemoryStore();
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const handler = createCatalogueSyncHandler({
      getStoreImpl: () => store,
      fetchImpl,
    });

    await handler(eventFor());
    await handler(eventFor());

    expect(fetchImpl).toHaveBeenCalledOnce();
    const current = await store.getWithMetadata("coordinator");
    expect(current.data.lastBuiltRevision).toBe(1);
  });

  it("does not trigger a build for an invalid signature or unexpected shop", async () => {
    const store = new MemoryStore();
    const fetchImpl = vi.fn();
    const handler = createCatalogueSyncHandler({ getStoreImpl: () => store, fetchImpl });

    await handler(eventFor({ headers: { ...eventFor().headers, "x-shopify-hmac-sha256": "invalid" } }));
    await handler(eventFor({ headers: { ...eventFor().headers, "x-shopify-shop-domain": "other.myshopify.com" } }));

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await store.getWithMetadata("coordinator")).toBeNull();
  });

  it("runs a trailing rebuild when a new catalogue event arrives during a build", async () => {
    const store = new MemoryStore();
    await recordCatalogueEvent(store, {
      webhookId: "delivery-1",
      topic: "products/update",
      receivedAt: 1,
    });

    const fetchImpl = vi.fn().mockImplementation(async () => {
      if (fetchImpl.mock.calls.length === 1) {
        await recordCatalogueEvent(store, {
          webhookId: "delivery-2",
          topic: "collections/update",
          receivedAt: 2,
        });
      }
      return new Response(null, { status: 200 });
    });

    const result = await runPendingCatalogueSync({
      store,
      buildHookUrl: process.env.NETLIFY_CATALOG_BUILD_HOOK_URL,
      fetchImpl,
      now: () => 10,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ status: "up-to-date", buildsTriggered: 2 });
    const current = await store.getWithMetadata("coordinator");
    expect(current.data.lastBuiltRevision).toBe(2);
  });

  it("keeps a failed revision pending and retries it on a duplicate delivery", async () => {
    const store = new MemoryStore();
    const failingFetch = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    const instantSleep = vi.fn().mockResolvedValue(undefined);
    const failingHandler = createCatalogueSyncHandler({
      getStoreImpl: () => store,
      fetchImpl: failingFetch,
      sleep: instantSleep,
    });

    await expect(failingHandler(eventFor())).rejects.toThrow("HTTP 503");
    expect(failingFetch).toHaveBeenCalledTimes(3);
    let current = await store.getWithMetadata("coordinator");
    expect(current.data.lastBuiltRevision).toBe(0);
    expect(current.data.workerToken).toBeNull();

    const successfulFetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const retryHandler = createCatalogueSyncHandler({
      getStoreImpl: () => store,
      fetchImpl: successfulFetch,
    });
    await retryHandler(eventFor());

    expect(successfulFetch).toHaveBeenCalledOnce();
    current = await store.getWithMetadata("coordinator");
    expect(current.data.lastBuiltRevision).toBe(1);
  });
});
