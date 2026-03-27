import { Award, Truck, Shield } from "lucide-react";
import Section from "@/components/design-system/Section";

const WhyShopHairPinns = () => {
  const benefits = [
    {
      icon: Award,
      title: "I pick everything myself",
      description: "I've been doing hair since 2009. Every product in the shop is something I use on my clients. If it doesn't work, it's gone.",
    },
    {
      icon: Truck,
      title: "Free shipping over $150",
      description: "Anywhere in Australia. I pack orders from the salon and they usually go out within 1-2 days.",
    },
    {
      icon: Shield,
      title: "Easy 14-day returns",
      description: "Not right for your hair? Send it back. No drama, no hassle.",
    },
  ];

  return (
    <Section className="bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
          Why shop with me
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-card border border-border rounded-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-heading mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default WhyShopHairPinns;
