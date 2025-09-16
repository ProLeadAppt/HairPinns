import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "accent";
  padding?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const Section = ({ 
  children, 
  className,
  variant = "default",
  padding = "lg",
  maxWidth = "xl"
}: SectionProps) => {
  const variants = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-accent/10",
  };

  const paddings = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  const maxWidths = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-5xl",
    xl: "max-w-7xl",
    "2xl": "max-w-8xl",
    full: "max-w-full",
  };

  return (
    <section className={cn(
      variants[variant],
      paddings[padding],
      className
    )}>
      <div className={cn(
        maxWidths[maxWidth],
        "mx-auto px-4 sm:px-6 lg:px-8"
      )}>
        {children}
      </div>
    </section>
  );
};

export default Section;