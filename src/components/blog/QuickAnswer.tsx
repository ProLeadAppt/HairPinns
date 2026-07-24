import { Lightbulb } from "lucide-react";

interface QuickAnswerProps {
  question: string;
  answer: string;
}

const QuickAnswer = ({ question, answer }: QuickAnswerProps) => (
  <aside className="mb-12 border-y border-[hsl(var(--after-hours-plum)/0.28)] py-7" aria-labelledby="quick-answer-title">
    <div className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-4">
      <Lightbulb className="mt-1 h-5 w-5 text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
      <div>
        <p className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.6)]">Jena’s quick answer</p>
        <h2 id="quick-answer-title" className="mt-3 font-heading text-2xl font-normal leading-tight text-[hsl(var(--after-hours-plum))]">{question}</h2>
        <p className="mt-4 text-[1.05rem] leading-8 text-[hsl(var(--after-hours-plum)/0.76)]">{answer}</p>
      </div>
    </div>
  </aside>
);

export default QuickAnswer;
