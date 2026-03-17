/**
 * Inject NAP from businessConfig.ts into index.html HairSalon schema.
 * Keeps index.html schema in sync with the single source of truth.
 * Runs as part of build (prebuild).
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const configPath = resolve(root, 'src/config/businessConfig.ts');
const indexPath = resolve(root, 'index.html');

const content = readFileSync(configPath, 'utf8');
const street = content.match(/street:\s*"([^"]*)"/)?.[1] ?? '60 Goorgool Rd';
const locality = content.match(/locality:\s*"([^"]*)"/)?.[1] ?? 'Bangor';
const region = content.match(/region:\s*"([^"]*)"/)?.[1] ?? 'NSW';
const postcode = content.match(/postcode:\s*"([^"]*)"/)?.[1] ?? '2234';
const raw = content.match(/raw:\s*"([^"]*)"/)?.[1] ?? '+61468093991';
// Schema.org telephone format: +61-468-093-991
const phoneFormatted = raw.replace(/^\+61(\d{3})(\d{3})(\d{3})$/, '+61-$1-$2-$3');

let html = readFileSync(indexPath, 'utf8');
const schemaPattern = /"telephone":\s*"[^"]*",\s*"address":\s*\{\s*"@type":\s*"PostalAddress",\s*"streetAddress":\s*"[^"]*",\s*"addressLocality":\s*"[^"]*",\s*"addressRegion":\s*"[^"]*",\s*"postalCode":\s*"[^"]*",\s*"addressCountry":\s*"[^"]*"\s*\},?/;
const newSchema = `"telephone": "${phoneFormatted}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${street}",
      "addressLocality": "${locality}",
      "addressRegion": "${region}",
      "postalCode": "${postcode}",
      "addressCountry": "AU"
    },`;

if (schemaPattern.test(html)) {
  html = html.replace(schemaPattern, newSchema);
  writeFileSync(indexPath, html, 'utf8');
  console.log('[inject-nap] Updated index.html with NAP from businessConfig.ts');
} else {
  console.warn('[inject-nap] Could not find HairSalon schema pattern in index.html - manual sync may be needed');
}
