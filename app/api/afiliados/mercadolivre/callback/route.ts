import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { getMercadoLivreOAuthConfig } from "@/lib/server/affiliate-env";
import { saveMercadoLivreTokens } from "@/lib/server/mercadolivre-token-store";

export const runtime = "nodejs";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  const config = getMercadoLivreOAuthConfig();
  if (!config) return NextResponse.json({ error: "OAuth do Mercado Livre não configurado." }, { status: 503 });

  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  const stateCookie = request.cookies.get("ml_oauth_state")?.value;
  const verifier = request.cookies.get("ml_oauth_verifier")?.value;
  if (params.has("error")) return NextResponse.json({ error: "Autorização recusada no Mercado Livre." }, { status: 400 });
  if (!code || !state || !stateCookie || !verifier || !safeEqual(state, stateCookie)) {
    return NextResponse.json({ error: "Retorno OAuth inválido ou expirado. Inicie a conexão novamente." }, { status: 400 });
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      code_verifier: verifier,
    });
    const tokenResponse = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!tokenResponse.ok) return NextResponse.json({ error: "O Mercado Livre não concluiu a troca do código por token." }, { status: 502 });

    const token = (await tokenResponse.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };
    if (!token.access_token || !token.refresh_token || !token.expires_in) {
      return NextResponse.json({ error: "Resposta OAuth incompleta do Mercado Livre." }, { status: 502 });
    }

    await saveMercadoLivreTokens({
      provider: "mercadolivre",
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    });

    const response = NextResponse.json({ connected: true, message: "Conta Mercado Livre conectada com segurança." });
    response.cookies.delete("ml_oauth_state");
    response.cookies.delete("ml_oauth_verifier");
    return response;
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar os tokens. Confira o banco de dados e tente novamente." }, { status: 503 });
  }
}
