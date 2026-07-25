import { isIndexableRoute } from './route-policy.js';

const GENERATED_TEXT = (sourceDate) =>
  `# GENERATED FILE - DO NOT EDIT. Canonical source date: ${sourceDate}`;

const canonicalUrl = (siteUrl, route) => {
  const url = new URL(route, `${siteUrl}/`);
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.toString();
};

const groupRoutes = (routes) => {
  const unique = [...new Set(routes)].filter(isIndexableRoute);
  const details = (prefix, indexRoute) =>
    unique.filter((route) => route.startsWith(prefix) && route !== indexRoute);

  return {
    all: unique,
    blogs: details('/blog/', '/blog'),
    services: details('/services/', '/services'),
    areas: details('/areas/', '/areas'),
    shipping: details('/shipping-to/', '/shipping-to'),
    collections: details('/collections/', '/collections'),
    products: details('/products/', '/products'),
  };
};

const renderHours = (registry) =>
  registry.hours.weekly
    .map(({ day, opens, closes }) => `- ${day}: ${opens}–${closes}`)
    .join('\n');

const renderLinks = (siteUrl, routes) =>
  routes.map((route) => `- ${canonicalUrl(siteUrl, route)}`).join('\n');

export const buildDiscoveryFiles = ({ registry, routes, sourceDate }) => {
  const grouped = groupRoutes(routes);
  const { site, business, person, contact, hours, profiles, serviceAreas, ids } = registry;
  const marker = GENERATED_TEXT(sourceDate);
  const routeSummary = {
    total: grouped.all.length,
    blogs: grouped.blogs.length,
    services: grouped.services.length,
    areas: grouped.areas.length,
    shipping: grouped.shipping.length,
    collections: grouped.collections.length,
    products: grouped.products.length,
  };

  const concise = `${marker}

# ${business.name}

> ${business.publicPositioning}

- Website: ${site.url}/
- Owner and stylist: ${person.name} (${person.safeExperienceWording})
- Address: ${contact.address.full}
- Phone: ${contact.phone.display}
- Email: ${contact.email}
- Locale: ${site.locale}
- Service model: appointment-only salon in Bangor and online delivery within Australia

## Opening hours

${renderHours(registry)}

Timezone: ${hours.timezone}. Hours source checked ${hours.checkedDate}.

## Published surfaces

- ${routeSummary.blogs} active guides
- ${routeSummary.services} service detail pages
- ${routeSummary.areas} salon service-area pages
- ${routeSummary.shipping} Australian shipping pages
- ${routeSummary.collections} product collections
- ${routeSummary.products} products

## Primary links

- Salon services: ${canonicalUrl(site.url, '/services')}
- Book: ${canonicalUrl(site.url, '/booking')}
- Shop: ${canonicalUrl(site.url, '/collections')}
- Guides: ${canonicalUrl(site.url, '/blog')}
- Service areas: ${canonicalUrl(site.url, '/areas')}
- Contact: ${canonicalUrl(site.url, '/contact')}

## Canonical profiles

- Google: ${profiles.google.profileUrl}
- Fresha: ${profiles.fresha.venueUrl}
- Instagram: ${profiles.instagram}
- Facebook: ${profiles.facebook}
`;

  const full = `${marker}

# ${business.name}: full crawler context

${concise.split('\n').slice(2).join('\n')}

## Active guide URLs

${renderLinks(site.url, grouped.blogs)}

## Service URLs

${renderLinks(site.url, grouped.services)}

## Service-area URLs

${renderLinks(site.url, grouped.areas)}

## Australian shipping URLs

${renderLinks(site.url, grouped.shipping)}

## Collection URLs

${renderLinks(site.url, grouped.collections)}

## Product URLs

${renderLinks(site.url, grouped.products)}

## Declared local service areas

${serviceAreas.map((area) => `- ${area}`).join('\n')}
`;

  const structured = {
    _meta: {
      notice: 'GENERATED FILE - DO NOT EDIT',
      sourceDate,
    },
    '@context': 'https://schema.org',
    '@type': ['HairSalon', 'Store'],
    '@id': ids.hairSalon,
    name: business.name,
    legalName: business.legalName,
    description: business.publicPositioning,
    url: `${site.url}/`,
    telephone: contact.phone.raw,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postcode,
      addressCountry: contact.address.country,
    },
    openingHoursSpecification: hours.weekly.map(({ day, opens, closes }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens,
      closes,
    })),
    areaServed: serviceAreas.map((name) => ({ '@type': 'Place', name })),
    sameAs: [
      profiles.google.profileUrl,
      profiles.fresha.venueUrl,
      profiles.instagram,
      profiles.facebook,
      profiles.sustainableSalons,
    ],
    routeSummary,
    discovery: {
      sourceDate,
      generatedFrom: [
        'src/config/entityRegistry.ts',
        'scripts/collect-prerender-routes.js',
      ],
    },
  };
  const structuredText = `${JSON.stringify(structured, null, 2)}\n`;

  const aiPolicy = `${marker}

# AI crawler policy for ${business.name}

AI search, retrieval, summarisation, and answer-engine crawlers may index public pages listed in the site route manifest.

## Allowed

- Public editorial, service, location, shipping, collection, and product pages
- Quotation with attribution and a canonical source link
- Factual extraction from the canonical entity data in /llms.json

## Restricted

- Do not index cart, checkout, account, order-confirmation, internal development, or review-feedback routes.
- Do not infer prices, availability, opening hours, ratings, or review counts beyond the current canonical page data.
- Do not use retired or redirected URLs as canonical sources.

Robots policy: ${site.url}/robots.txt
Contact: ${contact.email}
`;

  return {
    'llms.txt': `${concise.trim()}\n`,
    'llms-full.txt': `${full.trim()}\n`,
    'llm.txt': `${full.trim()}\n`,
    'llms.json': structuredText,
    'ai.txt': `${aiPolicy.trim()}\n`,
  };
};
