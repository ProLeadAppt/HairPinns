import { useEffect } from "react";

const REVIEWS_SCRIPT_SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';

const ReviewCarousel = () => {
  useEffect(() => {
    if (document.querySelector(`script[src="${REVIEWS_SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = REVIEWS_SCRIPT_SRC;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-accent py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-lg font-heading font-bold text-heading mb-3">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground">Real reviews from real people</p>
        </div>
        
        <div className="w-full">
          <iframe 
            className="lc_reviews_widget" 
            src="https://reputationhub.site/reputation/widgets/review_widget/KPqFSaNlJv2TZr2naF8b" 
            frameBorder="0" 
            scrolling="no" 
            style={{ minWidth: '100%', width: '100%', border: 'none' }}
            title="Customer Reviews"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewCarousel;
