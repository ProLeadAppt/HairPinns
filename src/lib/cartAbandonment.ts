// Cart Abandonment Tracking Utility
// Tracks cart creation and sends abandonment events to GHL

// hpCapture will be imported dynamically to avoid blocking app load

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartData {
  cartId: string;
  checkoutUrl: string;
  items: CartItem[];
  total: number;
  currency: string;
  createdAt: number;
}

const CART_STORAGE_KEY = "hp_cart_data";
const ABANDONMENT_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Save cart data to localStorage for abandonment tracking
 */
export function saveCartData(cartData: CartData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      ...cartData,
      createdAt: Date.now(),
    }));
  } catch (error) {
    console.error("Failed to save cart data:", error);
  }
}

/**
 * Get saved cart data from localStorage
 */
export function getCartData(): CartData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to get cart data:", error);
    return null;
  }
}

/**
 * Clear cart data (called on successful checkout)
 */
export function clearCartData(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart data:", error);
  }
}

/**
 * Check for abandoned cart and send tracking event
 * Should be called periodically or on page visibility change
 */
export async function checkAbandonedCart(): Promise<boolean> {
  const cartData = getCartData();
  if (!cartData) return false;

  const now = Date.now();
  const timeSinceCreation = now - cartData.createdAt;

  // Check if cart is abandoned (older than threshold and no checkout initiated)
  if (timeSinceCreation > ABANDONMENT_DELAY) {
    // Check if user is still on checkout page
    const isOnCheckout = window.location.pathname.includes("/checkout") || 
                         window.location.href.includes("checkout.shopify.com");
    
    if (!isOnCheckout) {
      // Send abandonment event to GHL (non-blocking)
      try {
        const hpCaptureModule = await import("./hpCapture");
        const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
        if (hpCapture) {
          await hpCapture.trackEvent("cart_abandoned", {
            cart_id: cartData.cartId,
            checkout_url: cartData.checkoutUrl,
            cart_total: cartData.total,
            currency: cartData.currency,
            item_count: cartData.items.length,
            items: cartData.items.map(item => ({
              product_id: item.id,
              product_title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
            abandoned_after_seconds: Math.round(timeSinceCreation / 1000),
          });
        }
      } catch (error) {
        console.warn('[CartAbandonment] Failed to track abandonment:', error);
      }

      return true;
    }
  }

  return false;
}

/**
 * Track cart creation/update
 */
export async function trackCartCreated(
  cartId: string,
  checkoutUrl: string,
  items: CartItem[],
  total: number,
  currency: string = "AUD"
): Promise<void> {
  const cartData: CartData = {
    cartId,
    checkoutUrl,
    items,
    total,
    currency,
    createdAt: Date.now(),
  };

  saveCartData(cartData);

  // Track cart creation event (non-blocking)
  try {
    const hpCaptureModule = await import("./hpCapture");
    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
    if (hpCapture) {
      await hpCapture.trackEvent("cart_created", {
        cart_id: cartId,
        checkout_url: checkoutUrl,
        cart_total: total,
        currency,
        item_count: items.length,
        items: items.map(item => ({
          product_id: item.id,
          product_title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  } catch (error) {
    console.warn('[CartAbandonment] Failed to track cart creation:', error);
  }
}

/**
 * Initialize cart abandonment monitoring
 * Call this once on app load
 */
export function initCartAbandonmentMonitoring(): void {
  if (typeof window === "undefined") return;

  // Check for abandoned cart on page visibility change
  document.addEventListener("visibilitychange", async () => {
    if (document.hidden) {
      // Page hidden - check for abandonment
      await checkAbandonedCart();
    }
  });

  // Check periodically (every 2 minutes)
  setInterval(async () => {
    await checkAbandonedCart();
  }, 2 * 60 * 1000);

  // Check on page unload
  window.addEventListener("beforeunload", async () => {
    await checkAbandonedCart();
  });
}

