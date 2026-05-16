/**
 * IndexNow submission endpoint.
 *
 * Accepts a single URL or an array of URLs and forwards them to the
 * IndexNow API (api.indexnow.org) which pings Bing + Yandex for re-crawl.
 *
 * Wired at /api/indexnow via public/_redirects.
 *
 * Request shape (POST application/json):
 *   { "url":  "https://hairpinns.com/products/foo" }
 *   { "urls": ["https://hairpinns.com/a", "https://hairpinns.com/b", ...] }
 *
 * Response: 200 { ok: true, submitted: N, status: <indexnow status code> }
 *           400 { ok: false, error: "..." }
 *           502 { ok: false, error: "indexnow upstream returned <N>" }
 */

const INDEXNOW_KEY = 'index-now-50e2273d-d5b2-4ec0-aec8-437be544c65c';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_HOST = 'hairpinns.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

// IndexNow accepts up to 10,000 URLs per request — but a single page hitting
// a function shouldn't be allowed to spam thousands. Cap at a sane batch size.
const MAX_URLS_PER_REQUEST = 500;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

function normaliseUrls(payload) {
  const collected = [];
  if (typeof payload?.url === 'string') collected.push(payload.url);
  if (Array.isArray(payload?.urls)) collected.push(...payload.urls.filter((u) => typeof u === 'string'));

  const valid = [];
  for (const raw of collected) {
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      continue;
    }
    if (parsed.host !== SITE_HOST) continue; // IndexNow rejects cross-host URLs
    valid.push(parsed.toString());
  }
  return [...new Set(valid)]; // dedupe
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'POST only' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'invalid JSON body' });
  }

  const urls = normaliseUrls(payload);
  if (urls.length === 0) {
    return json(400, { ok: false, error: `provide "url" or "urls" — only ${SITE_HOST} URLs accepted` });
  }
  if (urls.length > MAX_URLS_PER_REQUEST) {
    return json(400, { ok: false, error: `max ${MAX_URLS_PER_REQUEST} URLs per request` });
  }

  const indexNowPayload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  let upstream;
  try {
    upstream = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload),
    });
  } catch (err) {
    return json(502, { ok: false, error: `network error: ${err.message}` });
  }

  // IndexNow returns 200 on accept, 202 on partial, 4xx on errors. Any 2xx is success.
  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    return json(502, {
      ok: false,
      error: `indexnow upstream returned ${upstream.status}`,
      detail: text.slice(0, 500),
      submitted: urls.length,
    });
  }

  return json(200, {
    ok: true,
    submitted: urls.length,
    status: upstream.status,
    urls,
  });
};
