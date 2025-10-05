# Shopify Order Webhooks - Server-Side Integration

## Overview

This document covers the **authoritative** server-side order tracking via Shopify webhooks to Zapier. The client-side `purchase_client` event on `/order-confirmation` is a backup for analytics cross-checking.

**Important**: Server-side webhooks are the source of truth for order data. Client-side tracking can be blocked by ad blockers or browser settings.

## Shopify Webhook Setup

### Access Shopify Admin Webhooks

1. Log into Shopify Admin
2. Navigate to: **Settings → Notifications → Webhooks**
3. Click **Create webhook**

### Webhook #1: Order Paid

**Event**: `Order payment`  
**Format**: JSON  
**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`  
**API Version**: Latest stable (2024-10+)

**Triggered When**: Customer completes payment (including Afterpay, Klarna, etc.)

**Webhook Fields to Include**:
- `id` - Shopify order ID
- `order_number` - Display order number
- `email` - Customer email
- `phone` - Customer phone
- `name` - Order name (#1001)
- `customer` - Customer object
- `line_items` - Array of products
- `total_price` - Order total
- `subtotal_price` - Subtotal before shipping/tax
- `total_tax` - Tax amount
- `total_discounts` - Discount amount
- `shipping_address` - Shipping details
- `billing_address` - Billing details
- `created_at` - Order timestamp
- `financial_status` - Payment status
- `fulfillment_status` - Shipping status

---

### Webhook #2: Order Fulfilled

**Event**: `Order fulfillment`  
**Format**: JSON  
**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`  
**API Version**: Latest stable (2024-10+)

**Triggered When**: Order is marked as fulfilled/shipped

**Use Case**: 
- Update order status in GHL
- Trigger shipping notification workflow
- Track fulfillment rate metrics

---

## Zapier Workflow for Order Paid

### Trigger

**App**: Webhooks by Zapier  
**Event**: Catch Hook  
**URL**: `https://hooks.zapier.com/hooks/catch/23975177/u9frxmo/`

**Sample Payload**:
```json
{
  "id": 5432109876,
  "order_number": 1001,
  "email": "jane@example.com",
  "phone": "+61412345678",
  "customer": {
    "id": 7654321,
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "line_items": [
    {
      "id": 12345,
      "title": "Hydrate & Restore Pack",
      "quantity": 1,
      "price": "89.00",
      "product_id": 98765,
      "variant_id": 43210
    }
  ],
  "total_price": "99.95",
  "subtotal_price": "89.00",
  "total_tax": "9.00",
  "total_discounts": "0.00",
  "currency": "AUD",
  "created_at": "2025-01-15T14:30:00+11:00",
  "financial_status": "paid",
  "fulfillment_status": null
}
```

---

### Step 1: Parse Order Data

**Action**: Code by Zapier - Run JavaScript

**Purpose**: Clean and structure order data for GHL

**Code**:
```javascript
// Extract customer info
const customer = {
  email: inputData.email,
  phone: inputData.phone,
  first_name: inputData.customer?.first_name || inputData.email.split('@')[0],
  last_name: inputData.customer?.last_name || '',
};

// Calculate order metrics
const orderValue = parseFloat(inputData.total_price || 0);
const itemCount = (inputData.line_items || []).reduce((sum, item) => sum + item.quantity, 0);

// Format line items
const lineItems = (inputData.line_items || []).map(item => ({
  title: item.title,
  quantity: item.quantity,
  price: parseFloat(item.price),
  total: parseFloat(item.price) * item.quantity,
  product_id: item.product_id,
  variant_id: item.variant_id,
}));

// Return structured data
output = {
  ...customer,
  order_id: inputData.id,
  order_number: inputData.order_number,
  order_value: orderValue,
  subtotal: parseFloat(inputData.subtotal_price || 0),
  tax: parseFloat(inputData.total_tax || 0),
  discounts: parseFloat(inputData.total_discounts || 0),
  currency: inputData.currency || 'AUD',
  item_count: itemCount,
  line_items: JSON.stringify(lineItems),
  created_at: inputData.created_at,
  financial_status: inputData.financial_status,
  fulfillment_status: inputData.fulfillment_status,
};
```

---

### Step 2: Create/Update Contact in GHL

**Action**: GoHighLevel - Find or Create Contact

**Search Fields**:
- Email: `{{email}}` (from Step 1)
- Phone: `{{phone}}` (from Step 1)

**If Not Found, Create With**:
- First Name: `{{first_name}}`
- Last Name: `{{last_name}}`
- Email: `{{email}}`
- Phone: `{{phone}}`

**Custom Fields to Update**:
- `last_order_id`: `{{order_id}}`
- `last_order_date`: `{{created_at}}`
- `last_order_value`: `{{order_value}}`
- `total_orders`: *Increment by 1 (use Formatter)*
- `lifetime_value`: *Add {{order_value}} to existing (use Formatter)*
- `average_order_value`: *Recalculate (lifetime_value / total_orders)*

---

### Step 3: Calculate Lifetime Value (LTV)

**Action**: Formatter by Zapier - Spreadsheet-Style Formula

**Operation**: Add Numbers

**Inputs**:
- Existing LTV: `{{contact.lifetime_value}}` (from Step 2, default: 0)
- New Order Value: `{{order_value}}` (from Step 1)

**Output**: `new_lifetime_value`

**Then**: Update contact custom field `lifetime_value` with result

---

### Step 4: Apply Tags

**Action**: GoHighLevel - Add Tags to Contact

**Contact ID**: `{{contact_id}}` (from Step 2)

**Tags to Add**:
- `purchaser` (base tag for all customers)
- `purchased_{{order_number}}` (specific order reference)

**Conditional Tags** (use Filter/Paths):
- If `order_value` >= 150: Add tag `high_value_customer`
- If `total_orders` >= 3: Add tag `repeat_customer`
- If `total_orders` = 1: Add tag `first_time_customer`

---

### Step 5: Create Order Note in GHL

**Action**: GoHighLevel - Create Note

**Contact ID**: `{{contact_id}}` (from Step 2)

**Note Body**:
```
🛍️ ORDER PLACED

Order #{{order_number}}
Total: ${{order_value}} {{currency}}
Items: {{item_count}}

Products:
{{line_items}}

Status: {{financial_status}} | {{fulfillment_status}}
Date: {{created_at}}

View in Shopify: https://yourstore.myshopify.com/admin/orders/{{order_id}}
```

**Purpose**: 
- Quick order reference in GHL
- Customer service context
- Order history tracking

---

### Step 6: Start Post-Purchase Workflow

**Action**: GoHighLevel - Add Contact to Workflow

**Contact ID**: `{{contact_id}}` (from Step 2)

**Workflow**: `Post-Purchase Education & Re-Buy`

**Workflow Steps** (configured in GHL):

**Day 0** (Immediate):
- SMS: "Thanks for your order! 🎉 Track it here: [tracking_link]. Questions? Reply anytime."
- Email: Order confirmation with care instructions

**Day 3**:
- SMS: "How's your new [product_name]? Share a pic and tag us @hairpinns for a chance to win!"
- Email: Product usage tips and tricks

**Day 7**:
- Email: Educational content - "How to Get the Most from Your [Product]"

**Day 14**:
- SMS: Quick check-in - "Loving your [product]? Leave a review: [review_link]"

**Day 30**:
- Email: Re-stock reminder with 10% off code
- Include: "Based on your purchase, you might also love..."

**Day 60**:
- Email: Replenishment campaign - "Time to restock?"
- SMS: "Your [product] should be running low. Reorder with code REFILL15"

**Day 90**:
- Email: Win-back campaign if no repeat purchase
- Offer: Free shipping + bonus sample

---

### Step 7: Notify Team (Optional)

**Filter**: Only if `order_value` > 200 (high-value orders)

**Action**: Slack - Send Channel Message

**Channel**: `#orders` or `#high-value-orders`

**Message**:
```
💰 *High-Value Order Alert*

*Customer*: {{first_name}} {{last_name}}
*Order*: #{{order_number}}
*Total*: ${{order_value}} {{currency}}
*Items*: {{item_count}}

*Products*:
{{line_items}}

<https://yourstore.myshopify.com/admin/orders/{{order_id}}|View in Shopify>
<https://app.gohighlevel.com/contacts/{{contact_id}}|View in GHL>
```

---

## Client-Side Purchase Event

The `/order-confirmation` page fires a `purchase_client` event as a backup tracking method.

### Event Payload

```json
{
  "event_name": "purchase_client",
  "order_id": "5432109876",
  "subtotal": 89.00,
  "total": 99.95,
  "currency": "AUD",
  "items": [
    {
      "title": "Hydrate & Restore Pack",
      "id": "98765",
      "quantity": 1,
      "price": 89.00
    }
  ],
  "item_count": 1,
  "page_url": "https://hairpinns.com.au/order-confirmation?order_id=5432109876",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "client_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Data Sources (Priority Order)

1. **URL Parameters**: `?order_id=123&total=99.95&items=[...]`
2. **dataLayer**: Google Tag Manager integration
3. **sessionStorage**: Stored by checkout process

### Usage in Zapier (Optional Path)

**Filter**: Only process if no matching server-side webhook received within 5 minutes

**Purpose**: Catch edge cases where Shopify webhook fails

**Action**: Same as Steps 2-6 above, but with lower priority

---

## Webhook Testing

### Test Order Paid Webhook

1. In Shopify Admin, navigate to Webhooks
2. Click on your Order Paid webhook
3. Click **Send test notification**
4. Verify in Zapier:
   - Webhook caught successfully
   - Contact created/updated in GHL
   - LTV calculated correctly
   - Tags applied
   - Workflow started

### Test Order Fulfilled Webhook

1. Create a test order in Shopify
2. Mark order as fulfilled
3. Verify webhook fires
4. Check GHL:
   - Order status updated
   - Shipping notification sent

### Test Client-Side Tracking

1. Navigate to: `/order-confirmation?order_id=TEST123&total=99.95`
2. Check browser console for tracking log
3. Verify in Zapier webhook history
4. Confirm event shows as `purchase_client`

---

## Error Handling

### Shopify Webhook Failures

**Issue**: Webhook delivery fails  
**Shopify Behavior**: Retries up to 19 times over 48 hours  
**Action**: Monitor webhook status in Shopify Admin

### Duplicate Orders

**Issue**: Same order processed twice (webhook + client)  
**Solution**: Use `dedupe_key` in Zapier to prevent duplicates:
```
dedupe_key = sha256(order_id + "purchase")
```

### Missing Customer Email

**Issue**: Guest checkout without email  
**Fallback**: Use phone number as primary identifier in GHL

---

## Analytics & Reporting

### Key Metrics to Track

**Revenue Metrics**:
- Total revenue (sum of all order_value)
- Average order value (AOV)
- Lifetime value per customer (LTV)
- Revenue by product category

**Customer Metrics**:
- First-time vs. repeat customer ratio
- Repeat purchase rate
- Time between purchases
- Customer churn rate

**Campaign Attribution**:
- Revenue by UTM source/campaign
- Conversion rate by traffic source
- Customer acquisition cost (CAC)
- Return on ad spend (ROAS)

### Dashboard Setup in GHL

Create custom reports for:
1. **Daily Sales**: Total orders, revenue, AOV
2. **Customer LTV**: Top customers by lifetime value
3. **Product Performance**: Best sellers, revenue by product
4. **Repeat Purchase**: Days to second purchase, repurchase rate
5. **Campaign ROI**: Revenue attributed to each campaign

---

## Privacy & Compliance

### Data Collection
- Order data stored securely in GHL
- Personal information (email, phone, address) encrypted
- Payment info NOT stored (handled by Shopify)

### GDPR Compliance
- Right to access: Customers can request order history
- Right to erasure: Delete customer data on request
- Data retention: Configure in GHL settings

### PCI Compliance
- No credit card data touches Zapier or GHL
- All payment processing via Shopify (PCI Level 1 certified)

---

## Troubleshooting

### Order not appearing in GHL

1. Check Shopify webhook delivery status
2. Verify webhook URL is correct
3. Check Zapier task history for errors
4. Confirm GHL API connection active

### LTV not calculating correctly

1. Verify Formatter step configuration
2. Check existing LTV custom field has default value (0)
3. Ensure order_value is parsed as number, not string

### Workflow not triggering

1. Confirm workflow is published in GHL
2. Check workflow trigger conditions
3. Verify contact has required fields (email/phone)

### Duplicate orders in GHL

1. Implement dedupe_key (see Error Handling)
2. Check if both webhooks firing for same event
3. Verify Zapier isn't running multiple times

---

## Best Practices

1. **Monitor webhook health**: Check Shopify webhook status weekly
2. **Test with real orders**: Don't rely solely on test notifications
3. **Set up alerts**: Slack/email notifications for webhook failures
4. **Regular audits**: Compare Shopify orders vs. GHL contacts monthly
5. **Document workflows**: Keep GHL workflows documented and versioned
6. **Backup tracking**: Client-side event catches edge cases
7. **Secure webhooks**: Use webhook signature verification (Shopify feature)

---

## Future Enhancements

Consider adding:
- **Order refunded webhook**: Handle refunds/cancellations
- **Abandoned cart recovery**: Shopify checkout webhook
- **Inventory alerts**: Low stock notifications
- **Product recommendations**: AI-based next-purchase suggestions
- **Subscription management**: Recurring order handling
- **Review requests**: Auto-send after fulfillment + 7 days
