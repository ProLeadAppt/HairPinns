import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "./Badge";

interface PriceFeature {
  name: string;
  included: boolean;
  note?: string;
}

interface PriceRowProps {
  title: string;
  price: string | number;
  period?: string;
  description?: string;
  features: PriceFeature[];
  badge?: string;
  highlighted?: boolean;
  onSelect?: () => void;
  buttonText?: string;
  className?: string;
}

const PriceRow = ({
  title,
  price,
  period = "month",
  description,
  features,
  badge,
  highlighted = false,
  onSelect,
  buttonText = "Choose Plan",
  className
}: PriceRowProps) => {
  return (
    <div className={cn(
      "relative p-6 bg-card border border-border rounded-lg transition-[border-color,box-shadow,transform] duration-base",
      highlighted && "border-brand-500 shadow-lg scale-105",
      className
    )}>
      {badge && (
        <div className="absolute -top-3 left-6">
          <Badge variant="accent" size="sm">
            {badge}
          </Badge>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm mb-4">
            {description}
          </p>
        )}
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">
            {typeof price === 'string' ? price : `$${price}`}
          </span>
          {period && typeof price === 'number' && (
            <span className="text-muted-foreground">/{period}</span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={cn(
              "mt-0.5 rounded-full p-0.5",
              feature.included 
                ? "text-[hsl(var(--success-fg))] bg-[hsl(var(--success-bg))]" 
                : "text-muted-foreground bg-muted"
            )}>
              {feature.included ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
            </div>
            <div className="flex-1">
              <span className={cn(
                "text-sm",
                feature.included ? "text-foreground" : "text-muted-foreground"
              )}>
                {feature.name}
              </span>
              {feature.note && (
                <p className="text-xs text-muted-foreground mt-1">
                  {feature.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {onSelect && (
        <button
          onClick={onSelect}
          className={cn(
            "w-full py-3 px-4 rounded-md font-medium transition-[background-color,color,border-color,box-shadow] duration-base",
            highlighted
              ? "bg-brand-500 text-primary-foreground hover:bg-brand-500/92 shadow-sm hover:shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          )}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PriceRow;