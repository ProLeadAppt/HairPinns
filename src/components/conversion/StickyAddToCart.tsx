import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface StickyAddToCartProps {
  productTitle: string;
  price: number;
  inStock: boolean;
  onAddToCart: () => void;
  threshold?: number;
}

const StickyAddToCart = ({
  productTitle,
  price,
  inStock,
  onAddToCart,
  threshold = 500,
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg animate-slide-in-bottom md:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-heading truncate">
              {productTitle}
            </p>
            <p className="text-lg font-bold text-brand-500">
              ${price.toFixed(2)}
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onAddToCart}
            disabled={!inStock}
            className="shrink-0"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;
