# Conversion Patterns Implementation Guide

This document outlines all conversion-focused features implemented across the Hair Pinns e-commerce site.

## 1. Sticky Elements

### Sticky Add-to-Cart (Mobile PDP)
**Component**: `src/components/conversion/StickyAddToCart.tsx`

**Usage**:
```tsx
<StickyAddToCart
  productTitle={product.title}
  price={product.price}
  inStock={product.inStock}
  onAddToCart={handleAddToCart}
  threshold={500} // Scroll threshold in pixels (optional, default: 500)
/>
```

**Features**:
- Appears on mobile only after user scrolls past 500px
- Shows product title, price, and Add to Cart button
- Smooth slide-in animation from bottom
- Respects stock status

**Implementation**: Added to `src/pages/ProductDetail.tsx`

### Sticky Book Appointment (Services Page)
**Component**: `src/components/conversion/StickyBooking.tsx`

**Usage**:
```tsx
<StickyBooking threshold={300} />
```

**Features**:
- Mobile-only booking button that sticks to bottom
- Appears after scrolling past threshold
- Direct link to Fresha booking system

**Implementation**: Added to `src/pages/Services.tsx`

---

## 2. Free Shipping Threshold Bar

**Component**: `src/components/conversion/FreeShippingBar.tsx`

**Usage** (to be added to cart drawer):
```tsx
<FreeShippingBar 
  subtotal={cartSubtotal} 
  threshold={100} // Default: $100 AUD
/>
```

**Features**:
- Dynamic progress bar showing progress toward free shipping
- Calculates remaining amount needed
- Success state when threshold is reached
- Customizable threshold value

**Visual States**:
- In progress: Shows remaining amount and progress bar
- Qualified: Green success message with checkmark

---

## 3. Product Badges

**Component**: `src/components/conversion/ProductBadges.tsx`

**Usage**:
```tsx
<ProductBadges
  stock={7}           // Current stock level
  soldLast24h={12}    // Units sold in last 24 hours
  lowStockThreshold={5}      // Default: 5
  fastMovingThreshold={10}   // Default: 10
/>
```

**Badge Types**:
1. **Low Stock**: Shows when `stock <= lowStockThreshold`
   - Red/destructive variant
   - "Only X left" message
   
2. **Fast Moving**: Shows when `soldLast24h >= fastMovingThreshold`
   - Orange variant
   - "X+ sold today" message

**Truth Rules**:
- Only displays badges with real inventory/sales data
- Never shows fake urgency
- Both badges can appear simultaneously if applicable

**Implementation**:
- Product Detail Page: Below product title
- Collection Grid: Top-right corner of product cards

---

## 4. Trust Strip

**Component**: `src/components/conversion/TrustStrip.tsx`

**Usage**:
```tsx
<TrustStrip />
```

**Features**:
- Three trust signals with icons:
  - 🚚 AU shipping
  - 🏆 Salon-approved
  - 🔒 Secure checkout
- Responsive grid layout
- Placed immediately below header

**Implementation**: Added to:
- `src/pages/ProductDetail.tsx`
- `src/pages/CollectionDetail.tsx`
- `src/pages/Services.tsx`

---

## 5. Exit-Intent Modal

**Component**: `src/components/conversion/ExitIntentModal.tsx`

**Usage**:
```tsx
<ExitIntentModal enabled={true} />
```

**Features**:
- Detects mouse leaving viewport from top
- Shows only once per session
- Collects email + phone
- Submits to Zapier with `form_name="exit_intent_offer"`
- Fires tracking events:
  - `exit_intent_seen` - When modal appears
  - `exit_intent_submitted` - When form is submitted

**Offer Details**:
- "Grab Jena's 7-Day Frizz-Free Plan + 5% off your first order"
- Lead magnet slug: `exit_intent_frizz7`
- Includes marketing consent checkbox

**Zapier Integration**:
```json
{
  "form_name": "exit_intent_offer",
  "email": "user@example.com",
  "phone": "0412345678",
  "lead_magnet_title": "7-Day Frizz-Free Plan + 5% off",
  "lead_magnet_slug": "exit_intent_frizz7",
  "consent_marketing": true,
  "context": { ... },
  "session": { ... },
  "first_touch": { ... }
}
```

**GHL Integration**:
Zap applies:
- Tag: `exit_intent_frizz7`
- 5% discount code via GHL workflow

**Implementation**: Added to:
- `src/pages/ProductDetail.tsx`
- `src/pages/CollectionDetail.tsx`

---

## 6. Post-Purchase Module

**Component**: `src/components/conversion/PostPurchaseModule.tsx`

**Usage**:
```tsx
<PostPurchaseModule 
  pairsWith={[
    { title: "Heat Defense Spray", price: 28.00, handle: "heat-defense" },
    { title: "Hair Oil", price: 35.00, handle: "hair-oil" }
  ]}
/>
```

**Features**:

### Education Section
- Encourages users to view care guide
- Includes maintenance tips and styling secrets
- CTA to external guide (can link to blog post)

### "Pairs Well With" Recommendations
- 3-column responsive grid
- Product cards with images, titles, prices
- Deep links to product pages
- Default products provided if none specified

**Implementation**: Added to `src/pages/OrderConfirmation.tsx`

---

## 7. Event Tracking

All events are sent to Zapier via `hpCapture.trackEvent()` and include:
- `event_name`
- `source_page`
- `client_id`
- UTM parameters (if present)
- Session data
- First-touch attribution

### New Events

#### exit_intent_seen
Fired when exit-intent modal appears.

```typescript
await hpCapture.trackEvent("exit_intent_seen", {
  source_page: window.location.pathname,
});
```

#### exit_intent_submitted
Fired when user submits exit-intent form (handled by `hpCapture.postToZapier` with `event: "exit_intent_submitted"`).

---

## Implementation Checklist

### Product Detail Page (PDP)
- ✅ Sticky Add-to-Cart (mobile)
- ✅ Trust Strip
- ✅ Exit-Intent Modal
- ✅ Product Badges (low stock, fast moving)

### Collection Pages
- ✅ Trust Strip
- ✅ Exit-Intent Modal
- ✅ Product Badges in grid

### Services Page
- ✅ Sticky Book Appointment (mobile)
- ✅ Trust Strip

### Order Confirmation
- ✅ Post-Purchase Module (education + pairs well with)

### Cart Drawer (TODO)
- ⚠️ **Cart drawer component needs to be created**
- ⚠️ Free Shipping Threshold Bar (ready to integrate)

---

## Design Tokens Used

All components use semantic design tokens from `src/index.css`:
- `--brand-500` - Primary CTA color
- `--success-fg` / `--success-bg` - Success states
- `--muted-foreground` - Secondary text
- `--card` / `--border` - Card backgrounds and borders

---

## Mobile-First Approach

All conversion elements are optimized for mobile:
- Sticky elements appear only on mobile (`md:hidden`)
- Touch-friendly button sizes (min height 44px)
- Responsive spacing and typography

---

## Analytics & Tracking

### Event Flow

1. **Page Load** → Session established (via `hpCapture`)
2. **Exit Intent** → `exit_intent_seen` event
3. **Form Submit** → `exit_intent_submitted` + Zapier POST
4. **Add to Cart** → `add_to_cart` event (already implemented)
5. **Purchase** → `purchase_client` event (already implemented)

### Non-PII Events
All tracking events exclude personally identifiable information (PII) in the event payload itself. PII is only sent via form submissions (`hpCapture.postToZapier`).

---

## Future Enhancements

1. **Cart Drawer**: Create cart drawer UI with FreeShippingBar integrated
2. **A/B Testing**: Test different exit-intent offers and thresholds
3. **Dynamic Thresholds**: Adjust free shipping threshold by campaign
4. **Product Recommendations**: ML-powered "pairs well with" suggestions
5. **Urgency Timers**: Countdown timers for limited-time offers (truthful only)

---

## Support & Questions

For implementation questions or custom conversion patterns, refer to:
- `GHL_FIELD_MAPPING.md` - Form data mapping
- `ZAPIER_IMPLEMENTATION_SUMMARY.md` - Zapier integration details
- `hpCapture` library - `src/lib/hpCapture.ts`
