import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Read Shopify config from environment (same pattern as /api/health)
const SHOPIFY_DOMAIN = Deno.env.get('SHOPIFY_MYSHOPIFY_DOMAIN');
const SF_API_VERSION = Deno.env.get('SF_API_VERSION');
const SF_STOREFRONT_TOKEN = Deno.env.get('SF_STOREFRONT_TOKEN');

// Validate required env vars
if (!SHOPIFY_DOMAIN || !SF_STOREFRONT_TOKEN || !SF_API_VERSION) {
  console.error('Missing required environment variables:', {
    SHOPIFY_DOMAIN: !!SHOPIFY_DOMAIN,
    SF_STOREFRONT_TOKEN: !!SF_STOREFRONT_TOKEN,
    SF_API_VERSION: !!SF_API_VERSION,
  });
}

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${SF_API_VERSION}/graphql.json`;

/**
 * Call Shopify Storefront API
 */
async function fetchShopify<T>(query: string, variables?: Record<string, any>): Promise<T> {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SF_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify API errors:', json.errors);
    throw new Error('Shopify API error');
  }

  return json.data as T;
}

/**
 * Create a new Shopify cart
 */
async function cartCreate(lines: Array<{ merchandiseId: string; quantity: number }>) {
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

  const data = await fetchShopify<any>(query, variables);

  if (data.cartCreate.userErrors?.length > 0) {
    console.error('Cart create user errors:', data.cartCreate.userErrors);
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

/**
 * Add lines to existing cart
 */
async function cartLinesAdd(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
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

  const data = await fetchShopify<any>(query, variables);

  if (data.cartLinesAdd.userErrors?.length > 0) {
    console.error('Cart lines add user errors:', data.cartLinesAdd.userErrors);
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Check env vars are available
    if (!SHOPIFY_DOMAIN || !SF_STOREFRONT_TOKEN || !SF_API_VERSION) {
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing required Shopify environment variables'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { lines, cartId } = await req.json();

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: lines array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate line items
    for (const line of lines) {
      if (!line.merchandiseId || typeof line.quantity !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Invalid line item: merchandiseId and quantity required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
      return new Response(
        JSON.stringify({ error: 'Checkout URL not available' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Cart ready:', { cartId: cart.id, checkoutUrl: cart.checkoutUrl });

    // Check for redirect query param
    const url = new URL(req.url);
    const shouldRedirect = url.searchParams.get('redirect') === 'true';

    if (shouldRedirect) {
      // 303 redirect to Shopify checkout
      return new Response(null, {
        status: 303,
        headers: {
          ...corsHeaders,
          'Location': cart.checkoutUrl,
        },
      });
    }

    // Return JSON response
    return new Response(
      JSON.stringify({ 
        checkoutUrl: cart.checkoutUrl,
        cartId: cart.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Checkout failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
