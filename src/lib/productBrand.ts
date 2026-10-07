/** Use a real vendor, or an explicit brand prefix in the catalogue title.
 * A retailer vendor is not evidence that an item is manufactured by Hair Pinns.
 */
export function productBrand(product: { vendor?: string; title?: string }): string | undefined {
  const vendor = product.vendor?.trim();
  if (vendor && !/^hair\s+pinns(?:\b|$)/i.test(vendor)) return vendor;
  const prefix = product.title?.match(/^(Juuce|Wet Brush|Aromaganic|QIQI|Pure)(?=\s|$)/i)?.[1];
  return prefix ? ({ juuce: "Juuce", "wet brush": "Wet Brush", aromaganic: "Aromaganic", qiqi: "QIQI", pure: "Pure" }[prefix.toLowerCase()]) : undefined;
}

export function recommendationCollection(product: { vendor?: string; title?: string; collections?: { edges?: { node: { handle: string; title?: string } }[] } }): string | undefined {
  const collections = product.collections?.edges?.map(edge => edge.node) || [];
  const brand = productBrand(product)?.toLowerCase();
  const branded = brand && collections.find(collection =>
    collection.handle.toLowerCase() === brand.replace(/\s+/g, "-") ||
    collection.title?.toLowerCase().startsWith(`${brand} `));
  if (branded) return branded.handle;
  return collections.find(collection => !/(?:^|[-\s])(?:all|sale|gifts?|clearance|new|frontpage|featured)(?:$|[-\s])/i.test(collection.handle))?.handle;
}
