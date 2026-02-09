import { useState } from "react";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";
import { pixelTracking } from "@/lib/pixelTracking";

interface NewsletterFormProps {
  formName?: string;
  showFirstName?: boolean;
  showPhone?: boolean;
  buttonText?: string;
  successMessage?: string;
  className?: string;
}

const NewsletterForm = ({
  formName = "newsletter_footer",
  showFirstName = false,
  showPhone = false,
  buttonText = "Join the list",
  successMessage = "Thanks! Check your inbox shortly.",
  className = "",
}: NewsletterFormProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive updates to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const hpCaptureModule = await import("@/lib/hpCapture");
      const hpCapture = hpCaptureModule.default || hpCaptureModule.hpCapture;
      
      // Get session data for UTMs and click IDs
      const session = hpCapture.getSession();
      
      // Build payload with exact structure requested
      const payload = {
        form_name: formName,
        first_name: formData.first_name,
        last_name: '',
        email: formData.email,
        phone: formData.phone,
        consent_marketing: formData.consent,
        source_page: typeof window !== 'undefined' ? window.location.href : '',
        // Session data will be merged by hpCapture.postToZapier
        // This includes: timestamp, client_id, utms, click_ids, referrer, dedupe_key
      };

      const success = await hpCapture.postToZapier(payload, {
        event: "newsletter_footer",
      });

      if (success) {
        // Track lead generation in pixels
        await pixelTracking.trackFormSubmission({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.first_name,
          leadValue: 10,
        });

        setIsSuccess(true);
        toast({
          title: "Success!",
          description: successMessage,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Newsletter form error:", error);
      setHasError(true);
      toast({
        title: "Submission Error",
        description: "We couldn't process your subscription. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasError) {
    return (
      <div className={`bg-destructive/10 border border-destructive/20 rounded-card p-6 text-center ${className}`}>
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-heading text-heading mb-2">Submission Failed</h3>
        <p className="text-foreground mb-4">
          We couldn't process your subscription. This might be a temporary network issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setHasError(false);
              setFormData({ first_name: "", email: "", phone: "", consent: false });
            }}
          >
            Try Again
          </Button>
          <Button variant="default" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`bg-accent/10 border border-accent/20 rounded-card p-6 text-center ${className}`}>
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-heading text-heading mb-2">You're Subscribed!</h3>
        <p className="text-foreground">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {showFirstName && (
        <Input
          type="text"
          placeholder="First name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          className="bg-background"
        />
      )}

      <Input
        type="email"
        placeholder="Email address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        className="bg-background"
      />

      {showPhone && (
        <Input
          type="tel"
          placeholder="Phone number (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-background"
        />
      )}

      <ConsentRow
        checked={formData.consent}
        onCheckedChange={(checked) => setFormData({ ...formData, consent: checked })}
        required
        id={`consent_${formName}`}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Mail className="w-5 h-5 mr-2" />
            {buttonText}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Protected by our <Link to="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
};

export default NewsletterForm;
