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
assert.match(businessConfig, /raw:\s*["']\+61[0-9]{9}["']/);
assert.match(businessConfig, /tel:\s*["']tel:\+61[0-9]{9}["']/);

const homepageSource = await readFile(path.join(ROOT, 'src/pages/Index.tsx'), 'utf8');
const truthSchemaSource = await readFile(path.join(ROOT, 'src/lib/schema.ts'), 'utf8');
const reviewsPageSource = await readFile(path.join(ROOT, 'src/pages/Reviews.tsx'), 'utf8');
const homepageTrustSource = await readFile(path.join(ROOT, 'src/components/home/HeroSocialProofBar.tsx'), 'utf8');
const criticalHeaderSource = await readFile(path.join(ROOT, 'src/components/Header.tsx'), 'utf8');
const criticalViteConfigSource = await readFile(path.join(ROOT, 'vite.config.ts'), 'utf8');
assert.doesNotMatch(truthSchemaSource, /reviewCount:\s*["']762["']/);
assert.doesNotMatch(truthSchemaSource, /reviews\.slice\(/);
assert.doesNotMatch(truthSchemaSource, /\baggregateRating\s*:/);
assert.doesNotMatch(homepageSource, /generateFAQPageSchema|generateHowToSchema|googleReviews|PT2M|762\s+five-star/i);
assert.doesNotMatch(reviewsPageSource, /4\.9\s+stars|53\+\s+verified|googleReviews/i);
assert.doesNotMatch(homepageTrustSource, /762|4\.9\s*\/\s*5|no drama/i);
assert.match(homepageTrustSource, /14-day returns[\s\S]*unopened products/);
assert.doesNotMatch(criticalViteConfigSource, /id\.includes\(['"]react['"]\)/, 'React vendor matching must not capture every package containing “react”');
assert.match(criticalViteConfigSource, /react\|react-dom\|react-router\|react-router-dom/, 'React vendor matching must remain limited to core packages');
assert.match(criticalHeaderSource, /matchMedia\(["']\(min-width: 1280px\)["']\)/, 'Desktop header enhancements must follow the xl breakpoint');
assert.match(criticalHeaderSource, /showDesktopEnhancements[\s\S]*?<ShopDropdown \/>/, 'Mobile must not mount the desktop shop dropdown');
assert.match(criticalHeaderSource, /showDesktopEnhancements[\s\S]*?<ProductSearch placeholder=["']Search products and articles/, 'Mobile must not mount desktop search');

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
const motionSource = await readFile(path.join(ROOT, 'src/lib/motion.ts'), 'utf8');
const scrollRevealSource = await readFile(path.join(ROOT, 'src/hooks/useScrollReveal.ts'), 'utf8');
const tableOfContentsSource = await readFile(path.join(ROOT, 'src/components/blog/TableOfContents.tsx'), 'utf8');
const serviceDirectoryMotionSource = await readFile(path.join(ROOT, 'src/components/services/ServiceDirectory.tsx'), 'utf8');
assert.match(scrollTopSource, /querySelector<HTMLElement>\("\[data-home-booking-close\]"\)/, 'Scroll-to-top control must detect the salon close');
assert.match(scrollTopSource, /querySelector<HTMLElement>\("\[data-home-footer\]"\)/, 'Scroll-to-top control must detect the final footer');
assert.match(scrollTopSource, /window\.pageYOffset > 300 && !salonIsVisible && !footerIsVisible/, 'Scroll-to-top control must yield to the salon close and footer while retaining its threshold');
assert.match(scrollTopSource, /new MutationObserver\(toggleVisibility\)[\s\S]*childList: true, subtree: true/, 'Scroll-to-top control must handle deferred salon mounting');
assert.match(motionSource, /prefers-reduced-motion: reduce[\s\S]*matches[\s\S]*\? "auto" : "smooth"/, 'Shared motion policy must map reduced motion to instant scrolling');
assert.match(scrollTopSource, /preferredScrollBehavior\(\)/, 'Scroll-to-top control must use the shared reduced-motion policy');
assert.match(scrollRevealSource, /prefersReducedMotion\(\)[\s\S]*classList\.add\("visible"\)/, 'Reduced-motion users must receive revealed content without an observer animation');
assert.match(tableOfContentsSource, /scrollIntoView\(\{ behavior: preferredScrollBehavior\(\) \}\)/, 'Blog table-of-contents scrolling must respect the shared motion policy');
assert.match(serviceDirectoryMotionSource, /window\.scrollTo\(\{ top, behavior: preferredScrollBehavior\(\) \}\)/, 'Service navigation scrolling must respect the shared motion policy');
assert.doesNotMatch(scrollTopSource, /transition-all/, 'Scroll-to-top control must not animate unrelated geometry');
assert.doesNotMatch(indexCss, /font-family:\s*"Fraunces"|fraunces-(?:italic-)?latin\.woff2/, 'Global typography must use one Playfair editorial face without loading legacy Fraunces');

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
assert.match(footerSource, /aria-label="Accepted payment methods"[\s\S]*after-hours-cream\)\/0\.68|after-hours-cream\)\/0\.68[^\n]*aria-label="Accepted payment methods"/, 'Small footer payment labels need accessible cream contrast');
assert.doesNotMatch(footerSource, /bg-muted|rounded-xl|rounded-full|<Instagram|<Facebook|<MapPin|<Phone/, 'After-Hours footer must not regress to pale template cards or generic icon circles');

const headerSource = await readFile(path.join(ROOT, 'src/components/Header.tsx'), 'utf8');
assert.match(headerSource, /isStocktakeActive\(\)[\s\S]*QIQI_DISCOUNT_ACTIVE[\s\S]*DEFAULT_HEADER_MESSAGE/, 'Header must retain promotion priority and fallback copy');
assert.match(headerSource, /data-cta-offer=\{headerPromoOfferId\}[\s\S]*trackPromoClick\("header_promo_strip"/, 'Header promo must retain click attribution and offer identity');
assert.match(headerSource, /hidden items-center gap-5 xl:flex[\s\S]*xl:hidden/, 'Full desktop navigation must wait until xl while tablet keeps the stable drawer');
assert.match(headerSource, /aria-label="Main navigation"[\s\S]*to="\/blog"[\s\S]*to="\/about"[\s\S]*to="\/services"[\s\S]*to="\/contact"/, 'Desktop navigation must retain guides, founder, salon, and contact routes');
assert.match(headerSource, /SHOP_BY_CONCERN\.slice\(0, 4\)[\s\S]*aria-label="Mobile navigation"|aria-label="Mobile navigation"[\s\S]*SHOP_BY_CONCERN\.slice\(0, 4\)/, 'Mobile navigation must retain centralized concern routes');
assert.match(headerSource, /aria-label=\{itemCount > 0 \? `View cart[\s\S]*xl:hidden[\s\S]*<Sheet/, 'Mobile header must expose direct cart access before the menu');
assert.match(headerSource, /openCart\(returnTarget\)[\s\S]*trackBookingClick\("header_mobile"/, 'Mobile drawer must retain cart handoff and booking attribution');
assert.match(headerSource, /mobileMenuFirstLinkRef\.current\?\.focus\(\)[\s\S]*min-h-11/, 'Mobile drawer must retain deterministic opening focus and 44px targets');
assert.match(headerSource, /after-hours-near-black[\s\S]*after-hours-cream[\s\S]*after-hours-copper/, 'Header must use the semantic After-Hours palette');
assert.doesNotMatch(headerSource, /rounded-lg border border-border bg-muted\/30/, 'Mobile concerns must not regress to generic rounded tiles');

const shopDropdownSource = await readFile(path.join(ROOT, 'src/components/navigation/ShopDropdown.tsx'), 'utf8');
assert.match(shopDropdownSource, /SHOP_BY_CONCERN\.map[\s\S]*FEATURED_BRANDS\.map[\s\S]*to="\/collections"/, 'Desktop shop ledger must retain all centralized concerns, brands, and catalogue route');
assert.match(shopDropdownSource, /w-\[34rem\][\s\S]*min-h-11[\s\S]*rounded-none/, 'Desktop shop ledger must retain editorial geometry and 44px targets');
assert.doesNotMatch(shopDropdownSource, /w-56|rounded-md|shadow-lg/, 'Desktop shop menu must not regress to the generic narrow dropdown');

const collectionsSource = await readFile(path.join(ROOT, 'src/pages/Collections.tsx'), 'utf8');
const collectionDetailSource = await readFile(path.join(ROOT, 'src/pages/CollectionDetail.tsx'), 'utf8');
const breadcrumbsSource = await readFile(path.join(ROOT, 'src/components/Breadcrumbs.tsx'), 'utf8');
assert.match(breadcrumbsSource, /<Fragment[\s\S]*<BreadcrumbItem>[\s\S]*<BreadcrumbSeparator/, 'Breadcrumbs must keep valid ordered-list semantics without div wrappers');
assert.doesNotMatch(breadcrumbsSource, /<div key=\{index\}/, 'Breadcrumb lists must not wrap list items in direct div children');
assert.match(indexCss, /--after-hours-paper:\s*270 67% 99%/, 'After-Hours paper must remain the approved #FCFAFE semantic token');
assert.match(collectionsSource, /grid grid-cols-2[\s\S]*filteredAndSortedCollections\.map/, 'Collection index must remain a two-column mobile catalogue');
assert.match(collectionsSource, /collectionImageSizes = "\(max-width: 767px\) 50vw/, 'Collection index must request mobile half-width Shopify image candidates');
assert.match(collectionsSource, /Jena’s routine \/ 10% saving[\s\S]*\/collections\/jenas-daily-trio/, 'Jena daily trio ledger and destination must remain intact');
assert.match(collectionsSource, /collections_cta[\s\S]*BUSINESS_NAP\.phone\.tel[\s\S]*BOOK_URL/, 'Collection advice close must preserve chat attribution, phone, and booking routes');
assert.doesNotMatch(collectionsSource, /product-count|Most Products/, 'Collection index must not rank by incomplete GraphQL product counts');
assert.doesNotMatch(collectionsSource, /bg-gradient-to|radial-gradient|rounded-3xl|rounded-2xl/, 'Collection index must not regress to gradient or rounded template panels');
assert.doesNotMatch(collectionsSource, /text-\[(?:0\.62|0\.66)rem\][^\n]*after-hours-copper/, 'Small collection labels need stronger than decorative copper contrast');
assert.match(collectionDetailSource, /grid grid-cols-2[\s\S]*sortedProducts\.map/, 'Collection detail must remain a two-column mobile product catalogue');
assert.match(collectionDetailSource, /object-contain[\s\S]*Quick View[\s\S]*Add to Bag/, 'Collection product plates must preserve full-image containment and both commerce actions');
assert.match(collectionDetailSource, /aria-label="Filter by price"[\s\S]*aria-label="Sort products"/, 'Collection controls must keep persistent accessible names');
assert.match(collectionDetailSource, /min-h-11[\s\S]*Quick View[\s\S]*min-h-11[\s\S]*Add to Bag/, 'Collection product actions must remain at least 44px tall');
assert.doesNotMatch(collectionDetailSource, /TrustStrip|762\+ five-star|Newest First|sortBy === "newest"/, 'Collection detail must not expose unsourced review proof or a no-op newest sort');

const productDetailSource = await readFile(path.join(ROOT, 'src/pages/ProductDetail.tsx'), 'utf8');
const stickyProductSource = await readFile(path.join(ROOT, 'src/components/conversion/StickyAddToCart.tsx'), 'utf8');
const scrollToTopSource = await readFile(path.join(ROOT, 'src/components/ScrollToTopButton.tsx'), 'utf8');
const productRecommendationsSource = await readFile(path.join(ROOT, 'src/components/product/ProductRecommendations.tsx'), 'utf8');
const socialShareSource = await readFile(path.join(ROOT, 'src/components/blog/SocialShareBar.tsx'), 'utf8');
const relatedContentSource = await readFile(path.join(ROOT, 'src/components/RelatedContent.tsx'), 'utf8');
const aboutSource = await readFile(path.join(ROOT, 'src/pages/About.tsx'), 'utf8');
const imageGallerySource = await readFile(path.join(ROOT, 'src/components/gallery/ImageGallery.tsx'), 'utf8');
const servicesSource = await readFile(path.join(ROOT, 'src/pages/Services.tsx'), 'utf8');
const serviceDirectorySource = await readFile(path.join(ROOT, 'src/components/services/ServiceDirectory.tsx'), 'utf8');
const serviceDetailSource = await readFile(path.join(ROOT, 'src/pages/ServiceDetail.tsx'), 'utf8');
const serviceDetailExperienceSource = await readFile(path.join(ROOT, 'src/components/services/ServiceDetailExperience.tsx'), 'utf8');
const serviceDetailDataSource = await readFile(path.join(ROOT, 'src/data/serviceDetails.ts'), 'utf8');
const bookingSource = await readFile(path.join(ROOT, 'src/pages/Booking.tsx'), 'utf8');
const contactSource = await readFile(path.join(ROOT, 'src/pages/Contact.tsx'), 'utf8');
const contactFormSource = await readFile(path.join(ROOT, 'src/components/forms/ContactForm.tsx'), 'utf8');
const miniCartSource = await readFile(path.join(ROOT, 'src/components/cart/MiniCart.tsx'), 'utf8');
const productSearchSource = await readFile(path.join(ROOT, 'src/components/product/ProductSearch.tsx'), 'utf8');
const searchResultsSource = await readFile(path.join(ROOT, 'src/pages/SearchResults.tsx'), 'utf8');
assert.match(productDetailSource, /data-product-purchase-actions=""/, 'Product detail needs a stable primary-purchase marker');
assert.match(productDetailSource, /data-product-detail-core=""/, 'Product detail needs a stable core marker for floating-control handoff');
assert.match(productDetailSource, /object-contain/, 'Product detail gallery must preserve complete product imagery');
assert.match(productDetailSource, /Standard<\/dt><dd>\$9\.95 · 3–5 business days/, 'Product detail must use the published standard shipping facts');
assert.match(productDetailSource, /Express<\/dt><dd>\$14\.95 · 1–2 business days/, 'Product detail must use the published express shipping facts');
assert.match(productDetailSource, /FREE_SHIPPING_THRESHOLD_DISPLAY/, 'Product detail must use the canonical free-shipping threshold');
assert.match(productDetailSource, /visibleOptionNames[\s\S]*?Default Title/, 'Product detail must hide Shopify default-only option chrome');
assert.doesNotMatch(productDetailSource, /TrustStrip|ShippingCalculator|EstimatedDelivery|UrgencyIndicator|FrequentlyBoughtTogether/, 'Product detail must not expose unsourced proof, simulated delivery, or arbitrary bundles');
assert.match(stickyProductSource, /querySelector\('\[data-product-purchase-actions\]'\)/, 'Sticky product action must yield over the real purchase controls');
assert.match(stickyProductSource, /data-home-footer|querySelector\('footer'\)/, 'Sticky product action must yield over the footer');
assert.match(stickyProductSource, /requestAnimationFrame|cancelAnimationFrame/, 'Sticky product visibility must be frame-throttled and cleaned up');
assert.match(stickyProductSource, /data-product-sticky-purchase=""/, 'Sticky product action needs a stable test marker');
assert.match(scrollToTopSource, /\[data-product-detail-core\]/, 'Scroll-to-top control must yield throughout the core product detail');
assert.doesNotMatch(productRecommendationsSource, /content-visibility-auto/, 'Async product recommendations must remain scrollable in WebKit');
assert.match(productRecommendationsSource, /RecommendationContext = "collection" \| "catalogue" \| "curated"/, 'Recommendation copy must reflect its actual data relationship');
assert.match(productRecommendationsSource, /More from this range[\s\S]*More to browse/, 'Recommendation shelf needs truthful collection and catalogue headings');
assert.match(productRecommendationsSource, /grid-cols-2[\s\S]*object-contain[\s\S]*View product/, 'Recommendation shelf must stay compact, identifiable, and honest on mobile');
assert.match(productRecommendationsSource, /!text-\[hsl\(var\(--after-hours-plum\)\)\][\s\S]*data-recommendation-catalogue=""[\s\S]*Browse catalogue/, 'Recommendation shelf must resist global link colour overrides and balance the mobile final row');
assert.match(productRecommendationsSource, /text-xs text-\[hsl\(var\(--after-hours-plum\)\/0\.72\)\] line-through/, 'Recommendation compare-at prices must retain AA contrast');
assert.doesNotMatch(productRecommendationsSource, /Complete the Set|Add to Bag|hover:shadow|rounded-card/, 'Recommendations must not imply a set, fake add-to-cart, or regress to template cards');
assert.match(socialShareSource, /variant\?: "fixed" \| "inline"[\s\S]*variant = "fixed"/, 'Shared social controls must preserve the BlogPost fixed default and expose the PDP inline variant');
assert.match(productDetailSource, /variant="editorial"[\s\S]*data-product-share-close=""[\s\S]*variant="inline"/, 'PDP must route conditional related content into the inline share close');
assert.ok(productDetailSource.indexOf('<ProductRecommendations') < productDetailSource.indexOf('data-product-share-close=""'), 'Recommendation shelf must precede the terminal share close');
assert.match(stickyProductSource, /\[data-product-share-close\]/, 'Sticky purchase action must yield over the product share close');
assert.match(scrollToTopSource, /\[data-product-share-close\]/, 'Scroll-to-top control must yield over the product share close');
assert.match(scrollToTopSource, /\[data-product-recommendations\]/, 'Scroll-to-top control must not cover recommendation products');
assert.match(relatedContentSource, /variant\?: "default" \| "editorial"[\s\S]*variant = "default"/, 'Related content must preserve existing routes while allowing the PDP editorial variant');
assert.match(aboutSource, /data-about-page=""[\s\S]*data-about-hero=""[\s\S]*data-about-work=""[\s\S]*data-about-close=""/, 'About route needs stable founder, proof, and close markers');
assert.match(aboutSource, /jena-founder-540w\.avif[\s\S]*jena-founder-1080w\.webp[\s\S]*jena-working-480w\.avif[\s\S]*jena-working-1170w\.webp/, 'About route must use approved responsive founder and working imagery');
assert.match(aboutSource, /trackBookingClick\("about_hero"[\s\S]*to="\/collections"[\s\S]*trackBookingClick\("about_close"[\s\S]*BUSINESS_NAP\.phone\.tel/, 'About route must preserve tracked Fresha, commerce, and canonical phone paths');
assert.match(aboutSource, /generateFAQPageSchema\(aboutFaqs\)[\s\S]*schemaJson=\{\[jenaPersonSchema, breadcrumbSchema, faqSchema\]\}/, 'About FAQ content and schema must share one source');
assert.match(aboutSource, /image: `\$\{SITE_URL\}\$\{jenaFounderWebp1080\}`/, 'About Person schema must use the clean founder portrait');
assert.match(aboutSource, /ImageGallery columns=\{3\} images=\{galleryImages\} variant="editorial"/, 'About work proof must use the editorial gallery variant');
assert.doesNotMatch(aboutSource, /Sarah M\.|Emma L\.|Michelle T\.|Foiling Master|Vidal Sassoon Advanced Cutting ABC|Same-day appointments|No filters, no stock photos|jena-headshot\.webp/, 'About route must not restore unsupported testimonials, credentials, availability, media, or campaign-headshot claims');
assert.match(imageGallerySource, /variant\?: "default" \| "editorial"[\s\S]*variant = "default"/, 'Shared gallery must preserve its existing default while exposing the About editorial variant');
assert.match(imageGallerySource, /role="dialog"[\s\S]*aria-modal="true"/, 'Shared gallery lightbox must expose modal dialog semantics');
assert.match(imageGallerySource, /event\.key === "Escape"/, 'Shared gallery lightbox must close on Escape');
assert.match(imageGallerySource, /triggerRefs\.current\[returnIndex\]\?\.focus/, 'Shared gallery lightbox must restore trigger focus');
assert.match(imageGallerySource, /fallbackSrc\?: string[\s\S]*type="image\/avif"[\s\S]*img\.fallbackSrc \|\| img\.src/, 'Shared gallery must support AVIF sources with WebP image fallbacks');
assert.match(aboutSource, /fallbackSrc: salonInteriorWebp[\s\S]*fallbackSrc: bobResultWebp/, 'About work proof must provide WebP fallbacks for every AVIF gallery image');
assert.match(scrollToTopSource, /\[data-about-page\]/, 'Scroll-to-top control must not cover the About founder journey');
const servicesDataBlock = servicesSource.slice(servicesSource.indexOf('const serviceCategories'), servicesSource.indexOf('// Scroll spy'));
assert.equal((servicesDataBlock.match(/\n\s+id: "/g) || []).length, 14, 'Services directory must preserve all 14 Fresha categories');
assert.equal((servicesDataBlock.match(/\n\s+price: /g) || []).length, 59, 'Services directory must preserve all 59 Fresha entries');
const serviceMapBlock = servicesSource.slice(servicesSource.indexOf('const serviceSlugMap'), servicesSource.indexOf('const Services'));
assert.equal((serviceMapBlock.match(/: "/g) || []).length, 15, 'Services directory must preserve all 15 detail-page mappings');
assert.match(servicesSource, /generateOrganizationSchema[\s\S]*generateEnhancedLocalBusinessSchema[\s\S]*generateFAQPageSchema[\s\S]*generateBreadcrumbSchema[\s\S]*generateServiceItemListSchema/, 'Services route must preserve its five schema sources');
assert.doesNotMatch(servicesSource, /GoogleReviewBadge|TrustStrip|ReviewStrip|StickyBooking/, 'Services directory must not restore stacked proof strips or overlapping booking controls');
assert.match(serviceDirectorySource, /data-services-page=""[\s\S]*data-services-hero=""[\s\S]*data-services-nav=""[\s\S]*data-services-directory=""[\s\S]*data-services-close=""/, 'Services directory needs stable journey markers');
assert.match(serviceDirectorySource, /categories\.map\([\s\S]*category\.services\.map\([\s\S]*aria-label=\{`Book now, \$\{service\.title\} on Fresha`\}/, 'Every category and service must retain a tracked Fresha action with visible text in its accessible name');
assert.doesNotMatch(serviceDirectorySource, /after-hours-plum\)\/0\.(?:46|58|6)\)|opacity-60/, 'Small service-directory labels must retain AA contrast');
assert.match(serviceDirectorySource, /serviceSlugMap\[service\.title\][\s\S]*to=\{`\/services\/\$\{category\.id\}\/\$\{serviceSlug\}`\}/, 'Mapped services must preserve their detail routes');
assert.match(serviceDirectorySource, /<details[\s\S]*Service details[\s\S]*service\.description/, 'Optional service copy must remain available through native disclosure');
assert.match(serviceDirectorySource, /BUSINESS_NAP\.phone\.tel[\s\S]*BUSINESS_NAP\.address\.full[\s\S]*to="\/areas"/, 'Services close must use canonical phone, address, and area routes');
assert.doesNotMatch(serviceDirectorySource, /`tel:\$\{BUSINESS_NAP\.phone\.tel\}`/, 'Services close must not duplicate the tel protocol');
assert.match(serviceDirectorySource, /min-h-11[\s\S]*Book now[\s\S]*min-h-11[\s\S]*Service guide/, 'Service actions must retain 44px targets');
assert.match(scrollToTopSource, /\[data-about-page\], \[data-services-page\], \[data-service-detail\]/, 'Scroll-to-top control must not cover editorial About, Services, or service-detail journeys');
assert.equal((serviceDetailDataSource.match(/metaDescription:\s*"/g) || []).length, 15, 'Service-detail data must preserve all 15 dedicated service routes');
assert.equal((serviceDetailDataSource.match(/\n\s+services: \[/g) || []).length, 5, 'Service-detail data must preserve all five routed categories');
assert.match(serviceDetailSource, /generateEnhancedServiceSchema[\s\S]*generateBreadcrumbSchema[\s\S]*generateFAQPageSchema[\s\S]*generateHowToSchema[\s\S]*generateWebPageSchema/, 'Service-detail controller must preserve all five schema sources');
assert.match(serviceDetailSource, /<Navigate to="\/services" replace \/>[\s\S]*ServiceDetailExperience/, 'Unknown service routes must preserve their redirect and valid routes must use the shared renderer');
assert.doesNotMatch(serviceDetailSource, /GoogleReviewBadge|TrustStrip|ReviewStrip|StickyBooking|same-day appointments|Starting from/, 'Service-detail controller must not restore stacked proof, floating booking, unsupported availability, or inexact price labels');
assert.match(serviceDetailExperienceSource, /data-service-detail=""[\s\S]*data-service-detail-hero=""[\s\S]*data-service-detail-overview=""[\s\S]*data-service-detail-process=""[\s\S]*data-service-detail-close=""/, 'Service-detail renderer needs stable hero, appointment, process, and close markers');
assert.match(serviceDetailExperienceSource, /trackBookingClick\(`service_detail_hero_[\s\S]*trackBookingClick\(`service_detail_close_/, 'Service-detail renderer must preserve tracked Fresha actions at the hero and close');
assert.match(serviceDetailExperienceSource, /data-service-detail-homecare[\s\S]*homeCareBundles\.products\.map[\s\S]*data-service-detail-faq[\s\S]*<details/, 'Service-detail renderer must preserve home-care links and native FAQ disclosure');
assert.match(serviceDetailExperienceSource, /data-service-detail-related[\s\S]*relatedServices\.map[\s\S]*<RelatedContent/, 'Service-detail renderer must preserve related services and editorial guidance');
assert.match(serviceDetailExperienceSource, /BUSINESS_NAP\.phone\.tel[\s\S]*BUSINESS_NAP\.address\.full[\s\S]*Back to the service menu/, 'Service-detail close must preserve canonical phone, address, and directory return');
assert.doesNotMatch(serviceDetailExperienceSource, /same-day appointments|Starting from|rounded-card|hover:scale|shadow-lg/, 'Service-detail renderer must not restore unsupported availability, inexact pricing, or generic conversion-card styling');
assert.match(breadcrumbsSource, /variant\?: "default" \| "dark"[\s\S]*isDark[\s\S]*after-hours-cream/, 'Shared breadcrumbs must preserve the default and expose an explicit dark-hero variant');

// After-Hours booking handoff invariants.
for (const marker of ['data-booking-page', 'data-booking-hero', 'data-booking-steps', 'data-booking-notes', 'data-booking-faq', 'data-booking-close']) {
  assert.match(bookingSource, new RegExp(marker), `Booking page must preserve ${marker}`);
}
assert.equal((bookingSource.match(/href=\{BOOK_URL\}/g) || []).length, 2, 'Booking page must keep one Fresha action at the hero and one at the close');
assert.match(bookingSource, /trackBookingClick\("booking_hero", "\/booking"\)/, 'Booking hero must preserve tracking');
assert.match(bookingSource, /trackBookingClick\("booking_close", "\/booking"\)/, 'Booking close must preserve tracking');
assert.match(bookingSource, /BUSINESS_NAP\.phone\.tel/, 'Booking help must use the canonical phone target');
assert.match(bookingSource, /generateFAQPageSchema\(bookingFaqs\)/, 'Booking FAQ schema must use the visible FAQ source');
assert.match(bookingSource, /generateBreadcrumbSchema/, 'Booking breadcrumb schema must remain present');
assert.equal((bookingSource.match(/question: "/g) || []).length, 5, 'Booking page must preserve five visible schema-matched FAQs');
assert.match(bookingSource, /<details key=\{faq\.question\}/, 'Booking FAQs must use native disclosures');
assert.match(bookingSource, /<Breadcrumbs[\s\S]*variant="dark"/, 'Booking hero must use the explicit dark breadcrumb variant');
assert.match(scrollToTopSource, /\[data-booking-page\]/, 'Booking journey must suppress the floating scroll-to-top control');
for (const unsupportedClaim of ['762+ five-star reviews', 'Same-day available', 'Klarna', 'Afterpay', '50% fee', 'free up to 24 hours', 'chat with Isabella', 'Takes about 2 minutes']) {
  assert.ok(!bookingSource.includes(unsupportedClaim), `Booking page must not restore unsupported claim: ${unsupportedClaim}`);
}

// After-Hours contact and visit invariants.
for (const marker of ['data-contact-page', 'data-contact-hero', 'data-contact-visit', 'data-contact-message', 'data-contact-faq', 'data-contact-close']) {
  assert.match(contactSource, new RegExp(marker), `Contact page must preserve ${marker}`);
}
assert.match(contactSource, /BUSINESS_NAP\.address\.fullForMaps[\s\S]*BUSINESS_HOURS_DISPLAY[\s\S]*BUSINESS_NAP\.phone\.raw/, 'Contact page must derive map, display hours, and schema phone from canonical config');
assert.match(contactSource, /openingHoursSpecification: BUSINESS_HOURS\.map/, 'Contact HairSalon schema must derive opening hours from canonical config');
assert.match(contactSource, /<iframe[\s\S]*loading="lazy"[\s\S]*title="Hair Pinns at 60 Goorgool Rd, Bangor"/, 'Contact map must remain lazy and named');
assert.match(contactSource, /<ContactForm formName="contact_page"[\s\S]*variant="editorial"/, 'Contact page must preserve the live contact form with the route-specific editorial shell');
assert.equal((contactSource.match(/question: "/g) || []).length, 4, 'Contact page must expose four schema-matched FAQs');
assert.match(contactSource, /generateFAQPageSchema\(contactFaqs\)/, 'Contact FAQ schema must use the visible FAQ source');
assert.match(contactSource, /trackBookingClick\("contact_close", "\/contact"\)/, 'Contact booking close must preserve attribution');
assert.match(scrollToTopSource, /\[data-contact-page\]/, 'Contact journey must suppress the floating scroll-to-top control');
assert.doesNotMatch(contactSource, /new Date\(|businessInfo|Open now|Currently closed|rear entrance|Wheelchair accessible|available 24\/7|within 24 hours/, 'Contact page must not restore browser-time status, duplicate business data, or unsupported access and response claims');
for (const formContract of ['postToZapier', 'contact_form_submit', "window.gtag('event', 'generate_lead'", 'pixelTracking.trackFormSubmission', 'contactSchema.safeParse', 'Send Another Message']) {
  assert.ok(contactFormSource.includes(formContract), `Contact form must preserve operational contract: ${formContract}`);
}
assert.match(contactFormSource, /variant\?: "default" \| "editorial"[\s\S]*variant === "editorial"/, 'Contact form must preserve default styling and expose the editorial shell');
assert.doesNotMatch(contactFormSource, /within 24 hours|within 2 hours|Need immediate help|For urgent matters/, 'Contact form states must not promise unsupported response timing or urgency');

// After-Hours cart and checkout handoff invariants.
for (const marker of ['data-mini-cart', 'data-cart-loading', 'data-cart-error', 'data-cart-lines', 'data-cart-shipping', 'data-cart-empty', 'data-cart-checkout']) {
  assert.match(miniCartSource, new RegExp(marker), `Mini cart must preserve ${marker}`);
}
for (const cartContract of ['getCart(cartId)', 'clearCartId()', 'hp:cartCountUpdate', 'removeLineIds: [lineId]', 'trackBeginCheckout', '/.netlify/functions/checkout?redirect=true', 'cartIdInput.name = "cartId"', 'linesInput.name = "lines"', 'form.submit()']) {
  assert.ok(miniCartSource.includes(cartContract), `Mini cart must preserve operational contract: ${cartContract}`);
}
assert.match(miniCartSource, /FREE_STANDARD_SHIPPING = 150[\s\S]*Standard shipping is \$9\.95[\s\S]*Free standard shipping applies from \$150/, 'Cart shipping handoff must preserve the published $9.95 and $150 facts');
assert.match(miniCartSource, /to="\/policies\/shipping"[\s\S]*to="\/policies\/returns"/, 'Cart must preserve shipping and returns policy routes');
assert.match(miniCartSource, /14-day returns on unopened products/, 'Cart returns language must preserve the published unopened-product condition');
assert.match(miniCartSource, /h-11 w-11[\s\S]*Remove \$\{merchandise/, 'Cart line removal must retain a 44px named target');
assert.match(miniCartSource, /disabled=\{isCheckingOut \|\| !hasItems\}/, 'Checkout must remain unavailable for empty or expired carts');
assert.match(miniCartSource, /merchandise\.title !== "Default Title"/, 'Cart must not display Shopify Default Title');
assert.doesNotMatch(miniCartSource, /searchProducts|upsellProducts|EstimatedDelivery|FreeShippingBar|You might also like|Estimated delivery|businessDays|hover:scale|rounded-card|shadow-lg/, 'Cart must not restore arbitrary upsells, simulated delivery, or generic conversion-card styling');

// After-Hours search and discovery invariants.
for (const marker of ['data-predictive-search', 'data-search-suggestions', 'data-search-loading', 'data-search-error', 'data-search-products', 'data-search-articles', 'data-search-empty']) {
  assert.match(productSearchSource, new RegExp(marker), `Predictive search must preserve ${marker}`);
}
for (const predictiveContract of ['searchProducts(trimmedQuery, maxResults)', 'searchBlogPosts(trimmedQuery', 'window.setTimeout', 'window.clearTimeout(timeout)', 'requestSequence.current', 'navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)', 'role="searchbox"', 'event.preventDefault()', 'aria-controls', 'aria-live="polite"']) {
  assert.ok(productSearchSource.includes(predictiveContract), `Predictive search must preserve contract: ${predictiveContract}`);
}
assert.match(productSearchSource, /trimmedQuery\.length < 2/, 'Predictive search must wait for two meaningful characters');
assert.match(productSearchSource, /document\.addEventListener\("pointerdown"[\s\S]*document\.removeEventListener\("pointerdown"/, 'Predictive search must close outside and clean up its listener');
assert.doesNotMatch(productSearchSource, /Card|CardContent|rounded-lg|rounded-md|hover:-translate|hover:shadow|object-cover/, 'Predictive search must retain flat editorial styling and contained product imagery');

for (const marker of ['data-search-page', 'data-search-hero', 'data-search-desk', 'data-search-page-loading', 'data-search-start', 'data-search-page-error', 'data-search-page-empty', 'data-search-page-results', 'data-search-product-results', 'data-search-article-results']) {
  assert.match(searchResultsSource, new RegExp(marker), `Search results must preserve ${marker}`);
}
for (const searchContract of ['useSearchParams', 'searchProducts(query, 50)', 'searchBlogPosts(query, 12)', 'window.gtag("event", "search"', 'generateSearchResultsItemListSchema', 'generateBreadcrumbSchema', 'noIndex={true}', 'navigate(`/search?q=${encodeURIComponent(nextQuery)}`)']) {
  assert.ok(searchResultsSource.includes(searchContract), `Search results must preserve contract: ${searchContract}`);
}
assert.match(searchResultsSource, /useMemo\(\(\) => \{[\s\S]*sortBy === "price-low"[\s\S]*\}, \[rawProducts, sortBy\]\)/, 'Search sorting must be local and must not refetch Shopify');
assert.match(searchResultsSource, /productError && articles\.length === 0[\s\S]*data-search-partial-error/, 'Search must distinguish total and partial Shopify failures');
assert.doesNotMatch(searchResultsSource, /generateFAQPageSchema|FAQPage|Where can I buy|Does Hair Pinns ship|rounded-lg|hover:-translate|hover:shadow-lg|object-cover group-hover/, 'Search must not restore fabricated dynamic FAQ schema or generic hover-card styling');

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
