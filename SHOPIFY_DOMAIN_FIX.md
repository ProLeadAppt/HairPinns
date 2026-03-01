# Fix: femtat-zu.myshopify.com Redirecting to hairpinns.com

## The Problem

`femtat-zu.myshopify.com` is configured in Shopify to **redirect to hairpinns.com**. This causes:

1. User clicks "Proceed to Checkout" → lands on `hairpinns.com/cart/c/TOKEN`
2. Netlify proxies that request to `femtat-zu.myshopify.com/cart/c/TOKEN`
3. Shopify returns a redirect back to `hairpinns.com` (because femtat-zu redirects to primary domain)
4. **Redirect loop** or "This store does not exist" error

## The Solution

Change the `femtat-zu.myshopify.com` domain in Shopify so it **serves the store** instead of redirecting.

### Steps in Shopify Admin

1. Go to **Settings** → **Domains**
2. Click on **femtat-zu.myshopify.com**
3. Find the section **"Domain target and type"** where it says **"Redirects to hairpinns.com"**
4. Click the **"Change"** button
5. Look for an option to:
   - **"Set as primary domain"** (don't do this – we want hairpinns.com to stay primary), OR
   - **"Serve Online Store"** / **"Don't redirect"** / **"Show store on this domain"**
6. Select the option that makes femtat-zu **serve the store content** (including checkout) instead of redirecting to hairpinns.com

### If "Change" Doesn't Offer That Option

Shopify's myshopify.com domain may always redirect to the primary domain. In that case:

**Alternative: Redirect users directly to shop.app**

When customers use Shop Pay, checkout goes to `shop.app`. We can update the checkout flow to prefer shop.app URLs when available, or ensure the checkout URL we return doesn't go through the proxy.

**Alternative: Use a 302 redirect instead of proxy**

Instead of proxying (which fetches from femtat-zu and gets a redirect back), we could:
- Have the checkout function return a URL that goes directly to `shop.app` if Shopify provides one
- Or: Remove the proxy and have the client redirect to `femtat-zu.myshopify.com/cart/c/TOKEN` – but if femtat-zu redirects to hairpinns.com, we're stuck

The **root fix** is in Shopify: femtat-zu must serve checkout, not redirect.

### Verify

After changing the setting:
1. Visit `https://femtat-zu.myshopify.com/cart` directly in your browser
2. You should see the Shopify cart/checkout page, **not** a redirect to hairpinns.com
3. Then the Netlify proxy will work: hairpinns.com/cart/c/TOKEN → Netlify fetches from femtat-zu → gets actual checkout content → serves it
