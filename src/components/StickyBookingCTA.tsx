import { Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyBookingCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 shadow-strong">
      <div className="max-w-7xl mx-auto flex gap-3 justify-center">
        <Button 
          variant="rose-gold" 
          size="lg" 
          className="flex-1 max-w-xs"
          onClick={() => window.open('https://fresha.com', '_blank')}
        >
          <Calendar className="w-5 h-5" />
          Book on Fresha
        </Button>
        <Button 
          variant="rose-gold-outline" 
          size="lg" 
          className="flex-1 max-w-xs"
          onClick={() => window.open('https://shopify.com', '_blank')}
        >
          <ShoppingBag className="w-5 h-5" />
          Shop Featured
        </Button>
      </div>
    </div>
  );
};

export default StickyBookingCTA;