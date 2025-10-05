import { MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FooterCTA = () => {
  return (
    <section className="bg-accent py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2 font-heading font-bold text-heading mb-4">
          Questions?
        </h2>
        <p className="text-lg text-foreground mb-8">
          We're here to help! Get in touch for product advice, booking assistance, 
          or anything else hair-related.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+61295550123">
            <Button variant="primary" size="lg">
              <MessageCircle className="w-5 h-5" />
              Text Us: (02) 9555 0123
            </Button>
          </a>
          <Link to="/contact">
            <Button variant="accent" size="lg">
              <Mail className="w-5 h-5" />
              Send a Message
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
