const MAX_BODY_BYTES = 64 * 1024;
const REQUEST_TIMEOUT_MS = 8_000;
const ALLOWED_PRODUCTION_ORIGINS = new Set([
  "https://hairpinns.com",
  "https://www.hairpinns.com",
]);
const NETLIFY_ORIGIN = /^https:\/\/(?:deploy-preview-\d+|[a-z0-9-]+)--hairpinns\.netlify\.app$/i;
const SAFE_NAME = /^[a-z0-9_-]{1,64}$/i;
const SAFE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const config = {
  path: "/api/ghl-capture",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip"],
    windowLimit: 10,
    windowSize: 60,
  },
};

const isAllowedOrigin = (origin) =>
  ALLOWED_PRODUCTION_ORIGINS.has(origin) || NETLIFY_ORIGIN.test(origin);

const jsonResponse = (status, body, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...(isAllowedOrigin(origin)
        ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
        : {}),
    },
  });

const hasKnownContact = (contact) => {
  if (!contact || typeof contact !== "object") return false;
  const email = typeof contact.email === "string" ? contact.email.trim() : "";
  const phone = typeof contact.phone === "string" ? contact.phone.replace(/\D/g, "") : "";
  return (
    (email.length <= 254 && SAFE_EMAIL.test(email)) ||
    (phone.length >= 8 && phone.length <= 15)
  );
};

const isValidPayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  if (!hasKnownContact(payload.contact)) return false;

  const formName = payload.context?.form_name;
  const eventName = payload.context?.event_name;
  if (typeof formName !== "string" || !SAFE_NAME.test(formName)) return false;
  if (typeof eventName !== "string" || !SAFE_NAME.test(eventName)) return false;
  if (typeof payload.consent?.marketing !== "boolean") return false;

  const events = payload.engagement?.events;
  if (events !== undefined) {
    if (!Array.isArray(events) || events.length > 20) return false;
    if (
      events.some(
        (event) =>
          !event ||
          typeof event !== "object" ||
          !SAFE_NAME.test(event.event_name || ""),
      )
    ) {
      return false;
    }
  }

  return true;
};

const getPrivateWebhookUrl = () => {
  const raw = process.env.GHL_INBOUND_WEBHOOK_URL || "";
  try {
    const parsed = new URL(raw);
    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== "services.leadconnectorhq.com"
    ) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
};

export default async function handler(request) {
  if (new URL(request.url).pathname !== config.path) {
    return jsonResponse(404, { error: "Not found" });
  }

  const origin = request.headers.get("origin") || "";
  if (!isAllowedOrigin(origin)) {
    return jsonResponse(403, { error: "Forbidden" });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" }, origin);
  }

  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return jsonResponse(415, { error: "JSON required" }, origin);
  }

  const statedLength = Number(request.headers.get("content-length") || 0);
  if (statedLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "Payload too large" }, origin);
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "Payload too large" }, origin);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" }, origin);
  }

  if (payload.context?.website || payload.website) {
    return jsonResponse(202, { accepted: true }, origin);
  }

  if (!isValidPayload(payload)) {
    return jsonResponse(
      422,
      { error: "Valid contact and explicit consent state required" },
      origin,
    );
  }

  const webhookUrl = getPrivateWebhookUrl();
  if (!webhookUrl) {
    console.error("[ghl-capture] Private GHL webhook is not configured.");
    return jsonResponse(503, { error: "Capture unavailable" }, origin);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "HairPinns-Netlify-GHL-Relay/1.0",
      },
      body: rawBody,
      signal: controller.signal,
    });

    if (!upstream.ok) {
      console.error(`[ghl-capture] HighLevel returned HTTP ${upstream.status}.`);
      return jsonResponse(502, { error: "Capture failed" }, origin);
    }

    return jsonResponse(202, { accepted: true }, origin);
  } catch (error) {
    const message = error instanceof Error ? error.name : "UnknownError";
    console.error(`[ghl-capture] HighLevel request failed: ${message}.`);
    return jsonResponse(502, { error: "Capture failed" }, origin);
  } finally {
    clearTimeout(timeout);
  }
}
