import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuickAnswerProps {
  question: string;
  answer: string;
}

const QuickAnswer = ({ question, answer }: QuickAnswerProps) => {
  return (
    <div className="bg-brand-500/10 border-l-4 border-brand-500 rounded-r-lg p-6 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
          <Lightbulb className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <Badge variant="secondary" className="mb-3">
            Quick Answer
          </Badge>
          <h3 className="text-xl font-heading font-semibold text-heading mb-3">
            {question}
          </h3>
          <p className="text-text leading-relaxed text-lg">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickAnswer;
