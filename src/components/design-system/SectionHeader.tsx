import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  /** Heading level. Use "h1" for the top-of-page hero on policy/contact pages. Defaults to "h2". */
  as?: "h1" | "h2";
}

const SectionHeader = ({
  title,
  subtitle,
  align = "center",
  className,
  as = "h2",
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
      <HeadingTag className="text-h2-lg font-heading text-heading mb-4">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
