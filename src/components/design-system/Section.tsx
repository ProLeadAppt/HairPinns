import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "accent" | "gold" | "transparent";
  /** Padding scale:
   *  - "sm" | "md" | "lg" | "xl" — old scale (8/12/16/20) for backwards-compat
   *  - "editorial" — uses the new 96px rhythm
   *  - "editorial-lg" — 128px rhythm (major beats)
   *  - "editorial-xl" — 160px rhythm (pull-quote, full-bleed)
   */
  padding?: "sm" | "md" | "lg" | "xl" | "editorial" | "editorial-lg" | "editorial-xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Optional section number for editorial dividers. e.g. { index: "01", label: "what we make" } */
  number?: { index: string; label: string };
  /** Optional gold hairline above the section. */
  hairline?: "gold" | "gold-left";
  style?: React.CSSProperties;
}

const Section = ({
  children,
  className,
  variant = "default",
  padding = "lg",
  maxWidth = "xl",
  number,
  hairline,
  style
}: SectionProps) => {
  const variants = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-accent/10",
    gold: "bg-gold-soft",
    transparent: "bg-transparent",
  };

  // Old scale — kept so existing call sites keep working unchanged.
  const paddings = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  // New editorial rhythm — far more generous. Mobile auto-dials back via CSS.
  const editorialPaddings = {
    editorial: "section-rhythm-md",
    "editorial-lg": "section-rhythm-lg",
    "editorial-xl": "section-rhythm-xl",
  };

  const isEditorial = padding in editorialPaddings;
  const paddingClass = isEditorial
    ? editorialPaddings[padding as keyof typeof editorialPaddings]
    : paddings[padding as keyof typeof paddings];

  const maxWidths = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
    "2xl": "max-w-8xl",
    full: "max-w-full",
  };

  const renderNumber = () => {
    if (!number) return null;
    return (
      <div className="section-number mb-10">
        <span className="section-number-label">
          <span className="section-number-index">{number.index}</span>
          <span>— {number.label}</span>
        </span>
      </div>
    );
  };

  const renderHairline = () => {
    if (!hairline) return null;
    return (
      <div className={cn(
        hairline === "gold" ? "hairline-gold" : "hairline-gold hairline-gold-left"
      )} />
    );
  };

  return (
    <section
      className={cn(
        variants[variant],
        paddingClass,
        className
      )}
      style={style}
    >
      {renderHairline()}
      <div className={cn(
        maxWidths[maxWidth],
        "mx-auto px-4 sm:px-6 lg:px-8"
      )}>
        {renderNumber()}
        {children}
      </div>
    </section>
  );
};

export default Section;
