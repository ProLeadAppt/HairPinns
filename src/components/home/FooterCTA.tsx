import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FooterCTA = () => {
  return (
    <section className="bg-accent py-12 md:py-16" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2 font-heading font-bold mb-4" style={{ color: '#241327' }}>
          Questions?
        </h2>
        <p className="text-lg mb-8" style={{ color: '#2A2230' }}>
          We're here to help! Get in touch for product advice, booking assistance, 
          or anything else hair-related.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="primary" size="lg" className="bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent">
            <a href="tel:+61295550123" aria-label="Text us on (02) 9555 0123" className="no-link-color">
              <MessageCircle className="w-5 h-5" />
              Text Us: (02) 9555 0123
            </a>
          </Button>
          <Button asChild variant="accent" size="lg">
            <Link to="/contact" aria-label="Send a message">
              <Mail className="w-5 h-5" />
              Send a Message
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
