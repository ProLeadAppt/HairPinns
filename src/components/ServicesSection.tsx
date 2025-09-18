import { Scissors, Palette, Sparkles, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Scissors,
    title: "Precision Cuts & Styling",
    description: "Expert cuts tailored to your face shape and lifestyle. From classic to contemporary, we create looks that enhance your natural beauty.",
    price: "From $85",
  },
  {
    icon: Palette,
    title: "Color & Highlights",
    description: "Dimensional color, balayage, and precision highlighting using premium products. Transform your look with our color expertise.",
    price: "From $130",
  },
  {
    icon: Sparkles,
    title: "Treatment & Care",
    description: "Deep conditioning, keratin treatments, and scalp therapies. Restore and maintain your hair's health and vitality.",
    price: "From $65",
  },
  {
    icon: Heart,
    title: "Special Occasions",
    description: "Bridal styling, formal updos, and special event looks. Make your moments memorable with our styling expertise.",
    price: "From $120",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of hair services, each delivered with 
              expert technique and personalized attention to detail.
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