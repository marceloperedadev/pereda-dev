import "server-only";

import { getPrivateTokenStoreConfig } from "@/lib/server/affiliate-env";

type StoredTokens = {
  provider: "mercadolivre";
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

const REFRESH_LOCK_SECONDS = 35;

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
    body: JSON.stringify({ ...tokens, refresh_lock_id: null, refresh_lock_expires_at: null }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    const responseText = await response.text();
    let databaseError: { code?: string } = {};
    try {
      const parsed = JSON.parse(responseText) as { code?: unknown; message?: unknown };
      databaseError = {
        code: typeof parsed.code === "string" ? parsed.code : undefined,
      };
    } catch {
      // Do not log an unstructured response body; keep only the HTTP status.
    }
    console.error("Supabase rejected Mercado Livre token storage", { status: response.status, ...databaseError });
    throw new Error(`Supabase token storage failed (${response.status}${databaseError.code ? ` ${databaseError.code}` : ""})`);
  }
}

async function callRefreshRpc(name: string, body: Record<string, unknown>): Promise<Response> {
  const store = config();
  const response = await fetch(`${store.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: headers(store.secretKey),
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Token refresh coordination failed (${response.status})`);
  return response;
}

/** Claims a database-backed lease so only one serverless instance rotates a refresh token. */
export async function claimMercadoLivreTokenRefresh(lockId: string): Promise<boolean> {
  const response = await callRefreshRpc("claim_mercadolivre_token_refresh", {
    p_lock_id: lockId,
    p_lease_seconds: REFRESH_LOCK_SECONDS,
  });
  return await response.json() as boolean;
}

/** Persist the rotated pair and release its lease in the same database transaction. */
export async function completeMercadoLivreTokenRefresh(lockId: string, tokens: StoredTokens): Promise<boolean> {
  const response = await callRefreshRpc("complete_mercadolivre_token_refresh", {
    p_lock_id: lockId,
    p_access_token: tokens.access_token,
    p_refresh_token: tokens.refresh_token,
    p_expires_at: tokens.expires_at,
  });
  return await response.json() as boolean;
}

export async function releaseMercadoLivreTokenRefresh(lockId: string): Promise<void> {
  await callRefreshRpc("release_mercadolivre_token_refresh", { p_lock_id: lockId });
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
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error("Could not read Mercado Livre tokens");
  const rows = (await response.json()) as StoredTokens[];
  return rows[0];
}
