import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

const ALLOWED_TOPICS = new Set([
  "products/create",
  "products/update",
  "products/delete",
  "collections/create",
  "collections/update",
  "collections/delete",
]);

const STORE_NAME = "hairpinns-catalogue-sync";
const STATE_KEY = "coordinator";
const DEFAULT_DELAY_MS = 60_000;
const DEFAULT_COOLDOWN_MS = 5 * 60_000;
const DEFAULT_LEASE_MS = 14 * 60_000;
const DEFAULT_MAX_BUILDS_PER_RUN = 3;
const MAX_RECENT_WEBHOOK_IDS = 100;

const emptyState = () => ({
  revision: 0,
  lastBuiltRevision: 0,
  latestEventAt: 0,
  lastBuildTriggerAt: 0,
  recentWebhookIds: [],
  workerToken: null,
  workerExpiresAt: 0,
});

const getHeader = (headers = {}, name) => {
  const target = name.toLowerCase();
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === target);
  return entry?.[1] || "";
};

const positiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const sleepFor = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const verifyShopifyWebhook = (rawBody, providedHmac, secret) => {
  if (!rawBody || !providedHmac || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const providedBuffer = Buffer.from(providedHmac, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
};

export const getCatalogueSyncStore = () =>
  getStore({ name: STORE_NAME, consistency: "strong" });

const readState = async (store) => {
  const current = await store.getWithMetadata(STATE_KEY, { type: "json" });
  return current
    ? { state: { ...emptyState(), ...current.data }, etag: current.etag }
    : { state: emptyState(), etag: null };
};

const mutateState = async (store, update, attempts = 12) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const current = await readState(store);
    const next = update(current.state);
    if (!next) return { modified: false, state: current.state, etag: current.etag };

    const result = await store.setJSON(
      STATE_KEY,
      next,
      current.etag ? { onlyIfMatch: current.etag } : { onlyIfNew: true },
    );
    if (result.modified) {
      return { modified: true, state: next, etag: result.etag };
    }
  }

  throw new Error("Could not update catalogue sync state after concurrent writes");
};

export const recordCatalogueEvent = async (store, { webhookId, topic, receivedAt }) =>
  mutateState(store, (state) => {
    if (webhookId && state.recentWebhookIds.includes(webhookId)) return null;

    const recentWebhookIds = webhookId
      ? [...state.recentWebhookIds, webhookId].slice(-MAX_RECENT_WEBHOOK_IDS)
      : state.recentWebhookIds;

    return {
      ...state,
      revision: state.revision + 1,
      latestEventAt: receivedAt,
      latestTopic: topic,
      recentWebhookIds,
    };
  });

const acquireWorker = async (store, now, leaseMs) => {
  const workerToken = randomUUID();
  const result = await mutateState(store, (state) => {
    if (state.workerToken && state.workerExpiresAt > now) return null;
    return {
      ...state,
      workerToken,
      workerExpiresAt: now + leaseMs,
    };
  });

  return result.modified ? workerToken : null;
};

const releaseWorker = async (store, workerToken) => {
  await mutateState(store, (state) => {
    if (state.workerToken !== workerToken) return null;
    return { ...state, workerToken: null, workerExpiresAt: 0 };
  });
};

const triggerBuildHook = async ({ buildHookUrl, topic, fetchImpl, sleep }) => {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchImpl(buildHookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          trigger_title: `Shopify catalogue changed: ${topic}`,
          clear_cache: true,
        }),
      });
      if (response.ok) return;
      lastError = new Error(`Netlify build hook returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < 3) await sleep(attempt * 1_000);
  }

  throw lastError || new Error("Netlify build hook failed");
};

export const runPendingCatalogueSync = async ({
  store,
  buildHookUrl,
  fetchImpl = (...args) => globalThis.fetch(...args),
  sleep = sleepFor,
  now = () => Date.now(),
  waitForDue = true,
}) => {
  const leaseMs = positiveNumber(process.env.SHOPIFY_CATALOG_WORKER_LEASE_MS, DEFAULT_LEASE_MS);
  const workerToken = await acquireWorker(store, now(), leaseMs);
  if (!workerToken) return { status: "coalesced" };

  let buildsTriggered = 0;
  try {
    const delayMs = positiveNumber(process.env.SHOPIFY_CATALOG_BUILD_DELAY_MS, DEFAULT_DELAY_MS);
    const cooldownMs = positiveNumber(
      process.env.SHOPIFY_CATALOG_BUILD_COOLDOWN_MS,
      DEFAULT_COOLDOWN_MS,
    );
    const maxBuilds = positiveNumber(
      process.env.SHOPIFY_CATALOG_MAX_BUILDS_PER_RUN,
      DEFAULT_MAX_BUILDS_PER_RUN,
    );

    while (buildsTriggered < maxBuilds) {
      let current = await readState(store);
      if (current.state.workerToken !== workerToken) return { status: "lease-lost", buildsTriggered };
      if (current.state.revision <= current.state.lastBuiltRevision) {
        return { status: "up-to-date", buildsTriggered };
      }

      const dueAt = Math.max(
        current.state.latestEventAt + delayMs,
        current.state.lastBuildTriggerAt + cooldownMs,
      );
      if (dueAt > now()) {
        if (!waitForDue) return { status: "deferred", buildsTriggered, dueAt };
        await sleep(dueAt - now());
        current = await readState(store);
        if (current.state.workerToken !== workerToken) {
          return { status: "lease-lost", buildsTriggered };
        }
        const refreshedDueAt = Math.max(
          current.state.latestEventAt + delayMs,
          current.state.lastBuildTriggerAt + cooldownMs,
        );
        if (refreshedDueAt > now()) continue;
      }

      const targetRevision = current.state.revision;
      const topic = current.state.latestTopic || "catalogue/update";
      await triggerBuildHook({ buildHookUrl, topic, fetchImpl, sleep });
      const triggeredAt = now();

      await mutateState(store, (state) => {
        if (state.workerToken !== workerToken) return null;
        return {
          ...state,
          lastBuiltRevision: Math.max(state.lastBuiltRevision, targetRevision),
          lastBuildTriggerAt: triggeredAt,
        };
      });
      buildsTriggered += 1;
    }

    return { status: "run-limit", buildsTriggered };
  } finally {
    await releaseWorker(store, workerToken);
  }
};

export const createCatalogueSyncHandler = ({
  getStoreImpl = getCatalogueSyncStore,
  fetchImpl = (...args) => globalThis.fetch(...args),
  sleep = sleepFor,
  now = () => Date.now(),
} = {}) => async (event = {}) => {
  if (event.httpMethod !== "POST") return;

  const webhookSecret = process.env.SHOPIFY_CATALOG_WEBHOOK_SECRET;
  const buildHookUrl = process.env.NETLIFY_CATALOG_BUILD_HOOK_URL;
  if (!webhookSecret || !buildHookUrl) {
    console.error("[catalogue-sync] Missing webhook secret or Netlify build hook URL");
    return;
  }

  const rawBody = event.body || "";
  const hmac = getHeader(event.headers, "x-shopify-hmac-sha256");
  if (!verifyShopifyWebhook(rawBody, hmac, webhookSecret)) {
    console.warn("[catalogue-sync] Rejected webhook with invalid HMAC");
    return;
  }

  const topic = getHeader(event.headers, "x-shopify-topic");
  const shopDomain = getHeader(event.headers, "x-shopify-shop-domain");
  const expectedShopDomain = process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
  if (!ALLOWED_TOPICS.has(topic) || (expectedShopDomain && shopDomain !== expectedShopDomain)) {
    console.warn("[catalogue-sync] Ignored unexpected Shopify webhook", { topic, shopDomain });
    return;
  }

  const store = getStoreImpl();
  const webhookId = getHeader(event.headers, "x-shopify-webhook-id");
  const recorded = await recordCatalogueEvent(store, {
    webhookId,
    topic,
    receivedAt: now(),
  });
  if (!recorded.modified) {
    console.info("[catalogue-sync] Duplicate delivery recorded previously", { topic, webhookId });
  }

  const result = await runPendingCatalogueSync({
    store,
    buildHookUrl,
    fetchImpl,
    sleep,
    now,
    waitForDue: true,
  });
  console.info("[catalogue-sync] Catalogue sync worker finished", { topic, webhookId, ...result });
};

export const handler = createCatalogueSyncHandler();
