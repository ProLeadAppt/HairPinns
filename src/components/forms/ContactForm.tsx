import { useState } from "react";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";

interface ContactFormProps {
  formName?: string;
  title?: string;
  description?: string;
  showTopic?: boolean;
  className?: string;
}

const ContactForm = ({
  formName = "contact_page",
  title = "Send Us a Message",
  description,
  showTopic = true,
  className = "",
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const topics = [
    { value: "product_question", label: "Product Question" },
    { value: "service_question", label: "Service Question" },
    { value: "order_help", label: "Order Help" },
    { value: "other", label: "Other" },
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

    if (showTopic && !formData.topic) {
      toast({
        title: "Topic Required",
        description: "Please select what you need help with.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { hpCapture } = await import("@/lib/hpCapture");

      // Find readable topic label
      const topicLabel = topics.find(t => t.value === formData.topic)?.label || formData.topic;

      const payload: Record<string, any> = {
        form_name: formName,
        name: formData.name,
        first_name: formData.name.split(' ')[0] || formData.name,
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        consent_marketing: formData.consent,
      };

      if (showTopic) {
        payload.topic = formData.topic;
        payload.topic_label = topicLabel;
      }

      const success = await hpCapture.postToZapier(
        payload,
        { event: "contact_submission" }
      );

      if (success) {
        setIsSuccess(true);
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setHasError(true);
      toast({
        title: "Submission Error",
        description: "We couldn't send your message. Please try again or call us.",
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
          We couldn't send your message. This might be a temporary network issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => setHasError(false)}
          >
            Try Again
          </Button>
          <p className="text-sm text-muted-foreground">
            Or call us at{" "}
            <a href="tel:+61295550123" className="text-brand-500 hover:underline font-semibold">
              (02) 9555 0123
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={`bg-accent/10 border border-accent/20 rounded-card p-8 text-center ${className}`}>
        <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-h2 font-heading text-heading mb-3">
          Message Received!
        </h3>
        <p className="text-foreground mb-6">
          {formData.topic === "order_help" 
            ? "Jena has been notified about your order issue and will respond within 2 hours."
            : "We'll get back to you within 24 hours. Check your inbox for confirmation."}
        </p>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                topic: "",
                message: "",
                consent: false,
              });
            }}
            className="w-full"
          >
            Send Another Message
          </Button>
          <p className="text-sm text-muted-foreground">
            Need immediate help? Call us at{" "}
            <a href="tel:+61295550123" className="text-brand-500 hover:underline">
              (02) 9555 0123
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-card p-8 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-h2 font-heading text-heading mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-foreground">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Your Name *</Label>
          <Input
            id="contact_name"
            type="text"
            placeholder="Jane Smith"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Email Address *</Label>
          <Input
            id="contact_email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Phone Number</Label>
          <Input
            id="contact_phone"
            type="tel"
            placeholder="(02) 1234 5678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {showTopic && (
          <div className="space-y-2">
            <Label htmlFor="contact_topic">What can we help you with? *</Label>
            <Select
              value={formData.topic}
              onValueChange={(value) => setFormData({ ...formData, topic: value })}
              required
            >
              <SelectTrigger id="contact_topic" className="bg-background">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {topics.map((topic) => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="contact_message">Your Message *</Label>
          <Textarea
            id="contact_message"
            placeholder="Tell us what you need help with..."
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="resize-none"
          />
        </div>

        <ConsentRow
          checked={formData.consent}
          onCheckedChange={(checked) => setFormData({ ...formData, consent: checked })}
          required
          id="contact_consent"
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
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          For urgent matters, call us at{" "}
          <a href="tel:+61295550123" className="text-brand-500 hover:underline">
            (02) 9555 0123
          </a>
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
