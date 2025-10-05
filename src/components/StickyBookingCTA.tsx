import { Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const StickyBookingCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 shadow-strong">
      <div className="max-w-7xl mx-auto flex gap-3 justify-center">
        <Button 
          asChild
          variant="primary" 
          size="lg" 
          className="flex-1 max-w-xs"
        >
          <a 
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("sticky_booking_cta", window.location.pathname)}
            aria-label="Book an appointment"
          >
            <Calendar className="w-5 h-5" />
            {BOOK_CTA_LABEL}
          </a>
        </Button>
        <Button 
          variant="accent" 
          size="lg" 
          className="flex-1 max-w-xs"
          onClick={() => window.open('https://shopify.com', '_blank')}
        >
          <ShoppingBag className="w-5 h-5" />
          Shop Featured
        </Button>
      </div>
    </div>
  );
};

export default StickyBookingCTA;