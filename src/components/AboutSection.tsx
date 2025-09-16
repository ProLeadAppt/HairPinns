import { Award, Users, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Clock, value: "6 Days", label: "Open Weekly" },
  { icon: MapPin, value: "Bangor", label: "NSW Location" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Expert Care, Beautiful Results
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Located in the heart of Bangor NSW, Hair Pinns has been serving the 
              Sutherland Shire community with exceptional hair care and styling services. 
              Our team of experienced stylists combines technical expertise with creative 
              vision to deliver results that exceed expectations.
            </p>
            <p className="text-muted-foreground mb-8">
              We believe that great hair is an art form. From precision cuts to stunning 
              color transformations, we use only the finest professional products and 
              latest techniques to ensure your hair looks and feels its absolute best. 
              Our boutique salon atmosphere provides a relaxing, personalized experience 
              where every client receives individual attention.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent-color/10 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-6 h-6 text-accent-color" />
                </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Placeholder */}
          <div className="relative">
            <Card className="shadow-strong border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-hero flex items-center justify-center">
                  <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-accent-color/20 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-accent-color" />
                  </div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      Professional Excellence
                    </h3>
                    <p className="text-muted-foreground">
                      Certified stylists with continuous training in the latest techniques 
                      and trends to ensure exceptional results every visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;