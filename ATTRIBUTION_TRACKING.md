# Multi-Touch Attribution Tracking

## Overview

Hair Pinns implements comprehensive multi-touch attribution tracking to understand the complete customer journey from first visit to conversion.

## Attribution Models

### 1. First-Touch Attribution
Captures data from the **very first visit** and persists it permanently in localStorage.

**Data Captured**:
- `first_utm_source` - Initial traffic source
- `first_utm_medium` - Initial medium
- `first_utm_campaign` - Initial campaign
- `first_utm_content` - Initial content variant
- `first_utm_term` - Initial keyword
- `first_gclid` - Google Ads click ID
- `first_fbclid` - Facebook click ID
- `first_ttclid` - TikTok click ID
- `first_referrer` - Initial referring URL
- `first_landing_page` - First page visited
- `first_seen_timestamp` - When user first arrived

**Storage**: `localStorage` (key: `hp_first_touch`)  
**Persistence**: Permanent (until cleared by user)

### 2. Last-Touch Attribution
Captures data from the **current session** (most recent visit).

**Data Captured**:
- `utm_source` - Current traffic source
- `utm_medium` - Current medium
- `utm_campaign` - Current campaign
- `utm_content` - Current content variant
- `utm_term` - Current keyword
- `gclid` - Google Ads click ID
- `fbclid` - Facebook click ID
- `ttclid` - TikTok click ID
- `referrer` - Current referring URL

**Storage**: `sessionStorage` (key: `hp_session_data`)  
**Persistence**: Current session only

### 3. Page-Level Tracking
Captures behavior on individual pages.

**Data Captured**:
- `last_seen_page` - URL of page where action occurred
- `page_entry_time` - When user landed on page (timestamp)
- `seconds_on_page` - Time spent on page before action

**Storage**: `sessionStorage` (key: `hp_page_tracking`)  
**Updates**: Every page navigation

## Payload Structure

Every Zapier payload includes both first-touch and last-touch data:

```json
{
  "form_name": "contact_page",
  "name": "Jane Smith",
  "email": "jane@example.com",
  
  "client_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-15T14:30:00.000Z",
  
  "last_seen_page": "https://hairpinns.com.au/services",
  "seconds_on_page": 127,
  
  "referrer": "https://google.com",
  "utms": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "services_retargeting",
    "utm_content": "ad_variant_b",
    "utm_term": "hair_salon_bangor"
  },
  "click_ids": {
    "gclid": "xyz789",
    "fbclid": "",
    "ttclid": ""
  },
  
  "first_touch": {
    "first_utm_source": "instagram",
    "first_utm_medium": "social",
    "first_utm_campaign": "brand_awareness",
    "first_utm_content": "carousel_post",
    "first_utm_term": "",
    "first_referrer": "https://instagram.com/hairpinns",
    "first_landing_page": "https://hairpinns.com.au/",
    "first_seen_timestamp": "2025-01-10T10:15:00.000Z"
  },
  "first_touch_click_ids": {
    "first_gclid": "",
    "first_fbclid": "abc123",
    "first_ttclid": ""
  }
}
```

## Customer Journey Example

**Day 1 (First Touch)**: User discovers Hair Pinns via Instagram ad
- Clicks link with `utm_source=instagram`, `utm_campaign=brand_awareness`
- Lands on homepage
- Browses for 3 minutes, leaves
- **First-touch data saved**: Instagram campaign

**Day 3**: User searches Google for "hair salon Bangor"
- Clicks organic result (no UTMs)
- Reads blog post for 5 minutes
- Leaves again
- **Last-touch updated**: Organic Google search

**Day 5**: User clicks retargeting ad on Google
- Ad parameters: `utm_source=google`, `utm_campaign=services_retargeting`
- Lands on /services page
- Spends 2 minutes reading
- Fills out contact form
- **Form submission includes**:
  - First-touch: Instagram brand awareness (Day 1)
  - Last-touch: Google retargeting (Day 5)
  - Time on page: 127 seconds
  - Last seen page: /services

## Attribution Analysis

### Multi-Touch Attribution Models

**First-Touch Credit**: Attributes conversion to initial discovery channel
- **Use Case**: Brand awareness campaign ROI
- **Example**: "Instagram ads drove 40% of new customers"

**Last-Touch Credit**: Attributes conversion to final interaction
- **Use Case**: Direct response campaign performance
- **Example**: "Google retargeting closed 60% of conversions"

**Time Decay**: Weights recent touchpoints more heavily
- **Calculation**: Recent interactions get exponentially higher credit
- **Use Case**: Understanding conversion path effectiveness

**Linear**: Equal credit to all touchpoints
- **Use Case**: Overall marketing mix optimization

### Implementing in GHL

#### Custom Fields for Attribution

Create these custom fields in GoHighLevel:

**First-Touch Fields**:
- `first_utm_source` (text)
- `first_utm_campaign` (text)
- `first_landing_page` (text)
- `first_seen_date` (date)
- `days_to_conversion` (number) - Calculated field

**Last-Touch Fields**:
- `last_utm_source` (text)
- `last_utm_campaign` (text)
- `conversion_page` (text)
- `time_on_conversion_page` (number - seconds)

#### Zapier Mapping

In your Zapier workflows, map fields:

```
First-Touch Attribution:
  first_utm_source → {{first_touch.first_utm_source}}
  first_utm_campaign → {{first_touch.first_utm_campaign}}
  first_landing_page → {{first_touch.first_landing_page}}
  first_seen_date → {{first_touch.first_seen_timestamp}}

Last-Touch Attribution:
  last_utm_source → {{utms.utm_source}}
  last_utm_campaign → {{utms.utm_campaign}}
  conversion_page → {{last_seen_page}}
  time_on_conversion_page → {{seconds_on_page}}

Days to Conversion (Calculated):
  = Date Diff between {{first_touch.first_seen_timestamp}} and {{timestamp}}
```

## Reporting & Analytics

### Key Metrics to Track

**Attribution Metrics**:
- Conversions by first-touch source
- Conversions by last-touch source
- Average days to conversion
- Average time on site before conversion
- Multi-touch path analysis

**Campaign Performance**:
```
First-Touch:
- Instagram brand awareness: 120 conversions, 30-day avg conversion time
- Google organic: 85 conversions, 7-day avg conversion time
- Facebook ads: 65 conversions, 14-day avg conversion time

Last-Touch:
- Google retargeting: 180 conversions
- Email campaigns: 45 conversions
- Direct traffic: 30 conversions
```

**Cross-Channel Journey Analysis**:
```
Most Common Paths:
1. Instagram → (7 days) → Google Retargeting → Conversion (45%)
2. Google Organic → (3 days) → Email → Conversion (30%)
3. Facebook → (14 days) → Direct → Conversion (15%)
```

### Dashboard Setup

#### GHL Reports

**Report 1: First-Touch Attribution**
- Group by: `first_utm_source`
- Metrics: Count of contacts, conversion rate, avg LTV
- Filter: Contacts with tag `purchaser`

**Report 2: Last-Touch Attribution**
- Group by: Last UTM source (from session)
- Metrics: Count of conversions, revenue attributed
- Timeframe: Last 30 days

**Report 3: Time to Conversion**
- Calculate: `days_to_conversion` = First seen to conversion date
- Histogram: Distribution of conversion times
- Segment by: First-touch source

**Report 4: Multi-Touch Analysis**
- Export data: First-touch + Last-touch for each conversion
- External analysis: Use Excel/Google Sheets for path analysis
- Visualization: Sankey diagram of customer journeys

## Use Cases

### 1. Campaign Budget Allocation

**Scenario**: Deciding how to allocate $10,000 ad budget

**Analysis**:
```
First-Touch Attribution:
- Instagram: 40% of conversions ($150 CPA) → Allocate 40% ($4,000)
- Google Search: 35% of conversions ($120 CPA) → Allocate 40% ($4,000)
- Facebook: 25% of conversions ($180 CPA) → Allocate 20% ($2,000)
```

### 2. Retargeting Optimization

**Finding**: 70% of conversions have Google retargeting as last-touch

**Action**:
- Increase retargeting budget
- Create specific retargeting audiences for each first-touch source
- Test different messaging based on first-touch (Instagram vs. Google vs. Facebook)

### 3. Content Performance

**Finding**: Blog posts have high first-touch but low immediate conversion

**Insight**: Blog is top-of-funnel awareness, not direct response

**Strategy**:
- Continue blog for awareness
- Implement nurture sequences for blog visitors
- Measure by 30-day conversion window, not immediate

### 4. Customer Journey Optimization

**Finding**: Average 12 days from first-touch to conversion

**Opportunity**:
- Implement 7-day nurture sequence
- Send SMS reminders at day 7
- Offer limited-time incentive to accelerate

## Technical Implementation

### Initialization

The tracking system initializes automatically via `TrackingInitializer.tsx`:

```tsx
import TrackingInitializer from "@/components/tracking/TrackingInitializer";

// In App.tsx
<BrowserRouter>
  <TrackingInitializer />
  <Routes>
    {/* ... routes ... */}
  </Routes>
</BrowserRouter>
```

### Manual Access

You can access tracking data programmatically:

```typescript
import { hpCapture } from "@/lib/hpCapture";

// Get last-touch session data
const session = hpCapture.getSession();
console.log(session.utm_source); // Current source

// Get first-touch data
const firstTouch = hpCapture.getFirstTouch();
console.log(firstTouch.first_landing_page); // Initial page

// Get page tracking
const pageTracking = hpCapture.getPageTracking();
console.log(pageTracking.seconds_on_page); // Time on previous page
```

### Form Integration

All form components automatically include attribution data:

```tsx
import ContactForm from "@/components/forms/ContactForm";

// Attribution data automatically included in submission
<ContactForm formName="contact_page" />
```

The `hpCapture.postToZapier()` function automatically merges:
- Form fields
- Last-touch attribution
- First-touch attribution
- Page tracking data

## Privacy & Compliance

### Data Storage
- **First-touch data**: localStorage (persistent, user can clear)
- **Session data**: sessionStorage (cleared when browser closes)
- **Page tracking**: sessionStorage (cleared when browser closes)

### GDPR Compliance
- No personal information stored in attribution data
- Anonymous client_id used for tracking
- Users can clear localStorage to reset tracking
- All tracking respects Do Not Track browser settings (optional)

### Transparency
- Attribution data visible in browser DevTools
- Users can see what's tracked: `localStorage.getItem('hp_first_touch')`
- Clear opt-out mechanism available

## Testing & Debugging

### View Current Attribution Data

Open browser console and run:

```javascript
// View first-touch data
console.log(JSON.parse(localStorage.getItem('hp_first_touch')));

// View session data
console.log(JSON.parse(sessionStorage.getItem('hp_session_data')));

// View page tracking
console.log(JSON.parse(sessionStorage.getItem('hp_page_tracking')));
```

### Simulate First Visit

```javascript
// Clear attribution data to simulate new user
localStorage.removeItem('hp_first_touch');
sessionStorage.clear();

// Then navigate with UTM parameters
window.location.href = '/?utm_source=test&utm_campaign=debugging';
```

### Test Form Submission

1. Clear attribution data
2. Visit with test UTM: `/?utm_source=test_first&utm_campaign=initial`
3. Wait 30 seconds
4. Visit with new UTM: `/?utm_source=test_last&utm_campaign=conversion`
5. Submit form
6. Check Zapier payload includes both `first_touch` and `utms`

## Best Practices

1. **Consistent UTM naming**: Use lowercase, underscores, standard format
2. **Track all sources**: Even "organic" and "direct" are valuable data
3. **Regular audits**: Check attribution data completeness monthly
4. **Cross-reference**: Compare Zapier data with GA4 for validation
5. **Document changes**: Log any attribution logic updates
6. **Test thoroughly**: Verify attribution on different devices/browsers
7. **Monitor storage**: Ensure localStorage isn't blocked

## Future Enhancements

Consider adding:
- **Multi-device tracking**: Cross-device user identification
- **Attribution windows**: Configurable lookback periods
- **Weighted attribution**: Algorithmic credit distribution
- **A/B testing**: Built-in variant tracking
- **Predictive scoring**: ML-based conversion probability
- **Real-time dashboards**: Live attribution visualization
