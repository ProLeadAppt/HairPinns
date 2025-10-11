import { cartCreate, cartLinesAdd } from "./shopify";

export interface CartItem {
  variantId: string;
  quantity: number;
  productTitle?: string;
  productHandle?: string;
  price?: number;
  image?: string;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: any[];
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

const CART_STORAGE_KEY = "hp_cart_id";
const CHECKOUT_URL_KEY = "hp_checkout_url";

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
  return localStorage.getItem(CART_STORAGE_KEY);
}

/**
 * Save cart ID to localStorage
 */
export function saveCartId(cartId: string): void {
  localStorage.setItem(CART_STORAGE_KEY, cartId);
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CHECKOUT_URL_KEY);
}

/**
 * Get checkout URL from localStorage
 */
export function getStoredCheckoutUrl(): string | null {
  return localStorage.getItem(CHECKOUT_URL_KEY);
}

/**
 * Save checkout URL to localStorage
 */
export function saveCheckoutUrl(url: string): void {
  localStorage.setItem(CHECKOUT_URL_KEY, url);
}

/**
 * Add item to bag (creates cart if needed, adds to existing cart otherwise)
 * @param variantId - Shopify variant ID (e.g., "gid://shopify/ProductVariant/...")
 * @param quantity - Quantity to add (default: 1)
 * @returns Cart object with checkout URL
 */
export async function addToBag(
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  const existingCartId = getCartId();

  try {
    let cart: Cart;

    if (existingCartId) {
      // Add to existing cart
      console.log("Adding to existing cart:", existingCartId);
      cart = await cartLinesAdd(existingCartId, [
        { merchandiseId: variantId, quantity },
      ]);
    } else {
      // Create new cart with AU country
      console.log("Creating new cart with AU country code");
      cart = await cartCreate([{ merchandiseId: variantId, quantity }]);
      saveCartId(cart.id);
    }

    // Guard: Validate checkout URL exists
    if (!cart.checkoutUrl) {
      console.error("❌ Cart missing checkoutUrl:", cart);
      throw new Error("Checkout URL unavailable. Please try again.");
    }

    // Store checkout URL for later use
    saveCheckoutUrl(cart.checkoutUrl);

    console.log("✅ Added to bag:", {
      cartId: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalItems: cart.lines.length,
    });

    return cart;
  } catch (error: any) {
    console.error("Failed to add to bag:", error);
    
    // If cart is invalid/expired, clear it and try creating a new one
    if (existingCartId && error?.message?.includes("cart")) {
      clearCartId();
      console.log("Clearing invalid cart, creating new one...");
      try {
        const newCart = await cartCreate([{ merchandiseId: variantId, quantity }]);
        
        // Guard: Validate new cart has checkout URL
        if (!newCart.checkoutUrl) {
          console.error("❌ New cart missing checkoutUrl:", newCart);
          throw new Error("Checkout URL unavailable. Please try again.");
        }
        
        saveCartId(newCart.id);
        saveCheckoutUrl(newCart.checkoutUrl);
        return newCart;
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        throw new Error("We couldn't add this to your bag. Please try again or contact us.");
      }
    }
    
    throw new Error("We couldn't add this to your bag. Please try again or contact us.");
  }
}

/**
 * Get checkout URL from localStorage (set during Add to Bag)
 */
export function getCheckoutUrl(): string | null {
  return getStoredCheckoutUrl();
}

