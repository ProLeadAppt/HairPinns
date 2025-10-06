import { projectConfig } from "@/config/projectConfig";

const { domain, storefrontToken, apiVersion, storeUrl } = projectConfig.shopify;

if (!domain || !storefrontToken) {
  throw new Error("Shopify configuration missing");
}

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

/**
 * Fetch data from Shopify Storefront API
 */
export async function fetchShopify<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  
  if (json.errors) {
    console.error("Shopify API errors:", json.errors);
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data;
}

/**
 * Get product by handle
 */
export async function getProductByHandle(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchShopify<{ product: any }>(query, { handle });
    return data.product;
  } catch (error) {
    console.error(`Failed to fetch product ${handle}:`, error);
    return null;
  }
}

/**
 * Get collection by handle
 */
export async function getCollectionByHandle(handle: string) {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchShopify<{ collection: any }>(query, { handle });
    return data.collection;
  } catch (error) {
    console.error(`Failed to fetch collection ${handle}:`, error);
    return null;
  }
}

/**
 * Create a new cart
 */
export async function cartCreate(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await fetchShopify<{ cartCreate: any }>(query, {
      input: { lines },
    });

    if (data.cartCreate.userErrors?.length > 0) {
      console.error("Cart create errors:", data.cartCreate.userErrors);
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    return data.cartCreate.cart;
  } catch (error) {
    console.error("Failed to create cart:", error);
    throw error;
  }
}

/**
 * Add lines to existing cart
 */
export async function cartLinesAdd(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await fetchShopify<{ cartLinesAdd: any }>(query, {
      cartId,
      lines,
    });

    if (data.cartLinesAdd.userErrors?.length > 0) {
      console.error("Cart lines add errors:", data.cartLinesAdd.userErrors);
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error("Failed to add cart lines:", error);
    throw error;
  }
}

/**
 * Get shop info (sanity check)
 */
export async function getShopInfo() {
  const query = `
    query {
      shop {
        name
        primaryDomain {
          url
        }
      }
    }
  `;

  try {
    const data = await fetchShopify<{ shop: { name: string; primaryDomain: { url: string } } }>(query);
    console.log("✅ Shopify connected:", data.shop.name);
    return data.shop;
  } catch (error) {
    console.error("❌ Shopify connection failed:", error);
    throw error;
  }
}

/**
 * Get all collections (for debugging)
 */
export async function getAllCollections(first: number = 20) {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;
  
  try {
    const data = await fetchShopify<{ collections: any }>(query, { first });
    return data.collections.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("❌ Failed to fetch collections:", error);
    throw error;
  }
}

/**
 * Get product URL for fallback
 */
export function getProductUrl(handle: string): string {
  return `${storeUrl}/products/${handle}`;
}

/**
 * Get collection URL for fallback
 */
export function getCollectionUrl(handle: string): string {
  return `${storeUrl}/collections/${handle}`;
}

export { storeUrl };
