import { CheckCircle2 } from "lucide-react";

interface KeyTakeawaysProps {
  items: string[];
  title?: string;
}

const KeyTakeaways = ({ items, title = "Key Takeaways" }: KeyTakeawaysProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-accent/30 border border-border rounded-lg p-6 my-8">
      <h3 className="text-2xl font-heading font-bold text-heading mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <span className="text-text leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyTakeaways;
