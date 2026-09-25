import "server-only";

/** Dados comuns normalizados; adaptadores de outras lojas podem implementar a mesma forma. */
export type CatalogListing = {
  provider: string;
  sourceProductId: string;
  title: string;
  price: number | null;
  currency: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  condition: string | null;
  sellerId: string | null;
  listingStatus: string;
  checkedAt: string;
};

export type CatalogProvider = {
  search(query: string, limit: number): Promise<CatalogListing[]>;
  getListing(id: string): Promise<CatalogListing>;
};
