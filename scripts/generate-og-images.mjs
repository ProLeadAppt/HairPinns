/**
 * Generate OG images (1200×630) for Hair Pinns using sharp.
 * Run: node scripts/generate-og-images.mjs
 */
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public');

const configs = [
  {
    file: 'og-default.jpg',
    bg: '#8B4A8B',
    title: 'Hair Pinns',
    subtitle: 'Professional Hair Care \u00B7 Bangor NSW',
  },
  {
    file: 'og-blog.jpg',
    bg: '#E8A87C',
    title: 'Hair Care Tips',
    subtitle: 'Expert Advice from Hair Pinns',
  },
  {
    file: 'og-product.jpg',
    bg: '#8B4A8B',
    title: 'Salon-Quality Products',
    subtitle: 'Shipped Australia-Wide',
  },
  {
    file: 'og-collection.jpg',
    bg: '#C4A575',
    title: 'Hair Care Collections',
    subtitle: 'Curated for Your Hair',
  },
  {
    file: 'og-service.jpg',
    bg: '#D4A574',
    title: 'Hair Services',
    subtitle: 'Colour \u00B7 Smoothing \u00B7 Styling \u00B7 Cuts',
  },
  {
    file: 'og-suburb.jpg',
    bg: '#A97B8F',
    title: 'Your Local Salon',
    subtitle: 'Serving the Sutherland Shire',
  },
];

function svgImage({ bg, title, subtitle }) {
  // SVG with embedded text — sharp will rasterise it to 1200×630
  return Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${bg}"/>
  <!-- subtle gradient overlay -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <!-- decorative line -->
  <rect x="480" y="200" width="240" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/>
  <!-- title -->
  <text x="600" y="310" text-anchor="middle"
        font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"
        font-weight="700" font-size="72" fill="#fff"
        letter-spacing="1">${escapeXml(title)}</text>
  <!-- subtitle -->
  <text x="600" y="380" text-anchor="middle"
        font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"
        font-weight="400" font-size="32" fill="rgba(255,255,255,0.85)"
        letter-spacing="0.5">${escapeXml(subtitle)}</text>
  <!-- decorative line -->
  <rect x="480" y="420" width="240" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/>
  <!-- bottom branding -->
  <text x="600" y="560" text-anchor="middle"
        font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif"
        font-weight="600" font-size="22" fill="rgba(255,255,255,0.6)"
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
      .jpeg({ quality: 85 })
      .toFile(out);
    const stats = await sharp(out).metadata();
    console.log(`  \u2713 ${cfg.file}  ${stats.width}\u00D7${stats.height}  (${Math.round(stats.size / 1024)} KB)`);
  }
  console.log('\nDone! All images saved to public/');
}

main().catch((e) => { console.error(e); process.exit(1); });
