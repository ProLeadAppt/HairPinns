import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";

const LeadMagnetBox = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) {
      toast({ title: "Consent Required", description: "Please agree to receive updates to continue.", variant: "destructive" });
      return;
    }

    const hpCaptureModule = await import("@/lib/hpCapture");
    const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
    const success = await hpCapture.postToZapier(
      { form_name: "blog_lead_magnet", email, phone, consent_marketing: consent },
      { event: "lead_magnet_subscription" },
    );

    if (success) {
      toast({ title: "You’re on the list", description: "Check your inbox for Jena’s hair care guide." });
      setEmail("");
      setPhone("");
      setConsent(false);
    } else {
      toast({ title: "Submission Error", description: "We couldn’t process your subscription. Please try again or call us.", variant: "destructive" });
    }
  };

  return (
    <aside className="my-16 bg-[hsl(var(--after-hours-near-black))] px-5 py-10 text-[hsl(var(--after-hours-cream))] sm:px-8 sm:py-12" aria-labelledby="guide-title">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
        <header>
          <p className="after-hours-kicker text-[hsl(var(--after-hours-copper))]">Keep the good advice</p>
          <h2 id="guide-title" className="mt-4 max-w-[9ch] font-heading text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[hsl(var(--after-hours-cream))]">Jena’s hair care guide.</h2>
          <p className="mt-5 text-sm leading-6 text-[hsl(var(--after-hours-cream)/0.68)]">Practical routines, product notes, and occasional salon updates. No inbox clutter.</p>
        </header>

        <form onSubmit={handleSubmit} className="border-t border-[hsl(var(--after-hours-cream)/0.26)] pt-2">
          <label className="block border-b border-[hsl(var(--after-hours-cream)/0.2)] py-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.58)]">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 min-h-11 w-full border-0 bg-transparent p-0 text-base font-normal normal-case tracking-normal text-[hsl(var(--after-hours-cream))] placeholder:text-[hsl(var(--after-hours-cream)/0.4)] focus-visible:ring-0"
            />
          </label>
          <label className="block border-b border-[hsl(var(--after-hours-cream)/0.2)] py-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--after-hours-cream)/0.58)]">
            Phone, optional
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="04xx xxx xxx"
              className="mt-2 min-h-11 w-full border-0 bg-transparent p-0 text-base font-normal normal-case tracking-normal text-[hsl(var(--after-hours-cream))] placeholder:text-[hsl(var(--after-hours-cream)/0.4)] focus-visible:ring-0"
            />
          </label>
          <div className="py-5 text-[hsl(var(--after-hours-cream))] [&_a]:!text-[hsl(var(--after-hours-cream))]">
            <ConsentRow checked={consent} onCheckedChange={setConsent} required id="lead_magnet_consent" />
          </div>
          <button type="submit" className="flex min-h-12 w-full items-center justify-between bg-[hsl(var(--after-hours-cream))] px-5 text-sm font-semibold text-[hsl(var(--after-hours-plum))] hover:bg-[hsl(var(--after-hours-copper))]">
            Send me the guide <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>
    </aside>
  );
};

export default LeadMagnetBox;
