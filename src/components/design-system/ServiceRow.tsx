import { cn } from "@/lib/utils";

interface ServiceRowProps {
  title: string;
  price: string;
  description?: string;
  className?: string;
}

const ServiceRow = ({
  title,
  price,
  description,
  className
}: ServiceRowProps) => {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 border-b border-border last:border-0",
      className
    )}>
      <div className="flex-1">
        <h3 className="font-medium text-foreground mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="ml-4 text-right">
        <p className="font-semibold text-brand-500">
          {price}
        </p>
      </div>
    </div>
  );
};

export default ServiceRow;
