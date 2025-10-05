import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { Award, Heart, Users, Sparkles } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passionate Care",
      description: "Every client receives personalized attention and care"
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "Highly trained stylists with years of experience"
    },
    {
      icon: Sparkles,
      title: "Premium Products",
      description: "Only the finest professional-grade products"
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Proud to serve the Sutherland Shire for over 10 years"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-accent py-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-h1-lg font-heading text-heading mb-6">
              About Hair Pinns
            </h1>
            <p className="text-lg text-foreground leading-relaxed">
              Your boutique salon experience in the heart of Bangor, NSW. 
              We combine expert technique with genuine care to create beautiful, 
              confidence-building results for every client.
            </p>
          </div>
        </div>

        {/* Story */}
        <Section className="pt-xl">
          <SectionHeader title="Our Story" />
          <div className="max-w-3xl mx-auto">
            <p className="text-foreground leading-relaxed mb-6">
              Founded in 2014, Hair Pinns began with a simple vision: to create a welcoming, 
              boutique salon where every client feels valued and leaves feeling their best. 
              What started as a small team has grown into a trusted name in the Sutherland Shire, 
              known for exceptional service and stunning results.
            </p>
            <p className="text-foreground leading-relaxed mb-6">
              Our team of experienced stylists stays current with the latest techniques and trends, 
              attending regular training and education. But beyond technical skill, we pride ourselves 
              on truly listening to our clients and creating looks that enhance their natural beauty 
              and lifestyle.
            </p>
            <p className="text-foreground leading-relaxed">
              Located in beautiful Bangor NSW, we serve clients throughout the Sutherland Shire 
              and beyond. Whether you're looking for a fresh new style, expert color work, or 
              special occasion styling, we're here to make your hair dreams a reality.
            </p>
          </div>
        </Section>

        {/* Values */}
        <Section variant="accent">
          <SectionHeader title="What Sets Us Apart" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-heading mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Salon Photos */}
        <Section>
          <SectionHeader title="Our Salon" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video bg-muted rounded-card overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Hair Pinns salon interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-video bg-muted rounded-card overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Hair Pinns styling station"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
