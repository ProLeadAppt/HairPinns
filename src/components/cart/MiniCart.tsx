import { useState } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
}

/**
 * Simplified MiniCart for headless Shopify checkout
 * Cart details are shown on Shopify's checkout page
 */
export default function MiniCart({ open, onClose, cartId }: MiniCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Track begin_checkout
      await trackBeginCheckout({
        cart_total: 0, // Will be calculated on Shopify checkout
        item_count: 0,
        currency: "AUD",
      });
      
      // Redirect to checkout via Edge Function
      const response = await fetch(`/api/checkout?redirect=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          lines: [], // Cart already exists with items
        }),
      });
      
      // Browser should follow redirect automatically
      if (!response.redirected && response.status !== 303) {
        console.error("Checkout redirect failed");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background shadow-2xl z-[61] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border bg-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-heading">Added to Bag!</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-background/80"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close cart</span>
          </Button>
        </header>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-brand-500" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-heading mb-3">
              Item added to your bag!
            </h3>
            <p className="text-muted-foreground mb-6">
              Ready to checkout? You'll see your cart details on the next page.
            </p>
          </div>
        </div>

        {/* Footer with checkout buttons */}
        <div className="border-t border-border p-6 space-y-3 bg-accent">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Redirecting...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
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
      </aside>
    </>
  );
}
