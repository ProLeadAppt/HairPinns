import { Instagram, Facebook, MapPin, Phone, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, FormEvent } from "react";
import { BOOK_CTA_LABEL } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";
import hairPinnsLogo from "@/assets/images/hair-pinns-logo-full.webp";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inject LeadConnector chat widget — but as a facade. The real loader.js (plus
  // its socket.io + Ionic web-components payload, hundreds of KB) only runs once
  // the user has shown intent: a meaningful scroll, the first pointer/key event,
  // OR after 8 s of idle, whichever comes first. Skipped during prerender so
  // the build step doesn't fetch the widget.
  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (ua.indexOf('HeadlessChrome') !== -1 || ua.indexOf('HairPinnsPrerender') !== -1) return;
    if (document.getElementById('leadconnector-widget')) return;

    let loaded = false;
    const load = () => {
      if (loaded || document.getElementById('leadconnector-widget')) return;
      loaded = true;
      const script = document.createElement('script');
      script.id = 'leadconnector-widget';
      script.src = 'https://beta.leadconnectorhq.com/loader.js';
      script.setAttribute('data-resources-url', 'https://beta.leadconnectorhq.com/chat-widget/loader.js');
      script.setAttribute('data-widget-id', '69faa5663cc757c354898554');
      document.body.appendChild(script);
      cleanup();
    };

    const onScroll = () => {
      if (window.scrollY > 200) load();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', load);
      window.removeEventListener('keydown', load);
      window.removeEventListener('touchstart', load);
      if (idleTimer) window.clearTimeout(idleTimer);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', load, { once: true });
    window.addEventListener('keydown', load, { once: true });
    window.addEventListener('touchstart', load, { once: true, passive: true });

    const idleTimer = window.setTimeout(load, 8000);

    return cleanup;
  }, []);

  // Note on chat realtime: the LeadConnector chat widget ships with socket.io
  // realtime support and connects to wss://services.leadconnectorhq.com/
  // sockets-live-chat/socket.io after the visitor submits the contact form
  // and sends their first message. CSP allows that endpoint. If realtime
  // replies aren't arriving on the open browser, the issue is server-side
  // (GHL is not broadcasting the agent's reply on the visitor's socket
  // channel) and needs to be raised with GHL support — no workaround in
  // page code can compensate for a missing server push without degrading
  // UX (e.g., closing/reopening the chat panel mid-conversation).

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
      const { hpCapture } = await import("@/lib/hpCapture");
      const success = await hpCapture.postToGHL({
        form_name: 'newsletter_footer',
        email,
        consent_marketing: true,
      }, {
        event: 'newsletter_subscription'
      });

      if (success) {
        // Track GA4 generate_lead event
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { method: 'newsletter' });
        }

        toast({
          title: "You're on the list.",
          description: "Check your inbox — your 10% off code is on its way.",
        });
        setEmail("");
      } else {
        throw new Error('Submission failed');
      }
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
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 lg:gap-16">
          {/* Left zone: Brand + tagline + newsletter */}
          <div>
            <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <img
                src={hairPinnsLogo}
                alt="Hair Pinns - Happy Hair Specialist"
                className="h-16 w-auto"
              loading="lazy"
              decoding="async"
              width="250"
              height="160"
            />
            </Link>
            <p className="text-foreground mb-4 text-sm leading-relaxed max-w-md">
              Hair care picked by Jena. Shipped anywhere in Australia. Free over {FREE_SHIPPING_THRESHOLD_DISPLAY}.
            </p>

            <div className="flex space-x-3 mb-6">
              <a
                href="https://www.instagram.com/hair.pinns/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-brand-500/10 flex items-center justify-center hover:bg-brand-500 hover:text-primary-foreground transition-all duration-base"
                aria-label="Follow Hair Pinns on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/Hair.Pinns"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-brand-500/10 flex items-center justify-center hover:bg-brand-500 hover:text-primary-foreground transition-all duration-base"
                aria-label="Follow Hair Pinns on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter inline */}
            <div className="bg-accent/20 rounded-xl p-4 max-w-md">
              <label htmlFor="footer-newsletter-email" className="block text-sm font-semibold text-heading mb-2">
                Get 10% off your first order
              </label>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="h-10 text-sm flex-1"
                  aria-label="Email address for 10% off newsletter signup"
                  autoComplete="email"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right zone: Contact + quick links stacked */}
          <div className="space-y-6">
            {/* Contact info */}
            <div>
              <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">Pop In & See Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <address className="not-italic text-foreground">
                    {BUSINESS_NAP.address.street}<br />
                    {BUSINESS_NAP.address.locality} {BUSINESS_NAP.address.region} {BUSINESS_NAP.address.postcode}
                  </address>
                </div>

                <div className="text-foreground">
                  <p className="font-medium mb-1">Hours</p>
                  <p className="text-muted-foreground">Mon: Closed</p>
                  <p className="text-muted-foreground">Tue: 10am-5pm</p>
                  <p className="text-muted-foreground">Wed: 6pm-9pm</p>
                  <p className="text-muted-foreground">Thu: 9am-9pm</p>
                  <p className="text-muted-foreground">Fri: 9am-5:30pm</p>
                  <p className="text-muted-foreground">Sat: 8am-2pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-500" />
                    <a
                      href={BUSINESS_NAP.phone.tel}
                      className="text-foreground hover:text-brand-500 transition-colors font-medium"
                    >
                      {BUSINESS_NAP.phone.display}
                    </a>
                  </div>
                  <a
                    href={`sms:${BUSINESS_NAP.phone.raw}?body=Hi%20Hair%20Pinns%2C%20I'd%20like%20to%20enquire%20about%20`}
                    className="text-sm text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    Text us
                  </a>
                  <a
                    href="https://wa.me/61416037663?text=Hi%20Jena%2C%20I%27d%20like%20to%20enquire%20about%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    WhatsApp us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-heading mb-3 uppercase tracking-wide">Quick Links</h4>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-2" aria-label="Footer navigation">
                <Link to="/collections" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Shop Products
                </Link>
                <Link to="/blog" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Hair Care Guides
                </Link>
                <Link to="/policies/shipping" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Shipping
                </Link>
                <Link to="/policies/returns" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Returns
                </Link>
                <Link to="/services" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Services & Pricing
                </Link>
                <Link to="/booking" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  {BOOK_CTA_LABEL}
                </Link>
                <Link to="/about" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  About Jena
                </Link>
                <Link to="/areas" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Areas We Serve
                </Link>
                <Link to="/faq" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  FAQ
                </Link>
                <Link to="/contact" className="text-foreground hover:text-brand-500 transition-colors text-sm">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p>
                © {new Date().getFullYear()} Hair Pinns. All rights reserved. Est. by Jena Pinn.
              </p>
              <p>
                This website was built by{" "}
                <a 
                  href="https://munyal.com.au"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Munyal
                </a>
              </p>
            </div>
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
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 mt-4">
            <span>Visa</span><span>Mastercard</span><span>Afterpay</span><span>Zip</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;