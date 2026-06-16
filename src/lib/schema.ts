// Schema.org JSON-LD utilities for SEO
import { googleReviews } from '@/data/reviews';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceData {
  name: string;
  description: string;
  url: string;
}

interface ProductData {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  brand?: string;
  sku?: string;
  availability?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface BlogPostData {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  wordCount?: number;
}

interface QAPageData {
  question: string;
  answer: string;
  author?: string;
  datePublished?: string;
}

interface HowToData {
  name: string;
  description: string;
  step: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
  tool?: Array<{ name: string }>;
  supply?: Array<{ name: string }>;
}

import { BUSINESS_NAP, BUSINESS_HOURS, SITE_URL } from '@/config/businessConfig';

const BASE_URL = SITE_URL;
const LOGO_URL = `${BASE_URL}/logo.png`;
const SALON_ADDRESS = {
  streetAddress: BUSINESS_NAP.address.street,
  addressLocality: BUSINESS_NAP.address.locality,
  addressRegion: BUSINESS_NAP.address.region,
  postalCode: BUSINESS_NAP.address.postcode,
  addressCountry: BUSINESS_NAP.address.country,
};
const SALON_GEO = {
  latitude: '-34.0186',
  longitude: '151.0333',
};
const SALON_PHONE = BUSINESS_NAP.phone.raw;

const AREA_SERVED = [
  'Bangor',
  'Menai',
  'Illawong',
  'Alfords Point',
  'Woronora',
  'Sutherland',
  'Kirrawee',
  'Kareela',
  'Como',
  'Gymea',
  'Miranda',
  'Engadine',
  'Heathcote',
];

/**
 * WebSite schema with SearchAction - enables sitelinks search box in Google
 */
export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Hair Pinns',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hair Pinns',
  url: BASE_URL,
  logo: LOGO_URL,
  // Australia-only commerce. The Organization (Hair Pinns as a shop) ships
  // nationally inside AU and explicitly does not service overseas. These
  // fields plus the Offer-level eligibleRegion give search engines and AI
  // surfaces unambiguous "AU market" signals.
  areaServed: {
    '@type': 'Country',
    name: 'AU',
  },
  currenciesAccepted: 'AUD',
  paymentAccepted: 'Credit Card, Debit Card, Afterpay, Apple Pay, Google Pay, Shop Pay',
  sameAs: [
    'https://www.facebook.com/Hair.Pinns',
    'https://www.instagram.com/hair.pinns/',
    'https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SALON_PHONE,
    contactType: 'Customer Service',
    areaServed: 'AU',
    availableLanguage: 'English',
  },
});

export const generateLocalBusinessSchema = (pageUrl?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  '@id': `${BASE_URL}/#hairsalon`,
  name: 'Hair Pinns',
  image: LOGO_URL,
  description:
    'Boutique hair salon in Bangor specializing in Colour and Blonding, Smoothing Treatments, and Cuts and Styling. Run by Jena since 2009, serving Sutherland Shire. Professional hair care products shipped Australia-wide.',
  address: {
    '@type': 'PostalAddress',
    ...SALON_ADDRESS,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SALON_GEO.latitude,
    longitude: SALON_GEO.longitude,
  },
  url: pageUrl || BASE_URL,
  telephone: SALON_PHONE,
  priceRange: '$$',
  // AggregateRating for Google Reviews
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '762',
    bestRating: '5',
    worstRating: '1',
  },
  // Individual customer reviews — Google-eligible for review rich results.
  // Sourced from src/data/reviews.ts which is refreshed manually from
  // Google Business Profile. Keep the top 5 most recent 5-star reviews.
  review: googleReviews.slice(0, 5).map((r) => ({
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: r.author,
    },
    datePublished: r.date,
    reviewBody: r.text,
    publisher: {
      '@type': 'Organization',
      name: 'Google',
    },
  })),
  foundingDate: '2009',
  foundingLocation: {
    '@type': 'City',
    name: 'Bangor',
    addressRegion: 'NSW',
    addressCountry: 'AU',
  },
  areaServed: AREA_SERVED.map((locality) => ({
    '@type': 'City',
    name: locality,
    addressRegion: 'NSW',
    addressCountry: 'AU',
  })),
  openingHoursSpecification: getOpeningHoursSpecification(),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hair Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Colour & Blonding',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Full Head Foils',
              description: 'Precision foiling for bright, defined highlights from root to ends',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Full Colour',
              description: 'All-over colour transformation with professional-grade products',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Toning & Glossing',
              description: 'Refresh vibrancy and neutralize unwanted tones',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Smoothing & Treatments',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Keratin Smoothing',
              description: 'Reduce frizz and add shine for 3-4 months',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Deep Conditioning',
              description: 'Restore moisture and repair damage',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Cuts & Styling',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Precision Cut',
              description: 'Expert cutting tailored to your face shape and hair texture',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Blow-Dry & Styling',
              description: 'Professional styling for any occasion',
            },
          },
        ],
      },
    ],
  },
});

export const generateServiceSchema = (service: ServiceData) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.name,
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'HairSalon',
    name: 'Hair Pinns',
    '@id': `${BASE_URL}/#hairsalon`,
  },
  areaServed: AREA_SERVED.map((area) => ({
    '@type': 'City',
    name: area,
  })),
  url: service.url,
  // AggregateRating: 4.9/762 from Hair Pinns' Google Business Profile
  // (single salon-wide rating, applies to all services rendered from this provider).
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '762',
    bestRating: '5',
    worstRating: '1',
  },
});

export const generateProductSchema = (product: ProductData) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.sku || ''}`,
      priceCurrency: product.currency || 'AUD',
      price: product.price,
      availability: product.availability
        ? `https://schema.org/${product.availability}`
        : 'https://schema.org/InStock',
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split('T')[0],
    },
  };

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.ratingValue,
      reviewCount: product.rating.reviewCount,
    };
  }

  return schema;
};

export const generateFAQPageSchema = (faqs: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * WebPage schema for generic pages - helps search engines understand page context
 */
export const generateWebPageSchema = (data: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
  speakable?: { cssSelector?: string[]; xPath?: string[] };
}) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.name,
    description: data.description,
    url: data.url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Hair Pinns',
      url: BASE_URL,
    },
  };
  if (data.breadcrumb && data.breadcrumb.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(data.breadcrumb);
  }
  if (data.speakable) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      ...data.speakable,
    };
  }
  return schema;
};

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  // Context: every breadcrumb lives inside the Hair Pinns site. Adding
  // isPartOf keeps the breadcrumb node valid for AI overviews that walk
  // up the tree and want to confirm the parent website.
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Hair Pinns',
    url: BASE_URL,
  },
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateBlogPostSchema = (post: BlogPostData) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hair Pinns',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    image: post.image,
    url: post.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  return schema;
};

/**
 * Generate QAPage schema for Answer Engine Optimization
 * Used for question-answer content optimized for AI search engines
 */
export const generateQAPageSchema = (qa: QAPageData) => ({
  '@context': 'https://schema.org',
  '@type': 'QAPage',
  mainEntity: {
    '@type': 'Question',
    name: qa.question,
    text: qa.question,
    dateCreated: qa.datePublished || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: qa.author || 'Jena Pinn',
    },
    acceptedAnswer: {
      '@type': 'Answer',
      text: qa.answer,
      dateCreated: qa.datePublished || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: qa.author || 'Jena Pinn',
      },
    },
  },
});

/**
 * Generate HowTo schema for step-by-step tutorials
 * Optimized for AI search engines and featured snippets
 */
export const generateHowToSchema = (howTo: HowToData) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.step.map((stepItem, index) => {
      const step: any = {
        '@type': 'HowToStep',
        position: index + 1,
        name: stepItem.name,
        text: stepItem.text,
      };
      if (stepItem.image) {
        step.image = stepItem.image;
      }
      return step;
    }),
  };

  if (howTo.totalTime) {
    schema.totalTime = howTo.totalTime;
  }

  if (howTo.tool && howTo.tool.length > 0) {
    schema.tool = howTo.tool.map((tool) => ({
      '@type': 'HowToTool',
      name: tool.name,
    }));
  }

  if (howTo.supply && howTo.supply.length > 0) {
    schema.supply = howTo.supply.map((supply) => ({
      '@type': 'HowToSupply',
      name: supply.name,
    }));
  }

  return schema;
};

/**
 * Generate enhanced Article schema with speakable property
 * Optimized for voice search and AI assistants
 */
export const generateArticleSchema = (post: BlogPostData & { speakable?: { cssSelector?: string[]; xPath?: string[] } }) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hair Pinns',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    image: post.image,
    url: post.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  // Add speakable property for voice search optimization
  if (post.speakable) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      ...post.speakable,
    };
  }

  return schema;
};

/**
 * Person schema for Jena Pinn — E-E-A-T author authority.
 * Emitted on every blog post authored by Jena and referenced by `author` in
 * Article/BlogPosting schemas via the Meet Jena bio URL.
 */
export const generateJenaPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/blog/meet-jena-15-years-sutherland-shire#person`,
  name: 'Jena Pinn',
  jobTitle: 'Hair Stylist, Colourist & Founder of Hair Pinns',
  description:
    'Jena Pinn is the founder and head stylist of Hair Pinns in Bangor, with over 20 years of hairdressing experience across the Sutherland Shire. Established Hair Pinns in December 2009. Specialises in QIQI smoothing treatments, fast foiling, colour correction, and Straight Up Smoothing — known for an honest, warm, family-friendly approach.',
  url: `${BASE_URL}/blog/meet-jena-15-years-sutherland-shire`,
  image: LOGO_URL,
  worksFor: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Hair Pinns',
    url: BASE_URL,
  },
  knowsAbout: [
    'Hair colouring',
    'Full Head Foils',
    'Foil highlights',
    'Colour correction',
    'Box dye recovery',
    'Keratin smoothing',
    'Straight Up Smoothing',
    'QIQI Vega smoothing',
    'Bond repair',
    'Sutherland Shire hair salons',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Hairdresser',
    occupationLocation: {
      '@type': 'Place',
      name: 'Sutherland Shire, Sydney, Australia',
    },
    skills:
      'Colour correction, foils, smoothing treatments, cut and finish, bond repair',
  },
  sameAs: [
    'https://www.instagram.com/hair.pinns/',
    'https://www.facebook.com/Hair.Pinns',
  ],
});

// Helper to combine multiple schemas without @context/@type conflicts
export const combineSchemas = (...schemas: any[]) => {
  return schemas.map((schema) => {
    // Each schema should be a complete, independent block
    return schema;
  });
};

/**
 * Knowledge Graph Schema for AEO (Answer Engine Optimization)
 * Optimizes for AI/LLM search results (ChatGPT, Google AI Overview, voice assistants)
 */
export const generateKnowledgeGraphSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Hair Pinns',
  alternateName: 'Hair Pinns Hair Salon',
  description:
    'Hair Pinns is a boutique hair salon in Bangor, NSW, Australia. Colour, Smoothing Treatments, and Cuts and Styling. Founded in 2009 by Jena Pinn, serving the Sutherland Shire. Professional hair care products shipped Australia-wide with free shipping over $150.',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
  image: LOGO_URL,
  foundingDate: '2009',
  founder: {
    '@type': 'Person',
    name: 'Jena Pinn',
    jobTitle: 'Hair Stylist & Colorist',
  },
  address: {
    '@type': 'PostalAddress',
    ...SALON_ADDRESS,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SALON_GEO.latitude,
    longitude: SALON_GEO.longitude,
  },
  telephone: SALON_PHONE,
  priceRange: '$$',
  sameAs: [
    'https://www.facebook.com/Hair.Pinns',
    'https://www.instagram.com/hair.pinns/',
    'https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '762',
    bestRating: '5',
    worstRating: '1',
  },
  // Key services for AI understanding
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hair Services & Products',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Hair Services',
        description: 'Professional hair salon services including colour, treatments, cuts, and styling',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Hair Care Products',
        description: 'Professional hair care products picked by Jena, available Australia-wide',
      },
    ],
  },
  // Area served for location-based queries
  areaServed: AREA_SERVED.map((area) => ({
    '@type': 'City',
    name: area,
    addressRegion: 'NSW',
    addressCountry: 'AU',
  })),
  // Expertise and specialization
  knowsAbout: [
    'Hair Coloring',
    'Hair Blonding',
    'Full Head Foils',
    'Hair Smoothing Treatments',
    'Keratin Treatments',
    'Hair Cutting',
    'Hair Styling',
    'Hair Care Products',
  ],
});

/**
 * Store schema for Australia-wide online retail presence
 * Signals national hair product retailer to search engines
 */
export const generateStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${BASE_URL}/#store`,
  name: 'Hair Pinns',
  description:
    'Australia-wide hair care retailer. Picked by Jena since 2009. Free shipping over $150. Juuce, QIQI, Pure, Wet Brush and more. Ships to every state and territory.',
  url: BASE_URL,
  image: LOGO_URL,
  areaServed: {
    '@type': 'Country',
    name: 'Australia',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hair Care Products Australia',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Hair Care Products',
        description: 'Professional hair care products picked by Jena, shipped Australia-wide',
      },
    ],
  },
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '762',
    bestRating: '5',
    worstRating: '1',
  },
});

/**
 * Enhanced Product Schema for AEO
 * Complete product information optimized for AI understanding
 */
export interface EnhancedProductData extends ProductData {
  /**
   * Canonical product page URL. Used for both schema `@id` and `offers.url`.
   * If omitted, falls back to a SKU-based URL which Google can't resolve to
   * a buyable page and will downgrade Merchant Listings eligibility.
   */
  url?: string;
  category?: string;
  productID?: string;
  mpn?: string;
  gtin?: string;
  color?: string;
  size?: string;
  weight?: string;
  manufacturer?: string;
  inProductGroupWithID?: string;
  additionalProperty?: Array<{
    name: string;
    value: string;
  }>;
}

export const generateEnhancedProductSchema = (product: EnhancedProductData) => {
  const rawImages = Array.isArray(product.image) ? product.image : (product.image ? [product.image] : []);
  const imageUrls = rawImages.filter((url): url is string => typeof url === "string" && url.length > 0);

  const canonicalUrl = product.url || `${BASE_URL}/products/${product.sku || product.productID || ''}`;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': canonicalUrl,
    name: product.name,
    description: product.description,
    image: imageUrls.length > 0 ? imageUrls : [`${BASE_URL}/og-product.jpg`],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Hair Pinns',
      url: BASE_URL,
    },
    category: product.category || 'Hair Care',
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: product.currency || 'AUD',
      price: product.price,
      availability: product.availability
        ? `https://schema.org/${product.availability}`
        : 'https://schema.org/InStock',
      // Australia-only fulfilment. `eligibleRegion` tells search engines and
      // Merchant Center that this offer is valid for AU customers only;
      // `ineligibleRegion` (implicit via omission) means international
      // searchers don't see Shopping ads or rich results. Hair Pinns does
      // not ship overseas so this is the truthful, deliberate signal.
      eligibleRegion: {
        '@type': 'Country',
        name: 'AU',
      },
      areaServed: {
        '@type': 'Country',
        name: 'AU',
      },
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split('T')[0],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'AUD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'AU',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      seller: {
        '@type': 'Organization',
        name: 'Hair Pinns',
        url: BASE_URL,
        areaServed: {
          '@type': 'Country',
          name: 'AU',
        },
        currenciesAccepted: 'AUD',
      },
    },
  };

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.productID) {
    schema.productID = product.productID;
  }

  if (product.mpn) {
    schema.mpn = product.mpn;
  }

  if (product.gtin) {
    schema.gtin = product.gtin;
  }

  if (product.color) {
    schema.color = product.color;
  }

  if (product.size) {
    schema.size = product.size;
  }

  if (product.weight) {
    schema.weight = product.weight;
  }

  if (product.manufacturer) {
    schema.manufacturer = {
      '@type': 'Organization',
      name: product.manufacturer,
    };
  }

  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.ratingValue.toString(),
      reviewCount: product.rating.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (product.additionalProperty && product.additionalProperty.length > 0) {
    schema.additionalProperty = product.additionalProperty.map((prop) => ({
      '@type': 'PropertyValue',
      name: prop.name,
      value: prop.value,
    }));
  }

  return schema;
};

/**
 * Enhanced Service Schema for AEO
 * Complete service information with provider details, pricing, and availability
 */
export interface EnhancedServiceData extends ServiceData {
  price?: string;
  priceCurrency?: string;
  duration?: string;
  audience?: {
    audienceType?: string;
    geographicArea?: string;
  };
  hoursAvailable?: Array<{
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
}

export const generateEnhancedServiceSchema = (service: EnhancedServiceData) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${service.url}#service`,
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'HairSalon',
      '@id': `${BASE_URL}/#hairsalon`,
      name: 'Hair Pinns',
      image: LOGO_URL,
      address: {
        '@type': 'PostalAddress',
        ...SALON_ADDRESS,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: SALON_GEO.latitude,
        longitude: SALON_GEO.longitude,
      },
      telephone: SALON_PHONE,
      priceRange: '$$',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '762',
        bestRating: '5',
        worstRating: '1',
      },
    },
    areaServed: AREA_SERVED.map((area) => ({
      '@type': 'City',
      name: area,
      addressRegion: 'NSW',
      addressCountry: 'AU',
    })),
    url: service.url,
  };

  if (service.price) {
    // Hair Pinns salon services are bookable in AUD by Australian customers only.
    // Matches the product Offer eligibleRegion so the whole site signals
    // "Australian market" consistently.
    schema.offers = {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.priceCurrency || 'AUD',
      availability: 'https://schema.org/InStock',
      eligibleRegion: {
        '@type': 'Country',
        name: 'AU',
      },
      areaServed: {
        '@type': 'Country',
        name: 'AU',
      },
      url: service.url,
    };
  }

  if (service.duration) {
    schema.duration = `PT${service.duration.replace(/[^\d]/g, '')}M`;
  }

  if (service.audience) {
    schema.audience = {
      '@type': 'Audience',
      audienceType: service.audience.audienceType || 'General Public',
      geographicArea: service.audience.geographicArea || {
        '@type': 'City',
        name: 'Sutherland Shire',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
    };
  }

  if (service.hoursAvailable && service.hoursAvailable.length > 0) {
    schema.hoursAvailable = service.hoursAvailable.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    }));
  }

  return schema;
};

/**
 * CollectionPage Schema for AEO
 * Optimizes collection pages for AI understanding
 */
export interface CollectionPageData {
  name: string;
  description: string;
  url: string;
  image?: string;
  numberOfItems?: number;
  items?: Array<{
    name: string;
    description: string;
    url: string;
    image?: string;
    price?: string;
    currency?: string;
  }>;
}

export const generateCollectionPageSchema = (collection: CollectionPageData) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collection.url}#collection`,
    name: collection.name,
    description: collection.description,
    url: collection.url,
    mainEntity: {
      '@type': 'ItemList',
      name: collection.name,
      description: collection.description,
      numberOfItems: collection.numberOfItems || (collection.items ? collection.items.length : 0),
    },
  };

  schema.areaServed = {
    '@type': 'Country',
    name: 'Australia',
  };

  if (collection.image) {
    schema.image = collection.image;
  }

  if (collection.items && collection.items.length > 0) {
    schema.mainEntity.itemListElement = collection.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.description,
        url: item.url,
        image: item.image,
        ...(item.price && {
          offers: {
            '@type': 'Offer',
            price: item.price,
            priceCurrency: item.currency || 'AUD',
            availability: 'https://schema.org/InStock',
            url: item.url,
          },
        }),
      },
    }));
  }

  return schema;
};

/**
 * ItemList schema for search results page
 * Helps search engines understand product listings
 */
export const generateSearchResultsItemListSchema = (data: {
  query: string;
  url: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
    price?: number;
    currency?: string;
  }>;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Search results for "${data.query}"`,
  description: `Salon-quality hair care products. Shipped Australia-wide. Free shipping over $150.`,
  url: data.url,
  numberOfItems: data.items.length,
  itemListElement: data.items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: item.name,
      url: `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
      image: item.image,
      ...(item.price !== undefined && {
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: item.currency || 'AUD',
          availability: 'https://schema.org/InStock',
        },
      }),
    },
  })),
});

/**
 * ItemList schema for blog index
 * Helps search engines understand blog post listings
 */
export const generateBlogItemListSchema = (items: Array<{
  name: string;
  url: string;
  datePublished?: string;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Hair Care Tips & Product Advice | Hair Pinns Blog',
  description: 'Expert hair care tips and product advice from Jena at Hair Pinns. Salon-quality recommendations for Australian hair. Shipped Australia-wide.',
  url: `${BASE_URL}/blog`,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Article',
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
      ...(item.datePublished && { datePublished: item.datePublished }),
    },
  })),
});

/**
 * ItemList schema for the /services index page.
 * Groups every bookable service so search engines + AI overviews understand
 * the full menu and can surface sitelinks/structured answers to
 * "what services does Hair Pinns offer" and "how much does X cost".
 */
export const generateServiceItemListSchema = (items: Array<{
  name: string;
  url: string;
  description?: string;
  price?: string; // numeric only, e.g. "324"
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Hair Salon Services | Hair Pinns Bangor',
  description: 'Smoothing treatments, foil packages, colouring, cuts, kids & formal styling at Hair Pinns in Bangor, NSW. Book online with Jena.',
  url: `${BASE_URL}/services`,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
      ...(item.description && { description: item.description }),
      provider: {
        '@type': 'HairSalon',
        '@id': `${BASE_URL}/#hairsalon`,
        name: 'Hair Pinns',
        url: BASE_URL,
      },
      // Provider-level rating carries through to every list item.
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '762',
        bestRating: '5',
        worstRating: '1',
      },
      ...(item.price && {
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'AUD',
          availability: 'https://schema.org/InStock',
        },
      }),
    },
  })),
});

/**
 * Enhanced LocalBusiness Schema for AEO
 * Adds serviceArea and geo radius for better location-based queries
 */
/**
 * Place schema for local/geo pages - optimizes for "near me" and map pack.
 * Suburb pages re-state the salon-wide rating + offer catalog so the
 * provider's Google review score and price range appear in geo-targeted SERPs.
 */
export const generatePlaceSchema = (data: {
  name: string;
  description: string;
  url: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: data.name,
  description: data.description,
  url: data.url,
  address: {
    '@type': 'PostalAddress',
    addressLocality: data.addressLocality,
    addressRegion: data.addressRegion || 'NSW',
    postalCode: data.postalCode || '',
    addressCountry: 'AU',
  },
  containedInPlace: {
    '@type': 'City',
    name: 'Sutherland Shire',
    addressRegion: 'NSW',
    addressCountry: 'AU',
  },
  // Provider-level rating (Google Business Profile) — same salon, every suburb.
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '762',
    bestRating: '5',
    worstRating: '1',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hair Pinns Service Catalogue',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Smoothing Treatments',
        itemListElement: [
          { '@type': 'Offer', name: 'Straight Up Smoothing (Mid-Length)', price: '324', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Straight Up Smoothing (Long/Thick)', price: '349', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Straight Up Smoothing (Teens)', price: '234', priceCurrency: 'AUD' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Foil Packages',
        itemListElement: [
          { '@type': 'Offer', name: 'Quarter Head Foils, cut & blowdry', price: '202', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Half Head Foils, cut & blowdry', price: '237', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Full Head Foils Package', price: '267', priceCurrency: 'AUD' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Colouring Packages',
        itemListElement: [
          { '@type': 'Offer', name: 'Short Hair Colour Package', price: '184', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Mid-Length Colour Package', price: '178', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Long Hair Colour Package', price: '205', priceCurrency: 'AUD' },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Cut & Blowdry Packages',
        itemListElement: [
          { '@type': 'Offer', name: 'Kids cut & blowdry bundle', price: '54', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Short wash/cut/blow-dry', price: '79', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Mid-length wash/cut/blow-dry', price: '89', priceCurrency: 'AUD' },
          { '@type': 'Offer', name: 'Long Hair wash/cut/blow-dry', price: '99', priceCurrency: 'AUD' },
        ],
      },
    ],
  },
});

export const generateEnhancedLocalBusinessSchema = (pageUrl?: string) => {
  const baseSchema = generateLocalBusinessSchema(pageUrl);

  // Two distinct surfaces in one schema:
  //   - The salon (HairSalon): hyper-local, 25km from Bangor. `serviceArea`
  //     stays as the GeoCircle so Google Maps / "near me" queries route
  //     correctly.
  //   - Product e-commerce: nationally available across AU. `areaServed`
  //     spans the whole country for product fulfilment, and `currenciesAccepted`
  //     plus `paymentAccepted` give AU-shopper trust signals.
  return {
    ...baseSchema,
    hasMap: 'https://www.google.com/maps/place/Hair+Pinns+Bangor',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: SALON_GEO.latitude,
        longitude: SALON_GEO.longitude,
      },
      geoRadius: {
        '@type': 'Distance',
        value: '25',
        unitCode: 'KM',
      },
    },
    currenciesAccepted: 'AUD',
    paymentAccepted: 'Cash, Credit Card, Debit Card, Afterpay, Apple Pay, Google Pay, Shop Pay',
    // AggregateRating — Google Reviews only (verifiable source)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '762',
      bestRating: '5',
      worstRating: '1',
    },
  };
};

/**
 * Author Schema for Jena Pinn (E-E-A-T)
 * Establishes expertise and authority for Google rankings
 */
export const generateAuthorSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#jena-pinn`,
  name: 'Jena Pinn',
  jobTitle: 'Salon Owner and Hair Care Specialist',
  worksFor: {
    '@type': 'HairSalon',
    '@id': `${BASE_URL}/#hairsalon`,
    name: 'Hair Pinns',
  },
  knowsAbout: [
    'Hair Colouring',
    'Full Head Foils',
    'Keratin Smoothing Treatments',
    'Hair Care Products',
    'Foiling and Highlights',
    'Precision Hair Cutting',
  ],
  description: 'Jena has been doing hair since 2009. She runs Hair Pinns salon in Bangor, Sutherland Shire, and stocks only products she uses on her own clients.',
  address: {
    '@type': 'PostalAddress',
    ...SALON_ADDRESS,
  },
  sameAs: [
    'https://www.instagram.com/hair.pinns/',
    'https://www.facebook.com/Hair.Pinns',
  ],
});

/**
 * Opening hours from centralised config for schema use
 */
export const getOpeningHoursSpecification = () =>
  BUSINESS_HOURS.map(h => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.day,
    opens: h.opens,
    closes: h.closes,
  }));

/**
 * DefinedTermSet schema for /glossary — gives AI overviews and search
 * engines a structured definition list to cite for "what is X" queries.
 */
export const generateDefinedTermSetSchema = (terms: Array<{
  id: string;
  term: string;
  definition: string;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': `${BASE_URL}/glossary#termset`,
  name: 'Hair Care Glossary | Hair Pinns',
  description: 'Plain-English definitions of common hair-care terms, treatments, colour techniques and products — from Jena at Hair Pinns Bangor.',
  url: `${BASE_URL}/glossary`,
  hasDefinedTerm: terms.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/glossary#${t.id}`,
    name: t.term,
    description: t.definition,
    inDefinedTermSet: `${BASE_URL}/glossary#termset`,
    url: `${BASE_URL}/glossary#${t.id}`,
  })),
});