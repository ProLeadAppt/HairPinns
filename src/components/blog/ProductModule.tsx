import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProductModuleProps {
  title: string;
  products: string[];
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
          <ul className="space-y-2 mb-4">
            {products.map((product, index) => (
              <li key={index} className="text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {product}
              </li>
            ))}
          </ul>
          <Link to="/collections">
            <Button variant="accent" size="sm">
              Shop Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductModule;
