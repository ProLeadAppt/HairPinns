/**
 * Submit URLs to IndexNow (Bing, Yandex) for faster indexing.
 * Run post-deploy: npm run submit-indexnow
 * Reads URLs from sitemap.xml and POSTs to api.indexnow.org
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const INDEXNOW_KEY = 'hairpinns-indexnow-a1b2c3d4e5f6';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP_PATH = resolve(root, 'public', 'sitemap.xml');

function extractUrlsFromSitemap(xml) {
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let m;
  while ((m = locRegex.exec(xml)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

async function main() {
  if (!existsSync(SITEMAP_PATH)) {
    console.error('[indexnow] sitemap.xml not found. Run npm run generate-sitemap first.');
    process.exit(1);
  }

  const sitemapXml = readFileSync(SITEMAP_PATH, 'utf8');
  const urlList = extractUrlsFromSitemap(sitemapXml);

  if (urlList.length === 0) {
    console.error('[indexnow] No URLs found in sitemap.');
    process.exit(1);
  }

  const body = {
    host: 'hairpinns.com',
    key: INDEXNOW_KEY,
    keyLocation: `https://hairpinns.com/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log(`[indexnow] Submitted ${urlList.length} URLs to Bing/Yandex (HTTP ${res.status})`);
    } else {
      const text = await res.text();
      console.error(`[indexnow] Failed HTTP ${res.status}:`, text);
      process.exit(1);
    }
  } catch (err) {
    console.error('[indexnow] Error:', err.message);
    process.exit(1);
  }
}

main();
