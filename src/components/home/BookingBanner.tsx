import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const BookingBanner = () => {
  return (
    <section className="bg-brand-500 text-white py-16 md:py-20" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2-lg font-heading font-bold mb-6">
          Want advice? Book a quick consult.
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Not sure which products or services are right for you? Schedule a free 
          consultation with Jena and get personalized recommendations.
        </p>
        <Link to="/booking">
          <Button 
            variant="secondary" 
            size="xl"
            className="bg-white text-brand-500 hover:bg-white/90"
          >
            <Calendar className="w-5 h-5" />
            Book on Fresha
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BookingBanner;
