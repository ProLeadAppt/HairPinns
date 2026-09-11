import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "@/lib/newsletterSubscription";

const LeadMagnetBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter({ email, source: "blog" });
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { method: "newsletter_blog" });
      }
      toast({ title: "You’re in", description: "Your welcome email and 15% code should arrive shortly." });
      setEmail("");
    } catch {
      toast({ title: "Submission Error", description: "We couldn’t process your subscription. Please try again or call us.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="my-16 bg-[hsl(var(--hp-lavender))] px-5 py-10 text-[hsl(var(--hp-ink))] sm:px-8 sm:py-12" aria-labelledby="guide-title">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
        <header>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Keep the good advice</p>
          <h2 id="guide-title" className="mt-4 max-w-[9ch] font-heading text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[hsl(var(--hp-ink))]">Jena’s best hair advice.</h2>
          <p className="mt-5 text-sm leading-6 text-[hsl(var(--hp-ink)/0.68)]">Useful tips, honest product picks and 15% off your first online order. No daily inbox ambush.</p>
        </header>

        <form onSubmit={handleSubmit} className="border-t border-[hsl(var(--hp-ink)/0.26)] pt-2">
          <label className="block border-b border-[hsl(var(--hp-ink)/0.2)] py-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--hp-ink)/0.58)]">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 min-h-11 w-full border-0 bg-transparent p-0 text-base font-normal normal-case tracking-normal text-[hsl(var(--hp-ink))] placeholder:text-[hsl(var(--hp-ink)/0.4)] focus-visible:ring-0"
            />
          </label>
          <p className="py-5 text-xs leading-5 text-[hsl(var(--hp-ink)/0.62)]">
            By joining, you agree to receive Hair Pinns emails. You can unsubscribe any time. See our{' '}
            <Link to="/privacy" className="underline underline-offset-4">privacy policy</Link>.
          </p>
          <button type="submit" disabled={isSubmitting} className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--hp-purple))] px-5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
            {isSubmitting ? "Joining…" : "Join and get 15% off"} <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default LeadMagnetBox;
