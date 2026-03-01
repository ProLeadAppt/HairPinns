import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { quickAddToCart, QuickAddProduct } from "@/lib/quickAdd";
import { getCartId } from "@/lib/cartManagement";

interface StickyProductBarProps {
  threshold?: number;
}

const StickyProductBar = ({ threshold = 300 }: StickyProductBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    // ✅ SAFE: Load recently viewed products from localStorage (with error handling)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('hp_recent_products');
        if (stored) {
          try {
            const products = JSON.parse(stored);
            if (Array.isArray(products)) {
              setRecentProducts(products.slice(0, 3)); // Show max 3 products
            }
          } catch (e) {
            console.warn('[StickyProductBar] Failed to parse recent products:', e);
          }
        }

        // Load cart total
        const cartTotalStr = localStorage.getItem('hp_cart_total');
        if (cartTotalStr) {
          try {
            const total = parseFloat(cartTotalStr);
            if (!isNaN(total) && total >= 0) {
              setCartTotal(total);
            }
          } catch (e) {
            console.warn('[StickyProductBar] Failed to parse cart total:', e);
          }
        }
      }
    } catch (error) {
      // localStorage might be disabled or unavailable (private browsing, etc.)
      console.warn('[StickyProductBar] localStorage access failed:', error);
    }

    // ✅ SAFE: Scroll handler with error handling
    const handleScroll = () => {
      try {
        setIsVisible(window.scrollY > threshold);
      } catch (error) {
        console.warn('[StickyProductBar] Scroll handler failed:', error);
      }
    };

    try {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        try {
          window.removeEventListener("scroll", handleScroll);
        } catch (error) {
          // Ignore cleanup errors
        }
      };
    } catch (error) {
      console.warn('[StickyProductBar] Failed to attach scroll listener:', error);
      return () => {}; // Return empty cleanup function
    }
  }, [threshold]);

  const handleQuickAdd = async (product: any) => {
    if (!product.variantId) return;

    setAddingToCart(product.id);

    try {
      const quickAddProduct: QuickAddProduct = {
        variantId: product.variantId,
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        currency: product.currency || "AUD",
        quantity: 1,
      };

      await quickAddToCart(quickAddProduct, true);
    } catch (error) {
      console.error('[StickyProductBar] Failed to add product to cart:', error);
      // Show user-friendly error (optional - could add toast here)
    } finally {
      setAddingToCart(null);
    }
  };

  if (!isVisible || recentProducts.length === 0) return null;

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl animate-slide-in-bottom hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Recently Viewed Products */}
          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Recently viewed:</span>
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-muted rounded-lg p-2 min-w-[200px] hover:bg-muted/80 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-heading line-clamp-1">{product.title}</p>
                  <p className="text-xs font-bold text-brand-500">{formatPrice(product.price, product.currency || "AUD")}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handleQuickAdd(product)}
                  disabled={addingToCart === product.id}
                >
                  {addingToCart === product.id ? (
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Free Shipping Progress */}
          {remainingForFreeShipping > 0 && (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right min-w-[140px]">
                <p className="text-xs font-semibold text-heading">
                  {formatPrice(remainingForFreeShipping, "AUD")} until free shipping
                </p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Cart Total & CTA */}
          {cartTotal > 0 && (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Cart total</p>
                <p className="text-sm font-bold text-brand-500">{formatPrice(cartTotal, "AUD")}</p>
              </div>
            </div>
          )}

          {/* View Cart CTA */}
          <Link to="/collections">
            <Button variant="primary" size="sm" className="gap-2 whitespace-nowrap">
              <ShoppingBag className="w-4 h-4" />
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyProductBar;
