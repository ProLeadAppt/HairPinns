import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Terms of Service | Hair Pinns"
        description="Hair Pinns terms of service for salon services and online purchases."
        canonical="https://hairpinns.com/terms"
        hrefLang="en-AU"
        ogImage="https://hairpinns.com/og-default.jpg"
      />

      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader as="h1" title="Terms of Service" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

            <p className="text-foreground leading-relaxed mb-6">
              By accessing and using Hair Pinns' services and website, you agree to be bound 
              by these Terms of Service.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Appointments</h2>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Appointments must be cancelled at least 24 hours in advance</li>
              <li>• Late cancellations may incur a fee</li>
              <li>• We reserve the right to refuse service</li>
              <li>• Appointment times are approximate and may vary</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Salon Services</h2>
            <p className="text-foreground leading-relaxed mb-4">
              All services are performed by licensed professionals. Results may vary based on:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Individual hair type and condition</li>
              <li>• Previous treatments or chemical services</li>
              <li>• Home care and maintenance</li>
              <li>• Natural hair growth patterns</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Online Purchases</h2>
            <p className="text-foreground leading-relaxed mb-4">
              When purchasing products through our website:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• All prices are in Australian Dollars (AUD)</li>
              <li>• We reserve the right to modify prices without notice</li>
              <li>• Product availability is subject to stock</li>
              <li>• You must be 18 or older to make purchases</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Intellectual Property</h2>
            <p className="text-foreground leading-relaxed mb-6">
              All content on this website, including text, graphics, logos, and images, is 
              the property of Hair Pinns and protected by copyright laws.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-foreground leading-relaxed mb-6">
              Hair Pinns shall not be liable for any indirect, incidental, or consequential 
              damages arising from the use of our services or products.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Changes to Terms</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We reserve the right to modify these terms at any time. Continued use of our 
              services constitutes acceptance of updated terms.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Contact</h2>
            <p className="text-foreground leading-relaxed">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:hairpinns1@gmail.com" className="text-brand-500 hover:text-brand-600">
                hairpinns1@gmail.com
              </a>
              .
            </p>
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
