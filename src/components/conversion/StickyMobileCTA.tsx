import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

interface StickyMobileCTAProps {
  cartTotal?: number;
  itemCount?: number;
  threshold?: number;
}

export default function StickyMobileCTA({
  cartTotal = 0,
  itemCount = 0,
  threshold = 300,
}: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      setIsVisible(window.scrollY > threshold && itemCount > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, itemCount, isDismissed]);

  if (!isVisible || itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden animate-slide-in-bottom">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-semibold text-heading">
                {itemCount} {itemCount === 1 ? "item" : "items"} in bag
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {formatPrice(cartTotal, "AUD")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/cart" className="flex-1">
              <Button variant="primary" size="sm" className="min-w-[100px]">
                Checkout
              </Button>
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

