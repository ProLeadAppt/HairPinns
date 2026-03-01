import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";

interface PairsWellProduct {
  title: string;
  price: number;
  handle: string;
  image?: string;
}

interface PostPurchaseModuleProps {
  pairsWith?: PairsWellProduct[];
}

const PostPurchaseModule = ({ pairsWith = [] }: PostPurchaseModuleProps) => {
  const defaultPairs: PairsWellProduct[] = [
    { title: "Heat Defense Spray", price: 28.0, handle: "heat-defense" },
    { title: "Nourishing Hair Oil", price: 35.0, handle: "hair-oil" },
    { title: "Silk Pillowcase", price: 42.0, handle: "silk-pillowcase" },
  ];

  const products = pairsWith.length > 0 ? pairsWith : defaultPairs;

  return (
    <div className="space-y-8">
      {/* Education */}
      <div className="bg-accent/10 border border-accent/20 rounded-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-brand-500 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-h3 font-heading text-heading mb-2">
              Get the Most from Your Purchase
            </h2>
            <p className="text-foreground mb-4">
              We've created a complete guide to help you maximize your results.
              Learn the best application techniques, maintenance tips, and
              styling secrets from Jena.
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Care Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Pairs Well With */}
      <div>
        <h2 className="text-h3 font-heading text-heading mb-4">
          Pairs Well With
        </h2>
        <p className="text-foreground mb-6">
          Complete your routine with these complementary products
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Link
              key={index}
              to={`/products/${product.handle}`}
              className="bg-card border border-border rounded-card p-4 hover:shadow-lg transition-all duration-base group block"
            >
              {product.image && (
                <div className="aspect-square bg-muted rounded-card mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                </div>
              )}
              <h3 className="font-semibold text-heading mb-1 text-sm">
                {product.title}
              </h3>
              <p className="text-brand-500 font-bold mb-3">
                ${product.price.toFixed(2)}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Product
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPurchaseModule;
