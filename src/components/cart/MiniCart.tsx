import { useEffect, useState } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCheckoutUrl } from "@/lib/cartManagement";
import { fetchShopify } from "@/lib/shopify";
import { trackBeginCheckout } from "@/lib/ecommerceTracking";
import { gotoCheckout } from "@/lib/checkout";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image?: {
      url: string;
      altText: string | null;
    };
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
    };
  };
};

export interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
}

export default function MiniCart({ open, onClose, cartId }: MiniCartProps) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState<string>("0.00");
  const [subtotalAmount, setSubtotalAmount] = useState<number>(0);
  const [currencyCode, setCurrencyCode] = useState<string>("AUD");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !cartId) return;

    const fetchCart = async () => {
      setLoading(true);
      try {
        const query = `
          query($id: ID!) {
            cart(id: $id) {
              checkoutUrl
              cost {
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
              lines(first: 50) {
                nodes {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      image {
                        url
                        altText
                      }
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
          }
        `;
        
        const data = await fetchShopify<any>(query, { id: cartId });
        const cart = data.cart;
        
        setCheckoutUrl(cart.checkoutUrl);
        setSubtotal(parseFloat(cart.cost.subtotalAmount.amount).toFixed(2));
        setSubtotalAmount(parseFloat(cart.cost.subtotalAmount.amount));
        setCurrencyCode(cart.cost.subtotalAmount.currencyCode);
        setLines(cart.lines.nodes);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [open, cartId]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      await trackBeginCheckout({
        cart_total: subtotalAmount,
        item_count: lines.length,
        currency: currencyCode,
      });
      
      if (checkoutUrl) {
        console.log("🛒 Redirecting to checkout:", checkoutUrl);
        gotoCheckout(checkoutUrl);
      } else {
        throw new Error("No checkout URL available");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Unable to proceed to checkout. Please try again.");
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
              <h2 className="text-lg font-heading font-bold text-heading">Your Bag</h2>
              <p className="text-xs text-muted-foreground">
                {lines.length} {lines.length === 1 ? 'item' : 'items'}
              </p>
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

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-heading mb-1">Your bag is empty</h3>
                <p className="text-sm text-muted-foreground">
                  Start shopping to add items to your bag
                </p>
              </div>
              <Button
                variant="primary"
                onClick={onClose}
                className="mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                className="flex gap-4 p-4 bg-card border border-border rounded-card hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-card overflow-hidden bg-muted flex-shrink-0">
                  {line.merchandise.image ? (
                    <img
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || line.merchandise.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-heading mb-1 line-clamp-2">
                    {line.merchandise.product.title}
                  </h3>
                  {line.merchandise.title !== "Default Title" && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {line.merchandise.title}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-500">
                      ${parseFloat(line.merchandise.priceV2.amount).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Qty:</span>
                      <Badge variant="secondary" className="px-2 py-0.5">
                        {line.quantity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-accent">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-heading">{subtotal} {currencyCode}</span>
            </div>

            {/* Shipping Notice */}
            <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-card">
              Shipping and taxes calculated at checkout
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              variant="primary"
              size="lg"
              className="w-full bg-brand-500 hover:bg-brand-600"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Continue Shopping */}
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
