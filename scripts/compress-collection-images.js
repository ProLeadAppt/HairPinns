#!/usr/bin/env node

/**
 * Compress large collection WebP images for faster LCP
 * Targets images > 200KB, recompresses to quality 80
 *
 * Usage: npm run compress-collections
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLLECTIONS_DIR = path.join(__dirname, "../src/assets/collections");
const TARGETS = [
  "volume-collection.webp",
  "heat-protection-collection.webp",
  "frizz-free-collection.webp",
  "blonde-bombshells-collection.webp",
  "curly-girlys-collection.webp",
  "best-sellers-collection.webp",
];
const QUALITY = 80;
const MIN_SIZE_KB = 200;

async function compress(filePath) {
  const stats = await fs.stat(filePath);
  const sizeKb = stats.size / 1024;
  if (sizeKb < MIN_SIZE_KB) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (${sizeKb.toFixed(0)} KB < ${MIN_SIZE_KB} KB)`);
    return null;
  }
  const buf = await fs.readFile(filePath);
  const out = await sharp(buf)
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();
  const newKb = out.length / 1024;
  const savings = ((1 - out.length / stats.size) * 100).toFixed(1);
  await fs.writeFile(filePath, out);
  return { name: path.basename(filePath), before: sizeKb, after: newKb, savings };
}

async function main() {
  console.log("🖼️  Compressing large collection images...\n");
  let totalBefore = 0;
  let totalAfter = 0;
  for (const name of TARGETS) {
    const p = path.join(COLLECTIONS_DIR, name);
    try {
      await fs.access(p);
    } catch {
      console.log(`⏭️  ${name} not found`);
      continue;
    }
    const r = await compress(p);
    if (r) {
      totalBefore += r.before;
      totalAfter += r.after;
      console.log(`✅ ${r.name}: ${r.before.toFixed(0)} KB → ${r.after.toFixed(0)} KB (${r.savings}% smaller)`);
    }
  }
  if (totalBefore > 0) {
    const totalSavings = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(`\n📊 Total: ${(totalBefore / 1024).toFixed(2)} MB → ${(totalAfter / 1024).toFixed(2)} MB (${totalSavings}% saved)`);
  }
  console.log("\n✨ Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
