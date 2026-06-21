import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHpCapture } from "@/lib/loadHpCapture";

interface FaqFeedbackWidgetProps {
  faqId?: string;  // Optional FAQ ID for tracking
  question: string;
}

const FaqFeedbackWidget = ({ faqId, question }: FaqFeedbackWidgetProps) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (helpful: boolean) => {
    setIsSubmitting(true);
    
    try {
      // Track with hpCapture (sends to GHL inbound webhook)
      const hpCapture = await getHpCapture();
      await hpCapture.trackEvent('faq_feedback', {
        faq_id: faqId || 'unknown',
        faq_question: question,
        helpful: helpful,
      });
      
      setFeedback(helpful ? 'yes' : 'no');
    } catch (error) {
      console.error('Failed to submit FAQ feedback:', error);
      // Still show success to user even if tracking fails
      setFeedback(helpful ? 'yes' : 'no');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedback) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Did this help?</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            className="h-8 px-3 hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-500 hover:text-green-700 dark:hover:text-green-400"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="ml-1.5">Yes</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            className="h-8 px-3 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="ml-1.5">No</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaqFeedbackWidget;
