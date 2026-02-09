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
                    priceV2 {
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
                    priceV2 {
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

    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { lines, cartId } = body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid request: lines array required' }),
      };
    }

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

    // Create or update cart
    let cart;
    if (cartId) {
      console.log('Adding to existing cart:', cartId);
      cart = await cartLinesAdd(cartId, lines);
    } else {
      console.log('Creating new cart');
      cart = await cartCreate(lines);
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

    console.log('✅ Cart ready:', { cartId: cart.id, checkoutUrl: cart.checkoutUrl });

    // Check for redirect query param
    const queryParams = event.queryStringParameters || {};
    const shouldRedirect = queryParams.redirect === 'true';

    if (shouldRedirect) {
      // 303 redirect to Shopify checkout
      return {
        statusCode: 303,
        headers: {
          ...corsHeaders,
          'Location': cart.checkoutUrl,
        },
        body: '',
      };
    }

    // Return JSON response
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutUrl: cart.checkoutUrl,
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

