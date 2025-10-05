import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  align = "center",
  className 
}: SectionHeaderProps) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={cn(
      alignClasses[align],
      "mb-12",
      className
    )}>
      <h2 className="text-h2-lg font-heading text-heading mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
