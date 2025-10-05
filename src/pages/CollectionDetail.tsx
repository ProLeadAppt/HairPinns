import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/design-system/ProductCard";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { ChevronRight } from "lucide-react";

const CollectionDetail = () => {
  const { slug } = useParams();
  
  // Sample products - replace with real data
  const products = [
    {
      name: "Hydrating Shampoo & Conditioner Set",
      price: 45.00,
      image: "/placeholder.svg",
      href: "/products/hydrating-set"
    },
    {
      name: "Premium Hair Treatment Oil",
      price: 32.00,
      image: "/placeholder.svg",
      href: "/products/treatment-oil"
    },
    {
      name: "Styling Cream Trio",
      price: 58.00,
      image: "/placeholder.svg",
      href: "/products/styling-trio"
    },
    {
      name: "Color Protection Bundle",
      price: 65.00,
      image: "/placeholder.svg",
      href: "/products/color-bundle"
    }
  ];

  const collectionName = slug?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Collection';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/collections" className="hover:text-foreground transition-colors">Collections</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-foreground">{collectionName}</span>
          </nav>
        </div>

        <Section className="pt-lg">
          <SectionHeader 
            title={collectionName}
            subtitle="Curated products for your hair care needs"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </Section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CollectionDetail;
