import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { soundEffects } from "@/lib/soundEffects";
import { haptics } from "@/lib/haptics";

const sentimentLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const Reviews = () => {
  const navigate = useNavigate();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  
  // Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('.review-card')?.getBoundingClientRect();
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

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
    soundEffects.playHover();
    haptics.light();
  };

  const handleStarClick = (rating: number) => {
    setSelectedStar(rating);
    soundEffects.playClick();
    haptics.medium();
    
    // Advanced confetti for 4-5 stars
    if (rating >= 4) {
      soundEffects.playCelebration();
      haptics.success();
      
      // Multi-burst confetti
      const duration = 1000;
      const end = Date.now() + duration;

      const colors = ['#8B4A8B', '#E7D2EE', '#773E77', '#5D2C5D'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else if (rating <= 2) {
      soundEffects.playSympathy();
      haptics.error();
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
      <SEOHead
        title="Share Your Experience | Hair Pinns"
        description="How was your experience with Hair Pinns? Share your feedback to help us improve."
        noIndex={true}
      />

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
          className="w-full max-w-2xl relative z-10 review-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ 
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 text-center border border-accent/30"
            style={{ transform: "translateZ(20px)" }}
          >
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg text-text max-w-md mx-auto">
                Tap a star below to rate us
              </p>
            </motion.div>
            </motion.div>

            {/* Star Rating with sequential appearance */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="flex justify-center gap-3 md:gap-6">
                <AnimatePresence>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isHovered = hoveredStar !== null && star <= hoveredStar;
                    const isSelected = selectedStar !== null && star <= selectedStar;
                    const shouldFill = isSelected || isHovered;

                    return (
                      <motion.button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
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

              {/* Sentiment Label */}
              <AnimatePresence mode="wait">
                {(hoveredStar || selectedStar) && (
                  <motion.div
                    key={hoveredStar || selectedStar}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-medium text-brand-500"
                  >
                    {sentimentLabels[(hoveredStar || selectedStar)! - 1]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Helper Text */}
            <motion.p 
              className="text-sm text-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Your feedback helps us serve you better
            </motion.p>
          </div>

          {/* Footer Note */}
          <motion.p 
            className="text-center text-xs text-text mt-6"
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
