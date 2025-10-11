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
    <section className="py-8 bg-white/5 backdrop-blur-sm" style={{ contentVisibility: "auto" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-card p-5 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 text-[hsl(var(--star-color))] fill-current" 
                  />
                ))}
              </div>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                "{testimonial.text}"
              </p>
              <p className="text-xs font-semibold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
