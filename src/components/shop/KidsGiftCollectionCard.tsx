import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { DIY_KIDS_GIFTS } from "@/config/commerceNavigation";
import type { CollectionArtwork } from "@/lib/collectionArtwork";
import { shopifyImageWebp } from "@/lib/shopifyImage";

/** A collection destination, not a fixed-price or pre-made Shopify product. */
export default function KidsGiftCollectionCard({ artwork }: { artwork?: CollectionArtwork }) {
  return (
    <article className="group flex min-w-0 flex-col border-t border-[hsl(var(--hp-purple)/0.22)] pt-3">
      <Link
        to={`${DIY_KIDS_GIFTS.href}/`}
        aria-labelledby="kids-gift-link-heading"
        className="flex h-full flex-col text-[hsl(var(--hp-ink))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--hp-purple))] focus-visible:ring-offset-4"
      >
        <div className="relative aspect-square overflow-hidden bg-[hsl(var(--hp-lavender))]">
          {artwork?.url ? (
            <img
              src={shopifyImageWebp(artwork.url, 640)}
              srcSet={[320, 480, 640, 960].map((width) => `${shopifyImageWebp(artwork.url, width)} ${width}w`).join(", ")}
              alt=""
              aria-hidden="true"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 639px) calc((100vw - 48px) / 2), (max-width: 1023px) calc((100vw - 80px) / 2), (max-width: 1279px) calc((100vw - 128px) / 3), 384px"
              className="h-full w-full object-contain transition-opacity duration-slow group-hover:opacity-90"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-4 pt-8 text-center text-[hsl(var(--hp-purple))]">
              <Gift className="h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.25} aria-hidden="true" />
              <span className="max-w-[10ch] font-heading text-lg leading-tight sm:text-2xl">Make it theirs.</span>
            </div>
          )}
          <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--hp-purple))] sm:left-3 sm:top-3 sm:text-[0.65rem]">
            Build your own
          </span>
        </div>
        <div className="flex flex-1 flex-col pt-4">
          <h3 id="kids-gift-link-heading" className="mb-2 font-heading text-base leading-tight transition-colors group-hover:text-[hsl(var(--hp-purple))] sm:text-lg">
            {DIY_KIDS_GIFTS.name}
          </h3>
          <p className="mb-3 text-xs leading-5 text-[hsl(var(--hp-ink)/0.8)] sm:text-sm">
            Pick their favourites. Jena packs your selected items together as one gift.
          </p>
          <div className="mt-auto border-t border-[hsl(var(--hp-purple)/0.14)] pt-3">
            <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[hsl(var(--hp-purple))] px-2 text-center text-xs font-semibold text-white sm:text-sm">
              Choose the items
              <ArrowRight className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
