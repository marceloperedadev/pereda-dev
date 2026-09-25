import "server-only";

import { getMercadoLivreAccessToken } from "@/lib/server/mercadolivre-access-token";
import type { CatalogListing, CatalogProvider } from "@/lib/server/catalog-provider";

const API = "https://api.mercadolibre.com";
const ITEM_ID = /^MLB\d{5,20}$/;

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, max = 500): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim().slice(0, max)
    : null;
}

function safeSourceUrl(value: unknown): string | null {
  const raw = text(value, 2048);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password || url.port) return null;
    if (!/(^|\.)mercadolivre\.com\.br$/i.test(url.hostname)) return null;
    url.protocol = "https:";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function safeImageUrl(value: unknown): string | null {
  const raw = text(value, 2048);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !/(^|\.)mlstatic\.com$/i.test(url.hostname)) return null;
    if (url.username || url.password || url.port) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeMercadoLivreListing(input: unknown): CatalogListing {
  const item = record(input);
  const id = text(item.id, 32) ?? "";
  if (!ITEM_ID.test(id)) throw new Error("Mercado Livre returned an invalid item id");
  const price = typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0
    ? item.price
    : null;
  const seller = record(item.seller);
  const attributes = Array.isArray(item.attributes) ? item.attributes : [];
  const conditionAttribute = attributes
    .map(record)
    .find((attribute) => attribute.id === "ITEM_CONDITION");
  return {
    provider: "mercadolivre",
    sourceProductId: id,
    title: text(item.title, 300) ?? "Produto sem título",
    price,
    currency: item.currency_id === "BRL" ? "BRL" : null,
    sourceUrl: safeSourceUrl(item.permalink),
    imageUrl: safeImageUrl(item.secure_thumbnail ?? item.thumbnail),
    categoryId: text(item.category_id, 40),
    condition: text(item.condition, 32) ?? text(conditionAttribute?.value_name, 32),
    sellerId: text(item.seller_id ?? seller.id, 32),
    listingStatus: text(item.status, 32) ?? "unknown",
    checkedAt: new Date().toISOString(),
  };
}

async function apiGet(url: URL): Promise<unknown> {
  const token = await getMercadoLivreAccessToken();
  const response = await fetch(url, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    const error = new Error(`Mercado Livre API returned ${response.status}`);
    Object.assign(error, { status: response.status });
    throw error;
  }
  return response.json() as Promise<unknown>;
}

export const mercadoLivreCatalog: CatalogProvider = {
  async search(query, limit) {
    const url = new URL(`${API}/sites/MLB/search`);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));
    const payload = record(await apiGet(url));
    if (!Array.isArray(payload.results)) return [];
    return payload.results.slice(0, limit).map(normalizeMercadoLivreListing);
  },

  async getListing(id) {
    if (!ITEM_ID.test(id)) throw new Error("Invalid Mercado Livre item id");
    const url = new URL(`${API}/items/${encodeURIComponent(id)}`);
    return normalizeMercadoLivreListing(await apiGet(url));
  },
};
