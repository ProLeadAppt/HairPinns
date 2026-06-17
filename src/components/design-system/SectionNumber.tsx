import { cn } from "@/lib/utils";

/**
 * SectionNumber — the hairline + small-caps editorial divider that breaks
 * the homepage into a magazine-style sequence: "01 — what we make".
 *
 * Use between sections (NOT inside) to give the page a sense of rhythm.
 *
 *   <SectionNumber index="01" label="what we make" />
 */
interface SectionNumberProps {
  index: string;
  label: string;
  className?: string;
}

const SectionNumber = ({ index, label, className }: SectionNumberProps) => {
  return (
    <div className={cn("section-number", className)}>
      <span className="section-number-label">
        <span className="section-number-index">{index}</span>
        <span>— {label}</span>
      </span>
    </div>
  );
};

export default SectionNumber;
