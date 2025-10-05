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

const CART_STORAGE_KEY = "hairpinns_cart_id";

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
      // Create new cart
      console.log("Creating new cart");
      cart = await cartCreate([{ merchandiseId: variantId, quantity }]);
      saveCartId(cart.id);
    }

    console.log("✅ Added to bag:", {
      cartId: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalItems: cart.lines.length,
    });

    return cart;
  } catch (error) {
    console.error("Failed to add to bag:", error);
    
    // If cart is invalid/expired, clear it and try creating a new one
    if (existingCartId) {
      clearCartId();
      console.log("Clearing invalid cart, creating new one...");
      const newCart = await cartCreate([{ merchandiseId: variantId, quantity }]);
      saveCartId(newCart.id);
      return newCart;
    }
    
    throw error;
  }
}

/**
 * Navigate to checkout
 */
export function goToCheckout(checkoutUrl: string): void {
  window.location.href = checkoutUrl;
}
