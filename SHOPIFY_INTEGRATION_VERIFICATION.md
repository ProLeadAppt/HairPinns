# Shopify Integration Verification

## Overview

This document verifies the complete Shopify e-commerce integration flow from product selection to checkout to payment.

## Integration Flow

### 1. Product Display & Selection

**Files:**
- `src/lib/shopify.ts` - Shopify Storefront API client
- `src/pages/ProductDetail.tsx` - Product detail page
- `src/pages/CollectionDetail.tsx` - Collection pages
- `src/components/home/AboveFoldProducts.tsx` - Homepage products

**Flow:**
1. Products are fetched from Shopify Storefront API using `getProductByHandle()` and `getCollectionByHandle()`
2. Product data includes: title, description, images, variants, pricing, availability
3. Variant selection works correctly with option selection
4. Products display with correct images and pricing

**Status:** ✅ Verified

### 2. Add to Cart Flow

**Files:**
- `src/pages/ProductDetail.tsx` - `handleAddToBag()` function
- `netlify/functions/checkout.js` - Server-side cart creation
- `src/lib/cartManagement.ts` - Cart ID persistence

**Flow:**
1. User clicks "Add to Bag" button
2. `handleAddToBag()` calls `POST /api/checkout` with:
   ```json
   {
     "lines": [{ "merchandiseId": "variantId", "quantity": 1 }],
     "cartId": "existingCartId" // optional
   }
   ```
3. Netlify function (`netlify/functions/checkout.js`) creates or updates cart via Shopify API
4. Cart ID is stored in localStorage (`hp_cart_id`)
5. Mini cart opens showing cart items
6. Returns `{ checkoutUrl, cartId }` for future checkout

**Status:** ✅ Verified

### 3. Checkout Flow

**Files:**
- `netlify/functions/checkout.js` - Checkout handler
- `src/pages/ProductDetail.tsx` - `handleBuyNow()` function
- `src/components/cart/MiniCart.tsx` - `handleCheckout()` function

**Flow:**
1. User clicks "Checkout" or "Buy Now"
2. Calls `POST /api/checkout?redirect=true` with cart ID
3. Netlify function validates cart and returns checkout URL
4. Function returns HTTP 303 redirect to Shopify checkout URL
5. User is redirected to Shopify hosted checkout (`hairpinns.com/cart/c/...`)
6. Shopify handles payment processing

**Status:** ✅ Verified

### 4. Payment & Order Completion

**Files:**
- `src/pages/OrderConfirmation.tsx` - Order confirmation page
- Shopify webhook integration (if configured)

**Flow:**
1. User completes payment on Shopify checkout
2. Shopify processes payment
3. Order confirmation page accessible at `/order-confirmation`
4. Order data can be passed via URL parameters

**Status:** ✅ Verified

## Environment Variables

### Netlify Environment Variables (Server-Side)

Set in Netlify Dashboard → Site Settings → Environment Variables:

- `SHOPIFY_MYSHOPIFY_DOMAIN` - Shopify store domain (e.g., `femtat-zu.myshopify.com`)
- `SF_STOREFRONT_TOKEN` - Storefront API access token
- `SF_API_VERSION` - API version (e.g., `2025-01`)

### Client-Side Environment Variables (.env)

- `VITE_SHOPIFY_MYSHOPIFY_DOMAIN` - Shopify store domain
- `VITE_SF_STOREFRONT_TOKEN` - Storefront API token (public, safe for client-side)
- `VITE_SF_API_VERSION` - API version
- `VITE_SHOP_DOMAIN` - Store URL (e.g., `hairpinns.com`)

## Key Integration Points

### 1. Product Fetching (`src/lib/shopify.ts`)

```typescript
// Fetch product by handle
const product = await getProductByHandle('product-handle');

// Fetch collection by handle
const collection = await getCollectionByHandle('collection-handle');
```

### 2. Add to Cart (`src/pages/ProductDetail.tsx`)

```typescript
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lines: [{ merchandiseId: variantId, quantity: 1 }],
    cartId: getCartId() // optional
  })
});
const { checkoutUrl, cartId } = await response.json();
```

### 3. Checkout Redirect (`netlify/functions/checkout.js`)

```javascript
// Returns 303 redirect to Shopify checkout
return {
  statusCode: 303,
  headers: {
    'Location': cart.checkoutUrl
  }
};
```

## Verification Checklist

- ✅ Products load from Shopify Storefront API
- ✅ Variant selection works correctly
- ✅ Add to cart calls `/api/checkout` endpoint
- ✅ Cart ID stored in localStorage
- ✅ Mini cart displays items correctly
- ✅ Checkout redirects to Shopify hosted checkout
- ✅ Payment flow completes on Shopify
- ✅ Order confirmation page accessible
- ✅ No client-side cart operations (all server-side)
- ✅ No split coding - single codebase path

## Notes

- All cart operations are handled server-side via Netlify function
- Client-side only manages cart ID persistence
- Checkout always redirects to Shopify hosted checkout
- No local checkout page - all payments processed by Shopify
- Storefront API token is public and safe for client-side use

## Testing

To test the integration:

1. **Product Display**: Navigate to `/products/[handle]` - product should load from Shopify
2. **Add to Cart**: Click "Add to Bag" - should call `/api/checkout` and open mini cart
3. **Checkout**: Click "Checkout" in mini cart - should redirect to Shopify checkout
4. **Buy Now**: Click "Buy Now" on product page - should redirect directly to Shopify checkout

## Troubleshooting

If checkout fails:
1. Verify Netlify environment variables are set correctly
2. Check Netlify function logs for errors
3. Verify Shopify Storefront API token is valid
4. Ensure cart has valid checkout URL before redirect
