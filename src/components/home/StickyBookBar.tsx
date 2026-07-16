import { useEffect, useState } from "react";
import { CalendarCheck, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

/**
 * Mobile quick-action bar. Shopping is the primary path across the product-led
 * homepage; salon booking remains available as a quieter secondary action.
 */
const StickyBookBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;
    const updateVisibility = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const salonClose = document.querySelector<HTMLElement>("[data-home-booking-close]");
        const salonRect = salonClose?.getBoundingClientRect();
        const salonIsVisible = Boolean(
          salonRect && salonRect.bottom > 0 && salonRect.top < window.innerHeight,
        );

        const footer = document.querySelector<HTMLElement>("footer");
        const footerRect = footer?.getBoundingClientRect();
        const footerIsVisible = Boolean(
          footerRect && footerRect.bottom > 0 && footerRect.top <= window.innerHeight - 40,
        );

        setVisible(window.scrollY > 400 && !salonIsVisible && !footerIsVisible);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    // The salon close and footer are deferred. Recalculate as soon as either is
    // inserted so the bar cannot remain over newly mounted conversion content.
    const mountObserver = new MutationObserver(updateVisibility);
    mountObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      mountObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      role="region"
      aria-label="Quick shop bar"
    >
      <div className="bg-white/95 backdrop-blur border-t border-border shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <Button
            asChild
            variant="primary"
            size="default"
            className="flex-1 font-semibold"
            style={{ borderRadius: "999px" }}
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
              <span>Shop all products</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="hidden min-[360px]:inline-flex shrink-0"
            style={{ borderRadius: "999px" }}
          >
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book salon appointment (opens in new tab)"
              onClick={() => trackBookingClick("sticky_bar_mobile_secondary", window.location.pathname)}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden min-[360px]:inline">Book salon</span>
              <span className="sr-only min-[360px]:hidden">Book salon</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyBookBar;
