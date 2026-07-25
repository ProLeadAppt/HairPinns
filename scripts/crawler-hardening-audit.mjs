import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { auditDocuments } from './crawler-audit-utils.js';

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const dist = resolve(root, 'dist');
const publicDir = resolve(root, 'public');

const walkHtml = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) files.push(...walkHtml(path));
    else if (entry === 'index.html') files.push(path);
  }
  return files;
};

const routeFromFile = (file) => {
  const directory = relative(dist, file).split(sep).slice(0, -1).join('/');
  return directory ? `/${directory}/` : '/';
};

const auditDiscoveryFiles = () => {
  const errors = [];
  const names = ['llms.txt', 'llms-full.txt', 'llm.txt', 'llms.json', 'ai.txt'];
  const files = {};
  for (const name of names) {
    const path = resolve(publicDir, name);
    if (!existsSync(path)) {
      errors.push(`${name}: missing generated discovery file; run npm run generate-ai-discovery`);
      continue;
    }
    files[name] = readFileSync(path, 'utf8');
  }
  if (errors.length > 0) return errors;

  for (const [name, content] of Object.entries(files)) {
    if (!content.includes('GENERATED FILE')) errors.push(`${name}: missing generated-file marker`);
  }
  if (files['llm.txt'] !== files['llms-full.txt']) {
    errors.push('llm.txt is not an exact alias of llms-full.txt');
  }
  if (/aggregateRating|reviewCount|\b\d+[+,]?\s+(verified\s+)?reviews\b/i.test(files['llms.txt'] + files['llms-full.txt'])) {
    errors.push('AI discovery prose contains an unsupported rating or review-count claim');
  }

  let structured;
  try {
    structured = JSON.parse(files['llms.json'].replace(/^\/\/ GENERATED FILE[^\n]*\n/, ''));
  } catch {
    errors.push('llms.json is not parseable generated JSON');
    return errors;
  }
  for (const hours of structured.openingHoursSpecification || []) {
    const line = `${hours.dayOfWeek}: ${hours.opens}–${hours.closes}`;
    if (!files['llms.txt'].includes(line) || !files['llms-full.txt'].includes(line)) {
      errors.push(`AI discovery hours drift: ${line}`);
    }
  }

  const sitemap = readFileSync(resolve(publicDir, 'sitemap.xml'), 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, '&'));
  const sitemapSet = new Set(sitemapUrls);
  if (sitemapSet.size !== sitemapUrls.length) errors.push('sitemap.xml contains duplicate canonical URLs');

  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  if (lastmods.some((value) => !/^\d{4}-\d{2}-\d{2}$/.test(value))) {
    errors.push('sitemap.xml contains an invalid lastmod value');
  }
  const frequencies = new Map();
  for (const value of lastmods) frequencies.set(value, (frequencies.get(value) || 0) + 1);
  const dominant = Math.max(0, ...frequencies.values());
  if (lastmods.length > 10 && dominant / lastmods.length > 0.8) {
    errors.push(`sitemap.xml freshness is synthetic: ${dominant}/${lastmods.length} dated URLs share one date`);
  }

  const manifestUrls = [];
  for (const match of files['llms-full.txt'].matchAll(/https:\/\/hairpinns\.com\/[^\s)]+/g)) {
    const url = match[0].replace(/[.,;]+$/, '');
    try {
      if (/\/(blog|services|areas|shipping-to|collections|products)\//.test(new URL(url).pathname)) {
        manifestUrls.push(url);
      }
    } catch {
      errors.push(`llms-full.txt contains malformed URL: ${url}`);
    }
  }
  for (const url of manifestUrls) {
    if (!sitemapSet.has(url)) errors.push(`AI discovery URL missing from sitemap: ${url}`);
  }

  return errors;
};

if (!existsSync(dist)) {
  console.error('[crawler-hardening] dist/ is missing; run after prerender');
  process.exit(1);
}

const documents = walkHtml(dist).map((file) => ({
  route: routeFromFile(file),
  html: readFileSync(file, 'utf8'),
}));
const result = auditDocuments(documents);
const errors = [...result.errors, ...auditDiscoveryFiles()];

for (const warning of result.warnings.slice(0, 40)) {
  console.warn(`[crawler-hardening] WARN ${warning}`);
}
if (result.warnings.length > 40) {
  console.warn(`[crawler-hardening] WARN ${result.warnings.length - 40} additional warnings omitted`);
}
if (errors.length > 0) {
  for (const error of errors) console.error(`[crawler-hardening] ERROR ${error}`);
  console.error(`[crawler-hardening] Failed with ${errors.length} errors and ${result.warnings.length} warnings`);
  process.exit(1);
}

console.log(
  `[crawler-hardening] Passed ${documents.length} rendered pages with ${result.warnings.length} review warnings`,
);
