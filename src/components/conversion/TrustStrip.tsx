import { Truck, Shield, Star, Lock } from "lucide-react";

export default function TrustStrip() {
  return (
    <div className="bg-muted/50 border-y border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-5 h-5 text-brand-500" />
            <div className="text-sm">
              <p className="font-semibold text-heading">Free Shipping</p>
              <p className="text-xs text-muted-foreground">Over $150</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-5 h-5 text-brand-500" />
            <div className="text-sm">
              <p className="font-semibold text-heading">14-Day Returns</p>
              <p className="text-xs text-muted-foreground">Hassle-free</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" />
            <div className="text-sm">
              <p className="font-semibold text-heading">Secure Checkout</p>
              <p className="text-xs text-muted-foreground">Protected</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Star className="w-5 h-5 text-brand-500 fill-current" />
            <div className="text-sm">
              <p className="font-semibold text-heading">762+ Reviews</p>
              <p className="text-xs text-muted-foreground">Five-star rated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
