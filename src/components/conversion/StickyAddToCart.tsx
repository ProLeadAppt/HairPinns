import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface StickyAddToCartProps {
  productTitle: string;
  price: number;
  inStock: boolean;
  onAddToCart: () => void;
  threshold?: number;
}

const overlapsViewport = (element: Element | null) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

const StickyAddToCart = ({
  productTitle,
  price,
  inStock,
  onAddToCart,
  threshold = 500,
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const updateVisibility = () => {
      frame = null;
      const primaryActions = document.querySelector('[data-product-purchase-actions]');
      const footer = document.querySelector('[data-home-footer]') || document.querySelector('footer');
      setIsVisible(
        window.scrollY > threshold &&
        !overlapsViewport(primaryActions) &&
        !overlapsViewport(footer),
      );
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <div
      data-product-sticky-purchase=""
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(var(--after-hours-copper)/0.55)] bg-[hsl(var(--after-hours-cream)/0.98)] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[hsl(var(--after-hours-plum))]">{productTitle}</p>
          {Number.isFinite(price) && price > 0 && (
            <p className="font-heading text-lg text-[hsl(var(--after-hours-plum))]">${price.toFixed(2)}</p>
          )}
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={onAddToCart}
          disabled={!inStock}
          className="min-h-12 shrink-0 rounded-none bg-[hsl(var(--after-hours-plum))] text-[hsl(var(--after-hours-cream))] shadow-none"
        >
          <ShoppingBag className="h-5 w-5" />
          Add to bag
        </Button>
      </div>
    </div>
  );
};

export default StickyAddToCart;
