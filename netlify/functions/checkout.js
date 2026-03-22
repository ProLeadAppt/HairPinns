/**
 * Netlify Function for Shopify Checkout
 * Handles cart creation and checkout URL generation
 * 
 * Environment Variables Required (set in Netlify dashboard or .env):
 * - SHOPIFY_MYSHOPIFY_DOMAIN (e.g., femtat-zu.myshopify.com)
 * - SF_STOREFRONT_TOKEN (your storefront access token)
 * - SF_API_VERSION (e.g., 2025-01)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Read Shopify config from environment variables
const SHOPIFY_DOMAIN = process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
const SF_API_VERSION = process.env.SF_API_VERSION || '2025-01';
const SF_STOREFRONT_TOKEN = process.env.SF_STOREFRONT_TOKEN;

// Validate required env vars (log but don't throw - validate at runtime)
if (!SHOPIFY_DOMAIN || !SF_STOREFRONT_TOKEN) {
  console.error('Missing required environment variables:', {
    SHOPIFY_DOMAIN: !!SHOPIFY_DOMAIN,
    SF_STOREFRONT_TOKEN: !!SF_STOREFRONT_TOKEN,
  });
}

const SHOPIFY_ENDPOINT = SHOPIFY_DOMAIN 
  ? `https://${SHOPIFY_DOMAIN}/api/${SF_API_VERSION}/graphql.json`
  : null;

/**
 * Call Shopify Storefront API
 */
async function fetchShopify(query, variables) {
  if (!SHOPIFY_ENDPOINT || !SF_STOREFRONT_TOKEN) {
    throw new Error('Shopify configuration not available');
  }

  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SF_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error('Shopify API error');
  }

  return json.data;
}

/**
 * Create a new Shopify cart
 */
async function cartCreate(lines) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines,
      buyerIdentity: {
        countryCode: "AU",
      },
    },
  };

  const data = await fetchShopify(query, variables);

  if (data.cartCreate.userErrors?.length > 0) {
    console.error('Cart create user errors:', data.cartCreate.userErrors);
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

/**
 * Add lines to existing cart
 */
async function cartLinesAdd(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { cartId, lines };

  const data = await fetchShopify(query, variables);

  if (data.cartLinesAdd.userErrors?.length > 0) {
    console.error('Cart lines add user errors:', data.cartLinesAdd.userErrors);
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

/**
 * Remove lines from cart
 */
async function cartLinesRemove(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const data = await fetchShopify(query, { cartId, lineIds });
  if (data.cartLinesRemove.userErrors?.length > 0) {
    console.error('Cart lines remove user errors:', data.cartLinesRemove.userErrors);
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }
  return data.cartLinesRemove.cart;
}

/**
 * Ensure checkout URL uses Shopify domain and valid path
 * - Custom domain URLs hit our SPA and show 404
 * - Wrong paths (e.g. /api/checkout) mean Shopify config is misconfigured
 */
function ensureShopifyCheckoutUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    const customDomains = ['hairpinns.com', 'www.hairpinns.com'];

    // Reject URLs that point to our API - Shopify config is wrong
    if (parsed.pathname.includes('/api/') || parsed.pathname === '/api/checkout') {
      console.error('Invalid checkout URL from Shopify (points to our API):', url);
      return null;
    }

    // Rewrite custom domain to Shopify domain so checkout loads on Shopify
    if (customDomains.some(d => parsed.hostname === d) && SHOPIFY_DOMAIN) {
      parsed.hostname = SHOPIFY_DOMAIN;
      return parsed.toString();
    }

    // Ensure we're on Shopify domain for checkout
    if (!parsed.hostname.endsWith('.myshopify.com') && !parsed.hostname.includes('shopify.com')) {
      if (SHOPIFY_DOMAIN) {
        parsed.hostname = SHOPIFY_DOMAIN;
        return parsed.toString();
      }
    }

    return url;
  } catch {
    return null;
  }
}

/**
 * Normalize cart ID to Shopify GID format
 */
function normalizeCartId(cartId) {
  if (!cartId || typeof cartId !== 'string') return null;
  const trimmed = cartId.trim();
  if (trimmed.startsWith('gid://shopify/Cart/')) return trimmed;
  // Token-only format: add GID prefix
  return `gid://shopify/Cart/${trimmed}`;
}

/**
 * Get existing cart by ID (for "Proceed to Checkout" when cart already has items)
 */
async function cartGet(cartId) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;
  const data = await fetchShopify(query, { cartId });
  if (!data.cart) {
    throw new Error('Cart not found or expired');
  }
  return data.cart;
}

/**
 * Netlify Function Handler (v1 format - no package required)
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check env vars are available
    if (!SHOPIFY_DOMAIN || !SF_STOREFRONT_TOKEN) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Server configuration error',
          message: 'Missing required Shopify environment variables',
        }),
      };
    }

    // Parse request body - support both JSON and form-urlencoded (for form POST redirect)
    let body = {};
    const contentType = (event.headers && (event.headers['content-type'] || event.headers['Content-Type'])) || '';
    if (contentType.includes('application/json')) {
      body = event.body ? JSON.parse(event.body) : {};
    } else if (contentType.includes('application/x-www-form-urlencoded') || (event.body && event.body.includes('='))) {
      const params = new URLSearchParams(event.body || '');
      body = {
        cartId: params.get('cartId') || null,
        lines: (() => { try { return JSON.parse(params.get('lines') || '[]'); } catch { return []; } })(),
      };
    } else {
      body = event.body ? JSON.parse(event.body) : {};
    }
    const lines = Array.isArray(body.lines) ? body.lines : [];
    const removeLineIds = Array.isArray(body.removeLineIds) ? body.removeLineIds : [];
    const cartId = normalizeCartId(body.cartId) || body.cartId || null;

    let cart;

    // Remove lines from cart
    if (removeLineIds.length > 0 && cartId) {
      console.log('Removing lines from cart:', cartId, removeLineIds);
      cart = await cartLinesRemove(cartId, removeLineIds);
      if (!cart) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Failed to remove items' }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      };
    }

    // "Proceed to Checkout" with existing cart (mini cart sends cartId + empty lines)
    if (lines.length === 0 && cartId) {
      console.log('Fetching existing cart for checkout:', cartId);
      cart = await cartGet(cartId);
    }
    // Add to cart (one or more line items)
    else if (lines.length > 0) {
      // Validate line items
      for (const line of lines) {
        if (!line.merchandiseId || typeof line.quantity !== 'number') {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              error: 'Invalid line item: merchandiseId and quantity required',
            }),
          };
        }
      }
      if (cartId) {
        console.log('Adding to existing cart:', cartId);
        cart = await cartLinesAdd(cartId, lines);
      } else {
        console.log('Creating new cart');
        cart = await cartCreate(lines);
      }
    } else {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid request: send lines (add to cart) or cartId with empty lines (proceed to checkout)',
        }),
      };
    }

    // Validate checkoutUrl exists
    if (!cart.checkoutUrl) {
      console.error('Cart missing checkoutUrl:', cart);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Checkout URL not available' }),
      };
    }

    // Ensure checkout URL uses Shopify domain (fixes 404 when custom domain hits our SPA)
    const checkoutUrl = ensureShopifyCheckoutUrl(cart.checkoutUrl);

    if (!checkoutUrl) {
      console.error('Invalid or misconfigured checkout URL from Shopify:', cart.checkoutUrl);
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Checkout configuration error',
          message: 'Unable to get checkout URL. Please check your Shopify store settings.',
        }),
      };
    }

    console.log('✅ Cart ready:', { cartId: cart.id, checkoutUrl });

    // Check for redirect query param
    const queryParams = event.queryStringParameters || {};
    const shouldRedirect = queryParams.redirect === 'true';

    if (shouldRedirect) {
      // 303 redirect to Shopify checkout
      return {
        statusCode: 303,
        headers: {
          ...corsHeaders,
          'Location': checkoutUrl,
        },
        body: '',
      };
    }

    // Return JSON response
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutUrl,
        cartId: cart.id,
      }),
    };
  } catch (error) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Checkout failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

