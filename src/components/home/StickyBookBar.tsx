import { useEffect, useState } from "react";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * StickyBookBar — a 64px-tall sticky CTA bar that slides in on scroll
 * (after 400px) on mobile and small tablets.
 *
 * The audit gap: on a phone, the hero CTA is below the screen fold by the
 * time the user reads the headline. A persistent "Book Salon" bar lifts
 * bookings 20–40% on salon / trades sites. Only renders on viewports
 * < 1024px, and only after the user has scrolled past the hero so it
 * doesn't visually fight the in-hero CTAs.
 */
const StickyBookBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      // Show once scrolled 400px past the top, hide within 200px of the
      // top so the in-hero CTAs own the first screen.
      const y = window.scrollY;
      setVisible(y > 400 && y < document.body.scrollHeight - 1200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label="Quick booking bar"
    >
      {/* Thin shadow strip on top so it floats above content */}
      <div className="bg-white/95 backdrop-blur border-t border-border shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <Button
            asChild
            variant="primary"
            size="default"
            className="flex-1 font-semibold"
            style={{ borderRadius: "999px" }}
          >
            <a
              href="https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a salon appointment (opens in new tab)"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).dataLayer) {
                  (window as any).dataLayer.push({
                    event: "booking_click",
                    location: "sticky_bar_mobile",
                    cta: "book_now",
                  });
                }
              }}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Salon</span>
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="default"
            className="shrink-0"
            style={{ borderRadius: "999px" }}
          >
            <a
              href="https://wa.me/61416037663?text=Hi%20Jena%2C%20I%27d%20like%20to%20enquire%20about%20booking"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Hair Pinns"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).dataLayer) {
                  (window as any).dataLayer.push({
                    event: "whatsapp_click",
                    location: "sticky_bar_mobile",
                  });
                }
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyBookBar;
