import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";
import { z } from "zod";
import { pixelTracking } from "@/lib/pixelTracking";

interface LeadMagnetBannerProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
  magnet?: {
    title: string;
    subtitle: string;
    ctaText: string;
    formName: string;
  };
}

const defaultMagnet = {
  title: "Get Jena's 7-Day Frizz-Free Plan",
  subtitle: "PDF guide + day-by-day SMS tips. Join free.",
  ctaText: "Get My Free Plan",
  formName: "leadmagnet_frizz7",
};

// Validation schema
const leadMagnetSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  phone: z.string().trim().optional(),
  consent_marketing: z.boolean().refine((val) => val === true, {
    message: "Please agree to receive the guide and tips",
  }),
});

/**
 * LeadMagnetBanner Component
 * 
 * Captures email/phone for lead magnet delivery
 * Posts to Zapier with form_name for GHL tagging
 * 
 * @example
 * <LeadMagnetBanner variant="default" />
 * <LeadMagnetBanner variant="compact" />
 */
export const LeadMagnetBanner = ({
  variant = "default",
  className = "",
  magnet = defaultMagnet,
}: LeadMagnetBannerProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const validation = leadMagnetSchema.safeParse({
      email,
      phone,
      consent_marketing: consent,
    });

    if (!validation.success) {
      const error = validation.error.issues[0];
      toast({
        title: "Validation Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { hpCapture } = await import("@/lib/hpCapture");

      const success = await hpCapture.postToZapier(
        {
          form_name: magnet.formName,
          email: validation.data.email,
          phone: validation.data.phone || "",
          consent_marketing: validation.data.consent_marketing,
          lead_magnet_name: magnet.title,
        },
        { event: magnet.formName }
      );

      if (success) {
        // Fire pixel tracking (generate_lead event with hashed PII)
        await pixelTracking.trackFormSubmission({
          email: validation.data.email,
          leadValue: 25,
        });

        setIsSuccess(true);
        toast({
          title: "Success! Check your inbox",
          description: "We've sent your free guide. Check your email (and SMS if provided).",
        });
        
        // Reset form
        setEmail("");
        setPhone("");
        setConsent(false);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Lead magnet submission error:", error);
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-card p-6 text-center ${className}`}>
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-heading mb-2">
          You're All Set!
        </h3>
        <p className="text-foreground">
          Check your email for the PDF guide. If you provided your phone, you'll get SMS tips daily.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 items-end ${className}`}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting || !consent}>
          {isSubmitting ? "Sending..." : magnet.ctaText}
        </Button>
      </form>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-accent border border-border rounded-card p-6 ${className}`}>
        <div className="flex items-start gap-4 mb-4">
          <FileText className="w-8 h-8 text-brand-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-heading font-semibold text-heading mb-1">
              {magnet.title}
            </h3>
            <p className="text-sm text-foreground">
              {magnet.subtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Mobile (optional for SMS tips)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <ConsentRow
            checked={consent}
            onCheckedChange={setConsent}
            required
            id={`consent_${magnet.formName}`}
          />
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting || !consent}>
            {isSubmitting ? "Sending..." : magnet.ctaText}
          </Button>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-brand-500 text-primary-foreground rounded-card p-8 md:p-10 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-6 justify-center">
          <FileText className="w-12 h-12 flex-shrink-0" />
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              {magnet.title}
            </h3>
            <p className="text-lg opacity-90">
              {magnet.subtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Input
              type="tel"
              placeholder="Mobile (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </div>

          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-3">
            <ConsentRow
              checked={consent}
              onCheckedChange={setConsent}
              required
              id={`consent_${magnet.formName}`}
              textColor="text-primary-foreground"
              linkColor="text-primary-foreground hover:text-primary-foreground/80"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full bg-background text-brand-500 hover:bg-background/90"
            disabled={isSubmitting || !consent}
          >
            {isSubmitting ? "Sending..." : magnet.ctaText}
          </Button>

          <p className="text-xs text-center opacity-75">
            Instant delivery. No spam, unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadMagnetBanner;
