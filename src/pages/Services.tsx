import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import ServiceRow from "@/components/design-system/ServiceRow";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      category: "Cuts & Styling",
      items: [
        { name: "Women's Cut & Style", price: "$85", duration: "60 min" },
        { name: "Men's Cut", price: "$45", duration: "30 min" },
        { name: "Children's Cut (under 12)", price: "$35", duration: "30 min" },
        { name: "Blow Dry & Style", price: "$55", duration: "45 min" },
      ]
    },
    {
      category: "Colour Services",
      items: [
        { name: "Full Colour", price: "From $120", duration: "2-3 hours" },
        { name: "Balayage", price: "From $180", duration: "3-4 hours" },
        { name: "Highlights (half head)", price: "$140", duration: "2 hours" },
        { name: "Highlights (full head)", price: "$180", duration: "3 hours" },
        { name: "Toner", price: "$45", duration: "30 min" },
      ]
    },
    {
      category: "Treatments",
      items: [
        { name: "Deep Conditioning Treatment", price: "$45", duration: "30 min" },
        { name: "Keratin Treatment", price: "From $250", duration: "3-4 hours" },
        { name: "Scalp Treatment", price: "$65", duration: "45 min" },
        { name: "Olaplex Treatment", price: "$55", duration: "30 min" },
      ]
    },
    {
      category: "Special Occasions",
      items: [
        { name: "Bridal Hair (trial)", price: "$150", duration: "2 hours" },
        { name: "Bridal Hair (wedding day)", price: "$180", duration: "2 hours" },
        { name: "Special Event Styling", price: "$95", duration: "90 min" },
        { name: "Hair Extensions Consultation", price: "Free", duration: "30 min" },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader 
            title="Salon Services" 
            subtitle="Expert styling, colouring, and treatments tailored to you"
          />
          <div className="max-w-4xl mx-auto">
            {services.map((serviceGroup, index) => (
              <div key={index} className="mb-12 last:mb-0">
                <h2 className="text-h2 font-heading text-heading mb-6 pb-3 border-b border-border">
                  {serviceGroup.category}
                </h2>
                <div className="space-y-4">
                  {serviceGroup.items.map((item, itemIndex) => (
                    <ServiceRow 
                      key={itemIndex}
                      title={item.name}
                      price={item.price}
                      description={item.duration}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-12 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground mb-6">
                All services include a complimentary consultation. Prices may vary based on hair length and condition.
              </p>
              <Link to="/booking">
                <Button variant="primary" size="xl">
                  <Calendar className="w-5 h-5" />
                  Book Your Appointment
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
