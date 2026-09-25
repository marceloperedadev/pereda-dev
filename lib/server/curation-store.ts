import "server-only";

import { getPrivateTokenStoreConfig } from "@/lib/server/affiliate-env";
import type { CatalogListing } from "@/lib/server/catalog-provider";

export type CurationStatus = "discovered" | "review" | "approved" | "published" | "expired";

export type CuratedProductRow = {
  id: string;
  provider: string;
  source_product_id: string;
  slug: string | null;
  editorial_title: string | null;
  suitable_for: string | null;
  recommendation_reason: string | null;
  limitations: string | null;
  contexts: string[];
  affiliate_url: string | null;
  source_title: string | null;
  source_url: string | null;
  source_image_url: string | null;
  source_category_id: string | null;
  source_condition: string | null;
  source_seller_id: string | null;
  source_status: string;
  price: number | null;
  currency: string | null;
  curation_status: CurationStatus;
  first_seen_at: string;
  last_checked_at: string | null;
  updated_at: string;
  setup_price_history?: { price: number; previous_price: number | null; currency: string; checked_at: string }[];
};

function endpoint(path: string) {
  const config = getPrivateTokenStoreConfig();
  if (!config) throw new Error("Supabase is not configured for curated products");
  return { url: `${config.url}/rest/v1/${path}`, key: config.secretKey };
}

function headers(key: string, extra?: HeadersInit) {
  const result = new Headers(extra);
  result.set("apikey", key);
  result.set("Content-Type", "application/json");
  return result;
}

async function checkedFetch(path: string, init?: RequestInit) {
  const config = endpoint(path);
  const response = await fetch(config.url, { ...init, headers: headers(config.key, init?.headers), cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase curation request failed (${response.status})`);
  return response;
}

export async function saveDiscoveredListing(listing: CatalogListing, contexts: string[] = []) {
  await checkedFetch("rpc/sync_curated_product", {
    method: "POST",
    body: JSON.stringify({ p_listing: listing, p_contexts: contexts }),
  });
}

export async function expireDiscoveredListing(provider: string, id: string) {
  await checkedFetch("rpc/expire_curated_product", {
    method: "POST",
    body: JSON.stringify({ p_provider: provider, p_source_product_id: id }),
  });
}

export async function listCurationRows(status?: CurationStatus, limit = 100): Promise<CuratedProductRow[]> {
  const config = endpoint("curated_products");
  const url = new URL(config.url);
  url.searchParams.set("select", "*");
  if (status) url.searchParams.set("curation_status", `eq.${status}`);
  url.searchParams.set("order", "updated_at.desc");
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 100)));
  const response = await fetch(url, { headers: headers(config.key), cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase curation request failed (${response.status})`);
  return response.json() as Promise<CuratedProductRow[]>;
}

export async function getCurationRow(id: string): Promise<CuratedProductRow | undefined> {
  const config = endpoint("curated_products");
  const url = new URL(config.url);
  url.searchParams.set("select", "*");
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");
  const response = await fetch(url, { headers: headers(config.key), cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase curation request failed (${response.status})`);
  const rows = await response.json() as CuratedProductRow[];
  return rows[0];
}

export async function updateCurationRow(id: string, patch: Partial<CuratedProductRow>): Promise<CuratedProductRow> {
  const config = endpoint("curated_products");
  const url = new URL(config.url);
  url.searchParams.set("id", `eq.${id}`);
  const response = await fetch(url, {
    method: "PATCH",
    headers: headers(config.key, { Prefer: "return=representation" }),
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Supabase curation update failed (${response.status})`);
  const rows = await response.json() as CuratedProductRow[];
  if (!rows[0]) throw new Error("Curated product was not found");
  return rows[0];
}

export async function getPublishedCuration(context?: string): Promise<CuratedProductRow[]> {
  const config = endpoint("curated_products");
  const url = new URL(config.url);
  url.searchParams.set("select", "*,setup_price_history(price,previous_price,currency,checked_at)");
  url.searchParams.set("curation_status", "eq.published");
  url.searchParams.set("source_status", "eq.active");
  url.searchParams.set("last_checked_at", `gte.${new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()}`);
  if (context) url.searchParams.set("contexts", `cs.{${context}}`);
  url.searchParams.set("setup_price_history.order", "checked_at.desc");
  url.searchParams.set("setup_price_history.limit", "2");
  url.searchParams.set("order", "updated_at.desc");
  url.searchParams.set("limit", "40");
  const response = await fetch(url, {
    headers: headers(config.key),
    next: { revalidate: 900 },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Supabase public curation request failed (${response.status})`);
  const rows = await response.json() as CuratedProductRow[];
  return rows.filter((row) => row.slug && row.editorial_title && row.suitable_for && row.recommendation_reason && row.limitations && row.price !== null && row.currency === "BRL" && row.source_url);
}

export async function getDueCurationRows(limit = 50): Promise<CuratedProductRow[]> {
  const config = endpoint("curated_products");
  const url = new URL(config.url);
  url.searchParams.set("select", "id,provider,source_product_id,curation_status");
  url.searchParams.set("curation_status", "in.(discovered,review,approved,published)");
  url.searchParams.set("provider", "eq.mercadolivre");
  url.searchParams.set("order", "last_checked_at.asc.nullsfirst");
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 50)));
  const response = await fetch(url, { headers: headers(config.key), cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Supabase scheduled curation query failed (${response.status})`);
  return response.json() as Promise<CuratedProductRow[]>;
}
