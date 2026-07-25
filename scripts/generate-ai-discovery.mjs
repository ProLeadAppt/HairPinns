import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { build } from 'esbuild';
import { buildDiscoveryFiles } from './ai-discovery.js';
import { collectRoutes } from './collect-prerender-routes.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const loadEntityRegistry = async () => {
  const result = await build({
    entryPoints: [resolve(root, 'src/config/entityRegistry.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });
  const source = result.outputFiles[0]?.text;
  if (!source) throw new Error('[ai-discovery] Entity registry bundle was empty');
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  return import(moduleUrl);
};

const getSourceDate = (fallback) => {
  try {
    const date = execSync(
      'git log -1 --format=%cs -- src/config/entityRegistry.ts src/data/blogSummaries.ts src/data/locationPages.ts src/data/shippingStates.ts src/data/shippingCities.ts scripts/service-routes.js scripts/route-policy.js',
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    return date || fallback;
  } catch {
    return fallback;
  }
};

const main = async () => {
  const registryModule = await loadEntityRegistry();
  const issues = registryModule.validateEntityRegistry();
  if (issues.length > 0) {
    throw new Error(`[ai-discovery] Invalid entity registry: ${issues.join(', ')}`);
  }

  const routes = await collectRoutes();
  const sourceDate = getSourceDate(registryModule.ENTITY_REGISTRY.hours.checkedDate);
  const files = buildDiscoveryFiles({
    registry: registryModule.ENTITY_REGISTRY,
    routes,
    sourceDate,
  });

  if (files['llm.txt'] !== files['llms-full.txt']) {
    throw new Error('[ai-discovery] llm.txt must be an exact alias of llms-full.txt');
  }

  for (const [filename, content] of Object.entries(files)) {
    if (!content.includes('GENERATED FILE')) {
      throw new Error(`[ai-discovery] ${filename} is missing its generated-file marker`);
    }
    writeFileSync(resolve(root, 'public', filename), content, 'utf8');
  }

  console.log(
    `[ai-discovery] Generated ${Object.keys(files).length} files from ${routes.length} manifest routes (source ${sourceDate})`,
  );
};

main().catch((error) => {
  console.error('[ai-discovery] Error:', error);
  process.exit(1);
});
