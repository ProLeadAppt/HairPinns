import { useState } from "react";
import { Calendar, Clock, CheckCircle2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";

interface ConsultMiniFormProps {
  title?: string;
  description?: string;
  className?: string;
}

const FRESHA_BOOKING_URL = "https://www.fresha.com/book-now/hair-pinns-hw3xch0p/all-offer?share=true&pId=227127";

const ConsultMiniForm = ({
  title = "Book a Free Consult",
  description = "Not sure what service you need? Chat with Jena for personalized recommendations.",
  className = "",
}: ConsultMiniFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_time: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    { value: "morning_weekday", label: "Morning (9am-12pm) - Weekday" },
    { value: "afternoon_weekday", label: "Afternoon (12pm-5pm) - Weekday" },
    { value: "evening_weekday", label: "Evening (5pm-7pm) - Weekday" },
    { value: "morning_saturday", label: "Morning (8am-12pm) - Saturday" },
    { value: "afternoon_saturday", label: "Afternoon (12pm-5pm) - Saturday" },
    { value: "asap", label: "ASAP - Any available time" },
  ];

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

    if (!formData.preferred_time) {
      toast({
        title: "Time Preference Required",
        description: "Please select your preferred day/time.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { hpCapture } = await import("@/lib/hpCapture");

      // Find readable time label
      const timeLabel = timeSlots.find(slot => slot.value === formData.preferred_time)?.label || formData.preferred_time;

      const success = await hpCapture.postToZapier(
        {
          form_name: "consult_request",
          name: formData.name,
          first_name: formData.name.split(' ')[0] || formData.name,
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          preferred_time: formData.preferred_time,
          preferred_time_label: timeLabel,
          consent_marketing: formData.consent,
        },
        { event: "consult_request" }
      );

      if (success) {
        setIsSuccess(true);
        
        // Open Fresha in new tab
        window.open(FRESHA_BOOKING_URL, "_blank", "noopener,noreferrer");
        
        toast({
          title: "Request Received!",
          description: "We'll text you shortly with next steps.",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Consult form error:", error);
      setHasError(true);
      toast({
        title: "Submission Error",
        description: "We couldn't process your request. Please try again or call us.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasError) {
    return (
      <div className={`bg-destructive/10 border border-destructive/20 rounded-card p-8 text-center ${className}`}>
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h3 className="text-h2 font-heading text-heading mb-3">
          Submission Failed
        </h3>
        <p className="text-foreground mb-6">
          We couldn't process your consult request. This might be a temporary network issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => setHasError(false)}
          >
            Try Again
          </Button>
          <Button variant="default" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Or call us: <a href="tel:+61295550123" className="text-brand-500 hover:underline font-semibold">(02) 9555 0123</a>
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`bg-accent/10 border border-accent/20 rounded-card p-8 text-center ${className}`}>
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-h2 font-heading text-heading mb-3">
          Thanks—link sent!
        </h3>
        <p className="text-foreground mb-6">
          Check your email/SMS, or book on Fresha now for instant confirmation.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.open(FRESHA_BOOKING_URL, "_blank", "noopener,noreferrer")}
          className="w-full"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Book Now on Fresha
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Or call us: <a href="tel:+61295550123" className="text-brand-500 hover:underline">(02) 9555 0123</a>
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-card p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-6">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Calendar className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-h3 font-heading text-heading mb-1">{title}</h3>
          <p className="text-sm text-foreground">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="consult_name">Your Name</Label>
          <Input
            id="consult_name"
            type="text"
            placeholder="Jane Smith"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consult_email">Email Address</Label>
          <Input
            id="consult_email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consult_phone">Phone Number</Label>
          <Input
            id="consult_phone"
            type="tel"
            placeholder="(02) 1234 5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consult_time">Preferred Day/Time</Label>
          <Select
            value={formData.preferred_time}
            onValueChange={(value) => setFormData({ ...formData, preferred_time: value })}
            required
          >
            <SelectTrigger id="consult_time" className="bg-background">
              <SelectValue placeholder="Select your preferred time" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              {timeSlots.map((slot) => (
                <SelectItem key={slot.value} value={slot.value}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{slot.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConsentRow
          checked={formData.consent}
          onCheckedChange={(checked) => setFormData({ ...formData, consent: checked })}
          required
          id="consult_consent"
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
              Submitting...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              Request a quick consult
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Protected by our <Link to="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
};

export default ConsultMiniForm;
