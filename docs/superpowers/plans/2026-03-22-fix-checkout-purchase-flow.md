# Fix Checkout & Purchase Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all purchase-blocking bugs so every product in the Shopify store can be purchased by customers.

**Architecture:** The site uses a React frontend (Vite + Tailwind) that talks to a Netlify serverless function (`checkout.js`) for all cart operations. The function calls Shopify Storefront API via GraphQL. The critical bug is that `checkout.js` uses the deprecated `priceV2` field in GraphQL fragments while the API version is `2025-01` (which may have removed it). Secondary fixes address products being hidden when they lack images, cart recovery on expiry, retry logic on checkout calls, and unavailable variant handling.

**Tech Stack:** React 18, TypeScript, Vite 7, Netlify Functions, Shopify Storefront API (GraphQL), Tailwind CSS

---

## CRITICAL BUG ANALYSIS

The Netlify function `checkout.js` uses `priceV2` in ALL cart mutation response fragments (lines 80, 150, 215). The Shopify API version is `2025-01`. In GraphQL, requesting a field that doesn't exist in the schema causes the **entire query to fail**. This means:

- `cartCreate` fails → customers can't add items to cart
- `cartLinesAdd` fails → customers can't add more items
- `cartLinesRemove` fails → customers can't remove items

The client-side `shopify.ts` correctly uses `price` (not `priceV2`), so product pages load fine — but the moment a customer clicks "Add to Bag" or "Buy Now", the server call fails.

---

### Task 1: Fix `priceV2` → `price` in checkout.js (CRITICAL)

**Files:**
- Modify: `netlify/functions/checkout.js:80-81` (cartCreate fragment)
- Modify: `netlify/functions/checkout.js:149-153` (cartLinesAdd fragment)
- Modify: `netlify/functions/checkout.js:214-218` (cartLinesRemove fragment)

- [ ] **Step 1: Fix `cartCreate` mutation fragment**

In `netlify/functions/checkout.js`, replace the `priceV2` field in the `cartCreate` function's GraphQL fragment:

```js
// Line 80-81: Change from:
priceV2 {
  amount
  currencyCode
}

// To:
price {
  amount
  currencyCode
}
```

- [ ] **Step 2: Fix `cartLinesAdd` mutation fragment**

Same fix in the `cartLinesAdd` function:

```js
// Lines 149-153: Change from:
priceV2 {
  amount
  currencyCode
}

// To:
price {
  amount
  currencyCode
}
```

- [ ] **Step 3: Fix `cartLinesRemove` mutation fragment**

Same fix in the `cartLinesRemove` function:

```js
// Lines 214-218: Change from:
priceV2 {
  amount
  currencyCode
}

// To:
price {
  amount
  currencyCode
}
```

- [ ] **Step 4: Verify the fix locally**

Run the Netlify dev server and test adding a product to cart:

```bash
cd HairPinns && npx netlify dev
```

Open the site, navigate to any product, click "Add to Bag". Confirm:
- No 500 error in the Netlify function logs
- Cart drawer opens with the added product
- "Buy Now" redirects to Shopify checkout

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/checkout.js
git commit -m "fix: replace deprecated priceV2 with price in checkout function

The Shopify Storefront API 2025-01 removed the priceV2 field.
All cart mutations (create, add, remove) were failing because the
GraphQL fragments requested a non-existent field, causing the entire
query to error. This broke all purchases site-wide."
```

---

### Task 2: Remove `priceV2` fallbacks from client-side code

**Files:**
- Modify: `src/pages/ProductDetail.tsx:184` (handleAddToBag)
- Modify: `src/pages/ProductDetail.tsx:237` (handleBuyNow)
- Modify: `src/pages/ProductDetail.tsx:351-353` (price/compareAtPrice calculation)
- Modify: `src/components/cart/MiniCart.tsx:231` (cart line item price)

- [ ] **Step 1: Clean up ProductDetail.tsx price references**

In `src/pages/ProductDetail.tsx`:

Line 184 — change:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || activeVariant.priceV2?.amount || "0") : 0;
```
to:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : 0;
```

Line 237 — same change:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || activeVariant.priceV2?.amount || "0") : 0;
```
to:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : 0;
```

Lines 351-353 — change:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || activeVariant.priceV2?.amount || "0") : parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
const compareAtPrice = activeVariant?.compareAtPrice?.amount || activeVariant?.compareAtPriceV2?.amount
  ? parseFloat(activeVariant.compareAtPrice?.amount || activeVariant.compareAtPriceV2?.amount || "0")
  : null;
```
to:
```ts
const price = activeVariant ? parseFloat(activeVariant.price?.amount || "0") : parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
const compareAtPrice = activeVariant?.compareAtPrice?.amount
  ? parseFloat(activeVariant.compareAtPrice.amount)
  : null;
```

Line 411 — change:
```ts
currency: activeVariant?.price?.currencyCode || activeVariant?.priceV2?.currencyCode || "AUD",
```
to:
```ts
currency: activeVariant?.price?.currencyCode || "AUD",
```

- [ ] **Step 2: Clean up MiniCart.tsx price reference**

In `src/components/cart/MiniCart.tsx`, line 231 — change:
```ts
const price = parseFloat(merch?.price?.amount || merch?.priceV2?.amount || "0");
const currency = merch?.price?.currencyCode || merch?.priceV2?.currencyCode || "AUD";
```
to:
```ts
const price = parseFloat(merch?.price?.amount || "0");
const currency = merch?.price?.currencyCode || "AUD";
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductDetail.tsx src/components/cart/MiniCart.tsx
git commit -m "fix: remove deprecated priceV2 fallbacks from client code

Aligns client-side code with Shopify API 2025-01 which uses price
instead of priceV2. The fallbacks were dead code since the API
no longer returns priceV2 fields."
```

---

### Task 3: Allow products without images to display

**Files:**
- Modify: `src/pages/ProductDetail.tsx:68-77` (product validation)

- [ ] **Step 1: Change validation to allow imageless products**

In `src/pages/ProductDetail.tsx`, lines 68-77 — change:
```ts
if (productData) {
  // Validate product has required structure - treat malformed data as not found
  const hasImages = productData.images?.edges?.length > 0;
  const hasVariants = productData.variants?.edges?.length > 0;
  if (!hasImages || !hasVariants) {
    console.warn("Product data malformed (missing images or variants):", productData.handle);
    setProduct(null);
    setLoading(false);
    return;
  }

  setProduct(productData);
```
to:
```ts
if (productData) {
  // Products must have at least one variant to be purchasable
  const hasVariants = productData.variants?.edges?.length > 0;
  if (!hasVariants) {
    console.warn("Product has no variants (not purchasable):", productData.handle);
    setProduct(null);
    setLoading(false);
    return;
  }

  setProduct(productData);
```

- [ ] **Step 2: Verify the product page renders with placeholder when no images**

The existing code at line 492 already handles missing images with `currentImg?.url || "/placeholder.svg"`. With the validation removed, products without Shopify images will now display with the placeholder instead of showing "Product not found".

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductDetail.tsx
git commit -m "fix: display products without images instead of showing not found

Products that have variants but no images are still purchasable.
The page already handles missing images with placeholder.svg fallback,
so the validation was unnecessarily hiding valid products."
```

---

### Task 4: Add retry logic to Add to Bag / Buy Now

**Files:**
- Modify: `src/pages/ProductDetail.tsx:162-173` (handleAddToBag fetch)
- Modify: `src/pages/ProductDetail.tsx:264-280` (handleBuyNow fetch)

- [ ] **Step 1: Add retry wrapper to handleAddToBag**

In `src/pages/ProductDetail.tsx`, replace the fetch call in `handleAddToBag` (lines 162-173):

```ts
// Replace the single fetch with retry logic
const existingCartId = getCartId();
const body = {
  lines: [{ merchandiseId: activeVariantId, quantity: 1 }],
  ...(existingCartId && { cartId: existingCartId }),
};

let response: Response | null = null;
for (let attempt = 0; attempt < 2; attempt++) {
  response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (response.ok) break;
  // If cart ID is stale, retry without it
  if (attempt === 0 && existingCartId) {
    body.cartId = undefined;
    localStorage.removeItem('hp_cart_id');
  }
}

if (!response || !response.ok) {
  throw new Error('Failed to add to cart');
}
```

- [ ] **Step 2: Add retry wrapper to handleBuyNow**

In `src/pages/ProductDetail.tsx`, apply the same pattern to `handleBuyNow` (lines 264-280):

```ts
const existingCartId = getCartId();
const body: any = {
  lines: [{ merchandiseId: activeVariantId, quantity: 1 }],
  ...(existingCartId && { cartId: existingCartId }),
};

let response: Response | null = null;
for (let attempt = 0; attempt < 2; attempt++) {
  response = await fetch('/api/checkout?redirect=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (response.ok || response.redirected || response.status === 303) break;
  // If cart ID is stale, retry without it
  if (attempt === 0 && existingCartId) {
    body.cartId = undefined;
    localStorage.removeItem('hp_cart_id');
  }
}

if (!response) {
  throw new Error('Checkout failed');
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductDetail.tsx
git commit -m "fix: add retry with stale cart recovery for add-to-bag and buy-now

If the first attempt fails and there's a stored cart ID, retry
without it (creating a fresh cart). This handles expired carts
gracefully instead of showing an error."
```

---

### Task 5: Add retry logic to MiniCart cart fetch

**Files:**
- Modify: `src/components/cart/MiniCart.tsx:33-56` (cart fetch useEffect)

- [ ] **Step 1: Add retry before clearing cart**

In `src/components/cart/MiniCart.tsx`, replace the cart fetch logic (lines 33-56):

```ts
useEffect(() => {
  if (open && cartId) {
    setCartLoading(true);
    setCartError(null);

    const fetchCart = async () => {
      try {
        let data = await getCart(cartId);
        if (!data) {
          // Retry once - Shopify carts can be temporarily unavailable
          await new Promise(r => setTimeout(r, 1000));
          data = await getCart(cartId);
        }
        if (data) {
          setCart(data);
        } else {
          setCartError("Your cart has expired. Please add items again.");
          setCart(null);
          clearCartId();
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartError("Could not load cart. Please try again.");
        setCart(null);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  } else {
    setCart(null);
    setCartError(null);
  }
}, [open, cartId]);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cart/MiniCart.tsx
git commit -m "fix: retry cart fetch before clearing expired cart

Adds a single retry with 1s delay before declaring a cart expired.
Prevents unnecessary cart loss from transient network issues."
```

---

### Task 6: Show unavailable variant state instead of silent fallback

**Files:**
- Modify: `src/pages/ProductDetail.tsx:345-355` (variant resolution)
- Modify: `src/pages/ProductDetail.tsx:619-628` (Add to Bag button)

- [ ] **Step 1: Add explicit unavailable state**

In `src/pages/ProductDetail.tsx`, after the variant resolution block (around line 345), change:

```ts
const variantEdges = product.variants?.edges ?? [];
let activeVariant = variantEdges.find((e: any) => e.node.id === activeVariantId)?.node;
if (!activeVariant && variantEdges.length > 0) {
  activeVariant = variantEdges[0]?.node;
}
```
to:
```ts
const variantEdges = product.variants?.edges ?? [];
let activeVariant = variantEdges.find((e: any) => e.node.id === activeVariantId)?.node;
if (!activeVariant && variantEdges.length > 0) {
  // Selected variant no longer exists - reset to first available
  const firstAvailable = variantEdges.find((e: any) => e.node.availableForSale)?.node || variantEdges[0]?.node;
  activeVariant = firstAvailable;
  if (firstAvailable) {
    setActiveVariantId(firstAvailable.id);
  }
}
```

- [ ] **Step 2: Update button disabled state**

The existing code at line 355 already has:
```ts
const isAvailable = activeVariant?.availableForSale ?? false;
```

And the button at line 624 already uses `disabled={!isAvailable || addingToCart}`.

Verify the "Add to Bag" button shows disabled state with appropriate messaging when `isAvailable` is false. The current implementation already shows the button as disabled — this is sufficient.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductDetail.tsx
git commit -m "fix: prefer first available variant instead of silent fallback to first

When selected variant doesn't match any variant (e.g., removed from
Shopify), fall back to the first available-for-sale variant rather
than the first variant which may be out of stock."
```

---

## Verification Checklist

After all tasks are complete, verify:

- [ ] Navigate to any product page → page loads (even if product has no images)
- [ ] Click "Add to Bag" → item appears in mini cart drawer
- [ ] Click "Buy Now" → redirects to Shopify checkout
- [ ] Open mini cart → click "Proceed to Checkout" → redirects to Shopify checkout
- [ ] Clear `hp_cart_id` from localStorage, add item → works (fresh cart)
- [ ] Set `hp_cart_id` to invalid value, add item → recovers gracefully
- [ ] Product with multiple variants → switching variants works, correct price shown
- [ ] Out-of-stock variant → "Add to Bag" button disabled
