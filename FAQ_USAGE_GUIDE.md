# FAQ Usage Guide

## Overview
Comprehensive FAQ system with 12 professional answers, internal linking, FAQPage schema, and feedback tracking.

---

## 1. FAQ Data Structure

### Location
`src/data/faqs.ts`

### Schema
```typescript
interface FAQ {
  id: string;                    // Unique identifier
  question: string;              // The question text
  answer: string;                // Detailed answer
  category?: 'treatments' | 'colour' | 'care' | 'products' | 'booking' | 'general';
  relatedLinks?: Array<{
    text: string;
    url: string;                 // Internal link (/services#..., /collections/...)
  }>;
}
```

### The 12 Comprehensive FAQs

1. **Keratin vs Smoothing** (`keratin-vs-smoothing`)
   - Category: `treatments`
   - Links: `/services#smoothing`, `/collections/treatments`

2. **Smoothing Duration** (`smoothing-duration`)
   - Category: `treatments`
   - Links: `/services#smoothing`, `/collections/hair-care`

3. **Blonde Care** (`blonde-care`)
   - Category: `colour`
   - Links: `/services#colour`, `/collections/hair-care`

4. **Frizz in Humidity** (`frizz-humidity`)
   - Category: `care`
   - Links: `/services#smoothing`, `/collections/styling`

5. **Colour Routine** (`colour-routine`)
   - Category: `colour`
   - Links: `/services#colour`, `/collections/treatments`

6. **Brass Protection** (`brass-protection`)
   - Category: `products`
   - Links: `/collections/hair-care`, `/services#colour`

7. **Wash After Colour** (`wash-after-colour`)
   - Category: `colour`
   - Links: `/services#colour`, `/collections/hair-care`

8. **Repair Timeline** (`repair-timeline`)
   - Category: `treatments`
   - Links: `/services#smoothing`, `/collections/treatments`

9. **Blowout Technique** (`blowout-technique`)
   - Category: `care`
   - Links: `/services#cuts`, `/collections/styling`

10. **Trim Frequency** (`trim-frequency`)
    - Category: `general`
    - Links: `/services#cuts`, `/services`

11. **Cruelty-Free Options** (`cruelty-free`)
    - Category: `products`
    - Links: `/collections`, `/booking`

12. **Click & Collect** (`click-collect`)
    - Category: `booking`
    - Links: `/contact`, `/collections`

---

## 2. FAQSection Component

### Location
`src/components/FAQSection.tsx`

### Basic Usage
```tsx
import FAQSection from '@/components/FAQSection';
import { comprehensiveFAQs } from '@/data/faqs';

<FAQSection 
  faqs={comprehensiveFAQs}
  title="Frequently Asked Questions"
  showFeedback={true}
/>
```

### Props
```typescript
interface FAQSectionProps {
  faqs: FAQ[];                   // Array of FAQ objects
  title?: string;                // Section heading (default: "Frequently Asked Questions")
  subtitle?: string;             // Optional subtitle/description
  showFeedback?: boolean;        // Show feedback widget (default: true)
  className?: string;            // Additional CSS classes
}
```

### Features
- ✅ Accordion display with smooth animations
- ✅ Internal links with visual indicator
- ✅ FAQ feedback widget integration
- ✅ Anchor links for direct FAQ access (`#faq-id`)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Automatic FAQPage schema generation

---

## 3. Usage by Page Type

### Services Page (`/services`)
**Current Implementation:**
```tsx
import FAQSection from '@/components/FAQSection';
import { comprehensiveFAQs } from '@/data/faqs';

<FAQSection
  faqs={comprehensiveFAQs}
  title="Frequently Asked Questions"
  subtitle="Expert answers to your hair care questions from Jena and the Hair Pinns team."
  showFeedback={true}
/>
```

**Result:** Displays all 12 FAQs with feedback tracking

---

### Product Detail Page (PDP)
**Recommended FAQs:**
- Related to product category (treatments, colour care, styling)
- 4-6 FAQs maximum

```tsx
import FAQSection from '@/components/FAQSection';
import { getFAQsByIds } from '@/data/faqs';

// For a keratin treatment product
const productFAQs = getFAQsByIds([
  'keratin-vs-smoothing',
  'smoothing-duration',
  'repair-timeline',
  'wash-after-colour'
]);

<FAQSection
  faqs={productFAQs}
  title="Product FAQs"
  showFeedback={true}
  className="bg-background"
/>
```

---

### Collection Page
**Recommended FAQs:**
- Category-specific (by collection type)
- 6-8 FAQs

```tsx
import FAQSection from '@/components/FAQSection';
import { getFAQsByCategory } from '@/data/faqs';

// For Treatments collection
const treatmentFAQs = getFAQsByCategory('treatments');

<FAQSection
  faqs={treatmentFAQs}
  title="Treatment FAQs"
  subtitle="Everything you need to know about our professional treatments"
  showFeedback={true}
/>

// For Hair Care collection
const careFAQs = getFAQsByCategory('care');

<FAQSection
  faqs={careFAQs}
  title="Hair Care FAQs"
  showFeedback={true}
/>
```

---

### Suburb Pages
**Recommended FAQs:**
- Mix of general + booking FAQs
- 6 FAQs total

```tsx
import FAQSection from '@/components/FAQSection';
import { getFAQsByIds } from '@/data/faqs';

const suburbFAQs = getFAQsByIds([
  'keratin-vs-smoothing',
  'blonde-care',
  'trim-frequency',
  'click-collect',
  'cruelty-free',
  'colour-routine'
]);

<FAQSection
  faqs={suburbFAQs}
  title={`Hair Salon FAQs for ${suburbName}`}
  subtitle="Common questions from our Sutherland Shire clients"
  showFeedback={true}
/>
```

---

## 4. Helper Functions

### Get FAQs by Category
```typescript
import { getFAQsByCategory } from '@/data/faqs';

const treatmentFAQs = getFAQsByCategory('treatments');  // Returns 3 FAQs
const colourFAQs = getFAQsByCategory('colour');        // Returns 3 FAQs
const careFAQs = getFAQsByCategory('care');            // Returns 2 FAQs
const productFAQs = getFAQsByCategory('products');     // Returns 2 FAQs
const bookingFAQs = getFAQsByCategory('booking');      // Returns 1 FAQ
const generalFAQs = getFAQsByCategory('general');      // Returns 1 FAQ
```

### Get Specific FAQs by IDs
```typescript
import { getFAQsByIds } from '@/data/faqs';

const pdpFAQs = getFAQsByIds([
  'keratin-vs-smoothing',
  'smoothing-duration',
  'repair-timeline'
]);
```

### Get Random FAQs
```typescript
import { getRandomFAQs } from '@/data/faqs';

const randomSix = getRandomFAQs(6);  // Returns 6 random FAQs
```

### Search FAQs
```typescript
import { searchFAQs } from '@/data/faqs';

const frizzFAQs = searchFAQs('frizz');     // Returns FAQs mentioning "frizz"
const blondeFAQs = searchFAQs('blonde');   // Returns FAQs mentioning "blonde"
```

---

## 5. SEO & Schema

### FAQPage Schema
Automatically generated by `FAQSection` component and included in page `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's the difference between keratin and smoothing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Keratin (formaldehyde-free modern formulas)..."
      }
    }
    // ... more questions
  ]
}
```

### Services Page Implementation
```tsx
import { generateFAQPageSchema } from '@/lib/schema';
import { comprehensiveFAQs } from '@/data/faqs';

const faqSchema = generateFAQPageSchema(
  comprehensiveFAQs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
  }))
);

<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(faqSchema)}
  </script>
</Helmet>
```

### Benefits
- ✅ Rich results in Google Search
- ✅ "People also ask" eligibility
- ✅ Voice search optimization
- ✅ Featured snippet opportunities

---

## 6. Internal Linking Strategy

### Link Patterns
All FAQs include contextual internal links to:
- Service pages with anchor fragments (`/services#colour`, `/services#smoothing`)
- Collection pages (`/collections/treatments`, `/collections/hair-care`)
- Booking page (`/booking`)
- Contact page (`/contact`)

### Example Implementation
```tsx
// FAQ answer with internal links
{
  question: "How do I care for blonde hair?",
  answer: "Use a gentle cleanser...",
  relatedLinks: [
    { text: 'Book Toning Service', url: '/services#colour' },
    { text: 'Shop Hair Care', url: '/collections/hair-care' }
  ]
}
```

### Renders As
```tsx
<Link to="/services#colour" className="text-brand-500">
  Book Toning Service
  <ExternalLink className="w-3 h-3" />
</Link>
```

### SEO Benefits
- Internal link equity distribution
- Lower bounce rate (users navigate to other pages)
- Better crawl depth
- Increased session duration

---

## 7. Anchor Links (Direct FAQ Access)

### URL Structure
```
/services#keratin-vs-smoothing
/services#blonde-care
/services#click-collect
```

### Usage
```tsx
// Link to specific FAQ from anywhere
<Link to="/services#keratin-vs-smoothing">
  Learn about keratin vs smoothing
</Link>

// From blog post
<a href="/services#blonde-care">
  Read our FAQ on blonde care
</a>
```

### Implementation
Each accordion item has an `id` matching the FAQ id:
```tsx
<AccordionTrigger id={faq.id}>
  {faq.question}
</AccordionTrigger>
```

When navigating to `/services#keratin-vs-smoothing`, the browser automatically scrolls to that FAQ.

---

## 8. Feedback Tracking

### Integration
Each FAQ includes a `FaqFeedbackWidget` that tracks:
- Was this helpful? (Yes/No)
- User feedback submission to Zapier

### Implementation
```tsx
<FaqFeedbackWidget
  faqId={faq.id}
  question={faq.question}
/>
```

### Zapier Payload
```json
{
  "context": {
    "form_name": "faq_feedback",
    "event_name": "faq_feedback",
    "faq_id": "keratin-vs-smoothing",
    "faq_question": "What's the difference between keratin and smoothing?",
    "helpful": true,
    "source_page": "https://hairpinns.com/services"
  }
}
```

### Analytics Use
- Identify which FAQs are most/least helpful
- Improve FAQ content based on feedback
- Track which FAQs drive most engagement

---

## 9. Styling & Design

### Design System Integration
- Uses semantic colors: `bg-muted`, `text-heading`, `text-brand-500`
- Matches accordion styling across site
- Responsive padding and spacing
- Smooth accordion animations

### Mobile Optimization
- Touch-friendly accordion triggers
- Readable text sizes (16px+)
- Adequate spacing between elements
- Links don't overlap on tap

### Dark Mode Support
All colors use CSS variables:
```css
bg-muted       /* Adapts to light/dark */
text-heading   /* High contrast in both modes */
text-brand-500 /* Brand color in both modes */
```

---

## 10. Performance Considerations

### Bundle Size
- **FAQSection Component**: ~4KB
- **FAQ Data**: ~8KB
- **Total Impact**: ~12KB gzipped

### Lazy Loading
For pages with many FAQs, consider lazy loading:
```tsx
import { lazy, Suspense } from 'react';

const FAQSection = lazy(() => import('@/components/FAQSection'));

<Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
  <FAQSection faqs={comprehensiveFAQs} />
</Suspense>
```

### Accordion Performance
- Only renders visible FAQ content
- Smooth animations via CSS transitions
- No JavaScript overhead for closed FAQs

---

## 11. Testing Checklist

### Functionality
- [ ] All 12 FAQs display correctly on `/services`
- [ ] Accordion opens/closes smoothly
- [ ] Internal links navigate correctly
- [ ] Anchor links scroll to specific FAQs
- [ ] Feedback widget submits to Zapier
- [ ] Mobile accordion works (no double-tap needed)

### SEO
- [ ] FAQPage schema validates (Google Rich Results Test)
- [ ] All internal links are crawlable
- [ ] Anchor links work in search results
- [ ] No duplicate FAQ content across pages

### Accessibility
- [ ] Accordion keyboard navigable (Tab, Enter, Space)
- [ ] Screen reader announces FAQ open/close
- [ ] Focus visible on all interactive elements
- [ ] Links have proper ARIA labels

---

## 12. Maintenance

### Adding New FAQs
1. Add to `src/data/faqs.ts`:
   ```typescript
   {
     id: 'new-faq-id',
     question: "Question text?",
     answer: "Answer text.",
     category: 'treatments',
     relatedLinks: [
       { text: 'Link Text', url: '/path' }
     ]
   }
   ```

2. FAQ automatically appears in:
   - `comprehensiveFAQs` array
   - Services page (if using all FAQs)
   - Helper function results

### Updating FAQ Content
Edit `src/data/faqs.ts` → changes reflect everywhere FAQ is used

### Removing FAQs
1. Remove from `comprehensiveFAQs` array
2. Check if FAQ ID is used in specific implementations
3. Update any `getFAQsByIds()` calls

---

## 13. Quick Reference

### Import Statements
```tsx
// Component
import FAQSection from '@/components/FAQSection';

// Data
import { comprehensiveFAQs, getFAQsByCategory, getFAQsByIds } from '@/data/faqs';

// Schema
import { generateFAQPageSchema } from '@/lib/schema';
```

### Minimal Implementation
```tsx
<FAQSection faqs={comprehensiveFAQs} />
```

### Category-Specific
```tsx
<FAQSection faqs={getFAQsByCategory('treatments')} />
```

### Custom Selection
```tsx
<FAQSection 
  faqs={getFAQsByIds(['keratin-vs-smoothing', 'blonde-care'])}
  title="Product FAQs"
  showFeedback={true}
/>
```

---

**Last Updated:** 2025-01-05  
**Version:** 1.0  
**Status:** ✅ Complete - Deployed on /services, ready for PDP/Collections/Suburbs
