import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Send, Home, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { soundEffects } from "@/lib/soundEffects";
import { haptics } from "@/lib/haptics";
import { analyzeSentiment } from "@/lib/sentimentAnalysis";
import { hpCapture } from "@/lib/hpCapture";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AUTOSAVE_KEY = 'hair-pinns-feedback-draft';

const ReviewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rating = location.state?.rating || 3;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const [completedFields, setCompletedFields] = useState({
    name: false,
    email: false,
    feedback: false,
  });

  const sentiment = formData.feedback.length > 10 ? analyzeSentiment(formData.feedback) : null;

  // Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('.feedback-card')?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        // Check which fields are already filled
        setCompletedFields({
          name: parsed.name.trim().length > 0,
          email: parsed.email.trim().length > 0,
          feedback: parsed.feedback.trim().length > 0,
        });
      } catch (e) {
        console.error('Failed to parse saved feedback');
      }
    }
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
    }
  }, [formData, isSubmitted]);

  // Exit intent detection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmitted && (formData.name || formData.email || formData.feedback)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isSubmitted && (formData.name || formData.email || formData.feedback)) {
        setShowExitDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [formData, isSubmitted]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update completed fields
    const isComplete = value.trim().length > 0;
    setCompletedFields((prev) => ({
      ...prev,
      [name]: isComplete,
    }));

    // Haptic feedback on completion
    if (isComplete && !completedFields[name as keyof typeof completedFields]) {
      haptics.light();
      soundEffects.playClick();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEffects.playClick();
    haptics.medium();

    const feedbackData = {
      ...formData,
      rating,
      sentiment: sentiment?.label || 'unknown',
      timestamp: new Date().toISOString(),
    };

    try {
      await hpCapture.postToGHL({
        form_name: 'review_feedback',
        name: formData.name,
        email: formData.email,
        message: formData.feedback,
        rating: rating,
        sentiment: sentiment?.label || 'unknown',
      }, {
        event: 'review_feedback'
      });
      
      console.log("Feedback submitted:", feedbackData);
      soundEffects.playSuccess();
      haptics.success();
      localStorage.removeItem(AUTOSAVE_KEY);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      haptics.error();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    soundEffects.playClick();
    haptics.light();
    navigate("/");
  };

  const handleGoogleReview = () => {
    soundEffects.playClick();
    haptics.medium();
    window.open("https://g.page/r/CX-F0vOcpJLhEBM/review", "_blank");
  };

  // Exit intent dialog
  const ExitIntentDialog = () => (
    <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-500" />
            Before you go...
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your feedback is really valuable to us. It only takes a moment to share your thoughts and helps us improve our service for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            soundEffects.playClick();
            haptics.light();
          }}>
            Leave anyway
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            soundEffects.playClick();
            haptics.medium();
            setShowExitDialog(false);
          }}>
            Continue feedback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Thank you state after submission
  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Thank You | Hair Pinns</title>
          <meta name="description" content="Thank you for your feedback. We appreciate your time." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
          <motion.div 
            className="w-full max-w-2xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 border border-accent/30">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2 
                }}
              >
                <CheckCircle2 className="w-20 h-20 text-brand-500 mx-auto mb-6" />
              </motion.div>

              <motion.h1 
                className="text-h2-lg md:text-[2rem] font-heading text-heading mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Thank You for Your Feedback!
              </motion.h1>

              <motion.p 
                className="text-lg text-text mb-10 max-w-md mx-auto"
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
              className="flex justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleGoHome}
                  size="lg"
                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-500 text-white"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </motion.div>

            {/* Small compliance link at bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-accent/30"
            >
              <p className="text-xs text-muted-foreground text-center">
                <a 
                  href="https://g.page/r/CX-F0vOcpJLhEBM/review" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={soundEffects.playClick}
                  className="hover:text-brand-500 transition-colors"
                >
                  Leave a public Google review
                </a>
              </p>
            </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const completedCount = Object.values(completedFields).filter(Boolean).length;
  const progressPercentage = (completedCount / 3) * 100;

  return (
    <>
      <Helmet>
        <title>Share Your Feedback | Hair Pinns</title>
        <meta name="description" content="We'd love to hear your feedback to help us improve." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <ExitIntentDialog />

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
        <motion.div 
          className="w-full max-w-2xl feedback-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 border border-accent/30"
            style={{ transform: "translateZ(20px)" }}
          >
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-h2-lg md:text-[2rem] font-heading text-heading mb-3">
                Help Us Improve
              </h1>
              <p className="text-lg text-text">
                We're sorry we didn't meet your expectations. Your honest feedback helps us do better.
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text">Progress</span>
                <span className="text-sm font-medium text-brand-500">
                  {completedCount}/3 fields
                </span>
              </div>
              <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {progressPercentage === 100 && (
                    <motion.div
                      className="h-full w-full"
                      animate={{ 
                        background: [
                          'linear-gradient(90deg, #8B4A8B 0%, #773E77 100%)',
                          'linear-gradient(90deg, #773E77 0%, #8B4A8B 100%)',
                          'linear-gradient(90deg, #8B4A8B 0%, #773E77 100%)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="name" className="text-base font-medium text-heading">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="mt-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Label htmlFor="email" className="text-base font-medium text-heading">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="mt-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="feedback" className="text-base font-medium text-heading">
                  Your Feedback <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Tell us about your experience..."
                  required
                  rows={6}
                  className="mt-2 resize-none"
                />
                
                {/* Sentiment Analysis Preview */}
                <AnimatePresence>
                  {sentiment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex items-center gap-2 text-sm"
                    >
                      <span className="text-2xl">{sentiment.emoji}</span>
                      <span className="text-text">
                        Sentiment: <strong className="text-brand-500 capitalize">{sentiment.label}</strong>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-500 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={handleGoHome}
                  variant="outline"
                  size="lg"
                  className="text-brand-500 border-brand-500/30 hover:bg-brand-500/5"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Button>
              </motion.div>
            </motion.div>
            </form>

            {/* Footer note */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-xs text-text">
                💜 Your feedback is private and helps us improve
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ReviewFeedback;
