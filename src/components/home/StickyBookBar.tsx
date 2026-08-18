import { useEffect, useState } from "react";
import { CalendarCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { useFloatingActions } from "@/contexts/FloatingActionsContext";

/**
 * Mobile quick-action bar. Shopping is the primary path across the product-led
 * homepage; salon booking remains available as a quieter secondary action.
 */
const StickyBookBar = () => {
  const [passedScrollThreshold, setPassedScrollThreshold] = useState(false);
  const { dockBlocked, dockRef, setDockVisible } = useFloatingActions();
  const visible = passedScrollThreshold && !dockBlocked;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;
    const updateScrollThreshold = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPassedScrollThreshold(window.scrollY > 400);
      });
    };

    updateScrollThreshold();
    window.addEventListener("scroll", updateScrollThreshold, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollThreshold);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setDockVisible(visible);
    return () => setDockVisible(false);
  }, [setDockVisible, visible]);

  if (!visible) return null;

  return (
    <div
      ref={dockRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--after-hours-copper)/0.72)] bg-[hsl(var(--after-hours-cream)/0.97)] text-[hsl(var(--after-hours-plum))] shadow-[0_-10px_28px_-18px_hsl(var(--after-hours-near-black)/0.5)] backdrop-blur lg:hidden"
      role="region"
      aria-label="Quick shop bar"
      data-mobile-action-dock=""
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 pt-2.5 [padding-bottom:calc(0.625rem+env(safe-area-inset-bottom))]">
          <Button
            asChild
            variant="primary"
            size="default"
            className="min-h-12 flex-1 rounded-none border border-[hsl(var(--after-hours-plum))] bg-[hsl(var(--after-hours-plum))] font-semibold text-[hsl(var(--after-hours-cream))] shadow-none hover:bg-[hsl(var(--after-hours-near-black))] focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-2"
          >
            <Link
              to="/collections"
              aria-label="Shop all products"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).dataLayer) {
                  (window as any).dataLayer.push({
                    event: "shop_click",
                    location: "sticky_bar_mobile",
                    cta: "shop_all",
                  });
                }
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop products</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="min-h-12 shrink-0 rounded-none border-[hsl(var(--after-hours-plum))] bg-transparent px-3 font-semibold text-[hsl(var(--after-hours-plum))] shadow-none hover:bg-[hsl(var(--after-hours-copper)/0.18)] focus-visible:ring-2 focus-visible:ring-[hsl(var(--after-hours-copper))] focus-visible:ring-offset-2"
          >
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book salon appointment (opens in new tab)"
              onClick={() => trackBookingClick("sticky_bar_mobile_secondary", window.location.pathname)}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book salon</span>
            </a>
          </Button>
      </div>
    </div>
  );
};

export default StickyBookBar;
