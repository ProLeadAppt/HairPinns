import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const LeadMagnetBox = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, this would integrate with GoHighLevel
    // For now, we'll show a success message
    console.log("Lead capture:", { email, phone });
    
    toast({
      title: "Success!",
      description: "You're subscribed! Check your inbox for your exclusive hair care guide.",
    });
    
    setEmail("");
    setPhone("");
  };

  return (
    <div className="my-12 p-8 bg-brand-500 text-white rounded-card">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-h2 font-heading mb-3">
          Get Your Free Hair Care Guide
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Join our community and receive exclusive tips, product recommendations, 
          and special offers from Hair Pinns Bangor.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <Mail className="w-5 h-5 ml-3 opacity-70" />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <MessageSquare className="w-5 h-5 ml-3 opacity-70" />
            <Input
              type="tel"
              placeholder="Your phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-white text-brand-500 hover:bg-white/90"
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
