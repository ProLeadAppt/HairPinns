import { Scissors, Palette, Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Scissors,
    title: "Precision Cuts & Styling",
    description: "Cuts that work with your hair, not against it. Dry-cut for curls, blunt for thick, layered for fine. From A$39 kids to A$85+ bespoke.",
    price: "From $85",
  },
  {
    icon: Palette,
    title: "Color & Highlights",
    description: "Full-head foils, half-head, balayage, root touch-up. I do the colour, then the cut and blow-dry in the same appointment — no two trips, no surprise cost. From A$130.",
    price: "From $130",
  },
  {
    icon: Sparkles,
    title: "Treatment & Care",
    description: "Straight Up Smoothing, Olaplex bond repair, deep conditioning masks, scalp rituals. If I haven't used it on a client, it doesn't make the shelf. From A$65.",
    price: "From $65",
  },
  {
    icon: Heart,
    title: "Special Occasions",
    description: "Wedding hair, formal up-dos, school formals. Trial run included on bridal bookings so we both know how the style will hold on the day. From A$120.",
    price: "From $120",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mb-4">
              What I actually do in the chair.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four things I'm good at, priced honestly. If it isn't on this list, ask — I probably do it, I just don't list it on the homepage.
            </p>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {service.description}
                </p>
                <div className="text-brand-500 font-semibold">
                  {service.price}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;