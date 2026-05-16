import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Privacy Policy | Hair Pinns"
        description="Hair Pinns privacy policy. How we collect, use and protect your personal information."
        canonical="https://hairpinns.com/privacy"
        hrefLang="en-AU"
        ogImage="https://hairpinns.com/og-default.jpg"
      />

      <Header />
      
      <main className="flex-grow">
        <Section className="pt-xl">
          <SectionHeader as="h1" title="Privacy Policy" />
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

            <p className="text-foreground leading-relaxed mb-6">
              At Hair Pinns, we are committed to protecting your privacy and ensuring the 
              security of your personal information.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Information We Collect</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Name and contact information</li>
              <li>• Appointment booking details</li>
              <li>• Purchase history</li>
              <li>• Payment information (processed securely through third-party providers)</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Process your appointments and orders</li>
              <li>• Send appointment reminders and confirmations</li>
              <li>• Communicate about our services and products</li>
              <li>• Improve our website and services</li>
              <li>• Comply with legal obligations</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Information Sharing</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We do not sell or rent your personal information to third parties. We may share 
              your information with service providers who assist us in operating our business, 
              such as payment processors and appointment scheduling platforms.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Data Security</h2>
            <p className="text-foreground leading-relaxed mb-6">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Your Rights</h2>
            <p className="text-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-foreground mb-6">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate information</li>
              <li>• Request deletion of your information</li>
              <li>• Opt-out of marketing communications</li>
            </ul>

            <h2 className="text-h2 font-heading text-heading mt-8 mb-4">Contact Us</h2>
            <p className="text-foreground leading-relaxed">
              For any privacy-related questions or requests, please contact us at{" "}
              <a href="mailto:privacy@hairpinns.com" className="text-brand-500 hover:text-brand-600">
                privacy@hairpinns.com
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

export default Privacy;
