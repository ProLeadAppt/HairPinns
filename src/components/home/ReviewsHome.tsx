import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const ReviewsHome = () => {
  useEffect(() => {
    // Load the review widget script
    const script = document.createElement('script');
    script.src = 'https://reputationhub.site/reputation/assets/review-widget.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Section variant="accent" className="content-visibility-auto" style={{ containIntrinsicSize: "0 1200px" }}>
      <Helmet>
        <script type="text/javascript" src="https://reputationhub.site/reputation/assets/review-widget.js" />
      </Helmet>
      
      <SectionHeader
        title="What Our Clients Say"
        subtitle="Real reviews from real people"
      />
      
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
    </Section>
  );
};

export default ReviewsHome;
