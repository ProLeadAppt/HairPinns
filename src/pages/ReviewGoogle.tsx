import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Sparkles } from "lucide-react";
import { googleReviewsUrl } from "@/data/reviews";
import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

const ReviewGoogle = () => {
  const location = useLocation();
  const rating = location.state?.rating || 5;

  useEffect(() => {
    // Celebration confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8B4A8B', '#E7D2EE', '#773E77'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8B4A8B', '#E7D2EE', '#773E77'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <>
      <Helmet>
        <title>Share Your Review | Hair Pinns</title>
        <meta name="description" content="Thank you for your positive experience! Share it on Google." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated sparkles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: 0,
                opacity: 0 
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-4 h-4 text-brand-500/40" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="w-full max-w-lg relative z-10"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            duration: 0.6 
          }}
        >
          <div className="bg-surface/80 backdrop-blur-xl rounded-card shadow-[0_8px_40px_rgba(139,74,139,0.15)] p-8 md:p-12 text-center border border-accent/30 relative overflow-hidden">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-accent/20 to-brand-500/20 opacity-50 animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
            
            <div className="relative z-10">
              {/* Emoji/Icon with bounce animation */}
              <motion.div 
                className="mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.2 
                }}
              >
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🙌
                </motion.div>
              </motion.div>

              {/* Header */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-h2-lg md:text-[2rem] font-heading text-heading mb-4">
                  Awesome! Glad You Loved It
                </h1>
                <p className="text-lg text-muted max-w-md mx-auto">
                  Would you mind sharing your experience on Google?
                </p>
              </motion.div>

              {/* CTA Button with breathing animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto text-lg px-8 py-6 mb-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group animate-breathing"
                >
                  <a
                    href={googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {/* Shimmer effect on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    <span className="relative z-10">Leave a Google Review</span>
                    <ExternalLink className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>

              {/* Thank You Note with floating hearts */}
              <motion.div 
                className="bg-accent/20 rounded-btn p-4 mb-6 border border-accent relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ bottom: -20, left: `${30 + i * 20}%` }}
                      animate={{ 
                        bottom: "100%",
                        y: [-10, 0, -10],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    >
                      <Heart className="w-3 h-3 fill-brand-500/30 text-brand-500/30" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-sm text-foreground flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-4 h-4 fill-brand-500 text-brand-500" />
                  Your support helps us grow – thank you!
                </p>
              </motion.div>

              {/* Secondary Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button variant="outline" asChild className="w-full md:w-auto hover:scale-105 transition-transform">
                  <Link to="/">Return Home</Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Footer Note */}
          <motion.p 
            className="text-center text-xs text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Reviews help local businesses like ours reach more people who need our services
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default ReviewGoogle;
