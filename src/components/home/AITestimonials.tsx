import { Star } from "lucide-react";

const AITestimonials = () => {
  const testimonials = [
    {
      text: "I loved chatting with Isabella before booking - got all my questions answered instantly!",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "Called Sam at 10 PM and got instant help choosing my treatment. So convenient!",
      author: "Lisa K.",
      rating: 5
    },
    {
      text: "Isabella helped me understand the difference between treatments. Made booking so easy!",
      author: "Emma R.",
      rating: 5
    }
  ];

  return (
    <section className="py-8 bg-accent" style={{ contentVisibility: "auto" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-card p-5 border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" 
                  />
                ))}
              </div>
              <p className="text-sm mb-3 leading-relaxed text-text">
                "{testimonial.text}"
              </p>
              <p className="text-xs font-semibold text-muted">
                - {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AITestimonials;
