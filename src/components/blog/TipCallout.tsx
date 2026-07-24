import { Lightbulb, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface TipCalloutProps {
  content: string | ReactNode;
  title?: string;
  icon?: "lightbulb" | "sparkles";
}

const TipCallout = ({ content, title = "Jena’s note", icon = "lightbulb" }: TipCalloutProps) => {
  const Icon = icon === "sparkles" ? Sparkles : Lightbulb;
  return (
    <aside className="my-12 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-y border-[hsl(var(--after-hours-plum)/0.26)] py-7">
      <Icon className="mt-1 h-5 w-5 text-[hsl(var(--after-hours-copper))]" aria-hidden="true" />
      <div>
        <h3 className="after-hours-kicker text-[hsl(var(--after-hours-plum)/0.64)]">{title}</h3>
        <div className="mt-3 leading-7 text-[hsl(var(--after-hours-plum)/0.76)]">{typeof content === "string" ? <p>{content}</p> : content}</div>
      </div>
    </aside>
  );
};

export default TipCallout;
