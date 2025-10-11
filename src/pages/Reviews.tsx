import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Reviews = () => {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleStarClick = (rating: number) => {
    setSelectedStar(rating);
    
    // Celebration for 4-5 stars
    if (rating >= 4) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8B4A8B', '#E7D2EE', '#773E77'],
      });
    }
    
    // Delay for visual feedback
    setTimeout(() => {
      if (rating <= 3) {
        navigate("/reviews/feedback", { state: { rating } });
      } else {
        navigate("/reviews/google", { state: { rating } });
      }
    }, 600);
  };

  return (
    <>
      <Helmet>
        <title>Share Your Experience | Hair Pinns</title>
        <meta name="description" content="How was your experience with Hair Pinns? Share your feedback to help us improve." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-500/20 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: -20 }}
              animate={{
                y: window.innerHeight + 20,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <motion.div 
          className="w-full max-w-2xl relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 text-center border border-accent/30">
            {/* Header with staggered word animation */}
            <motion.div 
              className="mb-12"
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-h2-lg md:text-[2.5rem] font-heading text-heading mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                How was your experience with Hair Pinns?
              </motion.h1>
              <motion.p 
                className="text-lg text-muted max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Tap a star below to rate us
              </motion.p>
            </motion.div>

            {/* Star Rating with sequential appearance */}
            <div className="flex justify-center gap-3 md:gap-6 mb-8">
              <AnimatePresence>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHovered = hoveredStar !== null && star <= hoveredStar;
                  const isSelected = selectedStar !== null && star <= selectedStar;
                  const shouldFill = isSelected || isHovered;

                  return (
                    <motion.button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className={cn(
                        "transform transition-all duration-200 hover:scale-110 active:scale-95 relative",
                        "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded-lg p-2",
                        isSelected && "scale-105"
                      )}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.6 + star * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {/* Glow effect on hover */}
                      {shouldFill && (
                        <motion.div
                          className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      
                      <Star
                        className={cn(
                          "w-12 h-12 md:w-16 md:h-16 transition-all duration-200 relative z-10",
                          shouldFill
                            ? "fill-brand-500 text-brand-500 drop-shadow-[0_0_8px_rgba(139,74,139,0.5)]"
                            : "text-border hover:text-brand-500/50"
                        )}
                      />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Helper Text */}
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Your feedback helps us serve you better
            </motion.p>
          </div>

          {/* Footer Note */}
          <motion.p 
            className="text-center text-xs text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Your feedback is confidential and helps us improve our service
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default Reviews;
