# Launch QA Checklist - Test Results

**Test Date**: 2025-01-15  
**Status Legend**: ✅ PASS | ⚠️ NEEDS FIX | ❌ FAIL | 🔄 NEEDS TEST

---

## 1. SEO Fundamentals

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Unique titles across pages | ✅ PASS | All pages have unique title tags in Helmet | - |
| Unique meta descriptions | ✅ PASS | Each page has unique description | - |
| Single H1 per page | ⚠️ NEEDS FIX | SuburbPage.tsx has 2 H1s (line 198 and 346) | [Fix H1 duplication](#fix-h1-duplication) |
| Heading hierarchy valid (H1→H2→H3) | ⚠️ NEEDS AUDIT | Need to verify no H3 before H2, etc. | [Audit heading structure](#audit-heading-structure) |
| Structured data present | ✅ PASS | Product, FAQPage, Organization, LocalBusiness schemas implemented | - |

---

## 2. Lighthouse Scores (Mobile)

| Metric | Target | Status | Issue | Remedy |
|--------|--------|--------|-------|--------|
| Performance | ≥ 90 | 🔄 NEEDS TEST | Run Lighthouse in incognito | [Run Lighthouse test](#lighthouse-testing) |
| SEO | ≥ 95 | 🔄 NEEDS TEST | Run Lighthouse in incognito | [Run Lighthouse test](#lighthouse-testing) |
| Accessibility | ≥ 95 | 🔄 NEEDS TEST | Run Lighthouse in incognito | [Run Lighthouse test](#lighthouse-testing) |
| Best Practices | ≥ 95 | 🔄 NEEDS TEST | Run Lighthouse in incognito | [Run Lighthouse test](#lighthouse-testing) |

**Note**: Scores must be tested in production build with real images and optimized assets.

---

## 3. Core Web Vitals

| Metric | Target | Status | Implementation | Remedy |
|--------|--------|--------|----------------|--------|
| LCP image fetchpriority | high | ✅ PASS | Hero image has `fetchPriority="high"` (HeroHome.tsx:16) | - |
| Fonts preloaded | yes | ✅ PASS | 5 fonts preloaded in index.html (lines 17-21) | - |
| CLS prevention | < 0.06 | ✅ PASS | Images have width/height, OptimizedImage reserves space | - |
| Font display | swap | ✅ PASS | Google Fonts loaded with `display=swap` (index.html:24) | - |

---

## 4. Forms → Zapier Integration

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Zapier webhook 200 OK | ❌ **FAIL** | TypeError: Failed to fetch at hpCapture.ts:297 | [Fix Zapier CORS/URL](#fix-zapier-integration) |
| Payload includes form_name | ✅ PASS | `context.form_name` in payload structure | - |
| Payload includes client_id | ✅ PASS | `context.client_id` from localStorage | - |
| Payload includes UTMs | ✅ PASS | `session` and `first_touch` objects with UTM params | - |
| Payload includes consent | ✅ PASS | `consent.marketing` and `consent.gdpr_region_detected` | - |
| Retry logic implemented | ✅ PASS | 3 retry attempts with exponential backoff (1s, 3s, 10s) | - |
| Error logging to window.__hpErrors | ✅ PASS | All failures logged to `window.__hpErrors` array | - |

**Critical Issue**: Zapier fetch is failing. Most likely causes:
1. CORS issue (webhook not allowing browser requests)
2. Incorrect webhook URL
3. Network blocked by ad blocker

---

## 5. Zapier → GHL Workflows

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Zap paths route to GHL | 🔄 NEEDS TEST | Requires Zapier account verification | [Test Zapier → GHL flow](#test-ghl-integration) |
| Contact upserted in GHL | 🔄 NEEDS TEST | Requires test submission | [Test contact creation](#test-ghl-integration) |
| Tags/workflows applied | 🔄 NEEDS TEST | Requires GHL access | [Test GHL workflows](#test-ghl-integration) |
| Dedupe logic works | 🔄 NEEDS TEST | SHA-256 dedupe_key generated (hpCapture.ts:268-272) | [Test deduplication](#test-deduplication) |
| Same email/day doesn't duplicate | 🔄 NEEDS TEST | dedupe_key = sha256(client_id\|form_name\|email\|YYYY-MM-DD) | [Test deduplication](#test-deduplication) |

**Blocker**: Cannot test GHL until Zapier integration is fixed.

---

## 6. Shopify Webhooks → Zapier

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Webhooks configured in Shopify | ❌ **NOT IMPLEMENTED** | No webhook setup found | [Setup Shopify webhooks](#shopify-webhooks-setup) |
| Order created webhook | ❌ **NOT IMPLEMENTED** | Not configured | [Setup order webhooks](#shopify-webhooks-setup) |
| Test order updates LTV in GHL | 🔄 NEEDS TEST | Depends on webhook setup | [Test order tracking](#test-order-webhooks) |
| Webhook signature validation | ❌ **NOT IMPLEMENTED** | No verification code | [Add webhook validation](#shopify-webhooks-setup) |

**Status**: Shopify webhooks not implemented. See SHOPIFY_WEBHOOKS_SETUP.md for guidance.

---

## 7. Sitemap, Robots, Canonicals

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Sitemap live at /sitemap.xml | ✅ PASS | public/sitemap.xml exists | - |
| Robots.txt present | ✅ PASS | public/robots.txt exists with correct directives | - |
| Canonical tags on all pages | ✅ PASS | All pages have `<link rel="canonical">` via Helmet | - |
| 404 page styled | ✅ PASS | NotFound.tsx has branded styling | - |
| 500 page styled | ⚠️ NEEDS CREATE | No custom 500 error page | [Create 500 error page](#create-500-page) |
| Sitemap includes all pages | ⚠️ NEEDS AUDIT | Manual verification needed | [Audit sitemap completeness](#audit-sitemap) |
| Robots.txt references sitemap | ✅ PASS | Line 18: `Sitemap: https://hairpinns.com/sitemap.xml` | - |

---

## 8. Navigation & Links

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| All header nav links valid | 🔄 NEEDS TEST | Manual click-through required | [Test navigation](#test-navigation-links) |
| All footer links valid | 🔄 NEEDS TEST | Manual click-through required | [Test navigation](#test-navigation-links) |
| Phone/tel links work | 🔄 NEEDS TEST | Click to verify mobile dialer opens | [Test tel links](#test-phone-links) |
| SMS links work | ⚠️ NEEDS IMPLEMENT | No SMS links found | [Add SMS links](#add-sms-links) |
| External links open in new tab | ⚠️ NEEDS AUDIT | Some have `target="_blank"`, verify all | [Audit external links](#audit-external-links) |
| Broken link checker run | 🔄 NEEDS TEST | Use online tool or manual test | [Check for broken links](#broken-link-check) |

---

## 9. Accessibility

| Test | Status | Issue | Remedy |
|------|--------|-------|--------|
| Focus states visible | ⚠️ NEEDS AUDIT | Default browser styles, could enhance | [Enhance focus states](#accessibility-focus-states) |
| Color contrast meets WCAG AA | ⚠️ NEEDS AUDIT | Design system colors should be tested | [Test color contrast](#accessibility-contrast) |
| Alt text on critical images | ⚠️ PARTIAL | Hero has alt text; verify all images | [Audit image alt text](#accessibility-alt-text) |
| Form labels present | ✅ PASS | All forms use proper `<label>` elements | - |
| Keyboard navigation works | 🔄 NEEDS TEST | Tab through all interactive elements | [Test keyboard nav](#accessibility-keyboard) |
| ARIA labels on icon buttons | ⚠️ NEEDS AUDIT | Some buttons have `aria-label`, verify all | [Audit ARIA labels](#accessibility-aria) |
| Skip to content link | ❌ **MISSING** | No skip link for keyboard users | [Add skip link](#accessibility-skip-link) |

---

# Remedies & Action Items

## Fix H1 Duplication

**File**: `src/pages/SuburbPage.tsx`

**Issue**: Two H1 elements on line 198 and 346

**Fix**:
```tsx
// Line 346: Change H1 to H2
<h2 className="text-h2-lg font-heading mb-6">
  Ready to transform your hair?
</h2>
```

## Fix Zapier Integration

**File**: `src/lib/hpCapture.ts`

**Issue**: Fetch failing with "Failed to fetch" error

**Possible Causes**:
1. **CORS Issue**: Zapier webhook may not allow browser requests
2. **Incorrect URL**: Webhook URL may be invalid or expired
3. **Ad Blocker**: Browser extension blocking the request

**Solutions**:

### Solution 1: Test Webhook URL
```bash
# Test webhook directly with curl
curl -X POST https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/ \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Solution 2: Add CORS Headers
The Zapier webhook should automatically handle CORS, but if it's failing, you may need to:
1. Check Zapier dashboard for webhook status
2. Regenerate webhook URL if expired
3. Add `mode: 'no-cors'` (not recommended for production)

### Solution 3: Server-Side Proxy
Create a backend endpoint to proxy requests:
```typescript
// In a Lovable Cloud edge function or backend
export async function submitToZapier(payload: any) {
  return fetch(ZAPIER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
```

**Immediate Action**:
1. Log into Zapier
2. Verify webhook is active
3. Test webhook URL with curl
4. Check browser console for detailed error
5. Temporarily disable ad blockers for testing

---

## Audit Heading Structure

**What to Check**:
1. Each page should have exactly one H1
2. H2s should follow H1s (not H3s before H2s)
3. Heading levels shouldn't skip (H1 → H3 is invalid)

**Pages to Audit**:
- ✅ Home (Index.tsx)
- ✅ Services.tsx
- ✅ ProductDetail.tsx
- ✅ CollectionDetail.tsx
- ✅ BlogPost.tsx
- ⚠️ SuburbPage.tsx (has 2 H1s - needs fix)

**Tool**: Use [HeadingsMap browser extension](https://chromewebstore.google.com/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi)

---

## Lighthouse Testing

**How to Run**:
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile" device
4. Check all categories
5. Click "Generate report"

**Run in**:
- Incognito mode (no extensions)
- Production build (not dev server)
- Slow 3G throttling enabled

**Target Scores**:
- Performance: ≥ 90
- SEO: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95

**Common Issues**:
- Unused JavaScript: Use code splitting
- Render-blocking resources: Defer non-critical JS/CSS
- Missing alt text: Add to all images
- Low contrast: Adjust color palette

---

## Test GHL Integration

**Prerequisites**:
1. Zapier webhook must be working
2. GHL account access required
3. Zap must be turned ON

**Test Steps**:
1. Fill out a form on the site (e.g., contact form)
2. Check Zapier dashboard → Zap History
3. Verify payload received correctly
4. Check GHL for new contact
5. Verify tags applied
6. Verify workflow triggered

**What to Verify in GHL**:
- Contact created/updated
- UTM parameters stored
- First-touch attribution saved
- Tags applied based on form_name
- Workflow automation triggered

---

## Test Deduplication

**Test Scenario**:
1. Submit form with email `test@example.com`
2. Submit same form with same email within 24 hours
3. Check Zapier Zap History for 2 submissions
4. Check GHL for duplicate contact

**Expected Behavior**:
- Zapier receives 2 submissions
- Both have same `dedupe_key` in payload
- GHL Zap filters duplicate based on `dedupe_key`
- Contact is NOT duplicated in GHL

**Dedupe Logic**:
```typescript
dedupe_key = sha256(client_id + form_name + email + YYYY-MM-DD)
```

**Verification**:
```javascript
// In browser console after form submit
console.log(window.__hpErrors); // Check for errors
// Look for dedupe_key in payload
```

---

## Shopify Webhooks Setup

**File to Create**: Backend webhook handler (requires Lovable Cloud or external server)

**Webhooks to Configure in Shopify**:
1. `orders/create` - New order placed
2. `orders/updated` - Order status changed
3. `checkouts/create` - Checkout initiated
4. `customers/create` - New customer account

**Steps**:
1. Enable Lovable Cloud (if not enabled)
2. Create edge function for webhook handler
3. Verify webhook signature (HMAC SHA-256)
4. Forward to Zapier with enriched data
5. Configure in Shopify Admin → Settings → Notifications → Webhooks

**See**: `SHOPIFY_WEBHOOKS_SETUP.md` for complete implementation guide

---

## Create 500 Error Page

**Create File**: `src/pages/ServerError.tsx`

```tsx
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <>
      <Helmet>
        <title>500 Server Error | Hair Pinns</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center max-w-md px-4">
          <h1 className="mb-4 text-4xl font-heading font-bold text-heading">500</h1>
          <h2 className="mb-4 text-xl font-semibold text-heading">Server Error</h2>
          <p className="mb-8 text-foreground">
            Something went wrong on our end. We've been notified and are working to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 bg-brand-500 text-white rounded-btn hover:bg-brand-600 transition-colors"
            >
              Return to Home
            </Link>
            <a 
              href="/contact" 
              className="px-6 py-3 border border-border rounded-btn hover:bg-muted transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerError;
```

Then add to `src/App.tsx` routes.

---

## Audit Sitemap

**Check**:
1. All main pages included
2. All blog posts included
3. All collection pages included
4. All suburb pages included
5. Correct change frequency
6. Correct priority values
7. Valid lastmod dates

**Missing from Sitemap** (add if applicable):
- Product detail pages
- Individual service pages (if created)
- About, Contact, Terms, Privacy pages

**Tool**: Use [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

## Test Navigation Links

**Manual Test Checklist**:

**Header Nav**:
- [ ] Logo → Home
- [ ] Services → /services
- [ ] Collections → /collections
- [ ] Blog → /blog
- [ ] About → /about
- [ ] Contact → /contact
- [ ] Book Now → Fresha (external)

**Footer Nav**:
- [ ] All footer links valid
- [ ] Social media links work
- [ ] Phone number clickable
- [ ] Email address clickable

---

## Test Phone Links

**What to Test**:
1. Click phone number on mobile device
2. Verify native dialer opens
3. Number pre-filled correctly

**Phone Link Format**:
```tsx
<a href="tel:+61234567890">Call Us</a>
```

**Check**:
- Format: `tel:+[country][area][number]`
- No spaces, dashes, or parentheses in href
- Display format can have formatting

---

## Add SMS Links

**Implement SMS Links**:
```tsx
<a href="sms:+61234567890?body=Hi%20Hair%20Pinns%2C%20I%27d%20like%20to%20book">
  Text Us
</a>
```

**Where to Add**:
- Footer contact section
- Contact page
- Mobile header menu

---

## Audit External Links

**Check All External Links for**:
```tsx
// Correct format
<a 
  href="https://external-site.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  Link Text
</a>
```

**Security**: `rel="noopener noreferrer"` prevents:
- Tabnabbing attacks
- Referrer leaking

**Search for**:
```bash
# Find external links without proper rel
grep -r "target=\"_blank\"" src/ | grep -v "noopener"
```

---

## Broken Link Check

**Tools**:
1. [W3C Link Checker](https://validator.w3.org/checklink)
2. [Broken Link Checker](https://www.brokenlinkcheck.com/)
3. Screaming Frog SEO Spider (desktop app)

**Manual Check**:
1. Click every link in header
2. Click every link in footer
3. Click every link in content
4. Test on mobile and desktop

---

## Accessibility: Focus States

**Current State**: Default browser outline

**Enhancement**:
```css
/* In index.css */
*:focus-visible {
  outline: 2px solid hsl(var(--brand-500));
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid hsl(var(--brand-500));
  outline-offset: 2px;
}
```

**Test**:
1. Tab through all interactive elements
2. Verify visible focus indicator on each
3. Test in Chrome, Firefox, Safari

---

## Accessibility: Color Contrast

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**WCAG AA Requirements**:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Colors to Test**:
- Body text on background
- Muted text on background
- Brand color on white
- White on brand color
- Links on background

**Fix Low Contrast**:
```css
/* If text-muted-foreground fails contrast */
--muted-foreground: [adjust to darker shade];
```

---

## Accessibility: Alt Text

**Alt Text Rules**:
1. Describe image content
2. Include context/purpose
3. Don't start with "Image of..."
4. Keep under 125 characters
5. Leave empty (`alt=""`) for decorative images

**Hair Pinns Pattern**:
```tsx
alt="Balayage on brunette hair at Hair Pinns, Bangor"
alt="Keratin smoothing treatment results on curly hair"
alt="Hair Pinns boutique salon interior with styling stations"
```

**Audit**:
```bash
# Find images without alt text
grep -r "<img" src/ | grep -v "alt="
```

---

## Accessibility: Keyboard Navigation

**Test Checklist**:
- [ ] Tab through all links (in logical order)
- [ ] Tab through all buttons
- [ ] Tab through all form fields
- [ ] Press Enter to activate links/buttons
- [ ] Use arrow keys in select dropdowns
- [ ] Press Escape to close modals
- [ ] Skip navigation with Tab (after skip link added)

**Tools**:
- Just use keyboard (no mouse)
- [Keyboard Accessibility Tester](https://www.w3.org/WAI/perspective-videos/keyboard/)

---

## Accessibility: ARIA Labels

**Buttons to Check**:
```tsx
// Icon-only buttons MUST have aria-label
<button aria-label="Close menu">
  <X />
</button>

<button aria-label="Previous image">
  <ChevronLeft />
</button>

<button aria-label="Add to cart">
  <ShoppingCart />
</button>
```

**Search for Icon Buttons**:
```bash
grep -r "<button" src/ | grep -v "aria-label" | grep "Icon"
```

---

## Accessibility: Skip Link

**Add to Header**:
```tsx
// At top of Header.tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

**Add ID to Main**:
```tsx
<main id="main-content">
  {/* page content */}
</main>
```

**CSS for sr-only** (if not in index.css):
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: relative;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

# Priority Action Items

## 🔴 Critical (Block Launch)
1. **Fix Zapier Integration** - Forms cannot submit
2. **Fix H1 Duplication** - SEO issue

## 🟡 High Priority (Fix Before Launch)
1. **Test All Navigation Links** - Broken links hurt UX
2. **Audit Heading Structure** - SEO optimization
3. **Add 500 Error Page** - Professional error handling
4. **Implement Shopify Webhooks** - E-commerce tracking
5. **Add Skip Link** - Accessibility compliance

## 🟢 Medium Priority (Fix Within 1 Week)
1. **Run Lighthouse Tests** - Performance optimization
2. **Test GHL Integration** - Verify workflows
3. **Enhance Focus States** - Better accessibility
4. **Audit Color Contrast** - WCAG compliance
5. **Audit Image Alt Text** - SEO + Accessibility

## 🔵 Low Priority (Nice to Have)
1. **Add SMS Links** - Additional contact method
2. **Audit External Links** - Security best practice
3. **Broken Link Check** - Ongoing maintenance

---

# Testing Timeline

**Week 1** (Critical):
- Day 1: Fix Zapier integration
- Day 2: Fix H1 issues, test navigation
- Day 3: Add 500 page, audit headings
- Day 4: Run Lighthouse tests
- Day 5: Test GHL workflows

**Week 2** (High Priority):
- Day 1-2: Implement Shopify webhooks
- Day 3: Accessibility audit
- Day 4-5: Fix accessibility issues

**Ongoing**:
- Monthly broken link checks
- Quarterly Lighthouse audits
- Continuous accessibility testing

---

**Generated**: 2025-01-15  
**Next Review**: After fixing critical issues  
**Tested By**: AI Audit (Manual Testing Required)
