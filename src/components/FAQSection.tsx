import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";
import FaqFeedbackWidget from "./FaqFeedbackWidget";
import { FAQ } from "@/data/faqs";

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  showFeedback?: boolean;
  className?: string;
}

/**
 * FAQSection Component
 * 
 * Reusable FAQ display with accordion, internal links, and optional feedback
 * Generates FAQPage schema automatically
 * 
 * @example
 * <FAQSection 
 *   faqs={comprehensiveFAQs} 
 *   title="Frequently Asked Questions"
 *   showFeedback={true}
 * />
 */
export const FAQSection = ({
  faqs,
  title = "Frequently Asked Questions",
  subtitle,
  showFeedback = true,
  className = "",
}: FAQSectionProps) => {
  return (
    <section className={`py-16 bg-muted ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-lg font-heading font-bold text-heading mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-card border border-border rounded-card px-6"
            >
              <AccordionTrigger
                id={faq.id}
                className="text-left font-semibold text-heading hover:text-brand-500"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground leading-relaxed">
                <p className="mb-4">{faq.answer}</p>

                {/* Related Links */}
                {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border mt-4">
                    {faq.relatedLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.url}
                        className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-semibold transition-colors"
                      >
                        {link.text}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Feedback Widget */}
                {showFeedback && (
                  <div className="mt-4">
                    <FaqFeedbackWidget faqId={faq.id} question={faq.question} />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
