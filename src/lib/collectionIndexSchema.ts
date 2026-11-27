import { canonicalSiteUrl } from "@/config/businessConfig";
import { SHOP_TAXONOMY } from "@/config/commerceNavigation";

/** Actual destinations in the three user-accessible shop browse tabs. */
export const collectionIndexSchema = () => {
  const distinctDestinations = Array.from(new Map(SHOP_TAXONOMY.flatMap(group => [
    ...group.destinations, ...(group.secondaryDestinations || []),
  ]).map(destination => [canonicalSiteUrl(destination.href), destination])).values());
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shop Hair Pinns hair care collections",
    numberOfItems: distinctDestinations.length,
    itemListElement: distinctDestinations.map((destination, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: destination.name,
      item: canonicalSiteUrl(destination.href),
    })),
  };
};
