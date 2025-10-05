import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ConsentRow from "@/components/forms/ConsentRow";

const LeadMagnetBox = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to receive updates to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const { hpCapture } = await import("@/lib/hpCapture");
    
    const success = await hpCapture.postToZapier(
      {
        form_name: "blog_lead_magnet",
        email,
        phone,
        consent_marketing: consent,
      },
      { event: "lead_magnet_subscription" }
    );
    
    if (success) {
      toast({
        title: "Success!",
        description: "You're subscribed! Check your inbox for your exclusive hair care guide.",
      });
      
      setEmail("");
      setPhone("");
      setConsent(false);
    } else {
      toast({
        title: "Submission Error",
        description: "We couldn't process your subscription. Please try again or call us.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-12 p-8 bg-brand-500 text-primary-foreground rounded-card">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-h2 font-heading mb-3">
          Get Your Free Hair Care Guide
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Join our community and receive exclusive tips, product recommendations, 
          and special offers from Hair Pinns Bangor.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-lg p-1">
            <Mail className="w-5 h-5 ml-3 opacity-70" />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-lg p-1">
            <MessageSquare className="w-5 h-5 ml-3 opacity-70" />
            <Input
              type="tel"
              placeholder="Your phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-0"
            />
          </div>
          
          <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4">
            <ConsentRow 
              checked={consent}
              onCheckedChange={setConsent}
              required
              id="lead_magnet_consent"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-background text-brand-500 hover:bg-background/90"
          >
            Get My Free Guide
          </Button>
        </form>
        
        <p className="text-sm mt-4 opacity-75">
          No spam, ever. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default LeadMagnetBox;
