# Shopify Product Detail Page Integration

## Overview

Product detail pages (`/products/[handle]`) fetch real product data from Shopify, support variant selection, and integrate with cart + checkout flows. All e-commerce events are tracked to Zapier (analytics only, no PII).

---

## Implementation Details

### 1. Product Fetching

**File**: `src/pages/ProductDetail.tsx`

- Uses `getProductByHandle(handle)` to fetch product details
- Shows loading state while fetching
- Displays error state if product doesn't exist
- Sets first available variant as default

### 2. Variant Selection

**Variant Selector**:
- Extracts unique option names (e.g., "Size", "Color") from product variants
- Renders dropdown selector for each option
- Updates `activeVariantId` when user selects options
- Finds matching variant based on selected option combination

**How it works**:
```typescript
// User selects "Size: Large"
handleOptionChange("Size", "Large")
  → Updates selectedOptions state
  → Finds variant where all options match
  → Sets activeVariantId to matching variant
```

### 3. Add to Bag

**Primary CTA**: "Add to Bag" button

**Flow**:
1. Calls `addToBag(activeVariantId, 1)`
2. Updates cart state
3. Opens Mini-Cart drawer
4. Tracks `add_to_cart` event to Zapier

**Zapier Event**:
```json
{
  "event": "add_to_cart",
  "product_id": "gid://shopify/Product/...",
  "title": "Product Name",
  "variant_id": "gid://shopify/ProductVariant/...",
  "price": 29.99,
  "currency": "AUD",
  "quantity": 1
}
```

### 4. Buy Now (Fast Path)

**Secondary CTA**: "Buy Now" button

**Flow**:
1. Calls `addToBag(activeVariantId, 1)` to create/update cart
2. Tracks `add_to_cart` event to Zapier
3. Tracks `begin_checkout` event to Zapier
4. Immediately redirects to `cart.checkoutUrl` (Shopify checkout)

**Zapier Events**:
```json
// Event 1: add_to_cart
{
  "event": "add_to_cart",
  "product_id": "gid://shopify/Product/...",
  "title": "Product Name",
  "variant_id": "gid://shopify/ProductVariant/...",
  "price": 29.99,
  "currency": "AUD",
  "quantity": 1
}

// Event 2: begin_checkout
{
  "event": "begin_checkout",
  "cart_total": 29.99,
  "item_count": 1,
  "currency": "AUD"
}
```

### 5. Mini-Cart Checkout Tracking

**File**: `src/components/cart/MiniCart.tsx`

**"Checkout" button** in Mini-Cart now:
1. Tracks `begin_checkout` event to Zapier
2. Redirects to Shopify checkout

**Zapier Event**:
```json
{
  "event": "begin_checkout",
  "cart_total": 59.98,
  "item_count": 2,
  "currency": "AUD"
}
```

---

## Zapier Event Tracking

**File**: `src/lib/ecommerceTracking.ts`

### `trackAddToCart()`
Tracks when items are added to cart (analytics only, no PII).

**Parameters**:
- `product_id` - Shopify product ID
- `title` - Product name
- `variant_id` - Shopify variant ID
- `price` - Variant price
- `currency` - "AUD"
- `quantity` - Item quantity (default: 1)

### `trackBeginCheckout()`
Tracks when checkout is initiated (analytics only, no PII).

**Parameters**:
- `cart_total` - Total cart value
- `item_count` - Number of items in cart
- `currency` - "AUD"

---

## User Flows

### Flow 1: Add to Bag → Continue Shopping
1. User selects variant options
2. Clicks "Add to Bag"
3. `add_to_cart` event fires to Zapier
4. Mini-Cart opens showing item
5. User clicks "Continue Shopping"
6. User browses more products

### Flow 2: Add to Bag → Checkout
1. User selects variant options
2. Clicks "Add to Bag"
3. `add_to_cart` event fires to Zapier
4. Mini-Cart opens
5. User clicks "Checkout" in Mini-Cart
6. `begin_checkout` event fires to Zapier
7. User redirects to Shopify checkout

### Flow 3: Buy Now (Fast Path)
1. User selects variant options
2. Clicks "Buy Now"
3. `add_to_cart` event fires to Zapier
4. `begin_checkout` event fires to Zapier
5. User immediately redirects to Shopify checkout (no Mini-Cart)

---

## Fallbacks

### Product Fetch Failure
- Shows error message
- "Browse Collections" button to recover

### Add to Bag Failure
- Toast error notification
- After 1.5s delay, redirects to `https://hairpinns.com/products/[handle]`

### Buy Now Failure
- Toast error notification
- After 1.5s delay, redirects to `https://hairpinns.com/products/[handle]`

---

## Key Functions

### `getProductByHandle(handle)`
Fetches product from Shopify Storefront API:
- Product details (title, description, images)
- All variants with options (e.g., Size, Color)
- Pricing (regular + compare-at)
- Availability status

### `addToBag(variantId, quantity)`
Adds item to Shopify cart:
- Creates new cart if none exists
- Adds to existing cart if cart ID in localStorage
- Returns cart object with checkout URL

### `getCheckoutUrl(cart)`
Extracts checkout URL from cart object.

### `trackAddToCart(params)`
Fires `add_to_cart` event to Zapier webhook.

### `trackBeginCheckout(params)`
Fires `begin_checkout` event to Zapier webhook.

---

## Testing Checklist

- [ ] Product loads from Shopify
- [ ] Variant selector updates active variant
- [ ] "Add to Bag" adds correct variant to cart
- [ ] Mini-Cart opens after add to bag
- [ ] "Buy Now" redirects to checkout
- [ ] `add_to_cart` event fires with correct data
- [ ] `begin_checkout` event fires with correct cart totals
- [ ] Fallback redirects work when API fails
- [ ] Out of stock products disable buttons

---

## Next Steps

1. **Add quantity selector** to PDP (currently hardcoded to 1)
2. **Add product recommendations** ("You may also like")
3. **Add reviews section** for social proof
4. **Enhance tracking** with more granular events
5. **Add cart persistence** across sessions
