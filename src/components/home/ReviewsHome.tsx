import { useEffect } from "react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const REVIEWS_SCRIPT_SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';

const ReviewsHome = () => {
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
    <Section variant="accent" className="content-visibility-auto" style={{ containIntrinsicSize: "0 1200px" }}>
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
