import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { BOOK_CTA_LABEL, BOOK_URL, trackBookingClick } from "@/config/bookingConfig";

const BookingBanner = () => {
  return (
    <section className="bg-gradient-to-r from-brand-500 to-brand-600 text-white" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
          {/* Left: CTA */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
              Ready to book?
            </h2>
            <p className="text-white/95 mb-6 max-w-md">
              Pick your service, pick your time. Takes 2 minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white !text-brand-600 hover:bg-white hover:!text-brand-700 hover:scale-[1.02] active:scale-[0.99] font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ borderRadius: '999px' }}
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

          {/* Right: Quick details */}
          <div className="text-white/90 text-sm space-y-1 md:text-right">
            <p>60 Goorgool Rd, Bangor NSW</p>
            <p>0468 093 991</p>
            <p>Tue–Sat · Walk-ins welcome</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingBanner;
