import { Link } from "react-router-dom";
import { Star, Award, Calendar } from "lucide-react";
import { FRESHA_REVIEWS_URL } from "@/config/bookingConfig";

const SocialProofBadge = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6 px-4 bg-gradient-to-r from-brand-500/10 via-brand-400/10 to-brand-500/10 border-b border-brand-500/20">
      <Link 
        to="/reviews" 
        className="flex items-center gap-2 text-sm md:text-base font-semibold text-heading hover:text-brand-500 transition-colors"
      >
        <Star className="w-5 h-5 text-[hsl(var(--star-color))] fill-current" />
        <span>53+ Google Reviews</span>
        <span className="text-brand-500">4.9★</span>
      </Link>
      
      <a
        href={FRESHA_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm md:text-base font-semibold text-heading hover:text-brand-500 transition-colors"
      >
        <Star className="w-5 h-5 text-[hsl(var(--star-color))] fill-current" />
        <span>762+ Fresha Reviews</span>
        <span className="text-brand-500">5.0★</span>
      </a>
      
      <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-heading">
        <Award className="w-5 h-5 text-brand-500" />
        <span>20+ Years Experience</span>
        <span className="text-muted-foreground text-xs md:text-sm">(Hair Pinns est. 2009)</span>
      </div>
    </div>
  );
};

export default SocialProofBadge;

