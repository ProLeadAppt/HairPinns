import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";
import { googleReviewsUrl } from "@/data/reviews";

const ReviewGoogle = () => {
  const location = useLocation();
  const rating = location.state?.rating || 5;

  return (
    <>
      <Helmet>
        <title>Share Your Review | Hair Pinns</title>
        <meta name="description" content="Thank you for your positive experience! Share it on Google." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-accent/10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-surface rounded-card shadow-card p-8 md:p-12 text-center animate-fade-in">
            {/* Emoji/Icon */}
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-scale-in">🙌</div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-h2-lg md:text-[2rem] font-heading text-heading mb-4">
                Awesome! Glad You Loved It
              </h1>
              <p className="text-lg text-muted max-w-md mx-auto">
                Would you mind sharing your experience on Google?
              </p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto text-lg px-8 py-6 mb-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Leave a Google Review
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>

            {/* Thank You Note */}
            <div className="bg-accent/20 rounded-btn p-4 mb-6 border border-accent">
              <p className="text-sm text-foreground flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 fill-brand-500 text-brand-500" />
                Your support helps us grow – thank you!
              </p>
            </div>

            {/* Secondary Action */}
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link to="/">Return Home</Link>
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Reviews help local businesses like ours reach more people who need our services
          </p>
        </div>
      </div>
    </>
  );
};

export default ReviewGoogle;
