import { useState, useEffect } from "react";
import { X, ShoppingBag, ArrowRight, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import FreeShippingBar from "@/components/conversion/FreeShippingBar";
import { Link } from "react-router-dom";
import { searchProducts } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import EstimatedDelivery from "@/components/product/EstimatedDelivery";

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
  subtotal?: number; // Optional subtotal for free shipping bar
}

/**
 * Simplified MiniCart for headless Shopify checkout
 * Cart details are shown on Shopify's checkout page
 */
export default function MiniCart({ open, onClose, cartId, subtotal = 0 }: MiniCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      // Fetch upsell products
      const fetchUpsells = async () => {
        try {
          const result = await searchProducts("", 3);
          if (result?.products) {
            const products = result.products
              .filter((p: any) => p.availableForSale)
              .slice(0, 2)
              .map((product: any) => {
                const firstImage = product.images?.edges?.[0]?.node;
                const price = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
                return {
                  id: product.id,
                  slug: product.handle,
                  title: product.title,
                  price: price,
                  currency: product.priceRange?.minVariantPrice?.currencyCode || "AUD",
                  image: firstImage?.url || "/placeholder.svg",
                };
              });
            setUpsellProducts(products);
          }
        } catch (error) {
          console.error("Failed to fetch upsells:", error);
        }
      };
      fetchUpsells();
    }
  }, [open]);

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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-heading font-bold text-heading mb-2">
              Item added to your bag!
            </h3>
            <p className="text-sm text-muted-foreground">
              Ready to checkout? You'll see your cart details on the next page.
            </p>
          </div>

          {/* Free Shipping Bar */}
          {subtotal > 0 && (
            <>
              <FreeShippingBar subtotal={subtotal} threshold={100} />
              <EstimatedDelivery cartTotal={subtotal} />
            </>
          )}

          {/* Upsell Products */}
          {upsellProducts.length > 0 && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-heading mb-4">
                Recommended for You
              </h4>
              <div className="space-y-3">
                {upsellProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex gap-3 p-3 rounded-lg border border-border hover:border-brand-300 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-heading line-clamp-1 mb-1">
                        {product.title}
                      </h5>
                      <p className="text-sm font-bold text-brand-500">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-brand-500" />
                <span>14-day returns</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-brand-500" />
                <span>Secure checkout</span>
              </div>
            </div>
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
