/**
 * Authoritative Shopify cart boundary.
 *
 * JSON clients send one explicit action: get, add, remove or checkout.
 * The response always includes the complete cart snapshot. Legacy line-based
 * requests are temporarily inferred so existing product purchase forms keep
 * working while callers migrate to the action contract.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };
const SHOPIFY_DOMAIN = process.env.SHOPIFY_MYSHOPIFY_DOMAIN;
const SF_API_VERSION = process.env.SF_API_VERSION || '2026-07';
const SF_STOREFRONT_TOKEN = process.env.SF_STOREFRONT_TOKEN;
const SHOPIFY_ENDPOINT = SHOPIFY_DOMAIN
  ? `https://${SHOPIFY_DOMAIN}/api/${SF_API_VERSION}/graphql.json`
  : null;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  discountCodes { code applicable }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product { id title handle tags }
            image { url altText }
          }
        }
      }
    }
  }
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
`;

class CheckoutError extends Error {
  constructor(message, status = 500, code = 'CHECKOUT_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const isStaleMessage = (message = '', code = '') => {
  const normalised = message.toLowerCase();
  return code === 'CART_DOES_NOT_EXIST'
    || normalised.includes('cart does not exist')
    || normalised.includes('cart not found')
    || normalised.includes('cart has expired')
    || normalised.includes('invalid cart');
};

async function fetchShopify(query, variables) {
  if (!SHOPIFY_ENDPOINT || !SF_STOREFRONT_TOKEN) {
    throw new CheckoutError('Shopify configuration is unavailable.', 500, 'SHOPIFY_CONFIGURATION');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SF_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });
    const json = await response.json();
    if (!response.ok) {
      throw new CheckoutError('Shopify could not update the bag.', 502, 'SHOPIFY_HTTP_ERROR');
    }
    if (json.errors?.length) {
      const stale = json.errors.some((error) => isStaleMessage(error.message, error.extensions?.code));
      if (stale) throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
      throw new CheckoutError('Shopify could not update the bag.', 502, 'SHOPIFY_API_ERROR');
    }
    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeCartId(cartId) {
  if (!cartId || typeof cartId !== 'string') return null;
  const trimmed = cartId.trim();
  return trimmed.startsWith('gid://shopify/Cart/')
    ? trimmed
    : `gid://shopify/Cart/${trimmed}`;
}

function ensureShopifyCheckoutUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes('/api/')) return null;
    const isShopify = parsed.hostname.endsWith('.myshopify.com') || parsed.hostname.endsWith('.shopify.com');
    if (!isShopify && SHOPIFY_DOMAIN) parsed.hostname = SHOPIFY_DOMAIN;
    return parsed.toString();
  } catch {
    return null;
  }
}

function assertUserErrors(payload) {
  const errors = payload?.userErrors || [];
  if (!errors.length) return;
  const first = errors[0];
  if (errors.some((error) => isStaleMessage(error.message, error.code))) {
    throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
  }
  throw new CheckoutError(first.message || 'The bag could not be updated.', 422, 'CART_USER_ERROR');
}

async function cartGet(cartId) {
  const data = await fetchShopify(
    `query getCart($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }`,
    { cartId },
  );
  if (!data?.cart) throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
  return data.cart;
}

async function cartCreate(lines) {
  const data = await fetchShopify(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { field message code } }
    }`,
    { input: { lines, buyerIdentity: { countryCode: 'AU' } } },
  );
  assertUserErrors(data.cartCreate);
  return data.cartCreate.cart;
}

async function cartLinesAdd(cartId, lines) {
  const data = await fetchShopify(
    `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message code }
      }
    }`,
    { cartId, lines },
  );
  assertUserErrors(data.cartLinesAdd);
  if (!data.cartLinesAdd.cart) throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
  return data.cartLinesAdd.cart;
}

async function cartLinesRemove(cartId, lineIds) {
  const data = await fetchShopify(
    `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message code }
      }
    }`,
    { cartId, lineIds },
  );
  assertUserErrors(data.cartLinesRemove);
  if (!data.cartLinesRemove.cart) throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
  return data.cartLinesRemove.cart;
}

async function cartDiscountCodesUpdate(cartId, discountCodes) {
  const data = await fetchShopify(
    `mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart { ${CART_FIELDS} }
        userErrors { field message code }
      }
    }`,
    { cartId, discountCodes },
  );
  assertUserErrors(data.cartDiscountCodesUpdate);
  if (!data.cartDiscountCodesUpdate.cart) throw new CheckoutError('This bag has expired.', 410, 'STALE_CART');
  return data.cartDiscountCodesUpdate.cart;
}

function parseBody(event) {
  const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(event.body || '');
    return {
      action: params.get('action') || undefined,
      cartId: params.get('cartId') || undefined,
      lines: (() => { try { return JSON.parse(params.get('lines') || '[]'); } catch { return []; } })(),
    };
  }
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    throw new CheckoutError('The request body is not valid JSON.', 400, 'INVALID_JSON');
  }
}

function inferLegacyAction(body) {
  if (body.action) return body.action;
  if (Array.isArray(body.removeLineIds) && body.removeLineIds.length) return 'remove';
  if (Array.isArray(body.lines) && body.lines.length) return 'add';
  if (body.cartId) return 'checkout';
  return null;
}

function validateLines(lines) {
  if (!Array.isArray(lines) || !lines.length) {
    throw new CheckoutError('At least one line item is required.', 400, 'INVALID_LINES');
  }
  for (const line of lines) {
    if (!line?.merchandiseId || !Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new CheckoutError('Each line requires a merchandiseId and positive whole quantity.', 400, 'INVALID_LINES');
    }
  }
}

function responseForCart(cart) {
  if (!cart?.id) throw new CheckoutError('Shopify returned an incomplete bag.', 502, 'INVALID_CART_RESPONSE');
  const checkoutUrl = ensureShopifyCheckoutUrl(cart.checkoutUrl);
  const snapshot = { ...cart, checkoutUrl: checkoutUrl || cart.checkoutUrl || '' };
  return {
    cart: snapshot,
    cartId: snapshot.id,
    checkoutUrl: snapshot.checkoutUrl,
  };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = parseBody(event);
    const action = inferLegacyAction(body);
    if (!['get', 'add', 'remove', 'checkout'].includes(action)) {
      throw new CheckoutError('Action must be get, add, remove or checkout.', 400, 'INVALID_ACTION');
    }

    const cartId = normalizeCartId(body.cartId);
    let cart;
    if (action === 'get') {
      if (!cartId) throw new CheckoutError('A cartId is required.', 400, 'INVALID_CART_ID');
      cart = await cartGet(cartId);
    } else if (action === 'add') {
      validateLines(body.lines);
      if (cartId) {
        try {
          cart = await cartLinesAdd(cartId, body.lines);
        } catch (error) {
          if (!(error instanceof CheckoutError) || error.code !== 'STALE_CART') throw error;
          cart = await cartCreate(body.lines);
        }
      } else {
        cart = await cartCreate(body.lines);
      }
    } else if (action === 'remove') {
      if (!cartId) throw new CheckoutError('A cartId is required.', 400, 'INVALID_CART_ID');
      const lineIds = Array.isArray(body.lineIds) ? body.lineIds : body.removeLineIds;
      if (!Array.isArray(lineIds) || !lineIds.length) {
        throw new CheckoutError('At least one lineId is required.', 400, 'INVALID_LINE_IDS');
      }
      cart = await cartLinesRemove(cartId, lineIds);
    } else {
      if (!cartId) throw new CheckoutError('A cartId is required.', 400, 'INVALID_CART_ID');
      cart = Array.isArray(body.discountCodes)
        ? await cartDiscountCodesUpdate(cartId, body.discountCodes)
        : await cartGet(cartId);
    }

    const result = responseForCart(cart);
    if (event.queryStringParameters?.redirect === 'true') {
      if (!result.checkoutUrl) {
        throw new CheckoutError('Checkout is temporarily unavailable.', 502, 'CHECKOUT_URL_MISSING');
      }
      return { statusCode: 303, headers: { ...corsHeaders, Location: result.checkoutUrl }, body: '' };
    }
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify(result) };
  } catch (error) {
    const status = error instanceof CheckoutError ? error.status : 500;
    const code = error instanceof CheckoutError ? error.code : 'CHECKOUT_ERROR';
    if (status >= 500) console.error('Checkout function error:', error);
    return {
      statusCode: status,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: status >= 500 ? 'Checkout is temporarily unavailable.' : error.message,
        message: error.message,
        code,
      }),
    };
  }
};
