import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const BookingBanner = () => {
  return (
    <section className="bg-brand-500 text-white py-16 md:py-20" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2-lg font-heading font-bold mb-4 text-white">
          Ready to Book Your Appointment?
        </h2>
        <p className="text-lg mb-8 text-white/95 max-w-2xl mx-auto">
          Book online 24/7—choose your service, pick your time, and get instant confirmation.
        </p>
        <Button asChild 
          variant="secondary" 
          size="xl"
          className="bg-background text-brand-500 hover:bg-background/90"
        >
          <a 
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("booking_banner", window.location.pathname)}
            aria-label="Book an appointment"
          >
            <Calendar className="w-5 h-5" />
            {BOOK_CTA_LABEL}
          </a>
        </Button>
      </div>
    </section>
  );
};

export default BookingBanner;
