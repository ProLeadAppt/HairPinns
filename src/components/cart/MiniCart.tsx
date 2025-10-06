import { useState, useEffect } from "react";
import { X, ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Cart } from "@/lib/cartManagement";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import { gotoCheckout } from "@/lib/checkout";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart | null;
}

const MiniCart = ({ isOpen, onClose, cart }: MiniCartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const itemCount = cart?.lines?.length || 0;
  const total = cart?.cost?.totalAmount
    ? parseFloat(cart.cost.totalAmount.amount)
    : 0;

  const handleCheckout = () => {
    if (!cart || itemCount === 0) return;
    
    // Track begin_checkout to Zapier
    trackBeginCheckout({
      cart_total: total,
      item_count: itemCount,
      currency: "AUD",
    });
    
    // Use checkout URL if available, otherwise fallback to native cart
    if (cart.checkoutUrl) {
      console.log("🛒 Redirecting to checkout:", cart.checkoutUrl);
      gotoCheckout(cart.checkoutUrl);
    } else {
      // Fallback to native cart with first variant
      const firstLine = cart.lines[0];
      const variantId = firstLine?.merchandise?.id?.split('/').pop();
      if (variantId) {
        const fallbackUrl = `https://hairpinns.com/cart/${variantId}:1`;
        console.warn("⚠️ Using native cart fallback:", fallbackUrl);
        gotoCheckout(fallbackUrl);
      } else {
        console.error("❌ No checkout URL or variant available");
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-50 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-heading font-bold text-heading">
              Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart || itemCount === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-heading mb-2">
                Your bag is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Add products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.lines.map((line: any) => {
                const variant = line.merchandise;
                const product = variant.product;
                const price = parseFloat(variant.priceV2.amount);

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 p-4 bg-muted rounded-card"
                  >
                    <div className="w-20 h-20 bg-background rounded flex-shrink-0">
                      {/* Placeholder for product image */}
                      <div className="w-full h-full bg-muted/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-heading text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>
                      {variant.title !== "Default Title" && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {variant.title}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          ${price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {line.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && itemCount > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span className="text-foreground">Subtotal</span>
              <span className="text-heading">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
            >
              Checkout
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
