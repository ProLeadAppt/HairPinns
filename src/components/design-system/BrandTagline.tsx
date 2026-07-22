import { cn } from "@/lib/utils";

/**
 * Italic Playfair tagline — the warm, human sentence that lives at the top
 * of the hero or above section titles. Renders as `<p>` by default but can
 * be promoted to a `<div>` via `as` for layout contexts.
 */
interface BrandTaglineProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  as?: "p" | "div" | "span";
}

const BrandTagline = ({
  children,
  className,
  align = "center",
  as: Tag = "p",
}: BrandTaglineProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <Tag
      className={cn(
        "tagline",
        alignClasses[align],
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default BrandTagline;
