import { Instagram, Facebook, MapPin, Phone, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, FormEvent } from "react";
import { BOOK_CTA_LABEL } from "@/config/bookingConfig";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Newsletter signup:", email);

    try {
      // GHL webhook URL would be configured here
      // For now, we'll simulate success
      const webhookUrl = "https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          email,
          source: "website_footer",
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Success!",
        description: "You've been added to our mailing list. Check your inbox for a welcome message.",
      });
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Social */}
          <div>
            <h3 className="text-xl font-serif font-bold text-heading mb-3">Hair Pinns</h3>
            <p className="text-foreground mb-4 text-sm leading-relaxed">
              Boutique salon in Bangor NSW. Expert cuts, colour & treatments. 
              Salon-quality products for home care.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/hairpinns" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-base"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/hairpinns" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-base"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Contact & Hours */}
          <div>
            <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">Visit Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <address className="not-italic text-foreground">
                  123 River Road<br />
                  Bangor NSW 2234
                </address>
              </div>
              
              <div className="text-foreground">
                <p className="font-medium mb-1">Hours</p>
                <p className="text-muted-foreground">Mon-Fri: 9am-7pm</p>
                <p className="text-muted-foreground">Sat: 8am-5pm</p>
                <p className="text-muted-foreground">Sun: Closed</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <a 
                  href="tel:+61295550123" 
                  className="text-foreground hover:text-brand-500 transition-colors font-medium"
                >
                  (02) 9555 0123
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">Quick Links</h4>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link to="/services" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                Services & Pricing
              </Link>
              <Link to="/collections" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                Shop Products
              </Link>
              <Link to="/about" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                About Us
              </Link>
              <Link to="/blog" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                Blog & Tips
              </Link>
              <Link to="/booking" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                {BOOK_CTA_LABEL}
              </Link>
              <Link to="/contact" className="block text-foreground hover:text-brand-500 transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">Stay Connected</h4>
            <p className="text-sm text-foreground mb-4">
              Tips, launches & salon-only offers—join the list.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-10 text-sm"
                aria-label="Email address for newsletter"
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="sm" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Hair Pinns. All rights reserved. Est. by Jena Pinn.
            </p>
            <nav className="flex flex-wrap justify-center gap-4" aria-label="Legal links">
              <Link to="/policies/shipping" className="hover:text-foreground transition-colors">
                Shipping
              </Link>
              <Link to="/policies/returns" className="hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;