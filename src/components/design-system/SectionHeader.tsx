import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional italic Playfair tagline that appears between eyebrow and title.
   *  The hero/brand uses this for "Hair care from someone who actually does hair." */
  tagline?: string;
  /** Small-caps gold label above the title. e.g. "01 — what we make" */
  eyebrow?: string;
  align?: "left" | "center" | "right";
  className?: string;
  /** Heading level. Use "h1" for the top-of-page hero on policy/contact pages. Defaults to "h2". */
  as?: "h1" | "h2";
  /** Use the big editorial Playfair display size for h1/h2 instead of the
   *  default Playfair scale. Default false. */
  display?: boolean;
}

const SectionHeader = ({
  title,
  subtitle,
  tagline,
  eyebrow,
  align = "center",
  className,
  as = "h2",
  display = false,
}: SectionHeaderProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const HeadingTag = as;

  return (
    <div className={cn(
      alignClasses[align],
      "mb-12",
      className
    )}>
      {eyebrow && (
        <span className="eyebrow eyebrow-muted">{eyebrow}</span>
      )}
      <HeadingTag
        className={cn(
          display ? "h-display" : "text-h2-lg",
          "font-heading text-heading mb-4"
        )}
      >
        {title}
      </HeadingTag>
      {tagline && (
        <p className="tagline max-w-2xl mx-auto mb-4">{tagline}</p>
      )}
      {subtitle && (
        <p className={cn(
          "text-lg text-muted-foreground",
          align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
