import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, CheckCircle2, Heart } from "lucide-react";
import { googleReviewsUrl } from "@/data/reviews";
import { motion, AnimatePresence } from "framer-motion";

const ReviewFeedback = () => {
  const location = useLocation();
  const rating = location.state?.rating || 3;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedFields, setCompletedFields] = useState({
    name: false,
    email: false,
    feedback: false,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setCompletedFields((prev) => ({ ...prev, [field]: value.length > 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        feedback: formData.feedback,
        rating: rating,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
      };

      console.log("Sending feedback to Zapier:", payload);

      await fetch("https://hooks.zapier.com/hooks/catch/23975177/u59txby/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = 
    (Object.values(completedFields).filter(Boolean).length / 3) * 100;

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Thank You | Hair Pinns</title>
          <meta name="description" content="Thank you for your feedback!" />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
          <motion.div 
            className="w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 text-center border border-accent/30">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2 
                }}
              >
                <CheckCircle2 className="w-16 h-16 text-brand-500 mx-auto mb-6" />
              </motion.div>

              <motion.h1 
                className="text-h2-lg font-heading text-heading mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Thank You for Your Feedback!
              </motion.h1>

              <motion.p 
                className="text-muted mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                We really appreciate you taking the time to share your thoughts. Your feedback helps us improve.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-accent/20 rounded-btn p-4 mb-6 border border-accent">
                  <p className="text-sm text-muted-foreground mb-3">
                    Had a great experience? We'd love a Google review too:
                  </p>
                  <Button asChild size="sm" variant="outline" className="hover:scale-105 transition-transform">
                    <a
                      href={googleReviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Leave Google Review
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                <Button variant="outline" asChild className="w-full md:w-auto hover:scale-105 transition-transform">
                  <Link to="/">Return Home</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Share Your Feedback | Hair Pinns</title>
        <meta name="description" content="We'd love to hear your feedback on how we can improve." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
        <motion.div 
          className="w-full max-w-lg"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20 
          }}
        >
          <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 border border-accent/30 relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent/30 rounded-t-card overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-h2-lg font-heading text-heading mb-3">
                Help Us Improve
              </h1>
              <p className="text-muted">
                We're sorry we didn't meet your expectations. Your honest feedback helps us do better.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Label htmlFor="name" className="text-foreground mb-2 block">
                    Your Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="pr-10 focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                    {completedFields.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <Label htmlFor="email" className="text-foreground mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="pr-10 focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                    {completedFields.email && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <Label htmlFor="feedback" className="text-foreground mb-2 block">
                    What could we have done better?
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="feedback"
                      value={formData.feedback}
                      onChange={(e) => handleChange("feedback", e.target.value)}
                      required
                      rows={4}
                      className="resize-none focus:ring-2 focus:ring-brand-500 transition-all"
                      placeholder="Please be as specific as possible..."
                    />
                    {completedFields.feedback && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-500" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.feedback.length} characters
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden group"
                  size="lg"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      "Submit Feedback"
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </Button>
              </motion.div>
            </form>

            {/* Footer note */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <Heart className="w-3 h-3" />
                Your feedback is private and helps us improve
              </p>
            </motion.div>
          </div>

          {/* Back link */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/">Return Home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ReviewFeedback;
