import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  itemCount?: number;
  href?: string;
  onClick?: () => void;
}

interface CollectionGridProps {
  collections: CollectionItem[];
  columns?: 2 | 3 | 4;
  showItemCount?: boolean;
  aspectRatio?: "square" | "portrait" | "landscape";
  className?: string;
}

const CollectionGrid = ({
  collections,
  columns = 3,
  showItemCount = true,
  aspectRatio = "square",
  className
}: CollectionGridProps) => {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  const aspectRatios = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridCols[columns],
      className
    )}>
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="group relative overflow-hidden rounded-lg bg-muted hover:shadow-lg transition-all duration-base"
        >
          {/* Image */}
          <div className={cn(
            "relative overflow-hidden bg-muted",
            aspectRatios[aspectRatio]
          )}>
            <img
              src={collection.image}
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
            />
            <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors duration-base" />
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-primary-foreground">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {collection.name}
              </h3>
              
              {collection.description && (
                <p className="text-sm text-primary-foreground/90 line-clamp-2">
                  {collection.description}
                </p>
              )}
              
              {showItemCount && collection.itemCount !== undefined && (
                <p className="text-sm text-primary-foreground/80">
                  {collection.itemCount} items
                </p>
              )}
              
              <div className="pt-2">
                {collection.href ? (
                  <a href={collection.href}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-background/20 backdrop-blur-sm text-primary-foreground border-primary-foreground/30 hover:bg-background/30"
                    >
                      View Collection
                    </Button>
                  </a>
                ) : collection.onClick ? (
                  <Button 
                    onClick={collection.onClick}
                    variant="secondary" 
                    size="sm"
                    className="bg-background/20 backdrop-blur-sm text-primary-foreground border-primary-foreground/30 hover:bg-background/30"
                  >
                    View Collection
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionGrid;