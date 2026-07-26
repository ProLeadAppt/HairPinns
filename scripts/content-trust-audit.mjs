import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORBIDDEN_CLAIMS } from './content-trust-rules.mjs';

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

const claimSource = source.filter(({ file }) => !/\.test\.[cm]?[jt]sx?$/.test(file));

for (const { pattern, label, allowedFiles } of FORBIDDEN_CLAIMS) {
  const matches = claimSource
    .filter(({ file, text }) => !allowedFiles?.has(file) && pattern.test(text))
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
