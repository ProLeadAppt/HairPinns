// Sitemap generation utilities

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateXMLSitemap = (urls: SitemapUrl[]): string => {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const footer = '</urlset>';
  
  const urlEntries = urls.map(url => {
    let entry = `\n  <url>\n    <loc>${url.loc}</loc>`;
    if (url.lastmod) entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    if (url.changefreq) entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    if (url.priority !== undefined) entry += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    entry += '\n  </url>';
    return entry;
  }).join('');
  
  return `${header}${urlEntries}\n${footer}`;
};

export const getSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://hairpinns.com';
  const today = new Date().toISOString().split('T')[0];
  
  return [
    // Core pages
    { loc: baseUrl, changefreq: 'weekly', priority: 1.0, lastmod: today },
    { loc: `${baseUrl}/services`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.8, lastmod: today },
    { loc: `${baseUrl}/booking`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.8, lastmod: today },
    { loc: `${baseUrl}/collections`, changefreq: 'weekly', priority: 0.9, lastmod: today },
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.8, lastmod: today },
    
    // Collection pages
    { loc: `${baseUrl}/collections/christmas-gift-packs`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/collections/hair-care`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/collections/treatments`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/collections/styling`, changefreq: 'weekly', priority: 0.8 },
    
    // Suburb pages (example - generate dynamically in production)
    { loc: `${baseUrl}/near/menai`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/engadine`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/bangor`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/woronora`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/illawong`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/barden-ridge`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/lucas-heights`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/alfords-point`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/sandy-point`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${baseUrl}/near/padstow`, changefreq: 'monthly', priority: 0.7 },
    
    // Policy pages
    { loc: `${baseUrl}/policies/shipping`, changefreq: 'monthly', priority: 0.4 },
    { loc: `${baseUrl}/policies/returns`, changefreq: 'monthly', priority: 0.4 },
    { loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: 0.3 },
  ];
};

export const getOGImage = (type: 'default' | 'product' | 'collection' | 'blog' | 'suburb' | 'service'): string => {
  const baseUrl = 'https://hairpinns.com';
  
  // Map different page types to OG images
  const ogImages = {
    default: `${baseUrl}/og-default.jpg`,
    product: `${baseUrl}/og-product.jpg`,
    collection: `${baseUrl}/og-collection.jpg`,
    blog: `${baseUrl}/og-blog.jpg`,
    suburb: `${baseUrl}/og-suburb.jpg`,
    service: `${baseUrl}/og-service.jpg`,
  };
  
  return ogImages[type];
};
