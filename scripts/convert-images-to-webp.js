#!/usr/bin/env node

/**
 * Image Conversion Script
 * Converts all JPG/PNG images in src/assets/ to WebP format
 * 
 * Usage:
 *   npm run convert-images
 * 
 * Requirements:
 *   - sharp package (npm install -D sharp)
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const SIZES = {
  small: 640,
  medium: 1280,
  large: 1920,
};

/**
 * Check if file is an image
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

/**
 * Check if WebP version already exists
 */
async function webpExists(filePath) {
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  try {
    await fs.access(webpPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath, outputPath, width = null) {
  try {
    let sharpInstance = sharp(inputPath);
    
    const metadata = await sharpInstance.metadata();
    const actualWidth = width || metadata.width;
    
    // Resize if width is specified and image is larger
    if (width && metadata.width > width) {
      sharpInstance = sharpInstance.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    await sharpInstance
      .webp({ 
        quality: 85,
        effort: 6,
      })
      .toFile(outputPath);
    
    const stats = await fs.stat(outputPath);
    const inputStats = await fs.stat(inputPath);
    const savings = ((1 - stats.size / inputStats.size) * 100).toFixed(1);
    
    return {
      success: true,
      originalSize: inputStats.size,
      newSize: stats.size,
      savings: parseFloat(savings),
    };
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Generate multiple sizes for hero images
 */
async function generateResponsiveSizes(inputPath, baseName, outputDir) {
  const results = [];
  
  for (const [sizeName, width] of Object.entries(SIZES)) {
    const outputPath = path.join(outputDir, `${baseName}-${width}w.webp`);
    
    // Skip if already exists
    if (await webpExists(outputPath.replace(/\.webp$/, path.extname(inputPath)))) {
      console.log(`⏭️  Skipping ${path.basename(outputPath)} (already exists)`);
      continue;
    }
    
    const result = await convertToWebP(inputPath, outputPath, width);
    if (result.success) {
      results.push({ size: sizeName, width, ...result });
      console.log(`✅ Generated ${path.basename(outputPath)} (${width}w, ${result.savings}% smaller)`);
    }
  }
  
  return results;
}

/**
 * Process a single file
 */
async function processFile(filePath, relativePath) {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  
  // Check if WebP already exists
  const webpPath = path.join(dir, `${baseName}.webp`);
  if (await webpExists(filePath)) {
    console.log(`⏭️  Skipping ${relativePath} (WebP already exists)`);
    return null;
  }
  
  // For hero images, generate multiple sizes
  const isHeroImage = relativePath.includes('hero');
  
  if (isHeroImage) {
    console.log(`\n🖼️  Processing hero image: ${relativePath}`);
    const results = await generateResponsiveSizes(filePath, baseName, dir);
    return { type: 'hero', results };
  } else {
    // Single WebP conversion
    console.log(`\n🖼️  Converting: ${relativePath}`);
    const result = await convertToWebP(filePath, webpPath);
    
    if (result.success) {
      console.log(`✅ Created ${path.basename(webpPath)} (${result.savings}% smaller)`);
      return { type: 'single', result };
    }
    
    return null;
  }
}

/**
 * Recursively find all image files
 */
async function findImageFiles(dir, baseDir = dir) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        // Skip node_modules and .git
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          const subFiles = await findImageFiles(fullPath, baseDir);
          files.push(...subFiles);
        }
      } else if (entry.isFile() && isImageFile(entry.name)) {
        files.push({ fullPath, relativePath });
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image conversion to WebP...\n');
  console.log(`📁 Assets directory: ${ASSETS_DIR}\n`);
  
  // Check if assets directory exists
  try {
    await fs.access(ASSETS_DIR);
  } catch {
    console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
    process.exit(1);
  }
  
  // Find all image files
  const imageFiles = await findImageFiles(ASSETS_DIR);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  No image files found to convert.');
    return;
  }
  
  console.log(`📸 Found ${imageFiles.length} image file(s) to process\n`);
  
  // Process each file
  const results = [];
  for (const { fullPath, relativePath } of imageFiles) {
    const result = await processFile(fullPath, relativePath);
    if (result) {
      results.push(result);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Conversion Summary');
  console.log('='.repeat(60));
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let convertedCount = 0;
  
  for (const result of results) {
    if (result.type === 'hero') {
      for (const sizeResult of result.results) {
        totalOriginalSize += sizeResult.originalSize;
        totalNewSize += sizeResult.newSize;
        convertedCount++;
      }
    } else {
      totalOriginalSize += result.result.originalSize;
      totalNewSize += result.result.newSize;
      convertedCount++;
    }
  }
  
  const totalSavings = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1);
  const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const newMB = (totalNewSize / 1024 / 1024).toFixed(2);
  
  console.log(`✅ Converted: ${convertedCount} file(s)`);
  console.log(`📦 Original size: ${originalMB} MB`);
  console.log(`📦 New size: ${newMB} MB`);
  console.log(`💾 Space saved: ${totalSavings}% (${(totalOriginalSize - totalNewSize) / 1024 / 1024} MB)`);
  console.log('='.repeat(60));
  
  console.log('\n✨ Conversion complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update component imports to use .webp files');
  console.log('   2. Test images in development');
  console.log('   3. Commit converted images');
}

// Always run main when executed directly or via npm script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

export { convertToWebP, generateResponsiveSizes };

