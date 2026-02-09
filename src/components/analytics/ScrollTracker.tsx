import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackScrollDepth } from "@/lib/ecommerceTracking";

const ScrollTracker = () => {
  const location = useLocation();

  useEffect(() => {
    let lastTrackedDepth = 0;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);

      // Track at 25%, 50%, 75%, 100%
      if (
        scrollPercentage >= 25 &&
        lastTrackedDepth < 25 &&
        scrollPercentage < 50
      ) {
        trackScrollDepth(25, location.pathname);
        lastTrackedDepth = 25;
      } else if (
        scrollPercentage >= 50 &&
        lastTrackedDepth < 50 &&
        scrollPercentage < 75
      ) {
        trackScrollDepth(50, location.pathname);
        lastTrackedDepth = 50;
      } else if (
        scrollPercentage >= 75 &&
        lastTrackedDepth < 75 &&
        scrollPercentage < 100
      ) {
        trackScrollDepth(75, location.pathname);
        lastTrackedDepth = 75;
      } else if (scrollPercentage >= 100 && lastTrackedDepth < 100) {
        trackScrollDepth(100, location.pathname);
        lastTrackedDepth = 100;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return null;
};

export default ScrollTracker;
