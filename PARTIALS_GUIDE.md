# Reusable Partials Guide

## Overview
Drop-in conversion components that integrate with Zapier tracking and follow the design system.

---

## 1. ConsultBanner

### Purpose
Drive consultation bookings by offering expert guidance on product selection.

### Usage

#### Default Variant (Hero-style)
```tsx
import { ConsultBanner } from '@/components/partials';

<ConsultBanner variant="default" />
```

**Where to use:**
- Bottom of product pages
- Mid-collection pages
- End of blog posts about hair care

#### Compact Variant (Card-style)
```tsx
<ConsultBanner variant="compact" className="my-8" />
```

**Where to use:**
- Sidebar widgets
- Between product grids
- FAQ sections

#### Inline Variant (Horizontal)
```tsx
<ConsultBanner variant="inline" ctaText="Book Free Consult" />
```

**Where to use:**
- Above product grids
- In header/footer
- Navigation drawers

### Props
```typescript
interface ConsultBannerProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
  ctaText?: string; // Default: "Book on Fresha"
}
```

### CTA Destination
Links to Fresha consultation booking:
```
https://www.fresha.com/book-now/hair-pinns-example?service=consultation
```

---

## 2. ValueStrip

### Purpose
Build trust and communicate value proposition with 3-icon strip.

### Usage

#### Default Variant (Full-width section)
```tsx
import { ValueStrip } from '@/components/partials';

<ValueStrip variant="default" />
```

**Where to use:**
- Below hero sections
- Above product grids
- Between major page sections

#### Compact Variant (Inline text)
```tsx
<ValueStrip variant="compact" showIcons={false} />
```

**Where to use:**
- Checkout page
- Cart drawer
- Footer

### Props
```typescript
interface ValueStripProps {
  variant?: "default" | "compact";
  className?: string;
  showIcons?: boolean; // Default: true
}
```

### Values Displayed
1. **Real salon expertise** (Award icon)
2. **Care that lasts** (Heart icon)
3. **Shop salon-grade at home** (ShoppingBag icon)

---

## 3. FreeShippingBar

### Purpose
Incentivize cart value increase by showing dynamic progress to free shipping threshold.

### Usage

#### Default Variant (Progress bar)
```tsx
import { FreeShippingBar } from '@/components/partials';

const [cartTotal, setCartTotal] = useState(65.00);

<FreeShippingBar cartTotal={cartTotal} threshold={99} />
```

**Where to use:**
- Cart drawer (sticky at top)
- Checkout page header
- Product page (below price)

#### Compact Variant (Text-only)
```tsx
<FreeShippingBar 
  cartTotal={cartTotal} 
  variant="compact" 
  className="text-sm"
/>
```

**Where to use:**
- Mini cart dropdown
- Mobile sticky bar
- Checkout summary

### Props
```typescript
interface FreeShippingBarProps {
  cartTotal: number; // Current cart subtotal ($)
  threshold?: number; // Free shipping threshold (default: 99)
  className?: string;
  variant?: "default" | "compact";
}
```

### States
1. **Below threshold**: "Spend $99 for free AU shipping — you're $34 away"
2. **Qualified**: "You qualify for free AU shipping! 🎉"

### Integration Example
```tsx
// In cart context/state
const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

<FreeShippingBar cartTotal={cartSubtotal} />
```

---

## 4. LeadMagnetBanner

### Purpose
Capture email/phone for lead nurturing via high-value content offer.

### Usage

#### Default Variant (Full CTA)
```tsx
import { LeadMagnetBanner } from '@/components/partials';

<LeadMagnetBanner variant="default" />
```

**Where to use:**
- Product detail pages (below description)
- Blog post sidebars
- Exit-intent popups
- Bottom of service pages

#### Compact Variant (Card-style)
```tsx
<LeadMagnetBanner variant="compact" className="my-6" />
```

**Where to use:**
- Collection page grids (every 6 products)
- Blog post end CTAs
- Sidebar widgets

#### Inline Variant (Minimal)
```tsx
<LeadMagnetBanner variant="inline" />
```

**Where to use:**
- Footer
- Between product cards
- Navigation drawers

### Props
```typescript
interface LeadMagnetBannerProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
  magnet?: {
    title: string;
    subtitle: string;
    ctaText: string;
    formName: string;
  };
}
```

### Default Magnet
```javascript
{
  title: "Get Jena's 7-Day Frizz-Free Plan",
  subtitle: "PDF guide + day-by-day SMS tips. Join free.",
  ctaText: "Get My Free Plan",
  formName: "leadmagnet_frizz7",
}
```

### Custom Magnet Example
```tsx
<LeadMagnetBanner
  variant="compact"
  magnet={{
    title: "Free Blonde Care Checklist",
    subtitle: "Keep your blonde vibrant between salon visits",
    ctaText: "Download Free",
    formName: "leadmagnet_blonde_care",
  }}
/>
```

### Zapier Integration
Posts to Zapier with:
```javascript
{
  form_name: "leadmagnet_frizz7",
  email: "user@example.com",
  phone: "+61412345678", // optional
  consent_marketing: true,
  lead_magnet_name: "Get Jena's 7-Day Frizz-Free Plan",
  // + standard tracking fields (client_id, utms, etc.)
}
```

**GHL Action:** Tag with `leadmagnet_frizz7`, start nurture workflow

### Validation
Uses Zod schema:
```typescript
const leadMagnetSchema = z.object({
  email: z.string().trim().email().max(255),
  phone: z.string().trim().optional(),
  consent_marketing: z.boolean().refine((val) => val === true),
});
```

### Success State
After submission, shows:
- ✅ Checkmark icon
- "You're All Set!" heading
- "Check your email for the PDF guide" message

---

## 5. Usage Examples by Page

### Homepage
```tsx
<HeroHome />
<ValueStrip variant="default" />
<ProductSpotlight />
<LeadMagnetBanner variant="compact" className="my-16" />
<ReviewsHome />
<ConsultBanner variant="default" />
<FooterCTA />
```

### Product Detail Page
```tsx
<ProductDetail />
{/* After product description */}
<LeadMagnetBanner variant="compact" className="my-8" />

{/* Before footer */}
<ConsultBanner variant="default" />
```

### Collection Page
```tsx
<CollectionHeader />
<ValueStrip variant="compact" showIcons={false} className="mb-8" />

<ProductGrid>
  {products.map((product, index) => (
    <>
      <ProductCard key={product.id} {...product} />
      {/* Inject lead magnet every 6 products */}
      {(index + 1) % 6 === 0 && (
        <LeadMagnetBanner variant="compact" />
      )}
    </>
  ))}
</ProductGrid>

<ConsultBanner variant="default" className="mt-16" />
```

### Cart Drawer
```tsx
<CartDrawer>
  <FreeShippingBar cartTotal={cartSubtotal} variant="default" />
  
  <CartItems />
  
  <ValueStrip variant="compact" showIcons={false} />
  
  <CheckoutButton />
</CartDrawer>
```

### Services Page
```tsx
<ServicesHero />
<ValueStrip variant="default" />

<ServiceGrid />

<ConsultBanner variant="inline" className="my-12" />

<FAQSection />
```

### Blog Post
```tsx
<BlogHeader />

<BlogContent>
  {/* Mid-content */}
  <LeadMagnetBanner variant="compact" />
</BlogContent>

<ConsultBanner variant="compact" className="mt-12" />
```

---

## 6. Styling & Variants

### Design System Integration
All partials use:
- **Colors**: `bg-brand-500`, `bg-accent`, `text-brand-500`
- **Spacing**: `p-4`, `p-6`, `p-8`, `gap-3`, `gap-4`
- **Border Radius**: `rounded-card` (from design system)
- **Typography**: `font-heading`, `text-heading`, `text-foreground`

### Variant Comparison

| Component | Default | Compact | Inline |
|-----------|---------|---------|--------|
| **ConsultBanner** | Hero CTA | Card-style | Horizontal |
| **ValueStrip** | 3-column grid | Inline text | N/A |
| **FreeShippingBar** | Progress bar | Text-only | N/A |
| **LeadMagnetBanner** | Full form | Card form | Minimal email |

---

## 7. Tracking & Analytics

### Events Fired

#### ConsultBanner
- **No tracking** (direct link to Fresha)
- Tracks in Fresha analytics

#### ValueStrip
- **No tracking** (static display)

#### FreeShippingBar
- **No tracking** (dynamic display only)
- Can add `threshold_reached` event if needed

#### LeadMagnetBanner
- **Form Submit**: `leadmagnet_frizz7` (or custom `formName`)
- **Pixel Tracking**: `generate_lead` event with hashed PII
- **Zapier**: Full payload with contact, context, consent

### Zapier Payload Example
```json
{
  "contact": {
    "email": "user@example.com",
    "phone": "+61412345678"
  },
  "context": {
    "form_name": "leadmagnet_frizz7",
    "event_name": "leadmagnet_frizz7",
    "source_page": "https://hairpinns.com/products/shampoo",
    "client_id": "abc123",
    "dedupe_key": "...",
    "timestamp": "2025-01-05T12:00:00Z"
  },
  "consent": {
    "marketing": true,
    "gdpr_region_detected": "AU",
    "double_opt_in": true
  },
  "session": {
    "utm_source": "google",
    "utm_campaign": "hair_care"
  },
  "custom": {
    "lead_magnet_name": "Get Jena's 7-Day Frizz-Free Plan"
  }
}
```

---

## 8. A/B Testing Variations

### ConsultBanner Headlines
```tsx
// Test 1: Problem-focused
<ConsultBanner 
  variant="compact"
  customHeadline="Struggling with product overload?"
/>

// Test 2: Benefit-focused
<ConsultBanner 
  variant="compact"
  customHeadline="Get a personalized hair care plan in 15 minutes"
/>
```

### LeadMagnet Offers
```tsx
// Test 1: Time-bound value
<LeadMagnetBanner
  magnet={{
    title: "7-Day Transformation Challenge",
    subtitle: "See visible results in one week",
    ctaText: "Start Free Challenge",
    formName: "leadmagnet_7day_challenge",
  }}
/>

// Test 2: Expert authority
<LeadMagnetBanner
  magnet={{
    title: "Jena's Professional Hair Care Secrets",
    subtitle: "12+ years of salon expertise, free download",
    ctaText: "Get Expert Guide",
    formName: "leadmagnet_expert_secrets",
  }}
/>
```

---

## 9. Performance Considerations

### Lazy Loading
Lead magnet forms are lightweight, but can be lazy-loaded if below fold:

```tsx
import { lazy, Suspense } from 'react';

const LeadMagnetBanner = lazy(() => import('@/components/partials/LeadMagnetBanner'));

<Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-card" />}>
  <LeadMagnetBanner variant="compact" />
</Suspense>
```

### Bundle Size
- **ConsultBanner**: ~2KB (static)
- **ValueStrip**: ~1KB (static)
- **FreeShippingBar**: ~3KB (dynamic)
- **LeadMagnetBanner**: ~8KB (form + validation)

Total: ~14KB gzipped for all partials

---

## 10. Accessibility

### Keyboard Navigation
- All CTAs focusable with Tab
- Form inputs support keyboard navigation
- Submit buttons disabled until validation passes

### Screen Readers
- Proper ARIA labels on form inputs
- Error messages announced
- Success states announced

### Example
```tsx
<Input
  type="email"
  placeholder="Your email"
  aria-label="Email address for lead magnet"
  aria-required="true"
/>
```

---

## 11. Maintenance Checklist

### When Adding New Partial
- [ ] Create component in `src/components/partials/`
- [ ] Add to `index.ts` export
- [ ] Document in this guide
- [ ] Add Zapier integration if needed
- [ ] Test all variants (default, compact, inline)
- [ ] Add to Storybook (if available)
- [ ] Update design system tokens if needed

### When Updating Existing Partial
- [ ] Test all usage locations (search codebase)
- [ ] Update this documentation
- [ ] Check mobile responsiveness
- [ ] Verify Zapier payload structure
- [ ] Run Lighthouse audit

---

## 12. Common Issues & Solutions

### Issue: ConsultBanner not linking correctly
**Solution**: Verify Fresha URL is correct for your account:
```tsx
const freshaUrl = "https://www.fresha.com/book-now/YOUR-SALON-ID?service=consultation";
```

### Issue: FreeShippingBar not updating
**Solution**: Ensure `cartTotal` prop is reactive (state/prop):
```tsx
const [cartTotal, setCartTotal] = useState(0);

// Update when cart changes
useEffect(() => {
  const total = calculateCartTotal();
  setCartTotal(total);
}, [cartItems]);
```

### Issue: LeadMagnetBanner form not submitting
**Solution**: Check:
1. Zapier webhook URL in `hpCapture.ts`
2. Consent checkbox is checked
3. Email validation passing
4. Console for errors

### Issue: Partials not matching design system
**Solution**: Use semantic tokens from `index.css`:
```tsx
// ❌ Wrong
className="bg-blue-500 text-white"

// ✅ Correct
className="bg-brand-500 text-white"
```

---

## 13. Quick Reference

### Import Statement
```tsx
import {
  ConsultBanner,
  ValueStrip,
  FreeShippingBar,
  LeadMagnetBanner,
} from '@/components/partials';
```

### Minimal Examples

#### Consult Banner
```tsx
<ConsultBanner variant="compact" />
```

#### Value Strip
```tsx
<ValueStrip variant="default" />
```

#### Free Shipping Bar
```tsx
<FreeShippingBar cartTotal={cartSubtotal} />
```

#### Lead Magnet Banner
```tsx
<LeadMagnetBanner variant="compact" />
```

---

**Last Updated:** 2025-01-05  
**Version:** 1.0  
**Status:** ✅ Complete - Ready for production use
