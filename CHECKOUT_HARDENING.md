# Checkout Hardening Implementation

## Overview

All checkout actions now have robust fallback logic to native Shopify cart URLs and proper analytics tracking.

---

## Changes Made

### 1. Cart Management (`src/lib/cartManagement.ts`)

#### Guard in `addToBag()`
- **After** `cartCreate()` or `cartLinesAdd()`, re-reads `cart.checkoutUrl`
- **If** `checkoutUrl` is `undefined` or `null`, throws an error
- This triggers fallback logic in calling components

#### Updated `getCheckoutUrl()`
- Now accepts optional `cart` and `variantId` parameters
- Returns `cart.checkoutUrl` if available
- Returns `null` if checkout URL is missing (triggers fallback)

#### Updated `goToCheckout()`
- Uses `getCheckoutUrl()` with fallback logic
- **Primary**: Redirects to Shopify checkout URL if available
- **Fallback**: Redirects to native cart URL: `https://hairpinns.com/cart/${variantId}:1`
- Extracts numeric variant ID from Shopify GID format

---

### 2. Mini Cart Drawer (`src/components/MiniCartDrawer.tsx`)

#### `handleCheckout()`
- Tracks `begin_checkout` event to Zapier (non-blocking)
- **Primary**: Uses `checkout` URL if available
- **Fallback**: Uses native cart URL with first variant ID
- All redirects use `window.location.href` (no new window, no iframe)
- Added `aria-label` to checkout button

---

### 3. Mini Cart Component (`src/components/cart/MiniCart.tsx`)

#### `handleCheckout()`
- Tracks `begin_checkout` event to Zapier
- **Primary**: Uses `cart.checkoutUrl` if available
- **Fallback**: Constructs native cart URL from first line item's variant ID
- Uses `window.location.href` for same-window navigation

---

### 4. Product Detail Page (`src/pages/ProductDetail.tsx`)

#### `handleBuyNow()`
- Tracks both `add_to_cart` and `begin_checkout` events
- Uses `getCheckoutUrl(updatedCart, activeVariantId)` with fallback
- **Primary**: Redirects to Shopify checkout URL
- **Fallback**: Constructs native cart URL with variant ID
- Cleans variant ID (extracts numeric ID from GID)

---

## Native Cart URL Format

```
https://hairpinns.com/cart/${variantId}:1
```

- `variantId`: Numeric variant ID (e.g., `12345678`)
- `:1`: Quantity (hardcoded to 1 for single-item fallback)

---

## Zapier Tracking

All checkout flows fire `begin_checkout` event:

```typescript
trackBeginCheckout({
  cart_total: number,
  item_count: number,
  currency: "AUD"
})
```

**Non-blocking**: If tracking fails, checkout proceeds anyway.

---

## Navigation Behavior

✅ **All redirects use `window.location.href`**
- Same window navigation
- No `target="_blank"` (no new window)
- No iframe embedding

---

## Error Handling

### If `addToBag()` throws:
1. Error is caught in component
2. User sees toast notification
3. Fallback behavior (varies by component):
   - **Collection**: Redirects to Shopify product page
   - **Product Detail**: Redirects to Shopify product page
   - **Buy Now**: Uses native cart URL

### If checkout URL is missing:
1. Console warning logged
2. Native cart URL constructed from variant ID
3. User redirected to Shopify native cart

---

## Testing Checklist

- [ ] Add to bag from collection page
- [ ] Add to bag from product detail page
- [ ] Buy now button (fast checkout)
- [ ] Checkout from MiniCartDrawer
- [ ] Checkout from MiniCart component
- [ ] Verify `begin_checkout` Zapier event fires
- [ ] Test with invalid/expired cart
- [ ] Test native cart fallback (simulate missing checkoutUrl)
- [ ] Verify all redirects open in same window

---

## Known Limitations

1. **Native cart fallback is single-item only**
   - Format: `/cart/${variantId}:1`
   - If user had multiple items in cart, only one item will be in native cart fallback
   
2. **Variant ID extraction**
   - Assumes Shopify GID format: `gid://shopify/ProductVariant/12345678`
   - `.split('/').pop()` extracts numeric ID

---

## Future Enhancements

1. **Multi-item native cart URLs**
   - Build cart URL with all line items: `/cart/${variantId1}:${qty1},${variantId2}:${qty2}`
   
2. **Cart state persistence**
   - Store cart line items in localStorage
   - Reconstruct native cart URL from stored items

3. **Checkout URL retry**
   - If checkout URL is missing, retry cart query before falling back
