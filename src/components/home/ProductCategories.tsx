import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { getAllCollections } from "@/lib/shopify";

const ProductCategories = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCollections = async () => {
      try {
        const allCollections = await getAllCollections(20);
        
        // Filter for main product categories
        const mainCategories = [
          'juuce',
          'pure',
          'wet-brush',
          'qiqi',
          'aromaganic',
          'island-vibes',
        ];

        const filtered = allCollections
          .filter((c: any) => mainCategories.includes(c.handle?.toLowerCase()))
          .slice(0, 6)
          .map((c: any) => ({
            id: c.id,
            handle: c.handle,
            title: c.title,
            description: c.description,
            image: c.image?.url || "/placeholder.svg",
            productCount: c.products?.edges?.length || 0,
          }));

        if (!isMounted) return;
        setCollections(filtered);
      } catch (error) {
        console.error("❌ Failed to fetch collections:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCollections();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Section className="content-visibility-auto">
        <SectionHeader 
          title="Shop by Category"
          subtitle="Explore our curated collections"
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      </Section>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <Section className="content-visibility-auto">
      <SectionHeader 
        title="Shop by Category"
        subtitle="Explore our curated collections"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ containIntrinsicSize: "0 2000px" }}>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="group bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base"
          >
            <div className="aspect-[4/3] bg-muted relative overflow-hidden">
              <img 
                src={collection.image} 
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                loading="lazy"
                width="800"
                height="600"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {collection.title}
                </h3>
                {collection.productCount > 0 && (
                  <p className="text-sm text-white/80">
                    {collection.productCount} {collection.productCount === 1 ? 'product' : 'products'}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/collections">
          <button className="text-brand-500 font-semibold hover:text-brand-600 transition-colors text-lg">
            View All Collections →
          </button>
        </Link>
      </div>
    </Section>
  );
};

export default ProductCategories;

