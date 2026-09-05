import {
  CHRISTMAS_PRODUCTS as CHRISTMAS_PRODUCTS_DATA,
  FEATURED_BRANDS as FEATURED_BRANDS_DATA,
  HIDDEN_COLLECTION_HANDLES as HIDDEN_COLLECTION_HANDLES_DATA,
  isPublicCollectionHandle as isPublicCollectionHandleData,
  PUBLIC_COLLECTION_HANDLES as PUBLIC_COLLECTION_HANDLES_DATA,
  SECONDARY_BRANDS as SECONDARY_BRANDS_DATA,
  SHOP_BY_HAIR_NEED as SHOP_BY_HAIR_NEED_DATA,
  SHOP_BY_PRODUCT as SHOP_BY_PRODUCT_DATA,
  SHOP_TAXONOMY as SHOP_TAXONOMY_DATA,
} from "./commerceNavigation.data.js";

export interface CommerceDestination {
  name: string;
  shortName: string;
  handle: string;
  href: string;
  description: string;
  image: string;
}

export interface CommerceTaxonomyGroup {
  id: "hair-need" | "product" | "brand";
  label: string;
  heading: string;
  description: string;
  destinations: CommerceDestination[];
  secondaryDestinations?: CommerceDestination[];
}

export interface SeasonalProductDestination {
  name: string;
  handle: string;
  href: string;
}

export const SHOP_BY_HAIR_NEED = SHOP_BY_HAIR_NEED_DATA as CommerceDestination[];
// Backwards-compatible alias while existing imports move from "concern" to
// the clearer customer-facing term "hair need".
export const SHOP_BY_CONCERN = SHOP_BY_HAIR_NEED;
export const SHOP_BY_PRODUCT = SHOP_BY_PRODUCT_DATA as CommerceDestination[];
export const FEATURED_BRANDS = FEATURED_BRANDS_DATA as CommerceDestination[];
export const SECONDARY_BRANDS = SECONDARY_BRANDS_DATA as CommerceDestination[];
export const SHOP_TAXONOMY = SHOP_TAXONOMY_DATA as CommerceTaxonomyGroup[];
export const CHRISTMAS_PRODUCTS = CHRISTMAS_PRODUCTS_DATA as SeasonalProductDestination[];
export const HIDDEN_COLLECTION_HANDLES = HIDDEN_COLLECTION_HANDLES_DATA as string[];
export const PUBLIC_COLLECTION_HANDLES = PUBLIC_COLLECTION_HANDLES_DATA as string[];
export const isPublicCollectionHandle = isPublicCollectionHandleData as (handle?: string) => boolean;
