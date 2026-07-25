import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await readFile(path.join(ROOT, 'src/App.tsx'), 'utf8');
const indexCss = await readFile(path.join(ROOT, 'src/index.css'), 'utf8');

assert.doesNotMatch(app, /import\(["']\.\/pages\/(?:SuburbPage|DevCollections|DevShopify)["']\)/,
  'Retired suburb and development pages must not be in the production route graph');
assert.doesNotMatch(app, /path=["']\/(?:near\/:suburb|dev\/)/,
  'Retired /near and /dev routes must not be registered in production');
assert.doesNotMatch(indexCss, /\.editorial-route[^\n]*\[class\*=/,
  'Semantic route styling must not mask legacy classes with blanket substring overrides');
assert.doesNotMatch(indexCss, /\.editorial-route main h[1-6]/,
  'Semantic route shells must not override descendant heading colors');

const pageNames = new Set(['Index']);
for (const match of app.matchAll(/import\(["']\.\/pages\/(\w+)["']\)/g)) pageNames.add(match[1]);
const semanticDelegates = new Map([
  ['Index', 'src/components/home/HeroHome.tsx'],
  ['Services', 'src/components/services/ServiceDirectory.tsx'],
  ['ServiceDetail', 'src/components/services/ServiceDetailExperience.tsx'],
]);
const shellExemptions = new Set(['SuburbRedirect']);
const banned = [
  ['legacy brand utility', /(?:^|[\s"'])(?:(?:[a-z-]+):)*(?:bg|text|border|from|via|to)-brand-/m],
  ['gradient treatment', /(?:bg-gradient|linear-gradient\()/],
  ['template card radius', /rounded-(?:card|2xl|3xl)/],
  ['heavy floating shadow', /(?:shadow-2xl|hover:shadow)/],
  ['decorative blur or glass', /(?:blur-(?:2xl|3xl)|glass-card)/],
];
const failures = [];
for (const name of [...pageNames].sort()) {
  const relative = `src/pages/${name}.tsx`;
  const source = await readFile(path.join(ROOT, relative), 'utf8');
  const delegate = semanticDelegates.get(name);
  const semanticSource = delegate ? `${source}\n${await readFile(path.join(ROOT, delegate), 'utf8')}` : source;
  if (!shellExemptions.has(name) && !/(?:editorial-route|data-[a-z-]+-page|--after-hours-)/.test(semanticSource)) {
    failures.push(`${relative}: missing semantic After-Hours route shell`);
  }
  for (const [label, pattern] of banned) {
    if (pattern.test(source)) failures.push(`${relative}: contains ${label}`);
  }
}

assert.deepEqual(failures, [], `Editorial route audit failed:\n${failures.join('\n')}`);
console.log(`Editorial route audit passed: ${pageNames.size} production page modules use semantic After-Hours styling.`);
