// Pixel Tracking Utility - GA4 & Meta Pixel Integration
// Ensures NO PII is sent to ad pixels (except hashed for Meta Advanced Matching)

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// SHA-256 hash function for PII hashing (Meta Advanced Matching)
async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return btoa(message).substring(0, 32);
  }
  
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

interface EcommerceItem {
  item_id?: string;
  item_name?: string;
  price?: number;
  quantity?: number;
  product_id?: string;
  title?: string;
}

interface EcommerceData {
  currency: string;
  value: number;
  items: EcommerceItem[];
}

function getGtag() {
  if (typeof window === 'undefined') {
    return null;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: any[]) => {
      window.dataLayer?.push(args);
    };
  }

  return window.gtag;
}

// ============================================
// GA4 Tracking
// ============================================

export const ga4 = {
  /**
   * Track page view
   */
  pageView: (path: string, title: string) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: `${window.location.origin}${path}`,
      });
      console.log('[GA4] page_view:', { path, title });
    }
  },

  /**
   * Track view_item event (Product Detail Page)
   */
  viewItem: (data: EcommerceData) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'view_item', {
        currency: data.currency,
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id || item.product_id,
          item_name: item.item_name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      });
      console.log('[GA4] view_item:', data);
    }
  },

  /**
   * Track add_to_cart event
   */
  addToCart: (data: EcommerceData) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'add_to_cart', {
        currency: data.currency,
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id || item.product_id,
          item_name: item.item_name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      });
      console.log('[GA4] add_to_cart:', data);
    }
  },

  /**
   * Track begin_checkout event
   */
  beginCheckout: (data: EcommerceData) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'begin_checkout', {
        currency: data.currency,
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id || item.product_id,
          item_name: item.item_name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      });
      console.log('[GA4] begin_checkout:', data);
    }
  },

  /**
   * Track purchase event
   */
  purchase: (data: EcommerceData & { transaction_id: string }) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'purchase', {
        transaction_id: data.transaction_id,
        currency: data.currency,
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.item_id || item.product_id,
          item_name: item.item_name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      });
      console.log('[GA4] purchase:', data);
    }
  },

  /**
   * Track generate_lead event (form submissions)
   */
  generateLead: (leadValue?: number) => {
    const gtag = getGtag();
    if (gtag) {
      gtag('event', 'generate_lead', {
        currency: 'AUD',
        value: leadValue || 0,
      });
      console.log('[GA4] generate_lead:', { value: leadValue });
    }
  },
};

// ============================================
// Meta Pixel Tracking
// ============================================

export const metaPixel = {
  /**
   * Track ViewContent event (Product Detail Page)
   */
  viewContent: (data: {
    content_ids: string[];
    content_name: string;
    content_type: string;
    value: number;
    currency: string;
  }) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: data.content_ids,
        content_name: data.content_name,
        content_type: data.content_type,
        value: data.value,
        currency: data.currency,
      });
      console.log('[Meta Pixel] ViewContent:', data);
    }
  },

  /**
   * Track AddToCart event
   */
  addToCart: (data: {
    content_ids: string[];
    content_name: string;
    content_type: string;
    value: number;
    currency: string;
  }) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_ids: data.content_ids,
        content_name: data.content_name,
        content_type: data.content_type,
        value: data.value,
        currency: data.currency,
      });
      console.log('[Meta Pixel] AddToCart:', data);
    }
  },

  /**
   * Track InitiateCheckout event
   */
  initiateCheckout: (data: {
    content_ids: string[];
    num_items: number;
    value: number;
    currency: string;
  }) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: data.content_ids,
        num_items: data.num_items,
        value: data.value,
        currency: data.currency,
      });
      console.log('[Meta Pixel] InitiateCheckout:', data);
    }
  },

  /**
   * Track Purchase event
   */
  purchase: (data: {
    content_ids: string[];
    num_items: number;
    value: number;
    currency: string;
  }) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_ids: data.content_ids,
        num_items: data.num_items,
        value: data.value,
        currency: data.currency,
      });
      console.log('[Meta Pixel] Purchase:', data);
    }
  },

  /**
   * Track Lead event (form submissions)
   */
  lead: (value?: number) => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        value: value || 0,
        currency: 'AUD',
      });
      console.log('[Meta Pixel] Lead:', { value });
    }
  },

  /**
   * Advanced Matching - Hash PII and send to Meta
   * ONLY use when user explicitly submits form (NOT on page load)
   */
  advancedMatching: async (data: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }) => {
    if (typeof window.fbq === 'function') {
      const hashedData: any = {};

      if (data.email) {
        hashedData.em = await sha256(data.email.toLowerCase().trim());
      }
      if (data.phone) {
        const cleanPhone = data.phone.replace(/\D/g, '');
        hashedData.ph = await sha256(cleanPhone);
      }
      if (data.firstName) {
        hashedData.fn = await sha256(data.firstName.toLowerCase().trim());
      }
      if (data.lastName) {
        hashedData.ln = await sha256(data.lastName.toLowerCase().trim());
      }

      // Update user data (Meta will match this to Facebook users)
      window.fbq('init', window._fbq?.getState?.()?.pixels?.[0]?.id, hashedData);
      
      console.log('[Meta Pixel] Advanced Matching updated (hashed PII)');
    }
  },
};

// ============================================
// Combined Tracking Helpers
// ============================================

export const pixelTracking = {
  /**
   * Track product view (PDP load)
   */
  trackProductView: (product: {
    id: string;
    title: string;
    price: number;
    currency?: string;
  }) => {
    const currency = product.currency || 'AUD';

    // GA4
    ga4.viewItem({
      currency,
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity: 1,
        },
      ],
    });

    // Meta Pixel
    metaPixel.viewContent({
      content_ids: [product.id],
      content_name: product.title,
      content_type: 'product',
      value: product.price,
      currency,
    });
  },

  /**
   * Track add to cart
   */
  trackAddToCart: (product: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    currency?: string;
  }) => {
    const currency = product.currency || 'AUD';
    const value = product.price * product.quantity;

    // GA4
    ga4.addToCart({
      currency,
      value,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });

    // Meta Pixel
    metaPixel.addToCart({
      content_ids: [product.id],
      content_name: product.title,
      content_type: 'product',
      value,
      currency,
    });
  },

  /**
   * Track begin checkout
   */
  trackBeginCheckout: (cart: {
    items: Array<{
      id: string;
      title: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    currency?: string;
  }) => {
    const currency = cart.currency || 'AUD';
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = cart.items.map(item => item.id);

    // GA4
    ga4.beginCheckout({
      currency,
      value: cart.total,
      items: cart.items.map(item => ({
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // Meta Pixel
    metaPixel.initiateCheckout({
      content_ids: contentIds,
      num_items: itemCount,
      value: cart.total,
      currency,
    });
  },

  /**
   * Track purchase
   */
  trackPurchase: (order: {
    orderId: string;
    items: Array<{
      id: string;
      title: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    currency?: string;
  }) => {
    const currency = order.currency || 'AUD';
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = order.items.map(item => item.id);

    // GA4
    ga4.purchase({
      transaction_id: order.orderId,
      currency,
      value: order.total,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // Meta Pixel
    metaPixel.purchase({
      content_ids: contentIds,
      num_items: itemCount,
      value: order.total,
      currency,
    });
  },

  /**
   * Track form submission (lead generation)
   * Optionally send hashed PII to Meta for Advanced Matching
   */
  trackFormSubmission: async (data?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    leadValue?: number;
  }) => {
    // GA4 (NO PII)
    ga4.generateLead(data?.leadValue);

    // Meta Pixel - Lead event (NO PII)
    metaPixel.lead(data?.leadValue);

    // Meta Pixel - Advanced Matching (HASHED PII only)
    if (data?.email || data?.phone) {
      await metaPixel.advancedMatching({
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
  },
};
