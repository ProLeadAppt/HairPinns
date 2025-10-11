import { Lightbulb, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface TipCalloutProps {
  content: string | ReactNode;
  title?: string;
  icon?: "lightbulb" | "sparkles";
}

const TipCallout = ({ content, title = "Jena's Tip", icon = "lightbulb" }: TipCalloutProps) => {
  const Icon = icon === "sparkles" ? Sparkles : Lightbulb;
  
  return (
    <div className="my-8 bg-accent/10 border-l-4 border-brand-500 rounded-r-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-lg text-heading mb-2">
            {title}
          </h4>
          <div className="text-text leading-relaxed">
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCallout;
