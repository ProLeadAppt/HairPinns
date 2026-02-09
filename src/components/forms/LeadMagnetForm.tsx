import { useState } from "react";
import { Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";
import { pixelTracking } from "@/lib/pixelTracking";

interface LeadMagnetFormProps {
  formName: string;
  magnetTitle: string;
  magnetDescription?: string;
  showFirstName?: boolean;
  showPhone?: boolean;
  buttonText?: string;
  successMessage?: string;
  className?: string;
}

const LeadMagnetForm = ({
  formName,
  magnetTitle,
  magnetDescription,
  showFirstName = true,
  showPhone = true,
  buttonText = "Get the 7-Day Plan",
  successMessage = "Sent! Watch your email/SMS.",
  className = "",
}: LeadMagnetFormProps) => {
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
      
      // Build payload with exact structure requested
      const payload = {
        form_name: formName,
        first_name: formData.first_name,
        last_name: '',
        email: formData.email,
        phone: formData.phone,
        consent_marketing: formData.consent,
        source_page: typeof window !== 'undefined' ? window.location.href : '',
        lead_magnet_title: magnetTitle,
        lead_magnet_slug: formName.replace('lead_magnet_', ''),
        // Session data will be merged by hpCapture.postToZapier
      };

      const success = await hpCapture.postToZapier(payload, {
        event: "lead_magnet_download",
      });

      if (success) {
        // Track lead generation in pixels
        await pixelTracking.trackFormSubmission({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.first_name,
          leadValue: 25,
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
      console.error("Lead magnet form error:", error);
      setHasError(true);
      toast({
        title: "Submission Error",
        description: "We couldn't process your request. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasError) {
    return (
      <div className={`bg-destructive text-white rounded-card p-8 text-center ${className}`}>
        <AlertCircle className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-h2 font-heading mb-3">Submission Failed</h3>
        <p className="text-lg mb-6">
          We couldn't process your download request. This might be a temporary network issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              setHasError(false);
              setFormData({ first_name: "", email: "", phone: "", consent: false });
            }}
          >
            Try Again
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`bg-brand-500 text-white rounded-card p-8 text-center ${className}`}>
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h3 className="text-h2 font-heading mb-3">You're All Set!</h3>
        <p className="text-lg opacity-90 mb-4">{successMessage}</p>
        <p className="text-sm opacity-75">
          Can't find the email? Check your spam folder or contact us.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-brand-500 text-primary-foreground rounded-card p-8 ${className}`}>
      <div className="text-center mb-6">
        <Download className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h3 className="text-h2 font-heading mb-2">{magnetTitle}</h3>
        {magnetDescription && (
          <p className="text-lg opacity-90">{magnetDescription}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showFirstName && (
          <Input
            type="text"
            placeholder="First name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        )}

        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
        />

        {showPhone && (
          <Input
            type="tel"
            placeholder="Phone number (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        )}

        <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4">
          <ConsentRow
            checked={formData.consent}
            onCheckedChange={(checked) => setFormData({ ...formData, consent: checked })}
            required
            id={`consent_${formName}`}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-background text-brand-500 hover:bg-background/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              {buttonText}
            </>
          )}
        </Button>

        <p className="text-xs text-center opacity-75">
          Protected by our <Link to="/privacy" className="text-primary-foreground hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
};

export default LeadMagnetForm;
