# Hair Pinns Shopify Messaging lifecycle

Active production automations:

| Journey | Trigger and timing | Exit or suppression |
| --- | --- | --- |
| Welcome new subscribers | Customer subscribes to email marketing; immediate | Shopify marketing consent and unsubscribe status |
| Abandoned product browse | Shopify browse-abandonment trigger | Purchase and Shopify eligibility rules |
| Abandoned cart | Shopify cart-abandonment trigger | Checkout or purchase and Shopify eligibility rules |
| Abandoned checkout | Customer abandons checkout; 10-hour delay | Completed purchase and Shopify eligibility rules |
| Purchase thank-you | Order created; first order or two-plus orders | Transactional branch by order count |
| Post-purchase care | First paid order; 14-day delay | Marketing consent and Shopify eligibility rules |

The welcome email uses `WELCOME15`, an active 15% order discount with no minimum purchase, one use per customer and no discount stacking.

Do not activate the separate welcome series while the immediate welcome automation is active. Do not activate birthday, VIP, nearby-retail or win-back templates until their required customer data, eligibility rules and offer terms are approved.

Shopify's native abandoned browse, cart and checkout sections must remain in their respective messages. They contain the customer-specific products and recovery links that cannot be replaced by a generic HTML button.
