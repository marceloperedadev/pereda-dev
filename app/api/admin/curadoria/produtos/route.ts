import { NextResponse } from "next/server";

import { requireCurationAdmin } from "@/lib/server/curation-auth";
import { getCurationRow, listCurationRows, updateCurationRow, type CurationStatus } from "@/lib/server/curation-store";
import { expireDiscoveredListing } from "@/lib/server/curation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = new Set<CurationStatus>(["discovered", "review", "approved", "published", "expired"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const affiliateHosts = new Set(["meli.la", "www.mercadolivre.com.br", "mercadolivre.com.br"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function safeAffiliateUrl(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port || !affiliateHosts.has(url.hostname.toLowerCase()) || url.pathname.length < 2) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export async function GET(request: Request) {
  const denied = requireCurationAdmin(request);
  if (denied) return denied;
  const params = new URL(request.url).searchParams;
  const status = params.get("status") ?? undefined;
  if (status && !statuses.has(status as CurationStatus)) return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  try {
    return NextResponse.json({ products: await listCurationRows(status as CurationStatus | undefined) }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Não foi possível consultar a fila de curadoria." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const denied = requireCurationAdmin(request);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (typeof input.id !== "string" || !uuidPattern.test(input.id)) return NextResponse.json({ error: "ID de curadoria inválido." }, { status: 400 });

  const patch: Record<string, unknown> = {};
  const textFields: Record<string, [string, number]> = {
    slug: ["slug", 80],
    editorialTitle: ["editorial_title", 180],
    suitableFor: ["suitable_for", 500],
    recommendationReason: ["recommendation_reason", 1000],
    limitations: ["limitations", 1000],
  };
  for (const [external, [internal, max]] of Object.entries(textFields)) {
    if (!(external in input)) continue;
    if (typeof input[external] !== "string" || input[external].trim().length < 3 || input[external].trim().length > max) {
      return NextResponse.json({ error: `Campo ${external} inválido.` }, { status: 400 });
    }
    const value = (input[external] as string).trim();
    if (external === "slug" && !slugPattern.test(value)) return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
    patch[internal] = value;
  }
  if ("contexts" in input) {
    if (!Array.isArray(input.contexts) || input.contexts.length > 12 || input.contexts.some((item) => typeof item !== "string" || !slugPattern.test(item))) {
      return NextResponse.json({ error: "Contextos inválidos." }, { status: 400 });
    }
    patch.contexts = [...new Set(input.contexts)];
  }
  if ("affiliateUrl" in input) {
    const affiliateUrl = safeAffiliateUrl(input.affiliateUrl);
    if (affiliateUrl === undefined) return NextResponse.json({ error: "Use uma URL HTTPS do Mercado Livre ou meli.la." }, { status: 400 });
    patch.affiliate_url = affiliateUrl;
  }
  if ("status" in input) {
    if (typeof input.status !== "string" || !statuses.has(input.status as CurationStatus)) return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    patch.curation_status = input.status;
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });

  try {
    const current = await getCurationRow(input.id);
    if (!current) return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    const nextStatus = (patch.curation_status as CurationStatus | undefined) ?? current.curation_status;
    const transitions: Record<CurationStatus, CurationStatus[]> = {
      discovered: ["review"],
      review: ["approved", "discovered"],
      approved: ["review", "published"],
      published: ["approved", "review"],
      expired: [],
    };
    if (nextStatus !== current.curation_status && nextStatus !== "expired" && !transitions[current.curation_status].includes(nextStatus)) {
      return NextResponse.json({ error: `Transição de ${current.curation_status} para ${nextStatus} não permitida.` }, { status: 409 });
    }
    const value = { ...current, ...patch } as typeof current;
    if (nextStatus === "published") {
      const fresh = value.last_checked_at && Date.now() - Date.parse(value.last_checked_at) <= 48 * 60 * 60 * 1000;
      const complete = value.source_status === "active" && fresh && value.source_title && value.source_url && value.price !== null && value.currency === "BRL"
        && value.slug && value.editorial_title && value.suitable_for && value.recommendation_reason && value.limitations && value.contexts.length > 0;
      if (!complete) return NextResponse.json({ error: "Para publicar, confirme anúncio e preço recentes e preencha slug, contexto, público, motivo e limites." }, { status: 422 });
    }
    if (nextStatus === "expired") {
      await expireDiscoveredListing(current.provider, current.source_product_id);
      return NextResponse.json({ updated: true, curationStatus: "expired" });
    }
    const updated = await updateCurationRow(input.id, patch as never);
    return NextResponse.json({ updated: true, product: updated }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar a ficha de curadoria." }, { status: 503 });
  }
}
