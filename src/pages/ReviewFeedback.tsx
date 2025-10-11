import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle } from "lucide-react";
import { googleReviewsUrl } from "@/data/reviews";

const ReviewFeedback = () => {
  const location = useLocation();
  const rating = location.state?.rating || 0;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please share your feedback with us.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual webhook/API endpoint
      console.log("Feedback submission:", {
        ...formData,
        rating,
        timestamp: new Date().toISOString(),
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      
      toast({
        title: "Thank You",
        description: "We appreciate your feedback and will review it carefully.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Something Went Wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Thank You | Hair Pinns</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <div className="bg-surface rounded-card shadow-card p-8 md:p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-brand-500" />
              </div>
              
              <h1 className="text-h2-lg font-heading text-heading mb-4">
                Thank You for Your Feedback
              </h1>
              
              <p className="text-muted mb-8">
                We take all feedback seriously and will use it to improve our service. 
                We may reach out if you've provided contact details.
              </p>

              <Button asChild className="w-full md:w-auto">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Share Your Feedback | Hair Pinns</title>
        <meta name="description" content="Help us understand how we can improve your experience." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-surface rounded-card shadow-card p-8 md:p-12 animate-fade-in">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-h2-lg font-heading text-heading mb-3">
                We're Sorry to Hear That
              </h1>
              <p className="text-muted">
                Please share how we can make things right
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Name <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="feedback" className="text-foreground">
                  Your Feedback <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Please tell us what went wrong and how we can improve..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="mt-2 min-h-[120px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>

            {/* Google Review Link - Muted */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Still wish to leave a public review?{" "}
                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground underline inline-flex items-center gap-1 transition-colors"
                >
                  Click here
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewFeedback;
