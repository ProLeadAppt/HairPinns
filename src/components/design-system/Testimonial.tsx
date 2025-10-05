import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "./Card";

interface TestimonialProps {
  quote: string;
  author: string;
  title?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  variant?: "default" | "card" | "minimal";
}

const Testimonial = ({
  quote,
  author,
  title,
  company,
  avatar,
  rating,
  variant = "default"
}: TestimonialProps) => {
  const renderStars = () => {
    if (!rating) return null;
    return (
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-4 h-4",
              i < rating ? "text-[hsl(var(--star-color))] fill-current" : "text-muted-foreground"
            )} 
          />
        ))}
      </div>
    );
  };

  const renderContent = () => (
    <>
      {renderStars()}
      <blockquote className="text-lg text-foreground leading-relaxed mb-6">
        <Quote className="w-6 h-6 text-brand-500 mb-2 opacity-50" />
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        {avatar && (
          <img 
            src={avatar} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <cite className="text-foreground font-medium not-italic">{author}</cite>
          {(title || company) && (
            <p className="text-muted-foreground text-sm">
              {title}{title && company && ', '}{company}
            </p>
          )}
        </div>
      </div>
    </>
  );

  if (variant === "card") {
    return (
      <Card variant="elevated" padding="lg">
        {renderContent()}
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="text-center">
        {renderStars()}
        <blockquote className="text-xl text-foreground font-medium mb-4">
          "{quote}"
        </blockquote>
        <cite className="text-muted-foreground not-italic">
          — {author}{title && `, ${title}`}
        </cite>
      </div>
    );
  }

  return (
    <div className="bg-accent/5 border border-border rounded-card p-6">
      {renderContent()}
    </div>
  );
};

export default Testimonial;