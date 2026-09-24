import "server-only";

import { getPrivateTokenStoreConfig } from "@/lib/server/affiliate-env";

type StoredTokens = {
  provider: "mercadolivre";
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

function config() {
  const value = getPrivateTokenStoreConfig();
  if (!value) throw new Error("Token store is not configured");
  return value;
}

function headers(secretKey: string, extra?: HeadersInit): Headers {
  const result = new Headers(extra);
  result.set("apikey", secretKey);
  result.set("Content-Type", "application/json");
  return result;
}

export async function saveMercadoLivreTokens(tokens: StoredTokens): Promise<void> {
  const store = config();
  const response = await fetch(`${store.url}/rest/v1/affiliate_oauth_tokens`, {
    method: "POST",
    headers: headers(store.secretKey, {
      Prefer: "resolution=merge-duplicates,return=minimal",
    }),
    body: JSON.stringify(tokens),
    cache: "no-store",
  });
  if (!response.ok) {
    const responseText = await response.text();
    let databaseError: { code?: string; message?: string } = {};
    try {
      const parsed = JSON.parse(responseText) as { code?: unknown; message?: unknown };
      databaseError = {
        code: typeof parsed.code === "string" ? parsed.code : undefined,
        message: typeof parsed.message === "string" ? parsed.message : undefined,
      };
    } catch {
      // Do not log an unstructured response body; keep only the HTTP status.
    }
    console.error("Supabase rejected Mercado Livre token storage", {
      status: response.status,
      ...databaseError,
    });
    throw new Error(`Supabase token storage failed (${response.status}${databaseError.code ? ` ${databaseError.code}` : ""})`);
  }
}

export async function getMercadoLivreTokens(): Promise<StoredTokens | undefined> {
  const store = config();
  const url = new URL(`${store.url}/rest/v1/affiliate_oauth_tokens`);
  url.searchParams.set("provider", "eq.mercadolivre");
  url.searchParams.set("select", "provider,access_token,refresh_token,expires_at");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: headers(store.secretKey),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Could not read Mercado Livre tokens");
  const rows = (await response.json()) as StoredTokens[];
  return rows[0];
}
