#!/usr/bin/env node
/**
 * Convert all JPG/PNG images to AVIF format and delete originals.
 * Skips .webp files (already optimized and referenced in code).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRS = [
  path.resolve(__dirname, '../src/assets/images'),
  path.resolve(__dirname, '../src/assets/blog'),
];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const AVIF_QUALITY = 65;

let totalOriginalSize = 0;
let totalAvifSize = 0;
let convertedCount = 0;
let skippedCount = 0;

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.includes(ext)) {
    return;
  }

  const avifPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  // Skip if AVIF already exists
  if (fs.existsSync(avifPath)) {
    skippedCount++;
    return;
  }

  try {
    const originalSize = fs.statSync(filePath).size;
    await sharp(filePath).avif({ quality: AVIF_QUALITY }).toFile(avifPath);
    const avifSize = fs.statSync(avifPath).size;

    totalOriginalSize += originalSize;
    totalAvifSize += avifSize;
    convertedCount++;

    const savings = ((1 - avifSize / originalSize) * 100).toFixed(1);
    console.log(`✓ ${path.basename(filePath)} → .avif (${(originalSize/1024).toFixed(0)}KB → ${(avifSize/1024).toFixed(0)}KB, ${savings}% smaller)`);

    // Delete original
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`✗ Failed: ${path.basename(filePath)} — ${err.message}`);
  }
}

async function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Skipping (not found): ${dir}`);
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else {
      await convertFile(fullPath);
    }
  }
}

async function main() {
  console.log('=== AVIF Conversion ===\n');
  for (const dir of DIRS) {
    console.log(`\nProcessing: ${dir}`);
    await walkDir(dir);
  }

  console.log('\n=== Summary ===');
  console.log(`Converted: ${convertedCount} files`);
  console.log(`Skipped (already AVIF): ${skippedCount} files`);
  if (convertedCount > 0) {
    console.log(`Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`AVIF total: ${(totalAvifSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Saved: ${((totalOriginalSize - totalAvifSize) / 1024 / 1024).toFixed(2)} MB (${((1 - totalAvifSize / totalOriginalSize) * 100).toFixed(1)}%)`);
  }
}

main().catch(console.error);
