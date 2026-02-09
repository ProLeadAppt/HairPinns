import { useState } from "react";
import { Calculator, Package, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Australian states and territories
const AU_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

interface ShippingOption {
  name: string;
  price: string;
  estimatedDays: string;
  description?: string;
}

interface ShippingCalculatorProps {
  cartTotal?: number;
  className?: string;
}

export default function ShippingCalculator({ cartTotal = 0, className = "" }: ShippingCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateShipping = async () => {
    if (!postcode || !state) {
      setError("Please enter your postcode and select your state.");
      return;
    }

    // Validate postcode format (4 digits for AU)
    if (!/^\d{4}$/.test(postcode)) {
      setError("Please enter a valid 4-digit Australian postcode.");
      return;
    }

    setIsCalculating(true);
    setError(null);

    // Simulate API call - replace with actual shipping API integration
    setTimeout(() => {
      const options: ShippingOption[] = [];

      // Free shipping over $100
      if (cartTotal >= 100) {
        options.push({
          name: "Free Standard Shipping",
          price: "$0.00",
          estimatedDays: "5-7 business days",
          description: "Free shipping on orders over $100",
        });
      }

      // Standard shipping options
      options.push({
        name: "Standard Shipping",
        price: cartTotal >= 50 ? "$9.95" : "$12.95",
        estimatedDays: "5-7 business days",
      });

      options.push({
        name: "Express Shipping",
        price: "$19.95",
        estimatedDays: "2-3 business days",
      });

      // Metro areas get faster delivery
      const metroPostcodes = ["2000", "3000", "4000", "5000", "6000", "7000", "800", "900"];
      const isMetro = metroPostcodes.some((code) => postcode.startsWith(code));

      if (isMetro) {
        options.push({
          name: "Same Day Delivery (Sydney Metro)",
          price: "$29.95",
          estimatedDays: "Same day (if ordered before 2pm)",
          description: "Available for Sydney metro areas only",
        });
      }

      setShippingOptions(options);
      setIsCalculating(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateShipping();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Shipping
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Shipping Calculator</DialogTitle>
          <DialogDescription>
            Enter your location to see shipping options and estimated delivery times.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="postcode" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Postcode
              </label>
              <Input
                id="postcode"
                type="text"
                placeholder="2000"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {AU_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isCalculating}>
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Calculate Shipping
              </>
            )}
          </Button>
        </form>

        {shippingOptions.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm">Available Shipping Options:</h3>
            {shippingOptions.map((option, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{option.name}</CardTitle>
                    <CardDescription className="text-base font-semibold text-foreground">
                      {option.price}
                    </CardDescription>
                  </div>
                  {option.description && (
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: {option.estimatedDays}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Free shipping on orders over $100</p>
          <p>• Standard shipping: $9.95 (orders $50+) or $12.95</p>
          <p>• Express shipping available for most areas</p>
          <p>• Same-day delivery available for Sydney metro (order before 2pm)</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

