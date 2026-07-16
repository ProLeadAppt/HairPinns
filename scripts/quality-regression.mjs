import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEARCH_ROOTS = ['src', 'public', 'scripts'];
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.txt', '.html', '.toml', '.xml']);

async function textFiles(relativeDir) {
  const absoluteDir = path.join(ROOT, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) files.push(...await textFiles(relativePath));
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name))) files.push(relativePath);
  }
  return files;
}

const files = (await Promise.all(SEARCH_ROOTS.map(textFiles))).flat();
const corpus = [];
for (const relativePath of files) {
  corpus.push({ relativePath, text: await readFile(path.join(ROOT, relativePath), 'utf8') });
}

function occurrences(pattern, { exclude = [] } = {}) {
  const effectiveExclusions = ['scripts/quality-regression.mjs', 'scripts\\quality-regression.mjs', ...exclude];
  return corpus
    .filter(({ relativePath }) => {
      const normalizedPath = relativePath.replaceAll('\\', '/');
      return !effectiveExclusions.some((value) => normalizedPath.endsWith(value.replaceAll('\\', '/')));
    })
    .filter(({ text }) => pattern.test(text))
    .map(({ relativePath }) => relativePath);
}

const businessConfig = await readFile(path.join(ROOT, 'src/config/businessConfig.ts'), 'utf8');
assert.match(businessConfig, /display:\s*["']0416 037 663["']/);
assert.match(businessConfig, /raw:\s*["']\+61416037663["']/);
assert.match(businessConfig, /tel:\s*["']tel:\+61416037663["']/);

assert.deepEqual(
  occurrences(/(?:\+61[-\s]*468[-\s]*093[-\s]*991|0468\s*093\s*991|61468093991)/),
  [],
  'Stale non-GBP phone number remains in source or public content',
);

assert.deepEqual(
  occurrences(/Composite of client feedback|real quote to be added before publish/i),
  [],
  'Published placeholder or composite-review copy remains',
);

assert.deepEqual(
  occurrences(/synthesiseCompareAt/, { exclude: ['src/lib/utils.ts'] }),
  [],
  'UI still synthesises an unverified comparison price',
);

assert.deepEqual(
  occurrences(/searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, {
    exclude: ['.hermes/plans/2026-07-15_102209-hair-pinns-10x-audit-and-roadmap.md'],
  }),
  [],
  'SearchAtlas remains in deployable source',
);

assert.deepEqual(
  occurrences(/\/services#(?:colour|cuts|mid-length-straight-up-smoothing)(?=["'])/),
  [],
  'Broken service fragments remain in source or public content',
);

const searchResults = await readFile(path.join(ROOT, 'src/pages/SearchResults.tsx'), 'utf8');
assert.match(searchResults, /<SEOHead[\s\S]*?noIndex=\{true\}/, 'Internal search must be noindex');

const sitemapGenerator = await readFile(path.join(ROOT, 'scripts/generate-sitemap.js'), 'utf8');
assert.doesNotMatch(sitemapGenerator, /urls\.push\(url\(`\$\{BASE\}\/search/);
assert.doesNotMatch(sitemapGenerator, /urls\.push\(url\(`\$\{BASE\}\/(?:llms|llm|humans|ai|\.well-known)/);
assert.match(sitemapGenerator, /canonicalSiteUrl/, 'Sitemap URLs must use the canonical trailing-slash helper');

const seoHead = await readFile(path.join(ROOT, 'src/components/SEOHead.tsx'), 'utf8');
assert.match(seoHead, /canonicalSiteUrl/, 'SEOHead must normalize canonical and Open Graph URLs');
assert.match(seoHead, /canonicalizeSchemaUrls/, 'SEOHead must normalize same-site schema URLs');

const prerender = await readFile(path.join(ROOT, 'scripts/prerender.mjs'), 'utf8');
assert.match(prerender, /canonicalizeInternalHref/, 'Prerendered internal links must use trailing slashes');
assert.match(prerender, /throw new Error\(`Prerender failed/, 'Any missing prerender route must fail the build');

const routeCollector = await readFile(path.join(ROOT, 'scripts/collect-prerender-routes.js'), 'utf8');
assert.doesNotMatch(routeCollector, /collectionHandles = \['juuce', 'qiqi', 'pure'/, 'Stale collection fallbacks must not be prerendered');
assert.match(routeCollector, /juuce-botanicals/, 'Current Shopify collection handles must be guarded');
assert.doesNotMatch(routeCollector, /available_for_sale:true/, 'Sold-out Shopify products must remain routable');

const sitemapXml = await readFile(path.join(ROOT, 'public/sitemap.xml'), 'utf8');
for (const handle of [
  'aromaganic-curly-curl-hair-curly-hair-conditioner',
  'aromaganic-curly-curl-hair-curly-hair-shampoo',
  'juuce-sea-air-mist-beachy',
]) {
  assert.match(sitemapXml, new RegExp(`/products/${handle}/`), `Sold-out product missing from sitemap: ${handle}`);
}

const appSource = await readFile(path.join(ROOT, 'src/App.tsx'), 'utf8');
const exactRouterPaths = [...appSource.matchAll(/<Route\s+path="(\/[^"]*)"/g)]
  .map((match) => match[1])
  .filter((route) => !route.includes(':') && route !== '/*');
const staticPageBlock = routeCollector.match(/const staticPages = \[([\s\S]*?)\];/)?.[1] || '';
const prerenderedExactPaths = new Set([...staticPageBlock.matchAll(/['"](\/[^'"]*)['"]/g)].map((match) => match[1]));
const intentionallyPrivatePaths = new Set(['/dev/collections', '/dev/shopify', '/500']);

const schemaSource = await readFile(path.join(ROOT, 'src/lib/schema.ts'), 'utf8');
assert.match(schemaSource, /shippingDestination:[\s\S]*?addressCountry:\s*'AU'/, 'Product schema must restrict shipping to Australia');
assert.match(schemaSource, /eligibleRegion:[\s\S]*?name:\s*'Australia'/, 'Product offers must be Australia-only');
assert.match(schemaSource, /applicableCountry:\s*'AU'/, 'Merchant return policy must be scoped to Australia');

const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8');
assert.doesNotMatch(indexHtml, /searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, 'SearchAtlas loader remains in index.html');
assert.doesNotMatch(indexHtml, /fonts\.googleapis\.com|fonts\.gstatic\.com/, 'Critical fonts must be self-hosted');
assert.doesNotMatch(indexHtml, /googletagmanager\.com\/gtag\/js/, 'GA4 must not compete with first paint');
assert.match(indexHtml, /gtag\(['"]config['"],\s*['"]G-N6Y1TJMWGG['"]\)/, 'GA4 config must be queued before deferred events');
assert.doesNotMatch(indexHtml, /rel="preload"[^>]+hero-poster\.avif/, 'Do not preload the desktop video poster as the mobile LCP image');
assert.match(indexHtml, /rel="preload"[^>]+href="[^"]*hero-journal-mobile-640w\.avif"/, 'Preload the cropped mobile hero LCP image');
const responsiveHeroPreload = indexHtml.match(/imagesrcset="([^"]+)"/)?.[1] ?? '';
for (const candidate of ['hero-journal-640w.avif', 'hero-journal-1280w.avif', 'hero-journal-1440w.avif']) {
  assert.ok(responsiveHeroPreload.includes(candidate), `Responsive hero preload is missing ${candidate}`);
}

const trackingScripts = await readFile(path.join(ROOT, 'src/components/tracking/TrackingScripts.tsx'), 'utf8');
assert.match(trackingScripts, /googletagmanager\.com\/gtag\/js/, 'Deferred tracking must still load GA4');
assert.doesNotMatch(trackingScripts, /gtag\?\.\(['"]config['"]/, 'Deferred loader must not queue a duplicate GA4 config/page view');

const indexCss = await readFile(path.join(ROOT, 'src/index.css'), 'utf8');
assert.match(indexCss, /--after-hours-near-black:\s*288 100% 6%;\s*\/\* #18001E \*\//, 'After-Hours footer near-black must remain a semantic token');

const heroSource = await readFile(path.join(ROOT, 'src/components/home/HeroHome.tsx'), 'utf8');
assert.match(heroSource, /Shop Jena's shelf/, 'Hero CTA must expose its visible shopping label');
assert.doesNotMatch(heroSource, /aria-label="Shop Jena's product shelf"/, 'Hero CTA accessible name must exactly preserve its visible label');
assert.match(heroSource, /hero-journal-640w\.avif[\s\S]*?srcSet=/, 'Hero must use the approved responsive first-party finish image');
assert.match(heroSource, /hero-journal-mobile-640w\.avif/, 'Mobile hero must avoid decoding pixels that CSS immediately crops away');
assert.match(heroSource, /Selected by Jena/, 'Hero must preserve Jena as the human trust signature');
assert.doesNotMatch(heroSource, /hero-reel|<video/, 'Hero art direction must not be replaced after LCP by unrelated video footage');
assert.doesNotMatch(heroSource, /["']Fraunces["']/, 'Hero must not pull the optional Fraunces family into the critical path');

const socialProofSource = await readFile(path.join(ROOT, 'src/components/home/HeroSocialProofBar.tsx'), 'utf8');
assert.doesNotMatch(socialProofSource, /text-foreground\/60/, 'Trust-strip supporting text must meet WCAG AA contrast');

const jenaPromiseSource = await readFile(path.join(ROOT, 'src/components/home/JenaPromise.tsx'), 'utf8');
assert.match(jenaPromiseSource, /jena-founder-540w\.avif[\s\S]*?srcSet=/, 'Founder proof must offer a mobile-sized clean AVIF portrait');
assert.match(jenaPromiseSource, /jena-founder-1080w\.webp/, 'Founder proof must retain a WebP fallback');
assert.doesNotMatch(jenaPromiseSource, /jena-headshot|MEET JENA/, 'Founder proof must not restore the portrait with baked campaign text');
assert.match(jenaPromiseSource, /Behind the chair since 2009/, 'Founder proof must retain Jena’s working-hairdresser context');
assert.match(jenaPromiseSource, /Shop the shelf[\s\S]*Read Jena’s story/, 'Founder proof must keep commerce primary and biography secondary');
assert.doesNotMatch(jenaPromiseSource, /Award|Heart|Sparkles|rounded-full|999px/, 'Founder proof must not regress to generic icon-list or pill-card styling');

const beforeAfterSource = await readFile(path.join(ROOT, 'src/components/home/BeforeAfterShowcase.tsx'), 'utf8');
assert.match(beforeAfterSource, /hairdresser-taking-care-her-client-1280w\.avif/, 'Salon comparison must use the optimized finish image');
assert.match(beforeAfterSource, /brunette-woman-getting-her-hair-washed-1280w\.avif/, 'Salon comparison must use the optimized basin image');

const bestSellersSource = await readFile(path.join(ROOT, 'src/components/home/BestSellers.tsx'), 'utf8');
assert.doesNotMatch(bestSellersSource, /aria-label=\{`Add \$\{product\.title\} to bag`\}/, 'Quick-add accessible name must include the visible button label');
assert.match(bestSellersSource, /min-h-11/, 'Mobile quick-add target must be at least 44px tall');
assert.doesNotMatch(bestSellersSource, /most reordered|keep reordering/i, 'Curated product picks must not claim unsupported reorder data');
assert.match(bestSellersSource, /02 \/ Jena’s shelf/, 'Product shelf must retain its editorial sequence label');
assert.match(bestSellersSource, /object-contain/, 'Product packaging must not be cropped inside the editorial plates');
assert.match(bestSellersSource, /\(max-width: 1023px\) 50vw, 30vw/, 'Secondary product images must request candidates sized for the two-column mobile shelf');
assert.match(bestSellersSource, /Shop all products/, 'Product shelf must close with a route to the full catalogue');
assert.doesNotMatch(bestSellersSource, /text-\[0\.66rem\][^\n]*after-hours-copper/, 'Small shelf labels need stronger than decorative copper contrast on paper');
assert.doesNotMatch(bestSellersSource, /rounded-card|hover:shadow-lg/, 'Product shelf must not regress to generic floating card chrome');

const blogTrioSource = await readFile(path.join(ROOT, 'src/components/home/BlogTrio.tsx'), 'utf8');
assert.match(blogTrioSource, /homeFeaturedGuides\.slice\(0, 3\)/, 'Homepage advice desk must retain the first three curated guides');
assert.match(blogTrioSource, /post\.excerpt/, 'Homepage guides must render their descriptive excerpt');
assert.doesNotMatch(blogTrioSource, /post\.hook/, 'Homepage guides must not reference the nonexistent hook field');
assert.match(blogTrioSource, /04 \/ Read, learn, ask/, 'Advice desk must own its editorial sequence label');
assert.match(blogTrioSource, /`\/blog\/\$\{[^}]+\.slug\}`[\s\S]*to="\/blog"/, 'Advice desk must preserve article and guide-catalogue routes');
assert.match(blogTrioSource, /shopifyImageWebp[\s\S]*srcSet[\s\S]*sizes=/, 'Homepage guide images must retain responsive Shopify sources');
assert.doesNotMatch(blogTrioSource, /content-visibility-auto/, 'Deferred advice desk must not double-defer lazy images in WebKit');
assert.doesNotMatch(blogTrioSource, /rounded-card|hover:shadow-lg|<SectionHeader|<Badge/, 'Advice desk must not regress to generic floating card chrome');

const bookingBannerSource = await readFile(path.join(ROOT, 'src/components/home/BookingBanner.tsx'), 'utf8');
assert.match(bookingBannerSource, /05 \/ Visit the salon/, 'Salon close must own the final numbered homepage marker');
assert.match(bookingBannerSource, /data-home-booking-close/, 'Salon close must expose a stable marker for sticky-bar suppression');
assert.match(bookingBannerSource, /BOOK_CTA_LABEL[\s\S]*href=\{BOOK_URL\}/, 'Salon close must retain the centralized visible booking label and destination');
assert.match(bookingBannerSource, /trackBookingClick\("booking_banner", window\.location\.pathname\)/, 'Salon close must preserve booking attribution');
assert.match(bookingBannerSource, /target="_blank"[\s\S]*rel="noopener noreferrer"/, 'External Fresha booking must open safely in a new tab');
assert.match(bookingBannerSource, /tel:\+61416037663/, 'Salon close must retain the canonical Hair Pinns mobile number');
assert.match(bookingBannerSource, /jena-working-480w\.avif[\s\S]*srcSet[\s\S]*sizes=/, 'Salon close must use responsive first-party working imagery');
assert.doesNotMatch(bookingBannerSource, /aria-label="Book an appointment"|rounded-full|999px|bg-gradient|contentVisibility/, 'Salon close must not regress to mismatched labels, pills, gradients, or double deferral');

const stickyBarSource = await readFile(path.join(ROOT, 'src/components/home/StickyBookBar.tsx'), 'utf8');
assert.match(stickyBarSource, /querySelector<HTMLElement>\("\[data-home-booking-close\]"\)/, 'Sticky commerce bar must detect the contained salon close');
assert.match(stickyBarSource, /salonRect\.bottom > 0 && salonRect\.top < window\.innerHeight/, 'Sticky commerce bar must hide for the full visible salon-close interval');
assert.match(stickyBarSource, /new MutationObserver\(updateVisibility\)[\s\S]*childList: true, subtree: true/, 'Sticky commerce bar must handle deferred salon and footer mounting');
assert.match(stickyBarSource, /requestAnimationFrame[\s\S]*cancelAnimationFrame/, 'Sticky commerce geometry checks must be frame-throttled and cleaned up');
assert.match(stickyBarSource, /window\.scrollY > 400 && !salonIsVisible && !footerIsVisible/, 'Sticky commerce bar must retain threshold, salon, and footer suppression');
assert.match(stickyBarSource, /to="\/collections"[\s\S]*href=\{BOOK_URL\}/, 'Sticky commerce bar must retain product-first and secondary salon actions');

const scrollTopSource = await readFile(path.join(ROOT, 'src/components/ScrollToTopButton.tsx'), 'utf8');
assert.match(scrollTopSource, /querySelector<HTMLElement>\("\[data-home-booking-close\]"\)/, 'Scroll-to-top control must detect the salon close');
assert.match(scrollTopSource, /querySelector<HTMLElement>\("\[data-home-footer\]"\)/, 'Scroll-to-top control must detect the final footer');
assert.match(scrollTopSource, /window\.pageYOffset > 300 && !salonIsVisible && !footerIsVisible/, 'Scroll-to-top control must yield to the salon close and footer while retaining its threshold');
assert.match(scrollTopSource, /new MutationObserver\(toggleVisibility\)[\s\S]*childList: true, subtree: true/, 'Scroll-to-top control must handle deferred salon mounting');
assert.match(scrollTopSource, /prefers-reduced-motion: reduce[\s\S]*behavior: reduceMotion \? "auto" : "smooth"/, 'Scroll-to-top control must retain reduced-motion behavior');

const footerSource = await readFile(path.join(ROOT, 'src/components/Footer.tsx'), 'utf8');
assert.match(footerSource, /data-home-footer=""/, 'Footer must expose a stable marker for floating-control suppression');
assert.match(footerSource, /after-hours-near-black[\s\S]*after-hours-copper[\s\S]*after-hours-cream/, 'Footer must continue the semantic After-Hours palette');
assert.match(footerSource, /hairPinnsLogo[\s\S]*brightness-0 invert/, 'Footer must retain the real Hair Pinns logo with dark-background treatment');
assert.match(footerSource, /form_name: 'newsletter_footer'[\s\S]*consent_marketing: true[\s\S]*event: 'newsletter_subscription'/, 'Footer newsletter must retain GHL capture, consent, and attribution');
assert.match(footerSource, /leadconnector-widget[\s\S]*data-widget-id[\s\S]*setTimeout\(load, 8000\)/, 'Footer must retain the deferred LeadConnector facade');
assert.match(footerSource, /instagram\.com\/hair\.pinns[\s\S]*facebook\.com\/Hair\.Pinns/, 'Footer must retain first-party social destinations');
assert.match(footerSource, /BUSINESS_NAP\.address\.street[\s\S]*BUSINESS_NAP\.phone\.tel[\s\S]*sms:\$\{BUSINESS_NAP\.phone\.raw\}[\s\S]*wa\.me\/61416037663/, 'Footer must retain canonical address, phone, SMS, and WhatsApp contacts');
for (const route of ['/collections', '/blog', '/policies/shipping', '/policies/returns', '/faq', '/glossary', '/services', '/booking', '/about', '/areas', '/contact', '/privacy', '/terms']) {
  assert.match(footerSource, new RegExp(route.replaceAll('/', '\\/')), `Footer must retain route ${route}`);
}
assert.match(footerSource, /Mon", "Closed[\s\S]*Tue", "10am–5pm[\s\S]*Wed", "6pm–9pm[\s\S]*Thu", "9am–9pm[\s\S]*Fri", "9am–5:30pm[\s\S]*Sat", "8am–2pm[\s\S]*Sun", "Closed/, 'Footer must retain published salon hours');
assert.match(footerSource, /min-h-11[\s\S]*aria-label="Footer navigation"[\s\S]*aria-label="Legal links"/, 'Footer navigation and legal links must retain 44px touch targets and named regions');
assert.match(footerSource, /munyal\.com\.au[\s\S]*Visa[\s\S]*Mastercard[\s\S]*Afterpay[\s\S]*Zip/, 'Footer must retain Munyal credit and accepted payment labels');
assert.doesNotMatch(footerSource, /bg-muted|rounded-xl|rounded-full|<Instagram|<Facebook|<MapPin|<Phone/, 'After-Hours footer must not regress to pale template cards or generic icon circles');

const homeSource = await readFile(path.join(ROOT, 'src/pages/Index.tsx'), 'utf8');
assert.match(homeSource, /isVisible \? "" : "min-h-px"/, 'Deferred sections need a physical sentinel so WebKit cannot skip lazy mounting');
assert.doesNotMatch(homeSource, /"@type":\s*"VideoObject"/, 'Homepage schema must not advertise a video that is no longer embedded');
assert.doesNotMatch(homeSource, /<DeferredSection className="reveal" fallback=\{null\}>\s*<Suspense fallback=\{null\}>\s*<JenaPromise/, 'Deferred founder proof must not depend on a reveal observer that ran before it mounted');
assert.doesNotMatch(homeSource, /<SectionNumber index="04"|<DeferredSection className="reveal py-12 bg-muted\/30"/, 'Advice desk must not retain a duplicate divider or reveal-dependent wrapper');
for (const component of ['ShopByConcern', 'BestSellers', 'JenaPromise', 'BlogTrio', 'BookingBanner']) {
  assert.match(homeSource, new RegExp(`<${component}\\s*\\/>`), `Product-first homepage is missing ${component}`);
}
assert.ok(
  homeSource.indexOf('<ShopByConcern />') < homeSource.indexOf('<BestSellers />') &&
  homeSource.indexOf('<BestSellers />') < homeSource.indexOf('<JenaPromise />') &&
  homeSource.indexOf('<JenaPromise />') < homeSource.indexOf('<BlogTrio />') &&
  homeSource.indexOf('<BlogTrio />') < homeSource.indexOf('<BookingBanner />'),
  'Homepage must route product discovery before founder credibility and salon booking',
);
assert.doesNotMatch(homeSource, /<BeforeAfterShowcase\s*\/>|<ReviewsShowcase\s*\/>/, 'Salon-heavy showcases must not displace product discovery on the homepage');

const homeHeroSource = await readFile(path.join(ROOT, 'src/components/home/HeroHome.tsx'), 'utf8');
assert.ok(homeHeroSource.indexOf('to="/collections"') < homeHeroSource.indexOf('href={BOOK_URL}'), 'Homepage hero must present shopping before booking');
assert.match(homeHeroSource, /trackBookingClick\("hero_home_secondary"/, 'Homepage booking must use the central booking tracker and URL');
assert.match(homeHeroSource, /Shop Jena's shelf/, 'Homepage hero needs a clear product-first CTA');

const stickyActionSource = await readFile(path.join(ROOT, 'src/components/home/StickyBookBar.tsx'), 'utf8');
assert.match(stickyActionSource, /aria-label="Quick shop bar"/, 'Mobile sticky action must remain commerce-first');
assert.ok(stickyActionSource.indexOf('to="/collections"') < stickyActionSource.indexOf('href={BOOK_URL}'), 'Mobile sticky action must present shopping before salon booking');
assert.match(stickyActionSource, /if \(!visible\) return null;/, 'Hidden mobile sticky actions must be removed from keyboard navigation');

const commerceNavigationSource = await readFile(path.join(ROOT, 'src/config/commerceNavigation.ts'), 'utf8');
for (const handle of ['frizz-free-must-haves', 'heat-protection', 'blonde-bombshells', 'pump-up-the-volume', 'curly-girlys']) {
  assert.match(commerceNavigationSource, new RegExp(handle), `Shop-by-concern destination missing: ${handle}`);
}

const globalCss = await readFile(path.join(ROOT, 'src/index.css'), 'utf8');
assert.match(globalCss, /@font-face[\s\S]*?font-family:\s*"Inter"/, 'Inter must be self-hosted');
assert.match(globalCss, /@font-face[\s\S]*?font-family:\s*"Playfair Display"/, 'Playfair Display must be self-hosted');
assert.match(globalCss, /\.section-number-label[\s\S]*?var\(--muted-foreground\)/, 'Editorial divider labels must use the WCAG-safe muted foreground');
assert.match(globalCss, /\.section-number-index[\s\S]*?var\(--brand-700\)/, 'Editorial divider numbers must use a WCAG-safe brand colour');

const trackingGateSource = await readFile(path.join(ROOT, 'src/components/tracking/TrackingGate.tsx'), 'utf8');
assert.doesNotMatch(trackingGateSource, /requestIdleCallback\(run/, 'Tracking must not load during an early idle slot before LCP');
assert.match(trackingGateSource, /addEventListener\(["']load["']/, 'Tracking must wait until the page load event');
assert.match(trackingGateSource, /addEventListener\(["']pointerdown["']/, 'User interaction must still activate tracking immediately');

const netlify = await readFile(path.join(ROOT, 'netlify.toml'), 'utf8');
assert.doesNotMatch(netlify, /searchatlas|sa\.searchatlas\.com|dashboard\.searchatlas\.com/i, 'SearchAtlas remains in CSP');
const netlifyExactFromPaths = new Set(
  [...netlify.matchAll(/from\s*=\s*"(\/[^"]+)"/g)]
    .map((match) => match[1])
    .filter((route) => !route.includes('*') && !route.includes(':')),
);
for (const route of exactRouterPaths) {
  assert.ok(
    prerenderedExactPaths.has(route) || netlifyExactFromPaths.has(route) || intentionallyPrivatePaths.has(route),
    `Public router path is neither prerendered nor explicitly rewritten: ${route}`,
  );
}
assert.match(netlify, /from\s*=\s*"\/suburbs\/\*"[\s\S]*?status\s*=\s*301/, 'Legacy suburb routes need an edge redirect');
for (const operationalPath of ['/confirm', '/order-confirmation', '/reviews/feedback', '/reviews/google']) {
  const escaped = operationalPath.replaceAll('/', '\\/');
  assert.match(
    netlify,
    new RegExp(`from\\s*=\\s*"${escaped}"[\\s\\S]*?to\\s*=\\s*"\\/index\\.html"[\\s\\S]*?status\\s*=\\s*200`),
    `Operational route needs an SPA rewrite: ${operationalPath}`,
  );
}
for (const noindexPath of ['/confirm', '/order-confirmation', '/reviews/*']) {
  const escaped = noindexPath.replaceAll('/', '\\/').replace('*', '\\*');
  assert.match(
    netlify,
    new RegExp(`\\[\\[headers\\]\\]\\s+for\\s*=\\s*"${escaped}"\\s+\\[headers\\.values\\]\\s+X-Robots-Tag\\s*=\\s*"noindex, nofollow"`),
    `Operational route needs an HTTP noindex policy: ${noindexPath}`,
  );
}
assert.match(
  netlify,
  /from\s*=\s*"\/\*"[\s\S]*?to\s*=\s*"\/404\.html"[\s\S]*?status\s*=\s*404/,
  'Unknown routes must return a real 404 response',
);

console.log(`Quality regression checks passed across ${files.length} files.`);
