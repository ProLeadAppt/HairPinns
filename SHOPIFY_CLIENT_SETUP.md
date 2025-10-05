# Shopify Client Setup - Hair Pinns

## Configuration

Shopify Storefront API credentials are now stored in `src/config/projectConfig.ts`:

```typescript
shopify: {
  domain: 'femtat-zu.myshopify.com',
  storefrontToken: 'c4e78c2d75c37a6a3ae370dfc1e71bf4', // PUBLIC token
  apiVersion: '2024-07',
  storeUrl: 'https://hairpinns.com',
}
```

**Note**: The Storefront Access Token is PUBLIC and safe for client-side use.

---

## Shopify Client Library

**File**: `src/lib/shopify.ts`

### Core Functions

#### `fetchShopify<T>(query, variables)`
- GraphQL client for Storefront API
- Handles authentication and error logging
- Returns typed data

#### `getProductByHandle(handle)`
- Fetches product details including:
  - Title, description, availability
  - Pricing and compare-at pricing
  - Images
  - Variants with options

#### `getCollectionByHandle(handle)`
- Fetches collection details including:
  - Title, description
  - Collection image
  - Products (up to 50)

#### `cartCreate(lines)`
- Creates a new Shopify cart
- Returns cart with checkout URL
- Handles user errors

#### `cartLinesAdd(cartId, lines)`
- Adds items to existing cart
- Updates cart totals
- Returns updated cart

#### `getProductUrl(handle)`
- Returns hairpinns.com product URL for fallback

#### `getCollectionUrl(handle)`
- Returns hairpinns.com collection URL for fallback

---

## Sanity Check

**File**: `src/lib/shopifySanityCheck.ts`

Auto-runs in development mode to verify connection:
- ✅ Prints shop name to console on success
- ❌ Logs error if connection fails
- **No secrets are logged**

---

## ProductCard Integration

**File**: `src/components/design-system/ProductCard.tsx`

### Changes:
- Added `handle?: string` prop for Shopify product handle
- `handleAddToCart()`:
  - Calls `onAddToCart()` if provided
  - **Fallback**: Redirects to `hairpinns.com/products/{handle}` if API fails
- `handleViewProduct()`:
  - Calls `onViewProduct()` if provided
  - **Fallback**: Redirects to `hairpinns.com/products/{handle}`
- Added loading state (`isAddingToCart`)

### Usage:
```tsx
<ProductCard
  name="Product Name"
  price={29.99}
  image="/path/to/image.jpg"
  handle="product-handle" // Shopify handle
  inStock={true}
/>
```

---

## Test URLs

All user-facing links point to `https://hairpinns.com`:
- Product: `https://hairpinns.com/products/{handle}`
- Collection: `https://hairpinns.com/collections/{handle}`

API calls use `femtat-zu.myshopify.com`.

---

## Next Steps

1. **Check console** for "✅ Shopify connected: [Shop Name]" message
2. **Test product fetching**: Call `getProductByHandle('your-product-handle')`
3. **Test cart creation**: Use `cartCreate([{ merchandiseId: 'gid://...', quantity: 1 }])`
4. **Integrate PDP (Product Detail Page)** to use cart helpers
5. **Add cart state management** (localStorage or context)
