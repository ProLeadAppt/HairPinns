import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Section from "@/components/design-system/Section";
import SectionHeader from "@/components/design-system/SectionHeader";
import { FEATURED_BRANDS } from "@/config/commerceNavigation";
import { getCollectionArtwork } from "@/lib/collectionArtwork";
import { shopifyImage, shopifyImageWebp } from "@/lib/shopifyImage";

const buildShopifySrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImage(url, width)} ${width}w`).join(", ");

const buildShopifyWebpSrcSet = (url: string, widths: number[]) =>
  widths.map((width) => `${shopifyImageWebp(url, width)} ${width}w`).join(", ");

const ProductCategories = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        const artwork = await getCollectionArtwork(FEATURED_BRANDS.map(brand => brand.handle));
        const filtered = FEATURED_BRANDS.map(brand => ({
          id: brand.handle, handle: brand.handle, title: brand.name,
          description: brand.description, image: artwork[brand.handle]?.url || '/placeholder.svg',
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
          title="Shop by Brand"
          subtitle="Loading..."
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
        title="Shop by Brand"
        subtitle="I stock these because they actually work"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ containIntrinsicSize: "0 2000px" }}>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="group bg-card border border-border rounded-card overflow-hidden hover:shadow-lg transition-all duration-base"
          >
            <div className="aspect-[4/3] bg-muted relative overflow-hidden">
              <picture className="block w-full h-full">
                <source
                  type="image/webp"
                  srcSet={buildShopifyWebpSrcSet(collection.image, [480, 800, 1200])}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <source
                  srcSet={buildShopifySrcSet(collection.image, [480, 800, 1200])}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {collection.title}
                </h3>

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
