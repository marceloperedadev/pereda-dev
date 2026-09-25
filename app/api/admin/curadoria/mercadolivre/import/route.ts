import { NextResponse } from "next/server";

import { requireCurationAdmin } from "@/lib/server/curation-auth";
import { mercadoLivreCatalog } from "@/lib/server/mercadolivre-catalog";
import { saveDiscoveredListing } from "@/lib/server/curation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contextSlug = /^[a-z0-9-]{2,40}$/;

export async function POST(request: Request) {
  const denied = requireCurationAdmin(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const data = body as { itemId?: unknown; contexts?: unknown };
  if (typeof data.itemId !== "string" || !/^MLB\d{5,20}$/.test(data.itemId)) {
    return NextResponse.json({ error: "ID de anúncio MLB inválido." }, { status: 400 });
  }
  const contexts = Array.isArray(data.contexts) ? [...new Set(data.contexts)] : [];
  if (contexts.length > 12 || contexts.some((value) => typeof value !== "string" || !contextSlug.test(value))) {
    return NextResponse.json({ error: "Contextos inválidos. Use slugs curtos em letras minúsculas." }, { status: 400 });
  }

  try {
    const listing = await mercadoLivreCatalog.getListing(data.itemId);
    if (listing.listingStatus !== "active") {
      return NextResponse.json({ error: "O anúncio não está ativo; não entrou na fila de revisão." }, { status: 422 });
    }
    await saveDiscoveredListing(listing, contexts as string[]);
    return NextResponse.json({
      queued: true,
      curationStatus: "discovered",
      item: listing,
      message: "Anúncio normalizado e colocado na fila. A publicação continua dependendo de revisão editorial.",
    }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status: unknown }).status)
      : 0;
    console.error("Curadoria: could not import Mercado Livre item", { status });
    return NextResponse.json({ error: "Não foi possível adicionar este anúncio à fila." }, { status: status === 404 ? 404 : 502 });
  }
}
