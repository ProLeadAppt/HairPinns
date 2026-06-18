import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { BOOK_URL, trackBookingClick } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface BlogCTAProps {
  type: "call-jena" | "chat-isabella" | "service" | "product" | "booking";
  servicePath?: string;
  productPath?: string;
  customText?: string;
}

const BlogCTA = ({ type, servicePath, productPath, customText }: BlogCTAProps) => {
  const guideToBubble = () => {
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'isabella',
        action: 'chat_bubble_prompted',
        location: 'blog_cta'
      });
    }

    const selectors = [
      'div[id*="chat-widget"]',
      'div[class*="chat-widget"]',
      '[data-chat-bubble]',
      'button[aria-label*="chat"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element && element.tagName !== 'IFRAME') {
        element.style.outline = '3px solid rgba(139,74,139,0.9)';
        element.style.outlineOffset = '3px';
        element.style.transition = 'outline-color 300ms ease';
        setTimeout(() => {
          element.style.outline = '';
          element.style.outlineOffset = '';
        }, 2500);
        break;
      }
    }

    toast({
      title: "Chat with Isabella",
      description: "Look for the chat bubble at the bottom-right to start chatting with Isabella.",
    });
  };

  const trackPhoneClick = () => {
    if (window.hpCapture) {
      window.hpCapture('ai_agent_interaction', {
        agent: 'jena',
        action: 'phone_clicked',
        location: 'blog_cta'
      });
    }
  };

  if (type === "call-jena") {
    return (
      <div className="my-12 p-8 bg-accent rounded-card border border-border text-center">
        <h3 className="text-h3 font-heading font-bold mb-4 text-heading">
          {customText || "Questions about this service?"}
        </h3>
        <p className="text-lg mb-6 text-text">
          Call Jena now to discuss your hair goals and book your appointment.
        </p>
        <Button
          asChild
          size="lg"
          variant="primary"
          className="bg-brand-500 hover:bg-brand-600"
        >
          <a
            href={BUSINESS_NAP.phone.tel}
            onClick={trackPhoneClick}
            className="no-link-color"
          >
            <Phone className="w-5 h-5" />
            Call Jena: 0416 037 663
          </a>
        </Button>
      </div>
    );
  }

  if (type === "chat-isabella") {
    return (
      <div className="my-12 p-8 bg-accent rounded-card border border-border text-center">
        <h3 className="text-h3 font-heading font-bold mb-4 text-heading">
          {customText || "Want instant answers?"}
        </h3>
        <p className="text-lg mb-6 text-text">
          Chat with Isabella, available 24/7 to help with product recommendations and booking.
        </p>
        <Button
          onClick={guideToBubble}
          size="lg"
          variant="primary"
          className="bg-brand-500 hover:bg-brand-600"
        >
          <MessageCircle className="w-5 h-5" />
          Chat with Isabella
        </Button>
      </div>
    );
  }

  if (type === "service" && servicePath) {
    return (
      <div className="my-12 p-8 bg-accent rounded-card border border-border text-center">
        <h3 className="text-h3 font-heading font-bold mb-4 text-heading">
          {customText || "Ready to book this service?"}
        </h3>
        <p className="text-lg mb-6 text-text">
          Learn more about this service or book your appointment today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="primary">
            <Link to={servicePath} className="no-link-color">
              <ArrowRight className="w-5 h-5" />
              View Service Details
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="accent"
          >
            <a
              href={BUSINESS_NAP.phone.tel}
              onClick={trackPhoneClick}
              className="no-link-color"
            >
              <Phone className="w-5 h-5" />
              Call to Book
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (type === "product" && productPath) {
    return (
      <div className="my-12 p-8 bg-accent rounded-card border border-border text-center">
        <h3 className="text-h3 font-heading font-bold mb-4 text-heading">
          {customText || "Shop these products"}
        </h3>
        <p className="text-lg mb-6 text-text">
          Get professional products delivered to your door.
        </p>
        <Button asChild size="lg" variant="primary" className="bg-brand-500 hover:bg-brand-600">
          <a
            href={productPath}
            target="_blank"
            rel="noopener noreferrer"
            className="no-link-color"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </a>
        </Button>
      </div>
    );
  }

  if (type === "booking") {
    return (
      <div className="my-12 p-8 bg-accent rounded-card border border-border text-center">
        <h3 className="text-h3 font-heading font-bold mb-4 text-heading">
          {customText || "Want to try these products?"}
        </h3>
        <p className="text-lg mb-6 text-text">
          All stocked at Hair Pinns. Free shipping over $150, packed from the salon.
        </p>
        <Button
          asChild
          size="lg"
          variant="primary"
          className="bg-brand-500 hover:bg-brand-600"
        >
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingClick("blog_cta", window.location.pathname)}
            className="no-link-color"
          >
            <ArrowRight className="w-5 h-5" />
            Book Now with Jena
          </a>
        </Button>
      </div>
    );
  }

  return null;
};

declare global {
  interface Window {
    hpCapture?: (event: string, data: Record<string, any>) => void;
  }
}

export default BlogCTA;
