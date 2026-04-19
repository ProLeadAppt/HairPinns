/**
 * Topic map — single source of truth for cross-content-type linking.
 *
 * Every topic has:
 *   - A canonical hub page (a service or collection)
 *   - Blog posts that cover it (spoke content)
 *   - Product collections that satisfy it
 *   - Suburbs where it's relevant (usually all, but some are seasonal/climate)
 *
 * Used by RelatedContent components across service, suburb, product, and blog
 * pages so every page links into its topic cluster.
 */

export type TopicSlug =
  | 'smoothing'
  | 'colour'
  | 'foils'
  | 'cuts'
  | 'kids-formal'
  | 'heat-protection'
  | 'frizz-control'
  | 'bond-repair'
  | 'scalp-health'
  | 'organic-care'
  | 'curly-hair'
  | 'blonde-care'
  | 'hydration'
  | 'styling-tools';

export interface Topic {
  slug: TopicSlug;
  name: string;
  /** Hub page — service slug (cat/svc) OR a collection slug. */
  hub:
    | { kind: 'service'; path: string; label: string }
    | { kind: 'collection'; slug: string; label: string };
  /** Blog post slugs that cover this topic. */
  blogSlugs: string[];
  /** Shopify collection slugs that satisfy it. */
  collectionSlugs: string[];
  /** Service slugs (cat/svc) directly related. */
  serviceSlugs: string[];
  /** Keywords used to match SEO intent (for future use). */
  keywords: string[];
}

export const topics: Topic[] = [
  {
    slug: 'smoothing',
    name: 'Smoothing Treatments',
    hub: { kind: 'service', path: 'smoothing/mid-length-straight-up-smoothing', label: 'Straight Up Smoothing' },
    blogSlugs: [
      'how-long-does-keratin-smoothing-last',
      'keratin-vs-brazilian-blowout-vs-straight-up',
      'keratin-smoothing-sydney-prices-brands',
      'whats-a-straight-up-smoothing-treatment',
      'truth-about-shampoo-after-straight-up-treatment',
      'qiqi-vega-vs-nanoplasty-whats-the-difference',
      'sulfate-free-shampoo-australia',
      'say-goodbye-to-frizzy-hair-march-2025',
      'the-secret-behind-that-steamy-towel-moment',
      'qiqi-bare-repair-oil-shine-strength-smoothness',
      'sutherland-shire-hair-salon-guide',
      'meet-jena-15-years-sutherland-shire',
      'best-hair-salon-bangor',
    ],
    collectionSlugs: ['qiqi'],
    serviceSlugs: [
      'smoothing/mid-length-straight-up-smoothing',
      'smoothing/long-thick-straight-up-smoothing',
      'smoothing/straight-up-smoothing-teens',
    ],
    keywords: ['smoothing', 'keratin', 'frizz', 'qiqi', 'straight up', 'nanoplasty'],
  },
  {
    slug: 'colour',
    name: 'Hair Colouring',
    hub: { kind: 'service', path: 'colouring-packages/long-hair-colour-package', label: 'Colour Packages' },
    blogSlugs: [
      'how-much-full-head-foils-cost-sydney',
      'can-you-use-purple-shampoo-every-day',
      'best-shampoo-colour-treated-hair-australia',
      'balayage-sutherland-shire',
      'what-is-lamellar-vitality-technology',
      'smooth-seal-strengthen-pure-precious-ends',
      'sutherland-shire-hair-salon-guide',
      'meet-jena-15-years-sutherland-shire',
      'the-7-colouring-mistakes-i-see-every-week',
      'how-to-recover-hair-from-box-dye-damage',
      'best-hair-salon-bangor',
    ],
    collectionSlugs: ['aromaganic', 'blonde-bombshells'],
    serviceSlugs: [
      'colouring-packages/long-hair-colour-package',
      'colouring-packages/mid-length-colour-package',
      'colouring-packages/short-hair-colour-package',
    ],
    keywords: ['colour', 'color', 'dye', 'balayage', 'aromaganic'],
  },
  {
    slug: 'foils',
    name: 'Foil Highlights',
    hub: { kind: 'service', path: 'foil-packages/full-head-foils-package', label: 'Foil Packages' },
    blogSlugs: ['how-much-full-head-foils-cost-sydney', 'balayage-sutherland-shire', 'the-7-colouring-mistakes-i-see-every-week'],
    collectionSlugs: ['blonde-bombshells'],
    serviceSlugs: [
      'foil-packages/full-head-foils-package',
      'foil-packages/half-head-foils-cut-blowdry',
      'foil-packages/quarter-head-foils-cut-blowdry',
    ],
    keywords: ['foils', 'highlights', 'blonde', 'balayage', 'babylights'],
  },
  {
    slug: 'cuts',
    name: 'Cuts & Styling',
    hub: { kind: 'service', path: 'cut-packages/mid-length-wash-cut-blowdry', label: 'Cut Packages' },
    blogSlugs: [
      'when-should-you-get-a-haircut',
      'best-hair-salon-near-menai',
      'sutherland-shire-hair-salon-guide',
      'whats-the-best-hairspray-to-use',
      'why-wet-brush-is-a-must-have',
      'your-hair-deserves-the-best-wet-brush',
      'meet-jena-15-years-sutherland-shire',
      'best-hair-salon-bangor',
      'best-hair-salon-near-illawong',
      'best-hair-salon-near-sutherland',
      'best-hair-salon-near-cronulla',
      'best-hair-salon-near-como',
      'best-hair-salon-near-miranda',
      'best-hair-salon-near-engadine',
    ],
    collectionSlugs: ['styling', 'wet-brush-detanglers'],
    serviceSlugs: [
      'cut-packages/long-hair-wash-cut-blowdry',
      'cut-packages/mid-length-wash-cut-blowdry',
      'cut-packages/short-wash-cut-blowdry',
      'cut-packages/kids-cut-blowdry-bundle',
    ],
    keywords: ['cut', 'blowdry', 'styling', 'haircut', 'trim'],
  },
  {
    slug: 'kids-formal',
    name: 'Kids & Formal Styling',
    hub: { kind: 'service', path: 'kids-formal/primary-formal-hairstyle', label: 'Kids & Formal' },
    blogSlugs: ['hair-extensions-bangor'],
    collectionSlugs: ['hair-pinns-accessories', 'the-perfect-pony-hair'],
    serviceSlugs: [
      'kids-formal/primary-formal-hairstyle',
      'kids-formal/high-school-formal-hairstyle',
      'cut-packages/kids-cut-blowdry-bundle',
    ],
    keywords: ['formal', 'kids', 'updo', 'prom', 'school formal'],
  },
  {
    slug: 'heat-protection',
    name: 'Heat Protection',
    hub: { kind: 'collection', slug: 'heat-protection', label: 'Heat Protection Products' },
    blogSlugs: [
      'why-heat-protection-is-essential',
      'prevent-heat-damage-on-your-hair',
      'the-secret-behind-that-steamy-towel-moment',
    ],
    collectionSlugs: ['heat-protection', 'juuce-botanicals'],
    serviceSlugs: [],
    keywords: ['heat protection', 'heat damage', 'styling', 'thermal'],
  },
  {
    slug: 'frizz-control',
    name: 'Frizz Control',
    hub: { kind: 'collection', slug: 'frizz-free-must-haves', label: 'Frizz-Free Must Haves' },
    blogSlugs: [
      'how-long-does-keratin-smoothing-last',
      'keratin-vs-brazilian-blowout-vs-straight-up',
      'keratin-smoothing-sydney-prices-brands',
      'say-goodbye-to-frizzy-hair-march-2025',
      'whats-a-straight-up-smoothing-treatment',
      'winter-weather-hair-care-sydney',
    ],
    collectionSlugs: ['frizz-free-must-haves', 'qiqi'],
    serviceSlugs: [
      'smoothing/mid-length-straight-up-smoothing',
      'smoothing/long-thick-straight-up-smoothing',
    ],
    keywords: ['frizz', 'humidity', 'smooth', 'anti-frizz', 'sydney humidity'],
  },
  {
    slug: 'bond-repair',
    name: 'Bond Repair & Damaged Hair',
    hub: { kind: 'collection', slug: 'juuce-botanicals', label: 'Juuce Bond Repair' },
    blogSlugs: [
      'juuce-vs-pure-organic-shampoo',
      'best-shampoo-colour-treated-hair-australia',
      'best-hair-products-australia-2025',
      'how-often-should-you-replace-your-shampoo',
      'qiqi-bare-repair-oil-shine-strength-smoothness',
      'home-hair-care-myths-stylist-wishes-youd-stop',
      'how-to-recover-hair-from-box-dye-damage',
    ],
    collectionSlugs: ['juuce-botanicals'],
    serviceSlugs: [],
    keywords: ['bond repair', 'damage', 'broken', 'repair', 'treatment'],
  },
  {
    slug: 'scalp-health',
    name: 'Scalp Health',
    hub: { kind: 'collection', slug: 'pure-certified-organic-hair-care', label: 'Pure Scalp Care' },
    blogSlugs: [
      'how-often-should-you-wash-your-hair',
      'juuce-vs-pure-organic-shampoo',
      'sulfate-free-shampoo-australia',
      'pure-walnut-scrub-scalp-detox',
      'infrared-sauna-for-hair-scalp-health',
      '5-ways-infrared-sauna-boosts-hair-skin-glow',
      'what-is-an-infrared-sauna',
      'home-hair-care-myths-stylist-wishes-youd-stop',
    ],
    collectionSlugs: ['pure-certified-organic-hair-care'],
    serviceSlugs: [],
    keywords: ['scalp', 'detox', 'itchy scalp', 'dandruff', 'exfoliate'],
  },
  {
    slug: 'organic-care',
    name: 'Organic & Natural Care',
    hub: { kind: 'collection', slug: 'pure-certified-organic-hair-care', label: 'Pure Organic Range' },
    blogSlugs: [
      'how-often-should-you-wash-your-hair',
      'juuce-vs-pure-organic-shampoo',
      'sulfate-free-shampoo-australia',
      'pure-walnut-scrub-scalp-detox',
      'smooth-seal-strengthen-pure-precious-ends',
      'home-hair-care-myths-stylist-wishes-youd-stop',
    ],
    collectionSlugs: ['pure-certified-organic-hair-care', 'aromaganic'],
    serviceSlugs: [],
    keywords: ['organic', 'natural', 'pure', 'sulfate-free', 'eco'],
  },
  {
    slug: 'curly-hair',
    name: 'Curly Hair',
    hub: { kind: 'collection', slug: 'curly-girlys', label: 'Curly Girlys' },
    blogSlugs: [
      'sulfate-free-shampoo-australia',
      'wet-brush-vs-tangle-teezer',
    ],
    collectionSlugs: ['curly-girlys', 'frizz-free-must-haves'],
    serviceSlugs: ['cut-packages/mid-length-wash-cut-blowdry'],
    keywords: ['curly', 'curl', 'wavy', 'cgm', 'curl cream'],
  },
  {
    slug: 'blonde-care',
    name: 'Blonde Hair Care',
    hub: { kind: 'collection', slug: 'blonde-bombshells', label: 'Blonde Bombshells' },
    blogSlugs: [
      'can-you-use-purple-shampoo-every-day',
      'how-much-full-head-foils-cost-sydney',
      'best-shampoo-colour-treated-hair-australia',
      'balayage-sutherland-shire',
      'what-is-lamellar-vitality-technology',
      'smooth-seal-strengthen-pure-precious-ends',
      'the-7-colouring-mistakes-i-see-every-week',
      'how-to-recover-hair-from-box-dye-damage',
    ],
    collectionSlugs: ['blonde-bombshells'],
    serviceSlugs: ['foil-packages/full-head-foils-package'],
    keywords: ['blonde', 'purple shampoo', 'toner', 'silver', 'brassy'],
  },
  {
    slug: 'hydration',
    name: 'Hydration & Moisture',
    hub: { kind: 'collection', slug: 'juuce-botanicals', label: 'Hydration Products' },
    blogSlugs: [
      'quench-your-hairs-thirst-hydration-bundle',
      'what-is-lamellar-vitality-technology',
    ],
    collectionSlugs: ['juuce-botanicals', 'pure-certified-organic-hair-care'],
    serviceSlugs: [],
    keywords: ['hydration', 'moisture', 'dry hair', 'mask', 'conditioner'],
  },
  {
    slug: 'styling-tools',
    name: 'Styling Tools',
    hub: { kind: 'collection', slug: 'wet-brush-detanglers', label: 'Wet Brush Range' },
    blogSlugs: [
      'wet-brush-vs-tangle-teezer',
      'hair-extensions-bangor',
      'why-wet-brush-is-a-must-have',
      'your-hair-deserves-the-best-wet-brush',
    ],
    collectionSlugs: ['wet-brush-detanglers', 'hair-pinns-accessories'],
    serviceSlugs: [],
    keywords: ['brush', 'detangle', 'wet brush', 'tool', 'accessory'],
  },
];

/** Lookup a topic by slug. */
export const getTopic = (slug: TopicSlug): Topic | undefined =>
  topics.find((t) => t.slug === slug);

/** Find topics that match a service path (`cat/svc`). */
export const topicsForService = (servicePath: string): Topic[] =>
  topics.filter((t) => t.serviceSlugs.includes(servicePath));

/** Find topics that match a collection slug. */
export const topicsForCollection = (collectionSlug: string): Topic[] =>
  topics.filter((t) => t.collectionSlugs.includes(collectionSlug));

/** Find topics that reference a blog post. */
export const topicsForBlogPost = (blogSlug: string): Topic[] =>
  topics.filter((t) => t.blogSlugs.includes(blogSlug));

/** Pick related blog slugs for a given topic (capped). */
export const relatedBlogsForTopic = (slug: TopicSlug, limit = 3): string[] => {
  const t = getTopic(slug);
  return t ? t.blogSlugs.slice(0, limit) : [];
};

/** Pick related service paths for a given topic (capped). */
export const relatedServicesForTopic = (slug: TopicSlug, limit = 3): string[] => {
  const t = getTopic(slug);
  return t ? t.serviceSlugs.slice(0, limit) : [];
};

/** Pick related collection slugs for a given topic (capped). */
export const relatedCollectionsForTopic = (slug: TopicSlug, limit = 3): string[] => {
  const t = getTopic(slug);
  return t ? t.collectionSlugs.slice(0, limit) : [];
};
