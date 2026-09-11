/**
 * Generate OG images (1200×630) for Hair Pinns using sharp.
 * Run: node scripts/generate-og-images.mjs
 */
import fs from 'fs';
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public');

const configs = [
  {
    file: 'og-default.jpg',
    bg: '#F7F1FA',
    title: 'Hair Pinns',
    subtitle: 'Professional Hair Care \u00B7 Bangor NSW',
  },
  {
    file: 'og-blog.jpg',
    bg: '#E4D5EC',
    title: 'Hair Care Tips',
    subtitle: 'Expert Advice from Hair Pinns',
  },
  {
    file: 'og-product.jpg',
    bg: '#F7F1FA',
    title: 'Salon-Quality Products',
    subtitle: 'Shipped Australia-Wide',
  },
  {
    file: 'og-collection.jpg',
    bg: '#E4D5EC',
    title: 'Hair Care Collections',
    subtitle: 'Curated for Your Hair',
  },
  {
    file: 'og-service.jpg',
    bg: '#F7F1FA',
    title: 'Hair Services',
    subtitle: 'Colour \u00B7 Smoothing \u00B7 Styling \u00B7 Cuts',
  },
  {
    file: 'og-suburb.jpg',
    bg: '#E4D5EC',
    title: 'Your Local Salon',
    subtitle: 'Serving the Sutherland Shire',
  },
];

function svgImage({ bg, title, subtitle }) {
  // SVG with embedded text — sharp will rasterise it to 1200×630
  return Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${bg}"/>
  <!-- Light, editorial framing from Jena's approved lavender and purple palette. -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#E4D5EC" stop-opacity="0.32"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <path d="M0 0h292l148 630H0z" fill="#753D91"/>
  <circle cx="120" cy="474" r="170" fill="#FFFFFF" fill-opacity="0.08"/>
  <rect x="478" y="176" width="92" height="4" fill="#753D91"/>
  <text x="478" y="146" font-family="Inter,'Helvetica Neue',Arial,sans-serif"
        font-weight="600" font-size="19" fill="#753D91" letter-spacing="5">HAIR PINNS</text>
  <!-- title -->
  <text x="478" y="292" text-anchor="start"
        font-family="'Playfair Display',Georgia,serif"
        font-weight="700" font-size="70" fill="#35253E"
        letter-spacing="-1">${escapeXml(title)}</text>
  <!-- subtitle -->
  <text x="478" y="358" text-anchor="start"
        font-family="Inter,'Helvetica Neue',Arial,sans-serif"
        font-weight="400" font-size="30" fill="#35253E"
        letter-spacing="0.2">${escapeXml(subtitle)}</text>
  <rect x="478" y="405" width="520" height="2" fill="#753D91" fill-opacity="0.32"/>
  <!-- bottom branding -->
  <text x="478" y="486" text-anchor="start"
        font-family="Inter,'Helvetica Neue',Arial,sans-serif"
        font-weight="600" font-size="21" fill="#753D91"
        letter-spacing="3">HAIRPINNS.COM</text>
</svg>`);
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main() {
  console.log('Generating OG images...\n');
  for (const cfg of configs) {
    const out = resolve(outDir, cfg.file);
    await sharp(svgImage(cfg))
      .resize(1200, 630)
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toFile(out);
    const stats = fs.statSync(out);
    console.log(`  ✓ ${cfg.file}  1200×630  (${Math.round(stats.size / 1024)} KB)`);
  }

  console.log('\nDone! All images saved to public/');
}

main().catch((e) => { console.error(e); process.exit(1); });
