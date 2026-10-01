import "server-only";

import { randomUUID } from "node:crypto";

import { getMercadoLivreOAuthConfig } from "@/lib/server/affiliate-env";
import {
  claimMercadoLivreTokenRefresh,
  completeMercadoLivreTokenRefresh,
  getMercadoLivreTokens,
  releaseMercadoLivreTokenRefresh,
} from "@/lib/server/mercadolivre-token-store";

const TOKEN_SKEW_MS = 60_000;
// Public serverless renders can have short execution budgets; wait briefly for
// the winner and let a later request retry if the upstream refresh is slow.
const REFRESH_WAIT_MS = 8_000;

function isUsable(accessToken: string | undefined, expiresAt: string | undefined) {
  return Boolean(accessToken && expiresAt && Date.parse(expiresAt) > Date.now() + TOKEN_SKEW_MS);
}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getMercadoLivreAccessToken(): Promise<string> {
  const config = getMercadoLivreOAuthConfig();
  if (!config) throw new Error("Mercado Livre OAuth is not configured");

  const saved = await getMercadoLivreTokens();
  if (!saved?.access_token || !saved.refresh_token || !saved.expires_at) {
    throw new Error("Mercado Livre account is not connected");
  }
  if (isUsable(saved.access_token, saved.expires_at)) return saved.access_token;

  const lockId = randomUUID();
  const deadline = Date.now() + REFRESH_WAIT_MS;
  let ownsLock = await claimMercadoLivreTokenRefresh(lockId);
  let nextClaimAt = Date.now() + 1_500;
  let pollDelay = 400;

  // Another instance may be rotating the single-use refresh token. Wait for its
  // atomic write, and periodically retry the lease in case its invocation died.
  while (!ownsLock && Date.now() < deadline) {
    await pause(pollDelay);
    pollDelay = Math.min(1_500, Math.round(pollDelay * 1.5));
    const latest = await getMercadoLivreTokens();
    if (isUsable(latest?.access_token, latest?.expires_at)) return latest!.access_token;
    if (Date.now() >= nextClaimAt) {
      ownsLock = await claimMercadoLivreTokenRefresh(lockId);
      nextClaimAt = Date.now() + 1_500;
    }
  }
  if (!ownsLock) throw new Error("Mercado Livre token refresh is busy; retry the request");

  let leaseCommitted = false;
  try {
    // Re-read only after acquiring the lease; another instance may have just
    // completed a rotation between our first read and lease acquisition.
    const current = await getMercadoLivreTokens();
    if (!current) throw new Error("Mercado Livre account is not connected");
    if (isUsable(current.access_token, current.expires_at)) return current.access_token;

    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: current.refresh_token,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error("Mercado Livre token refresh failed");

    const token = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };
    if (!token.access_token || !token.refresh_token || !Number.isFinite(token.expires_in) || token.expires_in! <= 0) {
      throw new Error("Mercado Livre returned incomplete refreshed tokens");
    }

    const rotated = {
      provider: "mercadolivre" as const,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
    };
    let committed = false;
    for (let attempt = 0; attempt < 2 && !committed; attempt += 1) {
      try {
        committed = await completeMercadoLivreTokenRefresh(lockId, rotated);
      } catch (error) {
        if (attempt === 1) throw error;
        await pause(300);
      }
    }
    if (committed) {
      leaseCommitted = true;
      return rotated.access_token;
    }

    // The lease may have expired and been claimed after an unusually slow
    // upstream response. Prefer the winner's committed token; never overwrite it.
    const winner = await getMercadoLivreTokens();
    if (isUsable(winner?.access_token, winner?.expires_at)) return winner!.access_token;
    throw new Error("Mercado Livre token refresh lease was lost before commit");
  } finally {
    // A completed lease is already cleared atomically; this is a no-op then.
    // If an upstream/database operation failed, it frees the lease immediately.
    if (!leaseCommitted) {
      try {
        await releaseMercadoLivreTokenRefresh(lockId);
      } catch {
        // The bounded lease expires on its own if Supabase cannot release it.
      }
    }
  }
}
