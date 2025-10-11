import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ExternalLink, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { motion, useMotionValue, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { soundEffects } from "@/lib/soundEffects";
import { haptics } from "@/lib/haptics";

const ReviewGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rating = location.state?.rating || 5;
  const [socialProofCount, setSocialProofCount] = useState(847);

  // Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-300, 300], [-3, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('.google-card')?.getBoundingClientRect();
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

  useEffect(() => {
    // Celebration confetti and sound on mount
    soundEffects.playCelebration();
    haptics.success();
    
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ['#8B4A8B', '#E7D2EE', '#773E77', '#5D2C5D'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Animate social proof counter
    const startCount = 840;
    const endCount = 847;
    const duration2 = 2000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration2, 1);
      const current = Math.floor(startCount + (endCount - startCount) * progress);
      setSocialProofCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const handleGoogleReview = () => {
    soundEffects.playSuccess();
    haptics.medium();
    window.open("https://g.page/r/CX-F0vOcpJLhEBM/review", "_blank");
  };

  const handleGoHome = () => {
    soundEffects.playClick();
    haptics.light();
    navigate("/");
  };

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
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
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
          className="w-full max-w-2xl relative z-10 google-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          style={{ 
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="bg-surface/90 backdrop-blur-xl rounded-card shadow-[0_12px_50px_rgba(139,74,139,0.2)] p-8 md:p-12 text-center border border-accent/40 relative overflow-hidden"
            style={{ transform: "translateZ(30px)" }}
          >
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
                <h1 className="text-h2-lg md:text-[2.5rem] font-heading text-heading mb-4">
                  Awesome! Glad You Loved It
                </h1>
              </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-lg text-muted mb-4 max-w-lg mx-auto">
                Your {rating}-star experience means the world to us! Share it on Google to help other clients discover Hair Pinns.
              </p>
              
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 text-sm text-muted"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💜
                </motion.span>
                <span>
                  Join <strong className="text-brand-500">{socialProofCount}+</strong> happy clients
                </span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGoogleReview}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    Leave Google Review
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  size="lg"
                  className="text-brand-500 border-brand-500/30 hover:bg-brand-500/5 text-lg px-8 py-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </motion.div>

              {/* Thank You Note */}
              <motion.div 
                className="bg-accent/20 rounded-btn p-4 border border-accent relative overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <p className="text-sm text-foreground flex items-center justify-center gap-2 relative z-10">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💜
                  </motion.span>
                  Your support helps us grow – thank you!
                </p>
              </motion.div>
            </div>
          </div>

          {/* Footer Note */}
          <motion.p 
            className="text-center text-xs text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Reviews help local businesses like ours reach more people who need our services
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default ReviewGoogle;
