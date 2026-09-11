import { fetchShopify } from './shopify';
import { isRetiredProductHandle } from '@/config/retiredProducts';

export interface CollectionArtwork { url: string; altText?: string | null }
interface ArtworkCollection {
  handle: string;
  image?: CollectionArtwork | null;
  products?: { edges: Array<{ node: { handle: string; images?: { edges: Array<{ node: CollectionArtwork }> } } }> };
}

/** Small, explicit collection reads: no collection-wall pagination or unrelated imagery. */
export async function getCollectionArtwork(handles: string[]): Promise<Record<string, CollectionArtwork>> {
  const uniqueHandles = [...new Set(handles)];
  if (!uniqueHandles.length) return {};
  const variables = Object.fromEntries(uniqueHandles.map((handle, index) => [`handle${index}`, handle]));
  const declarations = uniqueHandles.map((_, index) => `$handle${index}: String!`).join(', ');
  const fields = uniqueHandles.map((_, index) => `card${index}: collection(handle: $handle${index}) {
    handle image { url altText }
    products(first: 4) { edges { node { handle images(first: 1) { edges { node { url altText } } } } } }
  }`).join('\n');
  const data = await fetchShopify<Record<string, ArtworkCollection | null>>(`query collectionArtwork(${declarations}) { ${fields} }`, variables, { timeoutMs: 8000 });
  const images: Record<string, CollectionArtwork> = {};
  for (const collection of Object.values(data)) {
    if (!collection?.handle || !uniqueHandles.includes(collection.handle)) continue;
    const artwork = collection.image?.url ? collection.image : collection.products?.edges
      .filter(({ node }) => !isRetiredProductHandle(node.handle))
      .map(({ node }) => node.images?.edges[0]?.node).find(image => image?.url);
    if (artwork?.url) images[collection.handle] = artwork;
  }
  return images;
}
