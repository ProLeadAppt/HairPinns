import { Link } from "react-router-dom";
import Section from "@/components/design-system/Section";

const ReviewsShowcase = () => {
  return (
    <Section className="bg-muted/30">
      <div className="max-w-3xl mx-auto text-center py-8">
        {/* Large decorative quote mark */}
        <span className="text-6xl md:text-8xl font-serif text-brand-500/15 leading-none select-none">
          &ldquo;
        </span>

        {/* Actual review quote — from Google reviews */}
        <blockquote className="text-xl md:text-2xl text-heading font-heading leading-relaxed -mt-8 mb-6">
          Jena is incredible. She really listens to what you want and delivers
          every time. My colour has never looked better. Wouldn&rsquo;t go
          anywhere else.
        </blockquote>

        {/* Attribution */}
        <p className="text-sm text-muted-foreground mb-8">
          Sarah M. · Google Review
        </p>

        {/* Supporting stats line */}
        <p className="text-sm text-muted-foreground">
          4.9 on Google · 5.0 on Fresha (762+ reviews)
        </p>

        {/* Link to all reviews */}
        <Link
          to="/reviews"
          className="inline-block mt-4 text-sm text-brand-500 hover:text-brand-600 font-medium"
        >
          Read all reviews &rarr;
        </Link>
      </div>
    </Section>
  );
};

export default ReviewsShowcase;
