import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Product {
  name: string;
  link: string;
  description: string;
}

interface ProductModuleProps {
  title: string;
  products: Product[];
}

const ProductModule = ({ title, products }: ProductModuleProps) => {
  return (
    <div className="my-8 p-6 bg-accent/10 border border-accent/20 rounded-card">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-accent/20 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-h3 font-heading text-heading mb-3">{title}</h3>
          <div className="space-y-3 mb-4">
            {products.map((product, index) => (
              <Link 
                key={index} 
                to={product.link}
                className="group block p-3 bg-background rounded-lg hover:shadow-md transition-all border border-border hover:border-accent"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-heading group-hover:text-brand-500 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.description}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModule;
