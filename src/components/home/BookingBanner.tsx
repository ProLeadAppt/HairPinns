import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const BookingBanner = () => {
  return (
    <section className="bg-brand-500 text-white py-16 md:py-20" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-h2-lg font-heading font-bold mb-4">
          Not sure what's right? Book a quick consult.
        </h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Get personalized product recommendations and hair advice from Jena. 
          Free 15-minute consultations available.
        </p>
        <a 
          href="https://www.fresha.com/book-now/hair-pinns-example" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button 
            variant="secondary" 
            size="xl"
            className="bg-white text-brand-500 hover:bg-white/90"
          >
            <Calendar className="w-5 h-5" />
            Book on Fresha
          </Button>
        </a>
      </div>
    </section>
  );
};

export default BookingBanner;
