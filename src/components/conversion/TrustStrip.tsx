import { Truck, Award, Lock } from "lucide-react";

const TrustStrip = () => {
  const trustSignals = [
    {
      icon: Truck,
      text: "AU shipping",
    },
    {
      icon: Award,
      text: "Salon-approved",
    },
    {
      icon: Lock,
      text: "Secure checkout",
    },
  ];

  return (
    <div className="bg-muted border-y border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2">
              <signal.icon className="w-5 h-5 text-brand-500" />
              <span className="text-sm font-medium text-foreground">
                {signal.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
