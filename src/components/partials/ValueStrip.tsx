import { Award, Heart, ShoppingBag } from "lucide-react";

interface ValueStripProps {
  variant?: "default" | "compact";
  className?: string;
  showIcons?: boolean;
}

/**
 * ValueStrip Component
 * 
 * Displays 3-icon value proposition strip
 * Use below hero, above product grids, or as trust builder
 * 
 * @example
 * <ValueStrip variant="default" />
 * <ValueStrip variant="compact" showIcons={false} />
 */
export const ValueStrip = ({
  variant = "default",
  className = "",
  showIcons = true,
}: ValueStripProps) => {
  const values = [
    {
      icon: Award,
      text: "Real salon expertise",
    },
    {
      icon: Heart,
      text: "Care that lasts",
    },
    {
      icon: ShoppingBag,
      text: "Shop salon-grade at home",
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground ${className}`}>
        {values.map((value, index) => (
          <span key={index} className="flex items-center gap-2">
            {showIcons && <value.icon className="w-4 h-4 text-brand-500" />}
            {value.text}
            {index < values.length - 1 && <span className="mx-2 text-border">•</span>}
          </span>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-accent border-y border-border py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3"
              >
                {showIcons && (
                  <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                )}
                <p className="text-lg font-semibold text-heading">
                  {value.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ValueStrip;
