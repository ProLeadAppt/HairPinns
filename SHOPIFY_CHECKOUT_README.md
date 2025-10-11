# Shopify Checkout Integration - Hair Pinns

## Overview

This project implements a **headless storefront** that uses Shopify's Storefront API for product data and checkout. We **do not render a local cart or checkout page**. Instead, all purchases redirect to Shopify's hosted checkout experience.

---

## Key Configuration

### Environment Variables

All Shopify configuration is centralized in `src/config/projectConfig.ts`:

```typescript
shopify: {
  domain: 'femtat-zu.myshopify.com',           // Shopify API domain
  storefrontToken: 'c4e78c2d75c37a6a3ae370dfc1e71bf4', // PUBLIC storefront token
  apiVersion: '2024-07',                        // API version
  storeUrl: 'https://hairpinns.com',           // User-facing store URL
}
```

**Important Notes:**
- The `storefrontToken` is **PUBLIC** and safe for client-side use
- The API domain (`femtat-zu.myshopify.com`) is used for GraphQL requests
- The store URL (`hairpinns.com`) is used for user-facing links and fallbacks
- All checkouts happen on `hairpinns.com` domain (Shopify's hosted checkout)

---

## How Checkout Works

### Cart Flow

1. **User clicks "Add to Bag"**
   - Calls `addToBag(variantId, quantity)` from `src/lib/cartManagement.ts`
   - If no cart exists, creates a new cart with `buyerIdentity: { countryCode: "AU" }`
   - If cart exists, adds the item to the existing cart
   - Stores `cart.id` and `cart.checkoutUrl` in localStorage

2. **Mini-Cart Drawer Opens** (optional)
   - Displays cart items and subtotal
   - Shows "Proceed to Checkout" button

3. **User clicks "Checkout" or "Buy Now"**
   - Retrieves `checkoutUrl` from the cart
   - Calls `gotoCheckout(checkoutUrl)` from `src/lib/checkout.ts`
   - Redirects user to Shopify's hosted checkout
   - Checkout URL format: `https://hairpinns.com/cart/c/...` or `https://femtat-zu.myshopify.com/.../checkouts/...`

4. **Shopify Handles Checkout**
   - User completes payment on Shopify
   - After successful purchase, Shopify redirects to our `/order-confirmation` page (if configured)

### No Internal Cart/Checkout Routes

This project **intentionally does not have** `/cart` or `/checkout` routes in `src/App.tsx`. All cart and checkout functionality is handled by:
- **Cart Management**: `src/lib/cartManagement.ts`
- **Checkout Navigation**: `src/lib/checkout.ts`
- **Mini-Cart UI**: `src/components/cart/MiniCart.tsx`

---

## Key Files

### 1. `src/lib/shopify.ts`
Main Shopify API client with GraphQL queries:
- `fetchShopify<T>(query, variables)` - Generic GraphQL client
- `getProductByHandle(handle)` - Fetch product details
- `getCollectionByHandle(handle)` - Fetch collection and products
- `cartCreate(lines)` - Create new cart with AU country code
- `cartLinesAdd(cartId, lines)` - Add items to existing cart

### 2. `src/lib/cartManagement.ts`
Cart state management:
- `addToBag(variantId, quantity)` - Add item to cart (creates/updates cart)
- `getCartId()` - Retrieve cart ID from localStorage
- `saveCartId(cartId)` - Save cart ID to localStorage
- `clearCartId()` - Clear cart ID from localStorage
- `getCheckoutUrl()` - Retrieve checkout URL from localStorage
- `saveCheckoutUrl(url)` - Save checkout URL to localStorage

**localStorage Keys:**
- `hp_cart_id` - Shopify cart ID (persists between sessions)
- `hp_checkout_url` - Shopify checkout URL (persists between sessions)

### 3. `src/lib/checkout.ts`
Checkout navigation:
- `gotoCheckout(url)` - Frame-safe navigation to Shopify checkout
  - Attempts `window.top.location.assign()` for iframe contexts
  - Falls back to `window.location.assign()` or `window.open()` if needed

### 4. `src/lib/ecommerceTracking.ts`
Analytics tracking:
- `trackAddToCart(params)` - Fires `add_to_cart` event to Zapier
- `trackBeginCheckout(params)` - Fires `begin_checkout` event to Zapier

### 5. `src/components/cart/MiniCart.tsx`
Mini-cart drawer UI:
- Fetches cart details from Shopify
- Displays cart items and subtotal
- "Proceed to Checkout" button redirects to `checkoutUrl`

---

## Button Implementations

### "Add to Bag" Button
```typescript
const handleAddToBag = async () => {
  try {
    const cart = await addToBag(variantId, 1);
    trackAddToCart({ product_id, title, variant_id, price, currency: "AUD", quantity: 1 });
    toast.success("Added to bag!");
    setMiniCartOpen(true); // Opens mini-cart drawer
  } catch (error) {
    toast.error("We couldn't add this to your bag. Please try again or contact us.");
  }
};
```

### "Buy Now" Button
```typescript
const handleBuyNow = async () => {
  try {
    const cart = await addToBag(variantId, 1);
    trackAddToCart({ product_id, title, variant_id, price, currency: "AUD", quantity: 1 });
    trackBeginCheckout({ cart_total, item_count, currency: "AUD" });
    
    // Immediate redirect to checkout
    gotoCheckout(cart.checkoutUrl);
  } catch (error) {
    toast.error("Unable to proceed to checkout. Please try again.");
  }
};
```

### "Checkout" Button (in Mini-Cart)
```typescript
const handleCheckout = async () => {
  try {
    trackBeginCheckout({ cart_total, item_count, currency: "AUD" });
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      gotoCheckout(checkoutUrl);
    } else {
      throw new Error("Checkout URL unavailable");
    }
  } catch (error) {
    toast.error("Unable to proceed to checkout. Please try again.");
  }
};
```

---

## Error Handling

### User-Friendly Error Messages
All cart errors display clear, actionable messages:
- **"We couldn't add this to your bag. Please try again or contact us."**
- **"Unable to proceed to checkout. Please try again."**
- **"Checkout URL unavailable. Please try again."**

### Automatic Recovery
If a cart becomes invalid (expired, deleted, etc.):
1. The system automatically clears the old cart ID
2. Creates a new cart on the next "Add to Bag" action
3. Retries the operation once
4. Shows an error message only if the retry fails

### Fallback Behavior
If all else fails:
- "Add to Bag" redirects to the product page on `hairpinns.com`
- "Buy Now" shows error message and user can retry
- All links include the Shopify handle for easy manual navigation

---

## Product Availability

Only products with `availableForSale: true` can be added to cart:
- GraphQL queries include `availableForSale` field
- Product cards show "Out of Stock" badge when unavailable
- "Add to Bag" buttons are disabled when `!availableForSale`

**How It Works:**
```typescript
if (!product.availableForSale) {
  return <Button disabled>Out of Stock</Button>;
}
```

---

## Currency & Country

- **Currency**: AUD (Australian Dollars)
- **Country**: AU (Australia)
- **Set at cart creation**: `buyerIdentity: { countryCode: "AU" }`
- **Applied automatically**: Shopify checkout uses this to determine shipping/taxes

---

## QA Checklist

### ✅ Cart Creation
- [ ] Click "Add to Bag" on any product
- [ ] Verify `cart.id` and `checkoutUrl` are saved to localStorage
- [ ] Check console logs for "✅ Added to bag"

### ✅ Cart Persistence
- [ ] Add item to cart
- [ ] Refresh the page
- [ ] Open Mini-Cart → should show the previously added item
- [ ] Verify `localStorage.getItem('hp_cart_id')` exists

### ✅ Buy Now Flow
- [ ] Click "Buy Now" on a product
- [ ] Should immediately redirect to Shopify checkout
- [ ] Verify URL contains `hairpinns.com/cart/c/...` or `femtat-zu.myshopify.com/.../checkouts/...`

### ✅ Mini-Cart Checkout
- [ ] Add item to cart
- [ ] Open Mini-Cart
- [ ] Click "Proceed to Checkout"
- [ ] Should redirect to Shopify checkout

### ✅ Currency & Country
- [ ] Proceed to checkout
- [ ] Verify checkout page shows **AUD** pricing
- [ ] Verify shipping options are for **Australia**

### ✅ Error Handling
- [ ] Try adding an invalid variant ID → should show error toast
- [ ] Try checking out with no internet → should show error toast
- [ ] Verify error messages are user-friendly

### ✅ Analytics (if configured)
- [ ] Add item to cart → check for `add_to_cart` event
- [ ] Click "Checkout" → check for `begin_checkout` event
- [ ] Events should fire to Zapier webhook

---

## Common Issues & Solutions

### Issue: "hairpinns.com refused to connect"
**Cause**: Trying to load Shopify checkout in an iframe (sandbox/preview mode)
**Solution**: The `gotoCheckout()` function handles this by:
1. Attempting `window.top.location.assign()` to break out of iframe
2. Falling back to `window.open()` in a new tab

### Issue: Cart expired or invalid
**Cause**: Cart ID stored in localStorage is stale
**Solution**: Automatic retry logic in `addToBag()`:
1. Detects cart error
2. Clears old cart ID
3. Creates new cart
4. Retries the operation

### Issue: Product shows "Out of Stock"
**Cause**: `availableForSale: false` in Shopify
**Solution**: 
1. Check product in Shopify admin
2. Ensure product is published to the "Storefront API" channel
3. Ensure at least one variant is available

### Issue: Checkout URL missing
**Cause**: API response is missing `checkoutUrl`
**Solution**: 
1. Check Shopify API response format
2. Verify `checkoutUrl` is requested in GraphQL query
3. Ensure cart was created successfully

---

## Testing in Development

### Localhost Testing
```bash
npm run dev
# Open http://localhost:5173
# Add product to cart
# Click "Buy Now" or "Checkout"
# Should redirect to Shopify checkout
```

### Preview/Sandbox Testing
- In preview mode, checkout may open in a new tab due to iframe restrictions
- This is **expected behavior** handled by `gotoCheckout()`

### Production Testing
- Checkout should work seamlessly in production
- No iframe restrictions
- Full redirect to Shopify checkout

---

## Deployment Checklist

Before deploying to production:
- [ ] Verify `projectConfig.shopify.storeUrl` is set to `https://hairpinns.com`
- [ ] Verify `projectConfig.shopify.domain` is set to correct Shopify domain
- [ ] Verify Storefront API token is valid and has correct permissions
- [ ] Test full checkout flow on staging environment
- [ ] Verify analytics events fire correctly
- [ ] Confirm AUD currency and AU country are applied
- [ ] Test error handling and fallback scenarios

---

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify Shopify API credentials in `src/config/projectConfig.ts`
3. Test cart creation manually: `addToBag(variantId, 1)`
4. Check network tab for failed GraphQL requests
5. Contact development team for assistance

---

**Last Updated**: 2025-10-11
**Version**: 1.0
