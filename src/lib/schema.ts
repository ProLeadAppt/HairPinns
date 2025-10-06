// Schema.org JSON-LD utilities for SEO

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

const BASE_URL = 'https://hairpinns.com';
const LOGO_URL = `${BASE_URL}/logo.png`;
const SALON_ADDRESS = {
  streetAddress: '60 Goorgool Rd',
  addressLocality: 'Bangor',
  addressRegion: 'NSW',
  postalCode: '2234',
  addressCountry: 'AU',
};
const SALON_GEO = {
  latitude: '-34.0186',
  longitude: '151.0333',
};
const SALON_PHONE = '+61-468-020-624';

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

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hair Pinns',
  url: BASE_URL,
  logo: LOGO_URL,
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
    'Boutique hair salon in Bangor specializing in Colour & Blonding, Smoothing Treatments, and precision Cuts & Styling. Over 20 years of expertise serving the Sutherland Shire.',
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Tuesday',
      opens: '10:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Wednesday',
      opens: '18:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Thursday',
      opens: '09:00',
      closes: '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '09:00',
      closes: '17:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '14:00',
    },
  ],
  areaServed: AREA_SERVED.map((area) => ({
    '@type': 'City',
    name: area,
  })),
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
              name: 'Balayage',
              description: 'Hand-painted highlights for natural, sun-kissed dimension',
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

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
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

// Helper to combine multiple schemas without @context/@type conflicts
export const combineSchemas = (...schemas: any[]) => {
  return schemas.map((schema) => {
    // Each schema should be a complete, independent block
    return schema;
  });
};
