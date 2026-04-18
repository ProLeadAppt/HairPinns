import { useEffect } from "react";
import { Helmet } from "react-helmet";

const ReviewCarousel = () => {
  useEffect(() => {
    // Load the review widget script
    const script = document.createElement('script');
    script.src = 'https://reputationhub.site/reputation/assets/review-widget.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-accent py-16 md:py-20">
      <Helmet>
        <script type="text/javascript" src="https://reputationhub.site/reputation/assets/review-widget.js" />
      </Helmet>
      
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
