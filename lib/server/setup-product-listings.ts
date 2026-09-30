import "server-only";

import { getMercadoLivreListingId, type Product } from "@/lib/data/setup";
import { getMercadoLivreListings } from "@/lib/server/mercadolivre-catalog";
import type { CatalogListing } from "@/lib/server/catalog-provider";

export async function getSetupProductListings(products: readonly Product[]): Promise<Record<string, CatalogListing>> {
  const productsWithIds = products.flatMap((product) => {
    const listingId = getMercadoLivreListingId(product);
    return listingId ? [{ productId: product.id, listingId }] : [];
  });
  if (!productsWithIds.length) return {};

  try {
    const ids = productsWithIds.map(({ listingId }) => listingId);
    const listings = await getMercadoLivreListings(ids);
    const byListingId = new Map(listings.flatMap((listing) => (
      listing ? [[listing.sourceProductId, listing] as const] : []
    )));
    return Object.fromEntries(productsWithIds.flatMap(({ productId, listingId }) => {
      const listing = byListingId.get(listingId);
      return listing ? [[productId, listing]] : [];
    }));
  } catch {
    // The editorial catalogue remains usable if the remote listing data is unavailable.
    return {};
  }
}

export function getProductImageMap(listings: Record<string, CatalogListing>): Record<string, { src: string; alt: string; caption: string }> {
  return Object.fromEntries(Object.entries(listings).flatMap(([productId, listing]) => (
    listing.imageUrl ? [[productId, { src: listing.imageUrl, alt: `Imagem do anúncio: ${listing.title}`, caption: "Imagem do anúncio · Mercado Livre." }]] : []
  )));
}
