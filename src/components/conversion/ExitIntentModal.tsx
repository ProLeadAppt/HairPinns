import { useState, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hpCapture } from "@/lib/hpCapture";
import { pixelTracking } from "@/lib/pixelTracking";

interface ExitIntentModalProps {
  enabled?: boolean;
}

const ExitIntentModal = ({ enabled = true }: ExitIntentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Skip on touch devices - exit intent is desktop-only and can block mobile clicks
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!enabled || hasShown || isTouch) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger only when mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);

        // Fire exit_intent_seen event
        hpCapture.trackEvent("exit_intent_seen", {
          source_page: window.location.pathname,
        }).catch((error) => {
          console.error("Failed to track exit_intent_seen:", error);
        });
      }
    };

    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, [enabled, hasShown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !phone) {
      toast({
        title: "Missing information",
        description: "Please enter both email and phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await hpCapture.postToZapier(
        {
          form_name: "exit_intent_offer",
          email: email,
          phone: phone,
          lead_magnet_title: "7-Day Frizz-Free Plan + 5% off",
          lead_magnet_slug: "exit_intent_frizz7",
          consent_marketing: true,
        },
        { event: "exit_intent_offer" }
      );

      if (success) {
        // Track lead generation in pixels
        await pixelTracking.trackFormSubmission({
          email: email,
          phone: phone,
          leadValue: 30,
        });

        toast({
          title: "Success!",
          description: "Check your email for your 7-Day Plan and discount code.",
        });
        setIsOpen(false);
        setEmail("");
        setPhone("");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Exit intent form error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <DialogTitle className="text-h3 font-heading text-heading">
            Wait! Before you go...
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Grab Jena's <strong>7-Day Frizz-Free Plan</strong> + get{" "}
            <strong className="text-brand-500">5% off</strong> your first order!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="exit-email">Email</Label>
            <Input
              id="exit-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <Label htmlFor="exit-phone">Phone</Label>
            <Input
              id="exit-phone"
              type="tel"
              placeholder="04XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Get My Plan + Discount"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to receive promotional emails and SMS.{" "}
            <a href="/privacy" className="text-brand-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
