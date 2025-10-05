# MiniCartDrawer Implementation

## Overview

Replaced the previous MiniCart component with a simpler MiniCartDrawer that directly fetches cart data using `fetchShopify` and tracks checkout events.

---

## Component Details

**File**: `src/components/MiniCartDrawer.tsx`

### Features

1. **Direct Cart Fetching**: Uses `fetchShopify` to query cart data directly
2. **Tracks Checkout**: Fires `begin_checkout` event to Zapier when user clicks "Checkout"
3. **Simple UI**: Slide-in drawer from right with cart items, subtotal, and checkout button
4. **Design System**: Uses semantic tokens from `index.css` for styling

### Props

```typescript
{
  open: boolean;        // Controls drawer visibility
  onClose: () => void;  // Close handler
  cartId: string;       // Cart ID from localStorage ("hp_cart_id")
}
```

### GraphQL Query

Fetches cart data including:
- `checkoutUrl` - Shopify checkout URL
- `cost.subtotalAmount` - Cart subtotal
- `lines` - Cart items with product/variant details

---

## Usage

### Product Detail Page

```typescript
const [miniCartOpen, setMiniCartOpen] = useState(false);

// After addToBag succeeds
setMiniCartOpen(true);

// Render component
<MiniCartDrawer
  open={miniCartOpen}
  onClose={() => setMiniCartOpen(false)}
  cartId={getCartId() || ""}
/>
```

### Collection Page

Same implementation - after addToBag, open the drawer.

---

## Tracking

### begin_checkout Event

Fires when user clicks "Checkout" button in drawer:

```json
{
  "event": "begin_checkout",
  "cart_total": 89.99,
  "item_count": 3,
  "currency": "AUD"
}
```

**File**: `src/lib/ecommerceTracking.ts`
- `trackBeginCheckout()` handles the Zapier webhook call

---

## localStorage Key

**Key**: `hp_cart_id`
- Stores Shopify cart ID for persistence
- Changed from `hairpinns_cart_id` to `hp_cart_id` to match implementation

---

## User Flow

1. User adds item to cart
2. `addToBag()` creates/updates cart
3. Cart ID saved to `localStorage.getItem("hp_cart_id")`
4. MiniCartDrawer opens
5. Component fetches cart data via GraphQL
6. Displays items and subtotal
7. User clicks "Checkout"
8. `begin_checkout` event fires to Zapier
9. User redirects to Shopify checkout

---

## Styling

Uses design system tokens:
- `bg-card` - Drawer background
- `text-heading` - Header text
- `text-foreground` - Body text
- `text-muted-foreground` - Secondary text
- `border-border` - Border colors
- `bg-brand-500` - Primary button background

---

## Files Updated

1. **Created**: `src/components/MiniCartDrawer.tsx`
2. **Updated**: `src/pages/ProductDetail.tsx` - Use MiniCartDrawer
3. **Updated**: `src/pages/CollectionDetail.tsx` - Use MiniCartDrawer
4. **Updated**: `src/lib/cartManagement.ts` - Changed localStorage key to `hp_cart_id`
5. **Deprecated**: `src/components/cart/MiniCart.tsx` - No longer used

---

## Key Differences from Previous Implementation

| Feature | Old MiniCart | New MiniCartDrawer |
|---------|-------------|-------------------|
| Data source | Props (cart object) | Direct GraphQL query |
| Checkout tracking | In cart component | In drawer component |
| Styling | Complex with cn() | Simple semantic tokens |
| State management | External cart state | Fetches own data |
| localStorage key | `hairpinns_cart_id` | `hp_cart_id` |

---

## Testing

- [ ] MiniCartDrawer opens after add to bag
- [ ] Cart items display correctly
- [ ] Subtotal calculates correctly
- [ ] "Checkout" button fires `begin_checkout` event
- [ ] User redirects to Shopify checkout
- [ ] Drawer closes when "Close" is clicked
- [ ] Empty state shows when no items
