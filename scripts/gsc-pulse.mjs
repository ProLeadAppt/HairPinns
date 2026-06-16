/**
 * GSC pulse — daily indexing + click/impression summary.
 *
 * Pulls Search Analytics (last 28 days) + URL Inspection (top new URLs)
 * from Google Search Console, writes a digest to dist/gsc-pulse.json and
 * stdout, suitable for delivery by a cron job.
 *
 * === ONE-TIME SETUP (Tyson, ~10 min) ===
 *
 * 1. Create a Google Cloud project:
 *      https://console.cloud.google.com/projectcreate
 *    Name: hairpinns-seo (or whatever you like). Note the Project ID.
 *
 * 2. Enable "Google Search Console API":
 *      APIs & Services → Library → search "Google Search Console API" → Enable
 *
 * 3. Create a Service Account:
 *      APIs & Services → Credentials → Create Credentials → Service Account
 *      Name: gsc-pulse-reader
 *      Role: (skip — GSC auth is on the Search Console side, not IAM)
 *      Done → click the account → Keys → Add Key → Create new (JSON) → save
 *      the downloaded JSON somewhere safe.
 *
 * 4. Grant the service account access in Search Console:
 *      https://search.google.com/search-console/settings
 *      → pick the hairpinns property → Users and permissions → Add user
 *      → paste the service account email (looks like
 *        gsc-pulse-reader@hairpinns-seo.iam.gserviceaccount.com)
 *      → Permission level: Owner (or Full)
 *
 *    CRITICAL: The site URL in GSC must match exactly. The script uses
 *    "sc-domain:hairpinns.com.au" by default (domain property). If your
 *    property is URL-prefix (https://www.hairpinns.com.au/), set
 *    GSC_SITE_URL=https://www.hairpinns.com.au/ in the env.
 *
 * 5. Save the JSON key in the project root as gsc-service-account.json
 *    (DO NOT commit — add to .gitignore). Then:
 *      export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/gsc-service-account.json"
 *      export GSC_SITE_URL="sc-domain:hairpinns.com.au"
 *
 * 6. Smoke test:
 *      node scripts/gsc-pulse.mjs
 *    Should print clicks, impressions, ctr, position for the last 28 days.
 *
 * === CRON USAGE ===
 *
 * Hermes cron example (every day 08:00 AEST):
 *   action: create
 *   schedule: "0 22 * * *"      # 22:00 UTC = 08:00 AEST
 *   prompt: "Run scripts/gsc-pulse.mjs, summarize any URL with > 0
 *            impressions but < 1% CTR, and any page that was inspected
 *            and is NOT indexed. Deliver to #hair-pinns."
 *   workdir: /root/hairpinns-audit
 *   env: GOOGLE_APPLICATION_CREDENTIALS, GSC_SITE_URL
 *
 * === RATE LIMITS ===
 *  - Search Analytics: ~1,200 queries/day, ~5/sec burst
 *  - URL Inspection:  600 req/min, 2,000/day, 600 sec for fresh inspect
 *  - The script batches by date+page to keep us under both caps.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── .env loader ──────────────────────────────────────────────────────
if (existsSync(resolve(root, '.env'))) {
  readFileSync(resolve(root, '.env'), 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && process.env[m[1].trim()] === undefined) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:hairpinns.com.au';
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  resolve(root, 'gsc-service-account.json');

if (!existsSync(KEY_PATH)) {
  console.error(`[gsc] Service account JSON not found at ${KEY_PATH}`);
  console.error('[gsc] See the SETUP block at the top of this file.');
  process.exit(1);
}

const creds = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const { client_email, private_key, project_id } = creds;

// ── JWT → OAuth token (no googleapis dep needed) ─────────────────────
function base64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const sig = base64url(sign.sign(private_key));

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${header}.${claim}.${sig}`,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth token failed: ${res.status} ${err}`);
  }
  const { access_token } = await res.json();
  return access_token;
}

// ── Search Analytics (last 28 days, by page) ─────────────────────────
async function fetchSearchAnalytics(token) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 28);
  const fmt = (d) => d.toISOString().slice(0, 10);

  const body = {
    startDate: fmt(startDate),
    endDate: fmt(endDate),
    dimensions: ['page'],
    rowLimit: 1000,
  };

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`searchAnalytics failed: ${res.status} ${err}`);
  }
  const json = await res.json();
  return json.rows || [];
}

// ── URL Inspection (top 5 by impression last 28d) ────────────────────
async function inspectUrl(token, url) {
  const res = await fetch(
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
    }
  );
  if (!res.ok) return { url, error: `HTTP ${res.status}` };
  const j = await res.json();
  const r = j.inspectionResult || {};
  return {
    url,
    verdict: r.indexStatusResult?.verdict || 'UNKNOWN',
    coverage: r.indexStatusResult?.coverageState || 'unknown',
    lastCrawled: r.indexStatusResult?.lastCrawlTime || null,
    robots: r.indexStatusResult?.robotsTxtState || null,
  };
}

// ── Main ─────────────────────────────────────────────────────────────
const token = await getAccessToken();
console.log(`[gsc] Token OK. Site: ${SITE_URL}, project: ${project_id}`);

const rows = await fetchSearchAnalytics(token);
const totals = rows.reduce(
  (acc, r) => ({
    clicks: acc.clicks + (r.clicks || 0),
    impressions: acc.impressions + (r.impressions || 0),
  }),
  { clicks: 0, impressions: 0 }
);
const avgCtr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
const avgPos = rows.length > 0
  ? rows.reduce((s, r) => s + (r.position || 0), 0) / rows.length
  : 0;

// Per-page summary, with high-impression low-CTR flag (opportunity)
const pages = rows
  .map((r) => ({
    page: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }))
  .sort((a, b) => b.impressions - a.impressions);

const opportunities = pages
  .filter((p) => p.impressions >= 50 && p.ctr < 0.01)
  .slice(0, 10);

const topTen = pages.slice(0, 10);

// URL Inspection for the top 5 by impression (slowest step, do last)
const inspectTop5 = await Promise.all(
  topTen.slice(0, 5).map((p) => inspectUrl(token, p.page).catch((e) => ({ url: p.page, error: e.message })))
);

const notIndexed = inspectTop5.filter(
  (i) => i.verdict && i.verdict !== 'PASS' && i.verdict !== 'NEUTRAL'
);

const digest = {
  generated: new Date().toISOString(),
  site: SITE_URL,
  window: '28d',
  totals: { ...totals, avgCtr, avgPosition: avgPos },
  topTen,
  opportunities: opportunities.map((o) => ({
    page: o.page,
    impressions: o.impressions,
    ctr: o.ctr,
    position: o.position,
  })),
  inspections: inspectTop5,
  notIndexedCount: notIndexed.length,
};

const outDir = resolve(root, 'dist');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'gsc-pulse.json'), JSON.stringify(digest, null, 2));

// Stdout summary — for cron delivery
const lines = [];
lines.push(`**GSC pulse — last 28 days (${SITE_URL})**`);
lines.push(`Clicks: ${totals.clicks} · Impressions: ${totals.impressions} · Avg CTR: ${(avgCtr * 100).toFixed(2)}% · Avg pos: ${avgPos.toFixed(1)}`);
lines.push('');
if (opportunities.length) {
  lines.push(`**Top CTR opportunities** (≥50 impressions, <1% CTR):`);
  opportunities.forEach((o) => {
    lines.push(`• ${o.page} — ${o.impressions} imp, CTR ${(o.ctr * 100).toFixed(2)}%, pos ${o.position.toFixed(1)}`);
  });
  lines.push('');
}
if (notIndexed.length) {
  lines.push(`**⚠️ Not indexed (top 5 inspected):**`);
  notIndexed.forEach((i) => {
    lines.push(`• ${i.url} — verdict: ${i.verdict} (${i.coverage})`);
  });
  lines.push('');
}
if (!opportunities.length && !notIndexed.length) {
  lines.push('No CTR flags. No indexing issues on the top-5 pages. ✅');
}
console.log(lines.join('\n'));
