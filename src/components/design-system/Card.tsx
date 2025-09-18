import { cn } from "@/lib/utils";
import { Card as UICard, CardContent, CardHeader } from "@/components/ui/card";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated";
  padding?: "sm" | "md" | "lg";
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card = ({ 
  children, 
  className,
  variant = "default",
  padding = "md",
  header,
  footer
}: CardProps) => {
  const variants = {
    default: "border-border rounded-card",
    bordered: "border-2 border-border rounded-card",
    elevated: "shadow-md hover:shadow-lg transition-shadow duration-base border-border rounded-card",
  };

  const paddings = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8",
  };

  return (
    <UICard className={cn(
      variants[variant],
      className
    )}>
      {header && (
        <CardHeader className="pb-4">
          {header}
        </CardHeader>
      )}
      <CardContent className={cn(
        paddings[padding],
        header && "pt-0",
        footer && "pb-4"
      )}>
        {children}
      </CardContent>
      {footer && (
        <CardContent className="pt-0 pb-6">
          {footer}
        </CardContent>
      )}
    </UICard>
  );
};

export default Card;