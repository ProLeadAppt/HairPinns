import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsultBannerProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
  ctaText?: string;
}

/**
 * ConsultBanner Component
 * 
 * Reusable CTA encouraging users to book a consultation
 * Can be dropped into any page for conversion optimization
 * 
 * @example
 * <ConsultBanner variant="default" />
 * <ConsultBanner variant="compact" className="my-8" />
 */
export const ConsultBanner = ({
  variant = "default",
  className = "",
  ctaText = "Book on Fresha",
}: ConsultBannerProps) => {
  const freshaUrl = "https://www.fresha.com/book-now/hair-pinns-example?service=consultation";

  if (variant === "inline") {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <p className="text-foreground text-center sm:text-left">
          <strong>Not sure which product fits your hair?</strong> Book a quick consult with Jena — fast, friendly, and tailored.
        </p>
        <a
          href={freshaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button variant="primary" size="lg" className="whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            {ctaText}
          </Button>
        </a>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-accent border border-border rounded-card p-6 text-center ${className}`}>
        <p className="text-foreground mb-4">
          <strong>Not sure which product fits your hair?</strong><br />
          Book a quick consult with Jena — fast, friendly, and tailored.
        </p>
        <a href={freshaUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            <Calendar className="w-4 h-4" />
            {ctaText}
          </Button>
        </a>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-brand-500 text-white rounded-card p-8 md:p-12 text-center ${className}`}>
      <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
        Not Sure Which Product Fits Your Hair?
      </h3>
      <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
        A 10-minute consult can save months of trial-and-error.
      </p>
      <a href={freshaUrl} target="_blank" rel="noopener noreferrer">
        <Button 
          variant="secondary" 
          size="xl" 
          className="bg-white text-brand-500 hover:bg-white/90"
        >
          <Calendar className="w-5 h-5" />
          {ctaText}
        </Button>
      </a>
      <p className="text-sm mt-4 opacity-75">
        Free 15-minute consultation • No obligation
      </p>
    </div>
  );
};

export default ConsultBanner;
