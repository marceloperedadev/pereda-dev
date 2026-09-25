import "server-only";

import { getMercadoLivreOAuthConfig } from "@/lib/server/affiliate-env";
import { getMercadoLivreTokens, saveMercadoLivreTokens } from "@/lib/server/mercadolivre-token-store";

export async function getMercadoLivreAccessToken(): Promise<string> {
  const config = getMercadoLivreOAuthConfig();
  if (!config) throw new Error("Mercado Livre OAuth is not configured");

  const saved = await getMercadoLivreTokens();
  if (!saved) throw new Error("Mercado Livre account is not connected");
  if (Date.parse(saved.expires_at) > Date.now() + 60_000) return saved.access_token;

  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: saved.refresh_token,
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
  if (!token.access_token || !token.refresh_token || !token.expires_in) {
    throw new Error("Mercado Livre returned incomplete refreshed tokens");
  }

  await saveMercadoLivreTokens({
    provider: "mercadolivre",
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
  });
  return token.access_token;
}
