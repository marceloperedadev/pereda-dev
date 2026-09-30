import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "analytics_admin_v1";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 horas

/** Lê o segredo admin ou retorna undefined se não configurado. */
function getSecret(): string | undefined {
  return process.env.ANALYTICS_ADMIN_SECRET?.trim() || undefined;
}

/** Gera um token HMAC para o cookie de sessão admin. */
function signToken(expiry: number, secret: string): string {
  const mac = createHmac("sha256", secret)
    .update(`${expiry}`)
    .digest("hex");
  return `${expiry}:${mac}`;
}

/** Verifica se o token do cookie é válido. */
function verifyToken(token: string, secret: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 2) return false;

  const [expiryStr, mac] = parts;
  const expiry = parseInt(expiryStr, 10);

  if (isNaN(expiry) || Date.now() > expiry) return false;

  const expected = signToken(expiry, secret);

  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verifica a senha enviada no login e retorna o cookie de sessão
 * ou undefined se inválido.
 */
export function createAdminSession(password: string): string | undefined {
  const secret = getSecret();
  if (!secret) return undefined;

  const secretBuf = Buffer.from(secret);
  const passBuf = Buffer.from(password);

  if (secretBuf.length !== passBuf.length) return undefined;
  if (!timingSafeEqual(secretBuf, passBuf)) return undefined;

  const expiry = Date.now() + COOKIE_MAX_AGE * 1000;
  return signToken(expiry, secret);
}

/**
 * Verifica se a sessão admin é válida a partir do cookie.
 * Retorna true se autenticado.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return verifyToken(token, secret);
}

/**
 * Middleware helper: retorna um NextResponse de redirect para o login
 * se o admin não estiver autenticado. Retorna undefined se autenticado.
 *
 * Usado em route handlers de API.
 */
export async function requireAdmin(): Promise<NextResponse | undefined> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Não autorizado." },
      { status: 401 },
    );
  }
  return undefined;
}

/** Retorna o Set-Cookie header string para o login. */
export function buildAdminCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}`;
}

/** Retorna o Set-Cookie header para limpar a sessão (logout). */
export function clearAdminCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=0`;
}

/** Verifica se o analytics está configurado (Supabase + secret). */
export function isAnalyticsConfigured(): { supabase: boolean; admin: boolean } {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  const secret = getSecret();
  return {
    supabase: !!(url && key),
    admin: !!secret,
  };
}

/**
 * Verifica o token de sessão admin no formato usado pelo middleware Edge.
 * Usa Web Crypto API (disponível no Edge Runtime).
 */
export async function verifyAdminTokenEdge(token: string, secret: string): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length !== 2) return false;

  const [expiryStr, mac] = parts;
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const message = encoder.encode(expiryStr);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, message);
    const expectedMac = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Comparação de comprimento constante
    if (mac.length !== expectedMac.length) return false;

    let diff = 0;
    for (let i = 0; i < mac.length; i++) {
      diff |= mac.charCodeAt(i) ^ expectedMac.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
