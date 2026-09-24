import "server-only";

export type MercadoLivreOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type PrivateTokenStoreConfig = {
  url: string;
  secretKey: string;
};

export type MercadoLivreConnectGuard = { username: string; password: string };

const read = (name: string) => process.env[name]?.trim() || undefined;

/** Reads Mercado Livre OAuth settings only in server code. */
export function getMercadoLivreOAuthConfig(): MercadoLivreOAuthConfig | undefined {
  const clientId = read("MERCADOLIVRE_CLIENT_ID");
  const clientSecret = read("MERCADOLIVRE_CLIENT_SECRET");
  const redirectUri = read("MERCADOLIVRE_REDIRECT_URI");

  if (!clientId || !clientSecret || !redirectUri) return undefined;

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

/** Supabase secret is server-only and must never be sent to the browser. */
export function getPrivateTokenStoreConfig(): PrivateTokenStoreConfig | undefined {
  const url = read("SUPABASE_URL");
  const secretKey = read("SUPABASE_SECRET_KEY");
  if (!url || !secretKey) return undefined;
  return { url: url.replace(/\/$/, ""), secretKey };
}

export function getMercadoLivreConnectGuard(): MercadoLivreConnectGuard | undefined {
  const username = read("MERCADOLIVRE_CONNECT_USERNAME");
  const password = read("MERCADOLIVRE_CONNECT_PASSWORD");
  return username && password ? { username, password } : undefined;
}
