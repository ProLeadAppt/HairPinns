import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry);
    const info = await stat(absolute);
    if (info.isDirectory()) files.push(...await walk(absolute));
    else if (/\.tsx?$/.test(entry)) files.push(absolute);
  }
  return files;
}

const sourceFiles = await walk(SRC);
const source = (await Promise.all(
  sourceFiles.map(async (file) => ({
    file: path.relative(ROOT, file).replaceAll('\\', '/'),
    text: await readFile(file, 'utf8'),
  })),
));

const forbiddenClaims = [
  { pattern: /20\+ years|over 20 years|twenty years of salon experience/i, label: 'unsupported rolling tenure claim' },
  { pattern: /team of 4 stylists/i, label: 'unsupported team-size claim' },
  { pattern: /4\.9-star Google rating/i, label: 'unsupported aggregate review claim' },
  { pattern: /15 minutes from Bangor/i, label: 'unsupported travel-time claim' },
  { pattern: /L['’]Or[ée]al Colour Specialist|DevaCut certified|Brazilian Blowout certified/i, label: 'unsupported credential claim' },
  { pattern: /up to 4 weddings per Saturday|no waitlist/i, label: 'unsupported capacity or availability claim' },
  { pattern: /loyal 60\+ clientele/i, label: 'unsupported client-demographic claim' },
  { pattern: /\$30 for under-12s|\$25 with a junior/i, label: 'unsupported price claim' },
  { pattern: /four hundred client trials|400 client trials/i, label: 'unsupported trial-volume claim' },
];

for (const { pattern, label } of forbiddenClaims) {
  const matches = source
    .filter(({ text }) => pattern.test(text))
    .map(({ file }) => file);
  assert.deepEqual(matches, [], `${label} found in: ${matches.join(', ')}`);
}

const removedRegistry = path.join(SRC, 'data', 'blogPosts.ts');
await assert.rejects(stat(removedRegistry), { code: 'ENOENT' }, 'The duplicate blogPosts.ts registry must stay removed');

const summariesText = await readFile(path.join(SRC, 'data', 'blogSummaries.ts'), 'utf8');
const summarySlugs = new Set([...summariesText.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]));
const moduleNames = (await readdir(path.join(SRC, 'data', 'blog-posts')))
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => name.replace(/\.tsx$/, ''));
const retiredModules = new Set(['christmas-gift-packs-at-hair-pinns']);
const activeModules = new Set(moduleNames.filter((slug) => !retiredModules.has(slug)));

assert.deepEqual(
  [...summarySlugs].filter((slug) => !activeModules.has(slug)),
  [],
  'Every blog summary must resolve to a content module',
);
assert.deepEqual(
  [...activeModules].filter((slug) => !summarySlugs.has(slug)),
  [],
  'Every active content module must have a blog summary',
);

assert.match(summariesText, /title:\s*['"]Meet Jena: Hair Pinns Founder and Bangor Stylist['"]/);
assert.match(summariesText, /title:\s*['"]Hair Salon in Bangor: What to Know Before Booking['"]/);
assert.doesNotMatch(summariesText, /best hair salon in Bangor|15\+ Years Behind/i);

console.log(`Trust audit passed across ${sourceFiles.length} source files and ${summarySlugs.size} active blog routes.`);
