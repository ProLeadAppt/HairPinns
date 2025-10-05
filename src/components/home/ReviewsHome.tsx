import { Star } from "lucide-react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const ReviewsHome = () => {
  const reviews = [
    {
      name: "Sarah M.",
      stars: 5,
      text: "Jena is amazing! She always knows exactly what my hair needs and the products she recommends actually work."
    },
    {
      name: "Emma L.",
      stars: 5,
      text: "Best salon experience I've ever had. The Christmas gift pack was perfect for my sister — she absolutely loved it!"
    },
    {
      name: "Jessica K.",
      stars: 5,
      text: "I've been coming to Hair Pinns for over 2 years. Consistently excellent service and my hair has never looked better."
    },
    {
      name: "Michelle T.",
      stars: 5,
      text: "The blonde balayage I got here is flawless. Jena really knows her craft and the salon has such a welcoming vibe."
    },
    {
      name: "Rachel P.",
      stars: 5,
      text: "Love the professional products they stock! They've transformed my dry, damaged hair. Highly recommend the treatment range."
    }
  ];

  return (
    <Section variant="accent" className="content-visibility-auto" style={{ containIntrinsicSize: "0 1200px" }}>
      <SectionHeader
        title="What Our Clients Say"
        subtitle="Real reviews from real people"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div 
            key={index}
            className="bg-card border border-border rounded-card p-6"
          >
            <div className="flex mb-3">
              {[...Array(review.stars)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" 
                />
              ))}
            </div>
            
            <p className="text-foreground leading-relaxed mb-4">
              "{review.text}"
            </p>
            
            <p className="text-sm font-medium text-muted-foreground">
              — {review.name}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ReviewsHome;
