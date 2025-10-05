# E-Commerce Event Tracking for Zapier

## Overview

Non-blocking behavioral event tracking for Hair Pinns e-commerce actions. These events **do not collect PII**, only anonymous behavioral data for analytics and remarketing.

## Webhook URL

**Zapier Catch Hook**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

All events are sent to this endpoint via the `hpCapture` utility.

## Events

### 1. Add to Cart

**Event Name**: `add_to_cart`

**Triggered**: When user clicks "Add to Cart" button on product detail page

**Payload Example**:
```json
{
  "event_name": "add_to_cart",
  "product_id": "hydrate-restore-pack",
  "product_title": "Hydrate & Restore Pack",
  "price": 89.00,
  "variant": "default",
  "quantity": 1,
  "currency": "AUD",
  "page_url": "https://hairpinns.com.au/products/hydrate-restore-pack",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "instagram",
  "utm_campaign": "winter_sale",
  "gclid": "",
  "fbclid": "abc123",
  "referrer": "https://instagram.com/hairpinns"
}
```

**Fields**:
- `event_name` (string): Always "add_to_cart"
- `product_id` (string): Product handle/slug
- `product_title` (string): Human-readable product name
- `price` (number): Unit price in AUD
- `variant` (string): Product variant (default: "default")
- `quantity` (number): Number of items added
- `currency` (string): Always "AUD"
- Plus all standard session fields (client_id, UTMs, referrer, etc.)

---

### 2. Begin Checkout

**Event Name**: `begin_checkout`

**Triggered**: When user initiates checkout process

**Payload Example**:
```json
{
  "event_name": "begin_checkout",
  "cart_line_items": [
    {
      "product_id": "hydrate-restore-pack",
      "product_title": "Hydrate & Restore Pack",
      "quantity": 1,
      "price": 89.00,
      "line_total": 89.00
    },
    {
      "product_id": "heat-defense-spray",
      "product_title": "Heat Defense Spray",
      "quantity": 2,
      "price": 28.00,
      "line_total": 56.00
    }
  ],
  "cart_total": 145.00,
  "cart_count": 3,
  "currency": "AUD",
  "page_url": "https://hairpinns.com.au/cart",
  "timestamp": "2025-01-15T14:35:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "utm_source": "google",
  "utm_campaign": "brand_search",
  "gclid": "xyz789",
  "referrer": "https://google.com"
}
```

**Fields**:
- `event_name` (string): Always "begin_checkout"
- `cart_line_items` (array): All items in cart with quantities and prices
- `cart_total` (number): Total cart value in AUD
- `cart_count` (number): Total number of items in cart
- `currency` (string): Always "AUD"
- Plus all standard session fields

---

### 3. View Product (Optional)

**Event Name**: `view_product`

**Triggered**: When user lands on product detail page

**Payload Example**:
```json
{
  "event_name": "view_product",
  "product_id": "hydrate-restore-pack",
  "product_title": "Hydrate & Restore Pack",
  "price": 89.00,
  "currency": "AUD",
  "page_url": "https://hairpinns.com.au/products/hydrate-restore-pack",
  "timestamp": "2025-01-15T14:28:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Implementation

### Add to Cart Tracking

Implemented in `src/pages/ProductDetail.tsx`:

```typescript
const handleAddToCart = async () => {
  // Fire non-blocking Zapier event
  const trackAddToCart = async () => {
    try {
      const { hpCapture } = await import("@/lib/hpCapture");
      
      await hpCapture.trackEvent("add_to_cart", {
        product_id: handle,
        product_title: product.title,
        price: product.price,
        variant: "default",
        quantity: quantity,
        currency: "AUD",
      });
    } catch (error) {
      console.error("Failed to track add_to_cart:", error);
    }
  };
  
  // Fire tracking in background (non-blocking)
  trackAddToCart();
  
  // Immediate user feedback
  toast({ title: "Added to cart!" });
};
```

### Begin Checkout Tracking

Use the `CheckoutButton` component:

```tsx
import CheckoutButton from "@/components/cart/CheckoutButton";

<CheckoutButton
  cartItems={[
    {
      product_id: "hydrate-restore-pack",
      product_title: "Hydrate & Restore Pack",
      price: 89.00,
      quantity: 1,
      currency: "AUD"
    }
  ]}
  cartTotal={89.00}
  onCheckout={() => {
    // Navigate to checkout or open cart drawer
    window.location.href = "/checkout";
  }}
/>
```

Or use the utility directly:

```typescript
import { trackBeginCheckout } from "@/lib/cartTracking";

const handleBeginCheckout = async () => {
  await trackBeginCheckout(cartItems, cartTotal);
  // Then proceed with checkout flow
};
```

## Zapier Workflow Setup

### Path A: Analytics Sheet (Optional)

**Action**: Google Sheets - Create Spreadsheet Row

**Mapping**:
- Column A: `{{timestamp}}`
- Column B: `{{event_name}}`
- Column C: `{{client_id}}`
- Column D: `{{product_id}}` (for add_to_cart)
- Column E: `{{product_title}}` (for add_to_cart)
- Column F: `{{cart_total}}` (for begin_checkout)
- Column G: `{{utm_source}}`
- Column H: `{{utm_campaign}}`
- Column I: `{{referrer}}`

**Use Case**: Historical analytics, campaign performance tracking

---

### Path B: GoHighLevel Anonymous Activity (Optional)

**Action**: Webhooks by Zapier - Custom Request

**URL**: Your GHL custom endpoint
```
POST https://services.leadconnectorhq.com/hooks/YOUR_CUSTOM_ENDPOINT
```

**Body**:
```json
{
  "client_id": "{{client_id}}",
  "event_type": "{{event_name}}",
  "event_data": {
    "product_id": "{{product_id}}",
    "product_title": "{{product_title}}",
    "price": "{{price}}",
    "cart_total": "{{cart_total}}",
    "quantity": "{{quantity}}"
  },
  "attribution": {
    "utm_source": "{{utm_source}}",
    "utm_campaign": "{{utm_campaign}}",
    "referrer": "{{referrer}}"
  },
  "timestamp": "{{timestamp}}"
}
```

**Use Case**: 
- Track anonymous visitor behavior
- Trigger remarketing campaigns when client_id later converts to known contact
- Build audience segments based on browsing behavior

---

### Path C: Facebook Conversions API (Advanced)

**Action**: Facebook Conversions - Send Browser Event

**Event Name**: Based on event_name
- `add_to_cart` → `AddToCart`
- `begin_checkout` → `InitiateCheckout`

**Event Data**:
- `content_ids`: `["{{product_id}}"]`
- `content_type`: `product`
- `value`: `{{price}}` or `{{cart_total}}`
- `currency`: `AUD`

**Custom Data**:
- `client_user_agent`: From page_url parsing
- `fbp`: `{{fbclid}}` (if present)
- `event_source_url`: `{{page_url}}`

**Use Case**: 
- Improve Facebook Ads attribution
- Build remarketing audiences (cart abandoners, product viewers)
- Optimize for conversions

---

## Privacy & Compliance

### What We Track
✅ Anonymous behavioral data (add to cart, checkout)
✅ Product information (ID, title, price)
✅ Session identifiers (client_id, UTMs)
✅ Referrer and page URL

### What We DON'T Track
❌ Names, emails, phone numbers (not included in these events)
❌ Payment information
❌ Personal addresses
❌ Credit card data

### GDPR Compliance
- Events use anonymous `client_id` (not tied to PII)
- Users can clear localStorage to reset client_id
- No cross-site tracking cookies
- UTM parameters captured only from current session
- Compliant with AU/NZ privacy laws

## Testing

### Test Add to Cart Event

1. Navigate to any product page
2. Click "Add to Cart"
3. Check browser console for `[hpCapture]` logs
4. Verify in Zapier task history:
   - Event name = "add_to_cart"
   - product_id, product_title, price present
   - Session data included

### Test Begin Checkout Event

1. Add items to cart
2. Click "Proceed to Checkout"
3. Check browser console for `[hpCapture]` logs
4. Verify in Zapier task history:
   - Event name = "begin_checkout"
   - cart_line_items array populated
   - cart_total calculated correctly

### Debug Failed Events

Check error log in browser console:
```javascript
window.__hpErrors
```

This shows any failed tracking attempts with full payload details.

## Performance

- **Non-blocking**: Events fire asynchronously, don't delay page interactions
- **Silent failures**: Errors logged but don't impact user experience
- **Retry logic**: hpCapture utility includes 3 retry attempts (1s, 3s, 10s)
- **No PII**: Lightweight payloads, no sensitive data

## Future Enhancements

Consider adding:
- `purchase` event when order completes
- `remove_from_cart` event
- `view_cart` event
- `add_to_wishlist` event
- Product category and collection tracking
- Discount/coupon code tracking
