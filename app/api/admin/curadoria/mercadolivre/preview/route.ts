import { NextResponse } from "next/server";
import { requireCurationAdmin } from "@/lib/server/curation-auth";
import { mercadoLivreCatalog } from "@/lib/server/mercadolivre-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const idPattern = /^MLB\d{5,20}$/;
function getItemId(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 2048) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    if (host !== "mercadolivre.com.br" && host !== "www.mercadolivre.com.br") return null;
    const candidates = [url.searchParams.get("item_id"), url.searchParams.get("wid"), ...url.pathname.matchAll(/(?:^|\/)(MLB\d{5,20})(?:$|\/)/gi).map((match) => match[1])];
    return candidates.find((candidate): candidate is string => typeof candidate === "string" && idPattern.test(candidate)) ?? null;
  } catch { return null; }
}

export async function POST(request: Request) {
  const denied = requireCurationAdmin(request);
  if (denied) return denied;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 }); }
  const url = body && typeof body === "object" ? (body as Record<string, unknown>).url : undefined;
  const itemId = getItemId(url);
  if (!itemId) return NextResponse.json({ error: "URL não compatível. Cole um link HTTPS de anúncio do Mercado Livre Brasil com ID MLB. Links curtos e outras lojas não são consultados." }, { status: 422 });
  try {
    const listing = await mercadoLivreCatalog.getListing(itemId);
    return NextResponse.json({ provider: "mercadolivre", listing }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? Number((error as { status: unknown }).status) : 0;
    return NextResponse.json({ error: status === 404 ? "Anúncio não encontrado. Confira o link ou preencha os dados manualmente." : "Não foi possível consultar o anúncio oficial do Mercado Livre agora. Você pode preencher os dados manualmente." }, { status: status === 404 ? 404 : 502 });
  }
}
