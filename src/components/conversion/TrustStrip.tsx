import { Truck, Shield, Star } from "lucide-react";

const TrustStrip = () => {
  return (
    <div className="bg-muted/50 border-y border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-brand-500" /> Free shipping over $150
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-brand-500" /> 14-day returns
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-brand-500" /> 762+ five-star reviews
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
