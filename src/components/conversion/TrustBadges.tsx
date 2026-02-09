import { Shield, Lock, Award, Truck } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      text: "14-Day Returns",
      description: "Hassle-free returns",
    },
    {
      icon: Lock,
      text: "Secure Checkout",
      description: "256-bit SSL encryption",
    },
    {
      icon: Award,
      text: "Salon Quality",
      description: "Expert curated products",
    },
    {
      icon: Truck,
      text: "Free Shipping",
      description: "Over $100 Australia-wide",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-2">
              <Icon className="w-6 h-6 text-brand-500" />
            </div>
            <p className="text-sm font-semibold text-heading mb-1">{badge.text}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;
