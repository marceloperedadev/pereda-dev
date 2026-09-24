import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getMercadoLivreConnectGuard, getMercadoLivreOAuthConfig } from "@/lib/server/affiliate-env";

export const runtime = "nodejs";

function same(value: string, expected: string) {
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const guard = getMercadoLivreConnectGuard();
  if (!guard) return NextResponse.json({ error: "Configure o acesso administrativo OAuth no servidor." }, { status: 503 });
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Basic ${Buffer.from(`${guard.username}:${guard.password}`).toString("base64")}`;
  if (!same(authHeader, expected)) {
    return new NextResponse("Autenticação necessária para conectar a conta Mercado Livre.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Pereda Dev Lab OAuth", charset="UTF-8"' },
    });
  }

  const config = getMercadoLivreOAuthConfig();
  if (!config) return NextResponse.json({ error: "OAuth do Mercado Livre não configurado." }, { status: 503 });

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authorizationUrl = new URL("https://auth.mercadolivre.com.br/authorization");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", challenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizationUrl);
  const secure = new URL(request.url).protocol === "https:";
  response.cookies.set("ml_oauth_state", state, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 600 });
  response.cookies.set("ml_oauth_verifier", verifier, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 600 });
  return response;
}
