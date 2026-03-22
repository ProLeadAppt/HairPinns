import { Award, Truck, Shield, Star, Sparkles } from "lucide-react";
import Section from "@/components/design-system/Section";
import { FREE_SHIPPING_THRESHOLD_DISPLAY } from "@/config/shippingConfig";

const WhyShopHairPinns = () => {
  const benefits = [
    {
      icon: Award,
      title: "15+ Years of Knowing What Works",
      description: "Since 2009, Jena has handpicked only the finest salon-quality products for her clients. Every item in our collection is tried, tested, and loved.",
    },
    {
      icon: Sparkles,
      title: "Salon-Quality Products",
      description: "Salon-quality products. Nothing from the supermarket aisle — stuff that actually works.",
    },
    {
      icon: Truck,
      title: "Nationwide Shipping",
      description: `Free shipping on orders over ${FREE_SHIPPING_THRESHOLD_DISPLAY} Australia-wide. Fast, secure delivery to your door, no matter where you are in Australia.`,
    },
    {
      icon: Shield,
      title: "14-Day Returns",
      description: "Not satisfied? We offer hassle-free 14-day returns. Your satisfaction is our priority.",
    },
    {
      icon: Star,
      title: "762+ Five-Star Reviews",
      description: "Join hundreds of satisfied customers. With 762+ five-star reviews on Fresha and 53+ Google reviews, we're trusted by thousands.",
    },
  ];

  return (
    <Section className="bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
          Why Thousands Trust Hair Pinns
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Why thousands of people trust Jena and Hair Pinns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-card p-6 hover:shadow-lg transition-shadow duration-base"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-semibold text-heading mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default WhyShopHairPinns;

