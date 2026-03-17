# Best Sellers Configuration

The "Shop Our Best Sellers" and "Above Fold Products" sections can show products from a list you provide, based on your analytics (add-to-cart, views, time on page).

## How to Update Best Sellers

1. **Get your top 6 products** from:
   - Shopify Admin > Reports > Sales by product
   - Google Analytics (product views, add-to-cart events)
   - Or any other analytics you use

2. **Find the product handle** for each product:
   - From the product URL: `hairpinns.com/products/walnut-scrub-hair-scalp-pre-wash-treatment` → handle is `walnut-scrub-hair-scalp-pre-wash-treatment`
   - Or in Shopify Admin: Products > [product] > the URL slug in the "Search engine listing" section

3. **Add the handles** to `src/config/featuredProducts.ts` in the `BEST_SELLERS_PRODUCT_HANDLES` array, in order of popularity (first = most popular):

```ts
export const BEST_SELLERS_PRODUCT_HANDLES: string[] = [
  "walnut-scrub-hair-scalp-pre-wash-treatment",  // #1 most popular
  "juuce-heat-shield",
  "aromaganic-curly-curl-hair-shampoo-conditioner-duo",
  // ... up to 6 products
];
```

4. **Leave the array empty** if you prefer to use the Shopify collection (`BEST_SELLERS_COLLECTION_HANDLE`) instead. When empty, the site will pull from the collection.

## Order Matters

The first product in the list appears first in the grid and is treated as the top best seller. List your products from most popular to least popular.
