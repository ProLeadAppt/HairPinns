import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

interface StickyBookingProps {
  threshold?: number;
}

const StickyBooking = ({ threshold = 300 }: StickyBookingProps) => {
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
        <a
          href={BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
          onClick={() => trackBookingClick("sticky_mobile", window.location.pathname)}
        >
          <Button variant="primary" size="lg" className="w-full" aria-label="Book an appointment">
            <Calendar className="w-5 h-5" />
            {BOOK_CTA_LABEL}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default StickyBooking;
