# FAQ Feedback Widget & Zapier Integration

## Overview

The FAQ feedback widget allows users to rate the helpfulness of FAQ answers with simple Yes/No buttons. This feedback is tracked to Zapier for analytics and optional contact enrichment in GoHighLevel (GHL).

---

## How It Works

### 1. User Interaction
- User opens an FAQ accordion item and reads the answer
- Below the answer, they see: **"Did this help?"** with **Yes** and **No** buttons
- User clicks one of the buttons
- Widget shows confirmation: **"Thanks for your feedback!"**

### 2. Data Tracking
When a user clicks Yes or No, the following payload is sent to Zapier:

```json
{
  "event_name": "faq_feedback",
  "faq_question": "How do I book an appointment?",
  "helpful": true,
  "page_url": "https://hairpinns.com/services#faqs",
  "client_id": "abc-123-def",
  "timestamp": "2025-10-05T15:30:00Z",
  "referrer": "(direct)",
  "utms": {
    "utm_source": "google",
    "utm_campaign": "hair_services"
  },
  "first_touch": {
    "first_utm_source": "facebook",
    "first_landing_page": "https://hairpinns.com/"
  }
}
```

**Key Fields:**
- `event_name`: Always `"faq_feedback"`
- `faq_question`: The exact text of the FAQ question
- `helpful`: `true` if Yes was clicked, `false` if No was clicked
- `client_id`: Unique browser identifier for the user
- All attribution data is included automatically via `hpCapture`

---

## Where FAQs Are Used

The `FaqFeedbackWidget` component is integrated into:

1. **Services Page** (`/services#faqs`)
   - Questions about bookings, pricing, services, etc.

2. **Product Detail Pages** (`/collections/:collection/:product`)
   - Questions about specific products, usage, ingredients, etc.

3. **Future FAQ sections** (can be added to any page with an Accordion)

---

## Zapier Workflow Setup

### Zap: FAQ Feedback Handler

#### Step 1: Trigger - Webhooks by Zapier
- **Type:** Catch Hook
- **Webhook URL:** `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`
- **Filter:** `event_name = "faq_feedback"`

#### Step 2: Filter - Only FAQ Feedback Events
- **Rule:** Only continue if...
  - `event_name` = `faq_feedback`
  - `faq_question` exists

#### Step 3: Google Sheets - Create Spreadsheet Row

**Sheet Name:** FAQ Feedback Log

**Columns:**
| Column | Zapier Field | Description |
|--------|--------------|-------------|
| Timestamp | `{{timestamp}}` | When feedback was submitted |
| Question | `{{faq_question}}` | The FAQ question text |
| Helpful | `{{helpful}}` | true or false |
| Page URL | `{{page_url}}` | Where the FAQ was viewed |
| Client ID | `{{client_id}}` | Unique browser ID |
| Referrer | `{{referrer}}` | How they arrived at the site |
| UTM Source | `{{utms.utm_source}}` | Last-touch campaign source |
| UTM Campaign | `{{utms.utm_campaign}}` | Last-touch campaign name |
| First UTM Source | `{{first_touch.first_utm_source}}` | First-touch campaign source |

**Purpose:**
- Track which FAQ questions are most/least helpful
- Identify content that needs improvement
- Analyze by traffic source and campaign

---

#### Step 4 (Optional): Lookup Contact in GHL

**Action:** GoHighLevel - Find Contact

**Search Criteria:**
Try to match the user by looking up their `client_id` in a custom field.

**Why Optional:**
- Not all users submitting FAQ feedback are identified (no email/phone yet)
- Only works if the user previously submitted a form with their email/phone
- If you're storing `client_id` in GHL when forms are submitted, you can match anonymous FAQ feedback to known contacts

**Recommended Setup:**
1. In all form submissions, save `client_id` to a GHL custom field: `client_id`
2. In this Zap, search GHL contacts where `client_id = {{client_id}}`
3. If a match is found, continue to Step 5

---

#### Step 5 (Optional): Add Note to GHL Contact

**Action:** GoHighLevel - Create Note

**Conditions:**
- Only run if a contact was found in Step 4
- Only run if `helpful = false` (negative feedback deserves attention)

**Note Content:**
```
FAQ Feedback: Not Helpful

Question: {{faq_question}}
Page: {{page_url}}
Timestamp: {{timestamp}}

This user found this FAQ answer unhelpful. Consider following up or improving the content.
```

**Why This Matters:**
- Negative feedback on FAQs can indicate confusion or unmet needs
- If the user later converts (books or buys), you'll have context about their journey
- Helps identify high-intent users who are researching but not yet converting

---

## Analytics & Reporting

### Key Metrics to Track in Google Sheets

1. **Helpfulness Rate by Question**
   - Formula: `COUNTIF(helpful, TRUE) / COUNTA(helpful)` per question
   - Identify low-scoring FAQs that need rewriting

2. **Most Viewed FAQs**
   - Count frequency of each `faq_question`
   - Prioritize improving top-viewed FAQs

3. **Negative Feedback by Traffic Source**
   - Filter `helpful = false` and group by `utm_source`
   - Identify if certain campaigns drive confused visitors

4. **FAQ Engagement by Page**
   - Compare feedback volume between `/services` and product detail pages
   - Understand where users need more help

### Sample Sheet Formula Examples

**Helpfulness Rate for a Specific Question:**
```
=COUNTIFS(B:B, "How do I book an appointment?", C:C, TRUE) / COUNTIF(B:B, "How do I book an appointment?")
```

**Total Negative Feedback This Month:**
```
=COUNTIFS(C:C, FALSE, A:A, ">="&DATE(2025,10,1))
```

---

## Frontend Implementation

### FaqFeedbackWidget Component

**File:** `src/components/FaqFeedbackWidget.tsx`

**Props:**
- `question: string` - The text of the FAQ question (required)

**Features:**
- Minimal, non-intrusive design
- Thumbs Up / Thumbs Down buttons
- Instant feedback confirmation
- Automatic tracking to Zapier via `hpCapture.trackEvent()`

**Usage Example:**
```tsx
import FaqFeedbackWidget from "@/components/FaqFeedbackWidget";

<AccordionContent>
  <div>This is the FAQ answer text...</div>
  <FaqFeedbackWidget question={faq.question} />
</AccordionContent>
```

---

## Testing the Integration

### 1. Test Frontend Widget
1. Navigate to `/services` or a product detail page
2. Open an FAQ accordion item
3. Click **Yes** or **No**
4. Verify "Thanks for your feedback!" appears

### 2. Test Zapier Payload
1. Click a feedback button
2. Go to Zapier Task History
3. Verify webhook was received with:
   - ✓ `event_name: "faq_feedback"`
   - ✓ `faq_question: "..."` (correct question text)
   - ✓ `helpful: true` or `false`
   - ✓ `client_id`, `page_url`, `timestamp` are populated

### 3. Test Google Sheets Logging
1. Check your FAQ Feedback Log sheet
2. Verify new row was added with all fields populated
3. Test formula calculations (helpfulness rate, etc.)

### 4. Test GHL Contact Matching (Optional)
1. Submit a form with your email (e.g., newsletter signup)
2. Note the `client_id` in Zapier Task History
3. On the same browser, submit FAQ feedback
4. Check GHL to see if a note was added to your contact

---

## Privacy & GDPR Compliance

- **No PII Collected:** The widget does not collect names, emails, or phone numbers
- **Anonymous by Default:** Only `client_id` (a random UUID) is used
- **Optional Contact Linking:** Only links feedback to GHL contacts if they previously opted in via form submission
- **Data Retention:** Recommend setting a retention policy in Google Sheets (e.g., 12 months)

---

## Improving FAQ Content

### When to Revise an FAQ

Revise if:
- Helpfulness rate < 60%
- More than 5 "No" votes in a month
- High view count but low helpfulness

### How to Use Feedback

1. **Read the Question Again**
   - Is it clear? Does it match what users are really asking?

2. **Review the Answer**
   - Is it concise and actionable?
   - Does it address common follow-up questions?

3. **Add Examples or Visuals**
   - Consider adding screenshots, videos, or step-by-step lists

4. **A/B Test Changes**
   - Update the answer and monitor helpfulness rate over the next month

---

## Future Enhancements

### Optional Text Feedback
Add a text input for users who click "No":
```tsx
{feedback === 'no' && (
  <textarea 
    placeholder="What could we improve?"
    onChange={(e) => setAdditionalFeedback(e.target.value)}
  />
)}
```

### FAQ Search Analytics
Combine with FAQ search feature to track:
- What users are searching for but not finding
- Most searched terms

### Sentiment Analysis
Use Lovable AI or external API to analyze negative feedback text for themes.

---

## Related Documentation

- [ATTRIBUTION_TRACKING.md](./ATTRIBUTION_TRACKING.md) - Client ID and attribution data
- [DOUBLE_OPT_IN.md](./DOUBLE_OPT_IN.md) - Form submission workflows
- [ZAPIER_CONTACT_FORM.md](./ZAPIER_CONTACT_FORM.md) - Contact form integration

---

## Summary Checklist

### Frontend
- [x] `FaqFeedbackWidget` component created
- [x] Integrated into Services page
- [x] Integrated into Product Detail pages
- [ ] (Optional) Add to About page or other FAQ sections

### Zapier Setup
- [ ] Create "FAQ Feedback Handler" Zap
- [ ] Set up Google Sheets logging with formulas
- [ ] (Optional) Set up GHL contact lookup and notes
- [ ] Test end-to-end flow
- [ ] Enable Zap and monitor for 1 week

### Analytics
- [ ] Create Google Sheets dashboard with helpfulness rates
- [ ] Set up monthly review process
- [ ] Assign owner to act on negative feedback

### Content Improvement
- [ ] Baseline all FAQ helpfulness rates
- [ ] Set targets (e.g., >70% helpful rate)
- [ ] Schedule quarterly FAQ content review
