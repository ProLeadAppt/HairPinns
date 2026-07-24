import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getHpCapture } from "@/lib/loadHpCapture";

interface FaqFeedbackWidgetProps {
  faqId?: string;
  question: string;
}

const FaqFeedbackWidget = ({ faqId, question }: FaqFeedbackWidgetProps) => {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (helpful: boolean) => {
    setIsSubmitting(true);
    try {
      const hpCapture = await getHpCapture();
      await hpCapture.trackEvent("faq_feedback", {
        faq_id: faqId || "unknown",
        faq_question: question,
        helpful,
      });
      setFeedback(helpful ? "yes" : "no");
    } catch (error) {
      console.error("Failed to submit FAQ feedback:", error);
      setFeedback(helpful ? "yes" : "no");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedback) {
    return (
      <div className="mt-4 flex items-center gap-2 border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-4 text-xs text-[hsl(var(--after-hours-plum)/0.58)]">
        <CheckCircle2 className="h-4 w-4 text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
        <span>Thank you for the feedback.</span>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--after-hours-plum)/0.16)] pt-4">
      <span className="text-xs text-[hsl(var(--after-hours-plum)/0.58)]">Was this useful?</span>
      <div className="flex gap-4">
        {[{ label: "Yes", value: true }, { label: "Not quite", value: false }].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleFeedback(option.value)}
            disabled={isSubmitting}
            className="min-h-11 border-b border-[hsl(var(--after-hours-plum)/0.32)] text-xs font-semibold uppercase tracking-[0.1em] text-[hsl(var(--after-hours-plum)/0.72)] hover:border-[hsl(var(--after-hours-copper))] hover:text-[hsl(var(--after-hours-plum))] disabled:opacity-50"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaqFeedbackWidget;
