import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, FormEvent } from "react";
import { BOOK_CTA_LABEL } from "@/config/bookingConfig";
import { BUSINESS_NAP } from "@/config/businessConfig";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";
import hairPinnsLogo from "@/assets/images/hair-pinns-logo-full.webp";

const salonHours = [
  ["Mon", "Closed"],
  ["Tue", "10am–5pm"],
  ["Wed", "6pm–9pm"],
  ["Thu", "9am–9pm"],
  ["Fri", "9am–5:30pm"],
  ["Sat", "8am–2pm"],
  ["Sun", "Closed"],
] as const;

const shopLinks = [
  ["Shop products", "/collections"],
  ["Hair care guides", "/blog"],
  ["Shipping", "/policies/shipping"],
  ["Returns", "/policies/returns"],
  ["FAQ", "/faq"],
  ["Glossary", "/glossary"],
] as const;

const salonLinks = [
  ["Services & pricing", "/services"],
  [BOOK_CTA_LABEL, "/booking"],
  ["About Jena", "/about"],
  ["Areas we serve", "/areas"],
  ["Contact", "/contact"],
] as const;

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

  // LeadConnector ships its own socket.io client. Missing live replies after a
  // visitor sends a message are a GHL server-push issue, not a page-code issue.

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

  const linkClass = "inline-flex min-h-11 items-center text-sm text-[hsl(var(--after-hours-cream)/0.76)] transition-colors hover:text-[hsl(var(--after-hours-copper))]";

  return (
    <footer
      className="border-t border-[hsl(var(--after-hours-copper)/0.55)] bg-[hsl(var(--after-hours-near-black))] text-[hsl(var(--after-hours-cream))]"
      data-home-footer=""
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-[hsl(var(--after-hours-cream)/0.18)] pb-10 md:grid-cols-12 md:gap-10 lg:pb-12">
          <div className="min-w-0 md:col-span-5">
            <Link to="/" className="inline-flex min-h-11 items-center" aria-label="Hair Pinns home">
              <img
                src={hairPinnsLogo}
                alt="Hair Pinns — Happy Hair Specialist"
                className="h-14 w-auto brightness-0 invert"
                loading="lazy"
                decoding="async"
                width="250"
                height="160"
              />
            </Link>
            <p className="mt-5 max-w-md font-heading text-[clamp(2rem,5vw,3.7rem)] leading-[1.02] tracking-[-0.035em]">
              Hair care picked by Jena.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.7)]">
              Shipped anywhere in Australia. Free over {FREE_SHIPPING_THRESHOLD_DISPLAY}.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-7">
              <a
                href="https://www.instagram.com/hair.pinns/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label="Follow Hair Pinns on Instagram (opens in a new tab)"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.facebook.com/Hair.Pinns"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label="Follow Hair Pinns on Facebook (opens in a new tab)"
              >
                Facebook ↗
              </a>
            </div>
          </div>

          <div className="min-w-0 md:col-span-7 md:border-l md:border-[hsl(var(--after-hours-cream)/0.18)] md:pl-10 lg:pl-14">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
              From behind the chair
            </p>
            <h2 className="mt-4 max-w-[12ch] font-heading text-[clamp(2rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.04em] text-[hsl(var(--after-hours-cream))]">
              Take 10% off your first order.
            </h2>
            <p id="footer-newsletter-note" className="mt-3 max-w-xl text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">
              Practical hair advice and product news from Jena. Your code arrives by email.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-[1fr_auto]">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for 10% off newsletter signup
              </label>
              <Input
                id="footer-newsletter-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-12 rounded-none border-[hsl(var(--after-hours-cream)/0.36)] bg-transparent px-4 text-[hsl(var(--after-hours-cream))] placeholder:text-[hsl(var(--after-hours-cream)/0.48)] focus-visible:ring-[hsl(var(--after-hours-copper))]"
                aria-describedby="footer-newsletter-note"
                autoComplete="email"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="h-12 rounded-none !bg-[hsl(var(--after-hours-cream))] px-7 font-semibold !text-[hsl(var(--after-hours-plum))] hover:!bg-[hsl(var(--after-hours-copper))]"
              >
                {isSubmitting ? "Joining…" : "Send my code"}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid gap-10 border-b border-[hsl(var(--after-hours-cream)/0.18)] py-10 md:grid-cols-12 md:gap-10 lg:py-12">
          <div className="min-w-0 md:col-span-5">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
              Visit Hair Pinns
            </p>
            <address className="mt-4 not-italic">
              <p className="font-heading text-2xl leading-tight">
                {BUSINESS_NAP.address.street}<br />
                {BUSINESS_NAP.address.locality} {BUSINESS_NAP.address.region} {BUSINESS_NAP.address.postcode}
              </p>
            </address>
            <div className="mt-3 flex flex-wrap gap-x-6">
              <a href={BUSINESS_NAP.phone.tel} className={linkClass}>
                {BUSINESS_NAP.phone.display}
              </a>
              <a
                href={`sms:${BUSINESS_NAP.phone.raw}?body=Hi%20Hair%20Pinns%2C%20I'd%20like%20to%20enquire%20about%20`}
                className={linkClass}
              >
                Text us
              </a>
              <a
                href="https://wa.me/61416037663?text=Hi%20Jena%2C%20I%27d%20like%20to%20enquire%20about%20"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp ↗
              </a>
            </div>

            <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
              Salon hours
            </p>
            <dl className="mt-3 grid grid-cols-2 border-t border-[hsl(var(--after-hours-cream)/0.18)] text-sm sm:max-w-md">
              {salonHours.map(([day, hours]) => (
                <div key={day} className="flex min-h-11 items-center justify-between gap-3 border-b border-[hsl(var(--after-hours-cream)/0.14)] py-2 odd:pr-4 even:pl-4">
                  <dt className="text-[hsl(var(--after-hours-cream)/0.58)]">{day}</dt>
                  <dd>{hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <nav className="grid min-w-0 grid-cols-2 gap-7 md:col-span-7 md:border-l md:border-[hsl(var(--after-hours-cream)/0.18)] md:pl-10 lg:gap-12 lg:pl-14" aria-label="Footer navigation">
            <div>
              <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
                Shop & learn
              </p>
              {shopLinks.map(([label, to]) => (
                <Link key={to} to={to} className={`${linkClass} w-full`}>
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <p className="mb-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--after-hours-copper))]">
                Salon & help
              </p>
              {salonLinks.map(([label, to]) => (
                <Link key={to} to={to} className={`${linkClass} w-full`}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="pt-8 text-xs text-[hsl(var(--after-hours-cream)/0.58)]">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p>© {new Date().getFullYear()} Hair Pinns. All rights reserved. Est. by Jena Pinn.</p>
              <p className="mt-1">
                This website was built by{" "}
                <a
                  href="https://munyal.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-[hsl(var(--after-hours-cream)/0.8)] underline decoration-[hsl(var(--after-hours-copper))] underline-offset-4 hover:text-[hsl(var(--after-hours-copper))]"
                >
                  Munyal
                </a>
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-5" aria-label="Legal links">
              <Link to="/policies/shipping" className={linkClass}>Shipping</Link>
              <Link to="/policies/returns" className={linkClass}>Returns</Link>
              <Link to="/privacy" className={linkClass}>Privacy</Link>
              <Link to="/terms" className={linkClass}>Terms</Link>
            </nav>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.16em] text-[0.62rem] text-[hsl(var(--after-hours-cream)/0.38)]" aria-label="Accepted payment methods">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Afterpay</span>
            <span>Zip</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
