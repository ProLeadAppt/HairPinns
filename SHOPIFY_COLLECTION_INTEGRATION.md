# Shopify Collection Integration

## Overview

Collection pages (`/collections/[handle]`) now fetch real product data from Shopify using the Storefront API and provide "Add to Bag" functionality with Mini-Cart integration.

---

## Implementation Details

### 1. Collection Fetching

**File**: `src/pages/CollectionDetail.tsx`

- Uses `getCollectionByHandle(handle)` to fetch collection details and products
- Shows loading state while fetching
- Displays error state if collection doesn't exist
- Maps Shopify product data to internal format

### 2. Add to Bag Functionality

**File**: `src/lib/cartManagement.ts`

#### `addToBag(variantId, quantity)`
- Creates a new cart if none exists
- Adds items to existing cart
- Stores cart ID in localStorage (`hairpinns_cart_id`)
- Handles expired/invalid carts automatically
- Returns cart object with checkout URL

**Usage**:
```typescript
const cart = await addToBag(variantId, 1);
// Cart contains: { id, checkoutUrl, lines, cost }
```

### 3. Mini-Cart Component

**File**: `src/components/cart/MiniCart.tsx`

- Slide-in drawer from right side
- Shows cart items with product details
- Displays subtotal
- "Checkout" button → redirects to Shopify checkout
- "Continue Shopping" button → closes drawer
- Empty state with icon

**Props**:
- `isOpen: boolean` - Controls drawer visibility
- `onClose: () => void` - Close handler
- `cart: Cart | null` - Cart data from addToBag

### 4. Product Cards

Each product card displays:
- Product image
- Title
- Price
- "Out of Stock" badge if unavailable
- **Primary CTA**: "Add to Bag" button
  - Calls `handleAddToBag(productHandle, variantId)`
  - Shows "Adding..." loading state
  - Disabled if out of stock
  - Opens Mini-Cart on success
- **Secondary CTA**: "View Product" link
  - Links to `/products/[handle]`
  - Fallback: `https://hairpinns.com/products/[handle]`

---

## User Flow

1. **User visits collection page** → Collection loads from Shopify
2. **User clicks "Add to Bag"**
   - First variant of product is used
   - Cart is created (or updated if exists)
   - Toast notification shows success
   - Mini-Cart drawer opens
3. **Mini-Cart opens**
   - Shows items in cart
   - Displays subtotal
   - User can continue shopping or checkout
4. **Checkout** → User is redirected to Shopify checkout page

---

## Fallbacks

### Add to Bag Failure
If `addToBag()` fails:
- Toast shows error message
- After 1.5s delay, redirects to `https://hairpinns.com/products/[handle]`

### View Product
- Primary: Internal route `/products/[handle]`
- Fallback: External URL `https://hairpinns.com/products/[handle]`

---

## Filtering & Sorting

Currently supports:
- **Price Range**: All, Under $80, $80-$90, Over $90
- **Sort By**: Price Low to High, Price High to Low

**Note**: Hair Goals filtering was removed as it requires product metafields/tags from Shopify.

---

## localStorage Keys

- `hairpinns_cart_id`: Stores Shopify cart ID for persistence

---

## Known Limitations

1. **First variant used**: Currently uses a placeholder for variant ID. In production, need to:
   - Fetch full product details with variants
   - Select appropriate variant based on options
   
2. **Product images in cart**: Mini-Cart shows placeholder for product images. Need to:
   - Store image URLs when adding to cart
   - Pass images to Mini-Cart component

3. **Cart persistence**: Cart ID expires after ~2 weeks (Shopify default). Library handles this by creating new cart if expired.

---

## Next Steps

1. **Implement Product Detail Page** (`/products/[handle]`)
   - Fetch full product details
   - Allow variant selection
   - Use proper variant IDs for add to cart
   
2. **Enhance Mini-Cart**
   - Add product images
   - Add quantity update controls
   - Add remove item functionality
   
3. **Add cart state management**
   - Context provider for global cart state
   - Persist cart items count in header
   
4. **Tracking**
   - Fire `add_to_cart` event to Zapier/analytics
   - Track cart abandonment
